# Data contract v2 — Sparetime off-peak service model

**Status: current model for the MVP (Nov 20, 2026).** This replaces the grocery
model in [data-contract.md](data-contract.md) (v1). The app code and
`supabase/schema.sql` / `seed.sql` are still v1 and change to this in a separate
PR (Sofia, backend).

## Conventions (unchanged from v1)

- `snake_case` names, `uuid` ids, `timestamptz` times, evaluated in America/Los_Angeles.
- Money in **integer cents**. `slots.price_cents` is the discounted "now" price.

## Tables

### 1. `businesses` — the local service providers (was `stores`)

| Field | Type | Notes |
|---|---|---|
| `id` | uuid | primary key |
| `name` | text | e.g. "Palms Barber Shop" |
| `category` | text | MVP job-readiness set: `hair`, `nails`, `laundry`, `dry_cleaning` (the platform is broader; the MVP seeds only these) |
| `address` | text | shown on the offer detail |
| `zip_code` | text | used for "near you" |
| `created_at` | timestamptz | default `now()` |

### 2. `services` — what a business offers (new)

| Field | Type | Notes |
|---|---|---|
| `id` | uuid | primary key |
| `business_id` | uuid | **→ `businesses.id`** |
| `name` | text | e.g. "Men's haircut", "Wash & fold", "Manicure", "Dry clean — blazer" |
| `description` | text | optional |
| `duration_minutes` | integer | `> 0` |
| `regular_price_cents` | integer | shown crossed out, `>= 0` |

### 3. `slots` — an off-peak time at a discount (was `listings`)

| Field | Type | Notes |
|---|---|---|
| `id` | uuid | primary key |
| `service_id` | uuid | **→ `services.id`** |
| `starts_at` | timestamptz | start time. Past slots are hidden |
| `ends_at` | timestamptz | `> starts_at` |
| `price_cents` | integer | discounted "now" price paid in cash in person, `>= 0` |
| `seats_total` | integer | `>= 1` |
| `seats_left` | integer | `>= 0` and `<= seats_total`; `0` = full |
| `created_at` | timestamptz | default `now()` |

Check constraints: `price_cents <= regular price`, `ends_at > starts_at`,
`seats_left` in range. "Save $X" on screen = `regular_price_cents - price_cents`.

### 4. `profiles` — one per signed-up user

| Field | Type | Notes |
|---|---|---|
| `id` | uuid | **= the auth account id** |
| `first_name` | text | shown on the booking to the business |
| `zip_code` | text | used for "near you" |
| `is_adult` | boolean | must be `true` (18+) to save a profile |
| `accepted_terms_at` | timestamptz | when they accepted the terms + privacy draft |
| `policy_version` | text | which policy version they agreed to (consent record) |
| `created_at` | timestamptz | default `now()` |

**Trust-ladder fields (NOT confirmed — check with Sofia).** The trust ladder
(see [screens-and-flows.md](screens-and-flows.md) §5) needs a place to count
**shown-up bookings** and **misses**. This can live on `profiles` (e.g.
`shows_count`, `misses_count`) **or** be derived from `bookings.status`. This is an
inference from the product rules, not a backend decision yet.

**Removed:** `verified`, `proof_type`, `dietary_prefs`, and `complete_verification()`.
Sparetime collects **no proof of income or benefits**, anywhere.

### 5. `bookings` — a held slot (was `reservations`)

| Field | Type | Notes |
|---|---|---|
| `id` | uuid | primary key |
| `user_id` | uuid | **→ `profiles.id`** |
| `slot_id` | uuid | **→ `slots.id`** |
| `seats` | integer | `>= 1`, default `1` |
| `code` | text | **unique** short booking code, e.g. `SPRT-7K3QZ9` (also shown as a QR) |
| `status` | text | `booked`, `checked_in` (= showed up), `no_show` (miss), `cancelled`; default `booked` |
| `created_at` | timestamptz | default `now()` |

A **show-up** is `checked_in`, set when the business confirms the booking (flow
step 8). A late cancellation or a no-show counts as a **miss**.

### 6. `consents` — consent records (new, for the privacy draft)

| Field | Type | Notes |
|---|---|---|
| `id` | uuid | primary key |
| `user_id` | uuid | **→ `profiles.id`** |
| `policy_version` | text | the version agreed to at sign-up |
| `created_at` | timestamptz | when they agreed |

(May instead be captured by `profiles.accepted_terms_at` + `policy_version`;
confirm with Sofia. See [privacy-and-retention.md](privacy-and-retention.md).)

## Functions (backend-only writes)

| Function | What it does |
|---|---|
| `book_slot(slot_id, seats)` | Checks the slot is in the future, has enough seats, **and that the user is under their trust-ladder limit**. Takes the seats in one step, creates a unique code, returns it. One backend book function (replaces `reserve_listing()`). |
| `cancel_booking(booking_id)` | Sets `cancelled` and returns the seats **only if cancelled ≥ 2 hours before `starts_at`**; a later cancel is a miss. |
| `mark_no_show(booking_id)` | Sets `no_show` (a miss) and returns the seats. |
| `confirm_show_up(booking_id)` | Sets `checked_in` when the business confirms. The **backend**, not the client, sets show-up status. (Demo: a demo-only control — **Not confirmed**, see screens-and-flows.) |

**Removed:** `complete_verification()`. The free-for-verified rule is gone.

## Browsing rules

- Shows slots whose `starts_at` is in the future and `seats_left > 0`.
- A slot the user has booked stays visible to them until it starts.

## Resolved (was open)

- **Cancellation:** allowed **up to 2 hours before** the slot; later counts as a
  miss (brief §5).
- **Childcare:** **out of the MVP.** No child fields. (Childcare needs a qualified
  review; see the privacy draft.)

## Still open

1. **Seats:** do we allow a group booking (several seats)? MVP default is 1.
2. Do the trust-ladder counts live on `profiles` or derive from `bookings`? (Sofia.)
3. Does `confirm_show_up` / `mark_no_show` run automatically at slot end, or stay manual?
