-- Sparetime demo data for schema v2 (businesses, services, off-peak slots).
-- Source: src/lib/mock-data.ts on main. All businesses are FICTIONAL sample
-- shops (the app says so). Run AFTER supabase/schema.sql (v2).
--
-- DEMO RESET: wipes bookings, slots, services and businesses, then re-creates
-- them. Slots run for the next 7 days, in Los Angeles time, so nothing is in
-- the past. Re-run on demo day. Never touches profiles, consents or sign-in.

delete from public.bookings;
delete from public.slots;
delete from public.services;
delete from public.businesses;

-- ───────────── 1. Businesses ─────────────
-- zip_code: looked up from each street name. Check these before the demo.
insert into public.businesses (name, category, address, zip_code) values
  ('Fresh Cuts Barbershop', 'hair',         '1420 W 7th St, Westlake, Los Angeles, CA 90017',     '90017'),
  ('Studio 7 Salon',        'hair',         '815 S Hill St, Downtown Los Angeles, CA 90014',      '90014'),
  ('Main St Barbers',       'hair',         '2047 S Main St, South Park, Los Angeles, CA 90007',  '90007'),
  ('Spin City Laundry',     'laundry',      '535 Alvarado St, Westlake, Los Angeles, CA 90057',   '90057'),
  ('Prime Press',           'dry_cleaning', '312 E 2nd St, Little Tokyo, Los Angeles, CA 90012',  '90012');

-- ───────────── 2. Services (regular prices in dollars, converted to cents below) ─────────────
insert into public.services (business_id, name, description, duration_minutes, regular_price_cents)
select b.id, v.name, v.description, v.minutes, v.regular_dollars * 100
from (values
  ('Fresh Cuts Barbershop', 'Haircut',                 'Wash, cut and a hot-towel finish',                       30, 28),
  ('Fresh Cuts Barbershop', 'Beard trim',              'Trim, line-up and a hot-towel finish',                   30, 15),
  ('Fresh Cuts Barbershop', 'Kids’ haircut',           'Cut and style for kids under 12',                        30, 20),
  ('Studio 7 Salon',        'Wash, cut and style',     'Wash, cut and blow-dry',                                 60, 40),
  ('Studio 7 Salon',        'Blowout',                 'Wash and blow-dry',                                      30, 30),
  ('Main St Barbers',       'Classic cut',             'Clipper or scissor cut and a neck shave',                30, 22),
  ('Spin City Laundry',     'Wash and fold, 15 lb',    'Wash, dry and fold, ready the same evening',             60, 15),
  ('Spin City Laundry',     'Wash and fold, 25 lb',    'Wash, dry and fold, ready the same evening',             60, 24),
  ('Prime Press',           'Shirt press (5 items)',   'Press and hang, ready the next day',                     60, 30)
) as v(business_name, name, description, minutes, regular_dollars)
join public.businesses b on b.name = v.business_name;

-- ───────────── 3. Off-peak slots, next 7 days (Los Angeles time) ─────────────
-- offpeak_dollars = the discounted price paid in cash at the visit.
-- days: 0 = Sunday ... 6 = Saturday. start_hour/end_hour = the off-peak window (24h).
-- seats = how many people one slot holds (laundry has several machines).
with rules (business_name, service_name, offpeak_dollars, seats, days, start_hour, end_hour) as (values
  ('Fresh Cuts Barbershop', 'Haircut',                 12, 1, '{1,2,3,4,5}'::int[], 13, 17),
  ('Fresh Cuts Barbershop', 'Beard trim',               8, 1, '{1,2,3,4,5}'::int[], 13, 17),
  ('Fresh Cuts Barbershop', 'Kids’ haircut',           10, 1, '{1,2,3,4,5}'::int[], 13, 17),
  ('Studio 7 Salon',        'Wash, cut and style',     18, 1, '{2,3,4,5}'::int[],   13, 16),
  ('Studio 7 Salon',        'Blowout',                 14, 1, '{2,3,4,5}'::int[],   13, 16),
  ('Main St Barbers',       'Classic cut',             10, 1, '{1,2,3,4,5}'::int[], 15, 17),
  ('Spin City Laundry',     'Wash and fold, 15 lb',     6, 3, '{1,2,3,4,5}'::int[], 10, 14),
  ('Spin City Laundry',     'Wash and fold, 25 lb',    10, 3, '{1,2,3,4,5}'::int[], 10, 14),
  ('Prime Press',           'Shirt press (5 items)',    9, 1, '{1,2,3,4,5}'::int[], 11, 14)
),
days as (
  select ((now() at time zone 'America/Los_Angeles')::date + g) as day
  from generate_series(0, 6) as g
)
insert into public.slots (service_id, starts_at, ends_at, price_cents, seats_total, seats_left)
select
  s.id,
  ((d.day + make_time(r.start_hour, 0, 0)) + k.n * make_interval(mins => s.duration_minutes))
    at time zone 'America/Los_Angeles',
  ((d.day + make_time(r.start_hour, 0, 0)) + (k.n + 1) * make_interval(mins => s.duration_minutes))
    at time zone 'America/Los_Angeles',
  r.offpeak_dollars * 100,
  r.seats,
  r.seats
from rules r
join public.businesses b on b.name = r.business_name
join public.services s on s.business_id = b.id and s.name = r.service_name
cross join days d
cross join lateral generate_series(0, ((r.end_hour - r.start_hour) * 60 / s.duration_minutes) - 1) as k(n)
where extract(dow from d.day)::int = any (r.days);
