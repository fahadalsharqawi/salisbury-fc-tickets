-- Tap Payments integration.
--
-- Bookings now start life as 'pending' (seats held while the customer is
-- on Tap's hosted payment page). They flip to 'confirmed' on a successful
-- charge (via the redirect-back route or webhook), or to 'cancelled' if
-- the charge fails / the customer abandons.

alter type public.booking_status add value if not exists 'pending';

alter table public.bookings
  add column if not exists tap_charge_id text,
  add column if not exists confirmed_at timestamptz;

create index if not exists bookings_tap_charge_id_idx
  on public.bookings(tap_charge_id);

-- Recreate create_booking so new rows default to 'pending' and we capture
-- a placeholder payment_method (Tap's hosted page chooses the real method;
-- the webhook updates the column to the actual one on confirmation).
create or replace function public.create_booking(
  p_match_id uuid,
  p_user_id uuid,
  p_customer_name text,
  p_email text,
  p_phone text,
  p_seats text[],
  p_adult int,
  p_concession int,
  p_under17 int,
  p_under5 int,
  p_payment_method public.payment_method,
  p_notes text
) returns public.bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking public.bookings;
  v_seat text;
  v_match_cancelled timestamptz;
begin
  select cancelled_at into v_match_cancelled
    from public.matches where id = p_match_id for update;
  if not found then
    raise exception 'match_not_found' using errcode = 'P0001';
  end if;
  if v_match_cancelled is not null then
    raise exception 'match_cancelled' using errcode = 'P0001';
  end if;

  if coalesce(array_length(p_seats, 1), 0) = 0 then
    raise exception 'no_seats' using errcode = 'P0001';
  end if;

  if array_length(p_seats, 1) <> p_adult + p_concession + p_under17 + p_under5 then
    raise exception 'count_mismatch' using errcode = 'P0001';
  end if;

  insert into public.bookings (
    match_id, user_id, customer_name, email, phone, seats,
    adult_count, concession_count, under17_count, under5_count,
    payment_method, notes, status
  ) values (
    p_match_id, p_user_id, p_customer_name, p_email, p_phone, p_seats,
    p_adult, p_concession, p_under17, p_under5,
    p_payment_method, p_notes, 'pending'
  ) returning * into v_booking;

  foreach v_seat in array p_seats loop
    insert into public.booking_seats (match_id, seat_id, booking_id)
    values (p_match_id, v_seat, v_booking.id);
  end loop;

  return v_booking;
exception
  when unique_violation then
    raise exception 'seats_taken' using errcode = 'P0001';
end;
$$;

-- Confirm a pending booking once Tap has captured the charge.
-- Idempotent: re-confirming an already-confirmed booking is a no-op.
create or replace function public.confirm_booking_payment(
  p_booking_id uuid,
  p_charge_id text,
  p_payment_method public.payment_method
) returns public.bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking public.bookings;
begin
  update public.bookings
    set status = 'confirmed',
        confirmed_at = coalesce(confirmed_at, now()),
        tap_charge_id = coalesce(tap_charge_id, p_charge_id),
        payment_method = p_payment_method
    where id = p_booking_id
      and status in ('pending', 'confirmed')
    returning * into v_booking;
  if not found then
    raise exception 'booking_not_confirmable' using errcode = 'P0001';
  end if;
  return v_booking;
end;
$$;

-- Mark a pending booking as cancelled because the customer abandoned or
-- the charge failed. Frees the seats. Idempotent on already-cancelled rows.
create or replace function public.expire_pending_booking(
  p_booking_id uuid
) returns public.bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking public.bookings;
begin
  update public.bookings
    set status = 'cancelled',
        cancelled_at = coalesce(cancelled_at, now()),
        cancelled_by = coalesce(cancelled_by, 'customer')
    where id = p_booking_id
      and status = 'pending'
    returning * into v_booking;
  if found then
    delete from public.booking_seats where booking_id = p_booking_id;
    return v_booking;
  end if;

  -- Already terminal — return whatever's there so callers can be idempotent.
  select * into v_booking from public.bookings where id = p_booking_id;
  return v_booking;
end;
$$;

-- Cancel a match should also free pending bookings, not just confirmed ones.
create or replace function public.cancel_match(
  p_match_id uuid,
  p_reason text
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.matches
    set cancelled_at = now(), cancellation_reason = p_reason
    where id = p_match_id and cancelled_at is null;
  if not found then
    raise exception 'match_not_found_or_already_cancelled' using errcode = 'P0001';
  end if;

  update public.bookings
    set status = 'cancelled',
        cancelled_at = now(),
        cancelled_by = 'match'
    where match_id = p_match_id and status in ('confirmed', 'pending');

  delete from public.booking_seats where match_id = p_match_id;
end;
$$;
