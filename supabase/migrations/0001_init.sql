-- Salisbury FC ticketing — initial schema.
-- Re-runnable: drops and recreates everything in `public`.

drop function if exists public.create_booking(uuid, uuid, text, text, text, text[], int, int, int, int, public.payment_method, text) cascade;
drop function if exists public.cancel_booking(uuid, public.cancelled_by_kind) cascade;
drop function if exists public.cancel_match(uuid, text) cascade;
drop function if exists public.mark_booking_attended(uuid) cascade;
drop table if exists public.booking_seats cascade;
drop table if exists public.bookings cascade;
drop table if exists public.matches cascade;
drop type if exists public.booking_status cascade;
drop type if exists public.cancelled_by_kind cascade;
drop type if exists public.payment_method cascade;

create type public.booking_status as enum ('confirmed', 'cancelled', 'attended');
create type public.cancelled_by_kind as enum ('customer', 'owner', 'match');
create type public.payment_method as enum ('card', 'apple', 'google');

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  opponent text not null,
  competition text not null,
  kickoff timestamptz not null,
  venue text not null,
  is_home boolean not null,
  price_per_seat numeric(10,2) not null,
  notes text,
  cancelled_at timestamptz,
  cancellation_reason text,
  created_at timestamptz not null default now()
);

create index matches_kickoff_idx on public.matches(kickoff);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete restrict,
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  email text not null,
  phone text not null,
  seats text[] not null,
  adult_count int not null default 0,
  concession_count int not null default 0,
  under17_count int not null default 0,
  under5_count int not null default 0,
  payment_method public.payment_method not null,
  notes text,
  status public.booking_status not null default 'confirmed',
  cancelled_at timestamptz,
  cancelled_by public.cancelled_by_kind,
  attended_at timestamptz,
  created_at timestamptz not null default now(),
  constraint counts_match_seats check (
    coalesce(array_length(seats, 1), 0) =
      adult_count + concession_count + under17_count + under5_count
  )
);

create index bookings_match_id_idx on public.bookings(match_id);
create index bookings_user_id_idx on public.bookings(user_id);
create index bookings_status_idx on public.bookings(status);
create index bookings_created_at_idx on public.bookings(created_at desc);

-- Per-seat reservation: enforces no double-booking via unique PK.
-- A booking that is cancelled has its rows here deleted, freeing the seats.
create table public.booking_seats (
  match_id uuid not null,
  seat_id text not null,
  booking_id uuid not null references public.bookings(id) on delete cascade,
  primary key (match_id, seat_id)
);

create index booking_seats_booking_id_idx on public.booking_seats(booking_id);

-- ============================================================================
-- Functions
-- ============================================================================

-- Atomic booking creation: validates match, validates count math,
-- inserts booking + seats. Raises specific error codes the app can catch.
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
    payment_method, notes
  ) values (
    p_match_id, p_user_id, p_customer_name, p_email, p_phone, p_seats,
    p_adult, p_concession, p_under17, p_under5,
    p_payment_method, p_notes
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

create or replace function public.cancel_booking(
  p_booking_id uuid,
  p_cancelled_by public.cancelled_by_kind
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
        cancelled_at = now(),
        cancelled_by = p_cancelled_by
    where id = p_booking_id and status <> 'cancelled'
    returning * into v_booking;
  if not found then
    raise exception 'booking_not_cancellable' using errcode = 'P0001';
  end if;

  delete from public.booking_seats where booking_id = p_booking_id;
  return v_booking;
end;
$$;

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
    where match_id = p_match_id and status = 'confirmed';

  delete from public.booking_seats where match_id = p_match_id;
end;
$$;

create or replace function public.mark_booking_attended(p_booking_id uuid)
returns public.bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking public.bookings;
begin
  update public.bookings
    set status = 'attended', attended_at = now()
    where id = p_booking_id and status = 'confirmed'
    returning * into v_booking;
  if not found then
    raise exception 'booking_not_attendable' using errcode = 'P0001';
  end if;
  return v_booking;
end;
$$;

-- ============================================================================
-- RLS — server uses service_role so policies are conservative.
-- ============================================================================

alter table public.matches enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_seats enable row level security;

create policy "matches public read" on public.matches
  for select using (true);

create policy "booking_seats public read" on public.booking_seats
  for select using (true);

create policy "bookings read own" on public.bookings
  for select using (user_id = auth.uid());
