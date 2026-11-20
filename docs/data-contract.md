> **Status: superseded (Nov 19).** This is the grocery model v1, which is what
> the code and `supabase/` use today. It is being replaced by
> [data-contract-v2.md](data-contract-v2.md) (off-peak services), pending team
> agreement. Do not use v1 for new work.

# Data contract — Plenty (Team 2)

> **Status: v1, updated for Sofia's review (task T1).** The single agreement on
> the table/field names and backend behavior shared by the **frontend** (fake
> data now, real data later) and the **backend** (Supabase). Once we both sign
> off, names are fixed — change them here first, then tell the team.

## Conventions

- **Names:** `snake_case` for tables and fields (Postgres/Supabase standard).
- **IDs:** every row has an `id` of type `uuid`.
- **Timestamps:** `timestamptz`. "Today/expired" is evaluated in **America/Los_Angeles**.
- **Money:** **integer cents** (e.g. `150` = $1.50). The frontend divides by 100
  to display. `0` cents = **Free**.
- **Writes go through backend functions**, not direct table writes, for the
  actions that need checks (verification, reserving) — see each table.
- **Seeding:** `stores` and `listings` are seeded by the backend for the MVP
  (no store-owner accounts yet).

## The four tables

### 1. `stores` — the local shops

| Field | Type | Notes |
|---|---|---|
| `id` | uuid | primary key |
| `name` | text | e.g. "Sunrise Bakery" |
| `address` | text | shown on the listing page |
| `zip_code` | text | **(new, per review #6)** the "not in your area yet" check compares the user's `zip_code` to covered store zips |
| `created_at` | timestamptz | default `now()` |

### 2. `listings` — the surplus bags for sale/free

| Field | Type | Notes |
|---|---|---|
| `id` | uuid | primary key |
| `store_id` | uuid | **→ `stores.id`** |
| `title` | text | the bag name, e.g. "Bread + produce bag" |
| `description` | text | optional |
| `photo_url` | text | optional (demo uses placeholder images) |
| `category` | text | one of: `produce`, `bakery`, `dairy`, `pantry` |
| `dietary_tags` | text[] | e.g. `{vegetarian, vegan, halal, gluten_free}` |
| `price_cents` | integer | `0` = free; otherwise the discounted price |
| `original_price_cents` | integer | the regular price (crossed-out "reg $X") |
| `quantity_left` | integer | never below 0; `0` = sold out |
| `best_by` | date | **expired = after the end of the `best_by` day, LA time** (review #7) |
| `pickup_start` | timestamptz | start of the store's pickup window |
| `pickup_end` | timestamptz | end of the store's pickup window |
| `created_at` | timestamptz | default `now()` |

**Browsing rules (apply to the Deals feed only — review #2):**
- Expired and sold-out (`quantity_left = 0`) listings are **not returned when browsing**.
- **Free** listings (`price_cents = 0`) are returned to the feed **only for verified users**.
- A listing a user has **reserved stays visible to that user** (on their pickup
  screen) even once it's sold out or expired.

**Check constraints the backend adds (review #9):**
`price_cents <= original_price_cents` · `pickup_end > pickup_start` ·
`category` in the four values above · `quantity_left >= 0`.

### 3. `profiles` — one per signed-up user

| Field | Type | Notes |
|---|---|---|
| `id` | uuid | primary key, **= the auth account id** |
| `first_name` | text | app greets the user by this |
| `zip_code` | text | used for the "not in your area yet" check |
| `dietary_prefs` | text[] | optional |
| `is_adult` | boolean | must be `true` to save a profile |
| `accepted_terms_at` | timestamptz | when they accepted terms + privacy |
| `verified` | boolean | **default `false`** · **backend-set only** (review #1) |
| `proof_type` | text | optional; one of `benefitscal`, `ebtedge`, `propel`, `card_photo` · **backend-set only** · **no image/document is ever stored** |
| `created_at` | timestamptz | default `now()` |

- **Editability (review #1):** users may edit their own profile fields **except
  `verified` and `proof_type`**, which are set only by the backend function
  **`complete_verification(proof_type)`** after the mock check. This stops anyone
  flipping `verified = true` themselves.
- **Not stored:** no age, no income, no phone number, no uploaded photo.

### 4. `reservations` — a held order

| Field | Type | Notes |
|---|---|---|
| `id` | uuid | primary key |
| `user_id` | uuid | **→ `profiles.id`** (who reserved) |
| `listing_id` | uuid | **→ `listings.id`** (what they reserved) |
| `quantity` | integer | **(new, review #4)** bags in this reservation; the listing has a "How many bags?" stepper. Default `1`, `>= 1` |
| `code` | text | **unique** pickup code (also shown as a QR) |
| `status` | text | one of `reserved`, `picked_up`, `no_show`; **default `reserved`** (check constraint on allowed values) |
| `arrival_at` | timestamptz | **(replaces `pickup_start/end`, review #5)** the single arrival time the user picked within the listing's window |
| `created_at` | timestamptz | default `now()` |

- **Reserving = one backend function `reserve_listing(listing_id, quantity, arrival_at)`**
  (review #3): checks availability and the free/verified rule, creates the
  reservation with a unique `code`, decrements `listings.quantity_left`
  **atomically**, and returns the code. Prevents two people getting the last bag.

## How the tables link

```
stores (1) ───< listings (many)
profiles (1) ───< reservations (many) >─── (1) listings
profiles.id = the user's auth account id
```

## Resolved questions (task T3)

- **No-show:** stays **manual** for the MVP (set by backend/store, not automated).
- **Confirm email:** **off** for the demo.
- **Categories / dietary tags:** current lists are the agreed **starting set**.

---
*v1 by Vichea (frontend), incorporating Sofia's (backend) review. Update this file
first whenever a name or rule changes.*
