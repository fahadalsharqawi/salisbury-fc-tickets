-- 0004_raymac_real_bowl_seed.sql
--
-- The seat IDs in 0003 used the old W/E/N/S stand model. We've moved to
-- the real Ray Mac block layout (NE/X/Y/SE on the north side, NW/A–H/SW
-- on the south side a.k.a. the Main Stand, P1/P2 on the east, NS on the
-- west). Truncate the demo bookings and reseed using the new IDs so the
-- bowl shows realistic occupancy.

BEGIN;
TRUNCATE public.booking_seats, public.bookings RESTART IDENTITY CASCADE;

DO $outer$
DECLARE
  m RECORD;
BEGIN
  FOR m IN SELECT id FROM public.matches WHERE cancelled_at IS NULL ORDER BY kickoff LOOP
    DECLARE
      -- (block_id, depth, length) — must match BLOCKS in src/lib/seats.ts.
      blocks text[][] := ARRAY[
        ['NE','6','5'], ['X','6','4'], ['Y','6','4'], ['SE','6','5'],
        ['P2','8','6'], ['P1','8','6'],
        ['NS','12','12'],
        ['NW','6','2'], ['A','9','2'], ['B','9','2'], ['C','9','2'],
        ['D','11','2'], ['E','11','1'], ['F','11','1'],
        ['G','9','2'], ['H','9','2'], ['SW','6','2']
      ];
      pool text[] := '{}';
      shuffled text[];
      target int;
      i int := 1;
      group_size int;
      group_seats text[];
      seat text;
      bid uuid;
      names text[] := ARRAY[
        'Oliver Smith','Sarah Jones','Tom Wilson','Emma Brown','James Taylor',
        'Lucy Davies','Harry Roberts','Charlotte White','Jack Thompson',
        'Lily Walker','Charlie Hughes','Grace Edwards','George Green','Mia Hall',
        'Henry Lewis','Isla Wood','Alfie Harris','Amelia Clark','Noah Robinson',
        'Ella Wright','Ethan Carter','Evelyn Phillips','Oscar Bennett',
        'Poppy Mitchell','Leo Cooper','Florence Kelly','Freddie Hayes',
        'Ivy Powell','Theo Reed','Daisy Ward','Arthur King','Rosie Scott',
        'Joseph Bell','Phoebe Murphy','Logan Cox','Hazel Howard','William Ross',
        'Maisie Mason','Edward Ellis','Sienna Wells'
      ]::text[];
      random_name text;
      method public.payment_method;
      adult_n int; conc_n int; u17_n int; u5_n int;
      b text[];
      r int;
      c int;
    BEGIN
      -- Build the seat pool from the block descriptors.
      FOREACH b SLICE 1 IN ARRAY blocks LOOP
        FOR r IN 0 .. b[2]::int - 1 LOOP
          FOR c IN 1 .. b[3]::int LOOP
            pool := pool || (b[1] || '-' || chr(65 + r) || '-' || c::text);
          END LOOP;
        END LOOP;
      END LOOP;

      -- Aim for ~80% occupancy across the whole bowl for the demo.
      target := (array_length(pool, 1) * 0.80)::int;

      SELECT ARRAY(SELECT unnest(pool) ORDER BY random()) INTO shuffled;
      WHILE i <= target LOOP
        -- 70% singleton, 25% pair, 5% triplet — speckled rather than clustered.
        IF random() < 0.70 THEN group_size := 1;
        ELSIF random() < 0.95 THEN group_size := 2;
        ELSE group_size := 3;
        END IF;
        group_size := least(group_size, target - i + 1);
        group_seats := shuffled[i : i + group_size - 1];
        random_name := names[1 + (random() * (array_length(names, 1) - 1))::int];
        method := (ARRAY['card','card','card','card','apple','google']::public.payment_method[])
                  [1 + (random() * 5)::int];
        adult_n := group_size; conc_n := 0; u17_n := 0; u5_n := 0;
        IF group_size >= 2 AND random() < 0.4 THEN conc_n := 1; adult_n := adult_n - 1; END IF;
        IF group_size >= 3 AND random() < 0.3 THEN u17_n := 1; adult_n := adult_n - 1; END IF;

        INSERT INTO public.bookings (
          match_id, customer_name, email, phone, seats,
          adult_count, concession_count, under17_count, under5_count,
          payment_method, status, created_at
        )
        VALUES (
          m.id, random_name,
          lower(regexp_replace(random_name, '[^a-zA-Z]+', '.', 'g')) || '@example.com',
          '07' || lpad((random() * 1000000000)::int::text, 9, '0'),
          group_seats,
          adult_n, conc_n, u17_n, u5_n,
          method, 'confirmed',
          now() - (random() * interval '14 days')
        )
        RETURNING id INTO bid;

        FOREACH seat IN ARRAY group_seats LOOP
          INSERT INTO public.booking_seats (match_id, seat_id, booking_id)
          VALUES (m.id, seat, bid);
        END LOOP;
        i := i + group_size;
      END LOOP;
    END;
  END LOOP;
END
$outer$;
COMMIT;
