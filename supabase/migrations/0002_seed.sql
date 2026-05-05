-- Re-runnable seed. Wipes and reseeds matches + a handful of demo bookings.

truncate public.booking_seats, public.bookings, public.matches restart identity cascade;

-- Helper: pick the next given weekday, N weeks from now (UTC).
-- Saturday = 6, Tuesday = 2.
with fixtures as (
  select * from (values
    ('Truro City',         'Southern League Premier South',  6, 0, time '15:00', 'Raymond McEnhill Stadium',  true,  17, 'Adult £17 · Concessions £13 · Age 5–17 £6 · Under 5 free.'),
    ('Hartley Wintney',    'Southern League Premier South',  2, 0, time '19:45', 'Memorial Ground, Hartley Wintney', false, 12, 'Away allocation — collect at the away turnstile.'),
    ('AFC Totton',         'Southern League Premier South',  6, 1, time '15:00', 'Raymond McEnhill Stadium',  true,  17, null),
    ('Plymouth Parkway',   'FA Trophy — Third Round',         2, 1, time '19:45', 'Raymond McEnhill Stadium',  true,  19, 'Cup pricing applies. No season-ticket entry.'),
    ('Farnborough',        'Southern League Premier South',  6, 2, time '15:00', 'Cherrywood Road, Farnborough', false, 13, null),
    ('Bracknell Town',     'Southern League Premier South',  6, 3, time '15:00', 'Raymond McEnhill Stadium',  true,  17, 'Family Day — under-5s free with a paying adult.')
  ) as t(opponent, competition, dow, weeks_ahead, kick_time, venue, is_home, price, notes)
)
insert into public.matches (opponent, competition, kickoff, venue, is_home, price_per_seat, notes)
select
  f.opponent,
  f.competition,
  ((date_trunc('day', now())::date
    + ((f.dow - extract(dow from now())::int + 7) % 7 + f.weeks_ahead * 7) * interval '1 day')::date
    + f.kick_time)::timestamptz,
  f.venue,
  f.is_home,
  f.price,
  f.notes
from fixtures f;
