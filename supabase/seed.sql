-- Demo data for Plenty, from the frontend's fake-data.ts (the "bag" model).
-- DEMO RESET: wipes reservations, listings and stores, then re-creates them with
-- dates relative to today (Los Angeles time). Re-run on demo day so nothing is
-- expired. Never touches profiles or sign-in accounts.

delete from public.reservations;
delete from public.listings;
delete from public.stores;

insert into public.stores (name, address, zip_code) values
  ('Sunrise Bakery', '220 Rose Ave, Los Angeles, CA 90291', '90291'),
  ('Vida Market',    '3420 Motor Ave, Los Angeles, CA 90034', '90034'),
  ('Corner Fresh',   '3715 Overland Ave, Los Angeles, CA 90034', '90034'),
  ('Palms Pantry',   '3600 Palms Blvd, Los Angeles, CA 90034', '90034');

-- day = days from today (0 = today); h1/h2 = pickup start/end hour, LA time.
with d as (select (now() at time zone 'America/Los_Angeles')::date as today)
insert into public.listings
  (store_id, title, description, category, dietary_tags,
   price_cents, original_price_cents, quantity_left, best_by, pickup_start, pickup_end)
select s.id, v.title, v.description, v.category, v.tags,
       v.price, v.orig, v.qty, d.today + v.best_by_days,
       ((d.today + v.day) + make_time(v.h1, 0, 0)) at time zone 'America/Los_Angeles',
       ((d.today + v.day) + make_time(v.h2, 0, 0)) at time zone 'America/Los_Angeles'
from d,
(values
  ('Sunrise Bakery', 'Bread + produce bag',   'A mixed bag of day-fresh bakery and produce.',        'bakery',  '{vegetarian}'::text[],               600, 1500, 3,  1, 0, 15, 17),
  ('Vida Market',    'Dairy + eggs bundle',   'Fridge staples close to their best-by date.',         'dairy',   '{vegetarian}'::text[],               500, 1100, 5,  3, 0, 16, 18),
  ('Corner Fresh',   'Produce surprise bag',  'Whatever''s ripe and ready — great value.',           'produce', '{vegan,vegetarian}'::text[],         400,  900, 4,  2, 0, 17, 19),
  ('Palms Pantry',   'Pantry staples bag',    'Shelf-stable basics to stretch the week.',            'pantry',  '{vegan,vegetarian}'::text[],           0, 1200, 6, 30, 0, 13, 16),
  ('Sunrise Bakery', 'Pastry box',            'The last box of the day — croissants and more.',      'bakery',  '{vegetarian}'::text[],               300, 1000, 1,  1, 0, 16, 18),
  ('Corner Fresh',   'Veggie + fruit bag',    'A free bag of produce for verified members.',         'produce', '{vegan,vegetarian,gluten_free}'::text[], 0, 1000, 2,  2, 1, 10, 12),
  ('Vida Market',    'Deli lunch bag',        'Sold-out example.',                                   'pantry',  '{}'::text[],                         500, 1100, 0,  1, 0, 12, 14)
) as v(store_name, title, description, category, tags, price, orig, qty, best_by_days, day, h1, h2)
join public.stores s on s.name = v.store_name;
