BEGIN;
TRUNCATE public.booking_seats, public.bookings RESTART IDENTITY CASCADE;
DO $$ DECLARE m RECORD;
BEGIN
FOR m IN SELECT id FROM public.matches WHERE cancelled_at IS NULL ORDER BY kickoff LOOP
DECLARE
  pool text[] := ARRAY['W-A-1', 'W-A-2', 'W-A-3', 'W-A-4', 'W-A-5', 'W-A-6', 'W-A-7', 'W-A-8', 'W-A-9', 'W-A-10', 'W-A-11', 'W-A-12', 'W-A-13', 'W-A-14', 'W-A-15', 'W-A-16', 'W-A-17', 'W-A-18', 'W-A-19', 'W-A-20', 'W-B-1', 'W-B-2', 'W-B-3', 'W-B-4', 'W-B-5', 'W-B-6', 'W-B-7', 'W-B-8', 'W-B-9', 'W-B-10', 'W-B-11', 'W-B-12', 'W-B-13', 'W-B-14', 'W-B-15', 'W-B-16', 'W-B-17', 'W-B-18', 'W-B-19', 'W-B-20', 'W-C-1', 'W-C-2', 'W-C-3', 'W-C-4', 'W-C-5', 'W-C-6', 'W-C-7', 'W-C-8', 'W-C-9', 'W-C-10', 'W-C-11', 'W-C-12', 'W-C-13', 'W-C-14', 'W-C-15', 'W-C-16', 'W-C-17', 'W-C-18', 'W-C-19', 'W-C-20', 'W-D-1', 'W-D-2', 'W-D-3', 'W-D-4', 'W-D-5', 'W-D-6', 'W-D-7', 'W-D-8', 'W-D-9', 'W-D-10', 'W-D-11', 'W-D-12', 'W-D-13', 'W-D-14', 'W-D-15', 'W-D-16', 'W-D-17', 'W-D-18', 'W-D-19', 'W-D-20', 'W-E-1', 'W-E-2', 'W-E-3', 'W-E-4', 'W-E-5', 'W-E-6', 'W-E-7', 'W-E-8', 'W-E-9', 'W-E-10', 'W-E-11', 'W-E-12', 'W-E-13', 'W-E-14', 'W-E-15', 'W-E-16', 'W-E-17', 'W-E-18', 'W-E-19', 'W-E-20', 'W-F-1', 'W-F-2', 'W-F-3', 'W-F-4', 'W-F-5', 'W-F-6', 'W-F-7', 'W-F-8', 'W-F-9', 'W-F-10', 'W-F-11', 'W-F-12', 'W-F-13', 'W-F-14', 'W-F-15', 'W-F-16', 'W-F-17', 'W-F-18', 'W-F-19', 'W-F-20', 'W-G-1', 'W-G-2', 'W-G-3', 'W-G-4', 'W-G-5', 'W-G-6', 'W-G-7', 'W-G-8', 'W-G-9', 'W-G-10', 'W-G-11', 'W-G-12', 'W-G-13', 'W-G-14', 'W-G-15', 'W-G-16', 'W-G-17', 'W-G-18', 'W-G-19', 'W-G-20', 'W-H-1', 'W-H-2', 'W-H-3', 'W-H-4', 'W-H-5', 'W-H-6', 'W-H-7', 'W-H-8', 'W-H-9', 'W-H-10', 'W-H-11', 'W-H-12', 'W-H-13', 'W-H-14', 'W-H-15', 'W-H-16', 'W-H-17', 'W-H-18', 'W-H-19', 'W-H-20', 'E-A-1', 'E-A-2', 'E-A-3', 'E-A-4', 'E-A-5', 'E-A-6', 'E-A-7', 'E-A-8', 'E-A-9', 'E-A-10', 'E-A-11', 'E-A-12', 'E-A-13', 'E-A-14', 'E-A-15', 'E-A-16', 'E-A-17', 'E-A-18', 'E-A-19', 'E-A-20', 'E-B-1', 'E-B-2', 'E-B-3', 'E-B-4', 'E-B-5', 'E-B-6', 'E-B-7', 'E-B-8', 'E-B-9', 'E-B-10', 'E-B-11', 'E-B-12', 'E-B-13', 'E-B-14', 'E-B-15', 'E-B-16', 'E-B-17', 'E-B-18', 'E-B-19', 'E-B-20', 'E-C-1', 'E-C-2', 'E-C-3', 'E-C-4', 'E-C-5', 'E-C-6', 'E-C-7', 'E-C-8', 'E-C-9', 'E-C-10', 'E-C-11', 'E-C-12', 'E-C-13', 'E-C-14', 'E-C-15', 'E-C-16', 'E-C-17', 'E-C-18', 'E-C-19', 'E-C-20', 'E-D-1', 'E-D-2', 'E-D-3', 'E-D-4', 'E-D-5', 'E-D-6', 'E-D-7', 'E-D-8', 'E-D-9', 'E-D-10', 'E-D-11', 'E-D-12', 'E-D-13', 'E-D-14', 'E-D-15', 'E-D-16', 'E-D-17', 'E-D-18', 'E-D-19', 'E-D-20', 'E-E-1', 'E-E-2', 'E-E-3', 'E-E-4', 'E-E-5', 'E-E-6', 'E-E-7', 'E-E-8', 'E-E-9', 'E-E-10', 'E-E-11', 'E-E-12', 'E-E-13', 'E-E-14', 'E-E-15', 'E-E-16', 'E-E-17', 'E-E-18', 'E-E-19', 'E-E-20', 'N-A-1', 'N-A-2', 'N-A-3', 'N-A-4', 'N-A-5', 'N-A-6', 'N-A-7', 'N-A-8', 'N-A-9', 'N-A-10', 'N-A-11', 'N-A-12', 'N-A-13', 'N-A-14', 'N-B-1', 'N-B-2', 'N-B-3', 'N-B-4', 'N-B-5', 'N-B-6', 'N-B-7', 'N-B-8', 'N-B-9', 'N-B-10', 'N-B-11', 'N-B-12', 'N-B-13', 'N-B-14', 'N-C-1', 'N-C-2', 'N-C-3', 'N-C-4', 'N-C-5', 'N-C-6', 'N-C-7', 'N-C-8', 'N-C-9', 'N-C-10', 'N-C-11', 'N-C-12', 'N-C-13', 'N-C-14', 'N-D-1', 'N-D-2', 'N-D-3', 'N-D-4', 'N-D-5', 'N-D-6', 'N-D-7', 'N-D-8', 'N-D-9', 'N-D-10', 'N-D-11', 'N-D-12', 'N-D-13', 'N-D-14', 'S-A-1', 'S-A-2', 'S-A-3', 'S-A-4', 'S-A-5', 'S-A-6', 'S-A-7', 'S-A-8', 'S-A-9', 'S-A-10', 'S-A-11', 'S-A-12', 'S-A-13', 'S-A-14', 'S-B-1', 'S-B-2', 'S-B-3', 'S-B-4', 'S-B-5', 'S-B-6', 'S-B-7', 'S-B-8', 'S-B-9', 'S-B-10', 'S-B-11', 'S-B-12', 'S-B-13', 'S-B-14', 'S-C-1', 'S-C-2', 'S-C-3', 'S-C-4', 'S-C-5', 'S-C-6', 'S-C-7', 'S-C-8', 'S-C-9', 'S-C-10', 'S-C-11', 'S-C-12', 'S-C-13', 'S-C-14', 'S-D-1', 'S-D-2', 'S-D-3', 'S-D-4', 'S-D-5', 'S-D-6', 'S-D-7', 'S-D-8', 'S-D-9', 'S-D-10', 'S-D-11', 'S-D-12', 'S-D-13', 'S-D-14']::text[];
  shuffled text[];
  target int := 297;
  i int := 1;
  group_size int;
  group_seats text[];
  seat text;
  bid uuid;
  names text[] := ARRAY['Oliver Smith', 'Sarah Jones', 'Tom Wilson', 'Emma Brown', 'James Taylor', 'Lucy Davies', 'Harry Roberts', 'Charlotte White', 'Jack Thompson', 'Lily Walker', 'Charlie Hughes', 'Grace Edwards', 'George Green', 'Mia Hall', 'Henry Lewis', 'Isla Wood', 'Alfie Harris', 'Amelia Clark', 'Noah Robinson', 'Ella Wright', 'Ethan Carter', 'Evelyn Phillips', 'Oscar Bennett', 'Poppy Mitchell', 'Leo Cooper', 'Florence Kelly', 'Freddie Hayes', 'Ivy Powell', 'Theo Reed', 'Daisy Ward', 'Arthur King', 'Rosie Scott', 'Joseph Bell', 'Phoebe Murphy', 'Logan Cox', 'Hazel Howard', 'William Ross', 'Maisie Mason', 'Edward Ellis', 'Sienna Wells']::text[];
  random_name text;
  method public.payment_method;
  adult_n int; conc_n int; u17_n int; u5_n int;
BEGIN
  SELECT ARRAY(SELECT unnest(pool) ORDER BY random()) INTO shuffled;
  WHILE i <= target LOOP
    -- 70% chance singleton, 25% chance pair, 5% chance triplet — keeps the
    -- booked pattern speckled rather than clustered.
    IF random() < 0.70 THEN group_size := 1;
    ELSIF random() < 0.95 THEN group_size := 2;
    ELSE group_size := 3;
    END IF;
    group_size := least(group_size, target - i + 1);
    group_seats := shuffled[i:i+group_size-1];
    random_name := names[1 + (random()*(array_length(names,1)-1))::int];
    method := (ARRAY['card','card','card','card','apple','google']::public.payment_method[])[1 + (random()*5)::int];
    adult_n := group_size; conc_n := 0; u17_n := 0; u5_n := 0;
    IF group_size >= 2 AND random() < 0.4 THEN conc_n := 1; adult_n := adult_n - 1; END IF;
    IF group_size >= 3 AND random() < 0.3 THEN u17_n := 1; adult_n := adult_n - 1; END IF;
    INSERT INTO public.bookings (match_id, customer_name, email, phone, seats,
      adult_count, concession_count, under17_count, under5_count, payment_method, status, created_at)
    VALUES (m.id, random_name,
      lower(regexp_replace(random_name, '[^a-zA-Z]+', '.', 'g')) || '@example.com',
      '07' || lpad((random()*1000000000)::int::text, 9, '0'),
      group_seats,
      adult_n, conc_n, u17_n, u5_n,
      method, 'confirmed',
      now() - (random() * interval '14 days'))
    RETURNING id INTO bid;
    FOREACH seat IN ARRAY group_seats LOOP
      INSERT INTO public.booking_seats (match_id, seat_id, booking_id) VALUES (m.id, seat, bid);
    END LOOP;
    i := i + group_size;
  END LOOP;
END;
END LOOP; END $$;
COMMIT;
