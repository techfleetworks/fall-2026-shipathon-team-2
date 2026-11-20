# Data contract v2 — off-peak service model

**Status: PROPOSAL, pending agreement with Vichea and Sara.** Until agreed,
the code and [data-contract.md](data-contract.md) (v1) stay as they are. Once
agreed, this file replaces v1, and `supabase/schema.sql` and `seed.sql` change
in a separate PR.

## Conventions (unchanged from v1)

- `snake_case` names, `uuid` ids, `timestamptz` times, evaluated in America/Los_Angeles.
- Money in **integer cents**. `0` is not a free price anymore; see `slots.price_cents`.

## Tables

### 1. `businesses` — the local service providers (was `stores`)

| Field | Type | Notes |
|---|---|---|
| `id` | uuid | primary key |
| `name` | text | e.g. "Palms Barber Shop" |
| `category` | text | one of: `hair`, `laundry`, `car_care`, `childcare`, `fitness`, `other` |
| `address` | text | shown on the slot page |
| `zip_code` | text | used for "near you" |
| `created_at` | timestamptz | default `now()` |

### 2. `services` — what a business offers (new)

| Field | Type | Notes |
|---|---|---|
| `id` | uuid | primary key |
| `business_id` | uuid | **→ `businesses.id`** |
| `name` | text | e.g. "Men's haircut", "Full-service wash" |
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
| `price_cents` | integer | discounted price the customer pays in person, `>= 0` |
| `seats_total` | integer | `>= 1` |
| `seats_left` | integer | `>= 0` and `<= seats_total`; `0` = full |
| `created_at` | timestamptz | default `now()` |

Check constraints: `price_cents <= regular price`, `ends_at > starts_at`,
`seats_left` in range.

### 4. `profiles` — one per signed-up user

| Field | Type | Notes |
|---|---|---|
| `id` | uuid | **= the auth account id** |
| `first_name` | text | shown on the booking to the business |
| `zip_code` | text | used for "near you" |
| `is_adult` | boolean | must be `true` to save a profile |
| `accepted_terms_at` | timestamptz | when they accepted the terms and privacy draft |
| `created_at` | timestamptz | default `now()` |

**Removed:** `verified`, `proof_type`, `dietary_prefs`, and `complete_verification()`.

### 5. `bookings` — a held slot (was `reservations`)

| Field | Type | Notes |
|---|---|---|
| `id` | uuid | primary key |
| `user_id` | uuid | **→ `profiles.id`** |
| `slot_id` | uuid | **→ `slots.id`** |
| `seats` | integer | `>= 1`, default `1` |
| `code` | text | **unique** booking code, e.g. `PLNTY-7K3QZ9` (also shown as a QR) |
| `status` | text | `booked`, `checked_in`, `no_show`, `cancelled`; default `booked` |
| `created_at` | timestamptz | default `now()` |

## Functions (backend-only writes)

| Function | What it does |
|---|---|
| `book_slot(slot_id, seats)` | Checks the slot is in the future and has enough seats. Takes the seats in one step, creates a unique code, returns it. Replaces `reserve_listing()`. |
| `mark_no_show(booking_id)` | Sets `no_show` and returns the seats. Manual, as before. |
| `cancel_booking(booking_id)` | **Proposed.** Sets `cancelled` and returns the seats. Cancellation window to agree. |

**Removed:** `complete_verification()`. The free-for-verified rule is gone.

## Browsing rules

- Shows slots whose `starts_at` is in the future and `seats_left > 0`.
- A slot the user has booked stays visible to them until it starts.

## Open questions

1. Cancellation: allowed at any time, or only up to N hours before the slot?
2. Seats: do we allow a group booking (for example, a class with several seats)?
3. Childcare: do we add a field for the child's first name? (See privacy draft.)
4. Does `mark_no_show` run at the end of the slot, or stay manual?
