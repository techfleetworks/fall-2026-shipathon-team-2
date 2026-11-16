# Business-side fake data — Plenty (Team 2)

Source: `src/lib/fake-data.ts` (frontend task F3). Field names match
`docs/data-contract.md`. This is the **supply side** only — the `stores`
(local shops) and their `listings` (surplus items). The consumer side
(`profiles`, `reservations`) is separate.

> **Two fields are DEMO-ONLY** and are **not** in the data contract / not in
> Supabase: `distance_mi` (on stores) and `emoji` (on listings). They're left
> out of the SQL seed below. `photo_url` is empty in the demo — the UI shows the
> emoji instead.

---

## 1. Stores (3)

| id | name | address |
|----|------|---------|
| s1 | Palms Corner Market | 3420 Motor Ave, Los Angeles, CA 90034 |
| s2 | Rose Ave Bakery | 220 Rose Ave, Los Angeles, CA 90291 |
| s3 | Overland Pantry | 3715 Overland Ave, Los Angeles, CA 90034 |

*(Demo-only `distance_mi`: s1 = 0.4, s2 = 0.8, s3 = 1.1 mi)*

## 2. Listings (10)

Money is **integer cents** (`0` = free). `quantity_left = 0` = sold out.
Dates in the frontend are generated **relative to "now"** so nothing looks
expired — the "days from now" column shows the rule; concrete values below are
anchored to **2026-11-16** as an example (adjust to taste).

| id | store | title | category | price / was | qty | best_by | pickup window | dietary |
|----|-------|-------|----------|-------------|-----|---------|---------------|---------|
| l1 | s1 | Mixed vegetable box | produce | **Free** / $12.00 | 4 | +2d | today 5:30–7:00 pm | vegetarian, vegan |
| l2 | s2 | Day-old sourdough loaf | bakery | $1.50 / $6.00 | 6 | +1d | today 4:00–7:00 pm | vegetarian |
| l3 | s1 | Gallon of milk | dairy | $2.00 / $4.50 | 3 | +3d | today 12:00–2:00 pm | — |
| l4 | s1 | Bananas (bunch) | produce | **Free** / $3.00 | 8 | +2d | +1d 9:00–11:00 am | vegan, vegetarian |
| l5 | s3 | Pasta & sauce bundle | pantry | $1.00 / $5.00 | 5 | +30d | today 3:00–6:00 pm | vegetarian |
| l6 | s1 | Dozen eggs | dairy | **Free** / $5.00 | 2 | +7d | +1d 10:00–12:00 pm | vegetarian, gluten_free |
| l7 | s2 | Assorted pastries (4) | bakery | $2.50 / $9.00 | 4 | +1d | today 4:00–6:30 pm | vegetarian |
| l8 | s3 | Canned soup (3-pack) | pantry | **Free** / $6.00 | 6 | +60d | +1d 1:00–4:00 pm | vegan, gluten_free |
| l11 | s2 | Fresh bagels (6) | bakery | $2.00 / $7.00 | **1** | +1d | today 4:00–6:00 pm | vegetarian |
| l9 | s2 | Chocolate chip cookies | bakery | $2.00 / $5.00 | **0** | +1d | today 4:00–6:00 pm | vegetarian |

**Two intentional edge cases for the demo:**
- `l11` has **qty 1** — demos the "sold out while you were deciding" message on reserve.
- `l9` has **qty 0** — sold out; should **not** appear in the feed.

---

## 3. JSON (contract-shaped, demo-only fields included and marked)

```json
{
  "stores": [
    { "id": "s1", "name": "Palms Corner Market", "address": "3420 Motor Ave, Los Angeles, CA 90034", "distance_mi": 0.4 },
    { "id": "s2", "name": "Rose Ave Bakery", "address": "220 Rose Ave, Los Angeles, CA 90291", "distance_mi": 0.8 },
    { "id": "s3", "name": "Overland Pantry", "address": "3715 Overland Ave, Los Angeles, CA 90034", "distance_mi": 1.1 }
  ],
  "listings": [
    { "id": "l1",  "store_id": "s1", "title": "Mixed vegetable box", "description": "Carrots, greens, peppers and more — great for a few dinners.", "photo_url": "", "category": "produce", "dietary_tags": ["vegetarian","vegan"], "price_cents": 0,   "original_price_cents": 1200, "quantity_left": 4, "best_by": "+2d",  "pickup_start": "today 17:30", "pickup_end": "today 19:00", "emoji": "🥦" },
    { "id": "l2",  "store_id": "s2", "title": "Day-old sourdough loaf", "description": "Baked yesterday, still great toasted.", "photo_url": "", "category": "bakery", "dietary_tags": ["vegetarian"], "price_cents": 150, "original_price_cents": 600, "quantity_left": 6, "best_by": "+1d",  "pickup_start": "today 16:00", "pickup_end": "today 19:00", "emoji": "🍞" },
    { "id": "l3",  "store_id": "s1", "title": "Gallon of milk", "description": "Whole milk, sealed.", "photo_url": "", "category": "dairy", "dietary_tags": [], "price_cents": 200, "original_price_cents": 450, "quantity_left": 3, "best_by": "+3d",  "pickup_start": "today 12:00", "pickup_end": "today 14:00", "emoji": "🥛" },
    { "id": "l4",  "store_id": "s1", "title": "Bananas (bunch)", "description": "Ripe and ready to eat.", "photo_url": "", "category": "produce", "dietary_tags": ["vegan","vegetarian"], "price_cents": 0, "original_price_cents": 300, "quantity_left": 8, "best_by": "+2d",  "pickup_start": "+1d 09:00", "pickup_end": "+1d 11:00", "emoji": "🍌" },
    { "id": "l5",  "store_id": "s3", "title": "Pasta & sauce bundle", "description": "Dry pasta plus a jar of marinara.", "photo_url": "", "category": "pantry", "dietary_tags": ["vegetarian"], "price_cents": 100, "original_price_cents": 500, "quantity_left": 5, "best_by": "+30d", "pickup_start": "today 15:00", "pickup_end": "today 18:00", "emoji": "🍝" },
    { "id": "l6",  "store_id": "s1", "title": "Dozen eggs", "description": "Grade A large.", "photo_url": "", "category": "dairy", "dietary_tags": ["vegetarian","gluten_free"], "price_cents": 0, "original_price_cents": 500, "quantity_left": 2, "best_by": "+7d",  "pickup_start": "+1d 10:00", "pickup_end": "+1d 12:00", "emoji": "🥚" },
    { "id": "l7",  "store_id": "s2", "title": "Assorted pastries (4)", "description": "A mix of croissants and muffins.", "photo_url": "", "category": "bakery", "dietary_tags": ["vegetarian"], "price_cents": 250, "original_price_cents": 900, "quantity_left": 4, "best_by": "+1d",  "pickup_start": "today 16:00", "pickup_end": "today 18:30", "emoji": "🥐" },
    { "id": "l8",  "store_id": "s3", "title": "Canned soup (3-pack)", "description": "Assorted vegetable soups.", "photo_url": "", "category": "pantry", "dietary_tags": ["vegan","gluten_free"], "price_cents": 0, "original_price_cents": 600, "quantity_left": 6, "best_by": "+60d", "pickup_start": "+1d 13:00", "pickup_end": "+1d 16:00", "emoji": "🥫" },
    { "id": "l11", "store_id": "s2", "title": "Fresh bagels (6)", "description": "Baked this morning — the last bag.", "photo_url": "", "category": "bakery", "dietary_tags": ["vegetarian"], "price_cents": 200, "original_price_cents": 700, "quantity_left": 1, "best_by": "+1d", "pickup_start": "today 16:00", "pickup_end": "today 18:00", "emoji": "🥯" },
    { "id": "l9",  "store_id": "s2", "title": "Chocolate chip cookies", "description": "Sold-out example.", "photo_url": "", "category": "bakery", "dietary_tags": ["vegetarian"], "price_cents": 200, "original_price_cents": 500, "quantity_left": 0, "best_by": "+1d", "pickup_start": "today 16:00", "pickup_end": "today 18:00", "emoji": "🍪" }
  ]
}
```

---

## 4. Supabase seed (SQL) — contract fields only

> Demo-only `distance_mi` and `emoji` are excluded. `id`s are kept as the demo
> strings for easy cross-referencing; swap to `uuid` / `gen_random_uuid()` if the
> real tables use uuid PKs. Timestamps are sample values anchored to 2026-11-16,
> America/Los_Angeles — adjust as needed.

```sql
insert into stores (id, name, address) values
  ('s1', 'Palms Corner Market', '3420 Motor Ave, Los Angeles, CA 90034'),
  ('s2', 'Rose Ave Bakery',      '220 Rose Ave, Los Angeles, CA 90291'),
  ('s3', 'Overland Pantry',      '3715 Overland Ave, Los Angeles, CA 90034');

insert into listings
  (id, store_id, title, description, photo_url, category, dietary_tags,
   price_cents, original_price_cents, quantity_left, best_by, pickup_start, pickup_end) values
  ('l1',  's1', 'Mixed vegetable box',    'Carrots, greens, peppers and more — great for a few dinners.', '', 'produce', '{vegetarian,vegan}',       0,    1200, 4, '2026-11-18', '2026-11-16T17:30:00-08', '2026-11-16T19:00:00-08'),
  ('l2',  's2', 'Day-old sourdough loaf', 'Baked yesterday, still great toasted.',                        '', 'bakery',  '{vegetarian}',             150,  600,  6, '2026-11-17', '2026-11-16T16:00:00-08', '2026-11-16T19:00:00-08'),
  ('l3',  's1', 'Gallon of milk',         'Whole milk, sealed.',                                          '', 'dairy',   '{}',                       200,  450,  3, '2026-11-19', '2026-11-16T12:00:00-08', '2026-11-16T14:00:00-08'),
  ('l4',  's1', 'Bananas (bunch)',        'Ripe and ready to eat.',                                       '', 'produce', '{vegan,vegetarian}',       0,    300,  8, '2026-11-18', '2026-11-17T09:00:00-08', '2026-11-17T11:00:00-08'),
  ('l5',  's3', 'Pasta & sauce bundle',   'Dry pasta plus a jar of marinara.',                            '', 'pantry',  '{vegetarian}',             100,  500,  5, '2026-12-16', '2026-11-16T15:00:00-08', '2026-11-16T18:00:00-08'),
  ('l6',  's1', 'Dozen eggs',             'Grade A large.',                                               '', 'dairy',   '{vegetarian,gluten_free}', 0,    500,  2, '2026-11-23', '2026-11-17T10:00:00-08', '2026-11-17T12:00:00-08'),
  ('l7',  's2', 'Assorted pastries (4)',  'A mix of croissants and muffins.',                             '', 'bakery',  '{vegetarian}',             250,  900,  4, '2026-11-17', '2026-11-16T16:00:00-08', '2026-11-16T18:30:00-08'),
  ('l8',  's3', 'Canned soup (3-pack)',   'Assorted vegetable soups.',                                    '', 'pantry',  '{vegan,gluten_free}',      0,    600,  6, '2027-01-15', '2026-11-17T13:00:00-08', '2026-11-17T16:00:00-08'),
  ('l11', 's2', 'Fresh bagels (6)',       'Baked this morning — the last bag.',                           '', 'bakery',  '{vegetarian}',             200,  700,  1, '2026-11-17', '2026-11-16T16:00:00-08', '2026-11-16T18:00:00-08'),
  ('l9',  's2', 'Chocolate chip cookies', 'Sold-out example.',                                            '', 'bakery',  '{vegetarian}',             200,  500,  0, '2026-11-17', '2026-11-16T16:00:00-08', '2026-11-16T18:00:00-08');
```
