# Data contract — Plenty (Team 2)

> **Status: DRAFT for team agreement (task T1).** This is the single agreement on
> the exact table and field names shared by the **frontend** (fake data now, real
> data later) and the **backend** (Supabase). Once Sofia and Vichea agree, these
> names are fixed — if we need to change one later, we change it here first and
> tell the team.

## Conventions

- **Names:** `snake_case` for tables and fields (Postgres/Supabase standard).
- **IDs:** every row has an `id` of type `uuid`.
- **Timestamps:** `timestamptz` (date + time + timezone).
- **Money:** stored as **integer cents** (e.g. `150` = $1.50) to avoid rounding
  bugs. The frontend divides by 100 to display. `0` cents = **Free**.

## The four tables

### 1. `stores` — the local shops

| Field | Type | Notes |
|---|---|---|
| `id` | uuid | primary key |
| `name` | text | e.g. "Palms Corner Market" |
| `address` | text | shown on the item detail page |
| `created_at` | timestamptz | default `now()` |

### 2. `listings` — the surplus items for sale/free

| Field | Type | Notes |
|---|---|---|
| `id` | uuid | primary key |
| `store_id` | uuid | **→ `stores.id`** (which shop) |
| `title` | text | e.g. "Day-old sourdough loaf" |
| `description` | text | optional |
| `photo_url` | text | optional (we may use emojis/placeholders for the demo) |
| `category` | text | one of: `produce`, `bakery`, `dairy`, `pantry` |
| `dietary_tags` | text[] | e.g. `{vegetarian, vegan, halal, gluten_free}` |
| `price_cents` | integer | `0` = free; otherwise the discounted price |
| `original_price_cents` | integer | the regular price (for the crossed-out "was $X") |
| `quantity_left` | integer | never below 0; `0` = sold out |
| `best_by` | date | expiry date |
| `pickup_start` | timestamptz | start of the pickup window |
| `pickup_end` | timestamptz | end of the pickup window |
| `created_at` | timestamptz | default `now()` |

**Rules the backend enforces (from the definition of done):**
- Expired (`best_by` passed or `pickup_end` passed) and sold-out
  (`quantity_left = 0`) listings are **not returned**.
- **Free** listings (`price_cents = 0`) are returned **only to verified users**.

### 3. `profiles` — one per signed-up user

| Field | Type | Notes |
|---|---|---|
| `id` | uuid | primary key, **= the auth account id** |
| `first_name` | text | app greets Chloe by this |
| `zip_code` | text | used for the "not in your area yet" check |
| `dietary_prefs` | text[] | optional |
| `is_adult` | boolean | must be `true` to save a profile |
| `accepted_terms_at` | timestamptz | when they accepted terms + privacy |
| `verified` | boolean | **default `false`**; set `true` after mock verification |
| `proof_type` | text | optional; one of `benefitscal`, `ebtedge`, `propel`, `card_photo`. **No image/document is ever stored** |
| `created_at` | timestamptz | default `now()` |

**Not stored:** no age, no income, no phone number.

### 4. `reservations` — a held order

| Field | Type | Notes |
|---|---|---|
| `id` | uuid | primary key |
| `user_id` | uuid | **→ `profiles.id`** (who reserved) |
| `listing_id` | uuid | **→ `listings.id`** (what they reserved) |
| `code` | text | **unique** pickup code (also shown as a QR) |
| `status` | text | one of `reserved`, `picked_up`, `no_show`; **default `reserved`** |
| `pickup_start` | timestamptz | the chosen pickup window start |
| `pickup_end` | timestamptz | the chosen pickup window end |
| `created_at` | timestamptz | default `now()` |

## How the tables link

```
stores (1) ───< listings (many)
profiles (1) ───< reservations (many) >─── (1) listings
profiles.id = the user's auth account id
```

- A `listing` belongs to one `store`.
- A `reservation` belongs to one `profile` (the user) and one `listing`.

## Open questions for the team (task T3)

- **No-show rule:** when/how does a reservation become `no_show`? (affects
  `reservations.status`)
- **Dietary tags:** is the list above the final set, or do we add/remove any?
- **Category list:** are `produce / bakery / dairy / pantry` the final four?
- **Confirm email:** on or off for the demo? (backend setting)

---
*Draft by Vichea (frontend) for agreement with Sofia (backend). Update this file
first whenever a name changes.*
