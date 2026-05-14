-- Capture the brand + last-4 digits Tap reports on capture so we can
-- show "Visa •••• 4242" on the booking confirmation receipt.

alter table public.bookings
  add column if not exists card_brand text,
  add column if not exists card_last4 text;

drop function if exists public.confirm_booking_payment(uuid, text, public.payment_method);
drop function if exists public.confirm_booking_payment(uuid, text, public.payment_method, text, text);

create or replace function public.confirm_booking_payment(
  p_booking_id uuid,
  p_charge_id text,
  p_payment_method public.payment_method,
  p_card_brand text,
  p_card_last4 text
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
        payment_method = p_payment_method,
        card_brand = coalesce(card_brand, p_card_brand),
        card_last4 = coalesce(card_last4, p_card_last4)
    where id = p_booking_id
      and status in ('pending', 'confirmed')
    returning * into v_booking;
  if not found then
    raise exception 'booking_not_confirmable' using errcode = 'P0001';
  end if;
  return v_booking;
end;
$$;
