# Backend how-to (for the frontend)

How to read and write real data from Supabase. Table and field names are in
[data-contract.md](data-contract.md); the database itself is in
[supabase/schema.sql](../supabase/schema.sql). The demo data comes from
[supabase/seed.sql](../supabase/seed.sql).

## 1. Get a Supabase client

| Where you are | Import | Use |
|---|---|---|
| A Client Component (`"use client"`) | `import { createClient } from "@/lib/supabase/client"` | `const supabase = createClient();` |
| A Server Component / Server Action | `import { createClient } from "@/lib/supabase/server"` | `const supabase = await createClient();` and wrap the component in `<Suspense>` |

You must be **signed in** to read anything. Signed-out requests get empty results.
Sign-in lives in PR #12 (`/login`); after it merges, `getCurrentUser()` in
`src/lib/auth.ts` returns `{ id, email, verified }` on the server.

## 2. The calls you need

### Deals feed (listings + their store)
```ts
const { data, error } = await supabase
  .from("listings")
  .select("*, stores(name, address, zip_code)")
  .order("pickup_start");
```
You do **not** filter sold-out, expired or free-for-unverified bags yourself. The
database already hides them (a verified user also sees the free bags). Each item
has the store under `listing.stores`.

### One listing
```ts
const { data } = await supabase
  .from("listings")
  .select("*, stores(name, address, zip_code)")
  .eq("id", listingId)
  .single();
```

### Reserve (the only way to create a reservation)
```ts
const { data: code, error } = await supabase.rpc("reserve_listing", {
  p_listing_id: listingId,
  p_quantity: 1,
  p_arrival_at: arrivalIso, // ISO time inside the listing's pickup window
});
// code is a string like "PLNTY-7K3QZ9"; show it and the QR on the pickup screen.
```
It checks everything and takes the stock in one step. `error.message` is one of:

| Message | Show the user |
|---|---|
| `Sold out` | "Someone just took the last one" screen |
| `Free bags are for verified members only` | Send them to `/verify` |
| `This listing has expired` | Listing is no longer available |
| `Arrival time is outside the pickup window` | Ask for a time inside the window |
| `Create your profile first` | Send them to onboarding |
| `Not signed in` | Send them to `/login` |

### My pickups
```ts
const { data } = await supabase
  .from("reservations")
  .select("*, listings(*, stores(name, address))")
  .order("created_at", { ascending: false });
```
You only get your own reservations. A bag you reserved stays visible even if it
sells out or expires.

### Create or edit my profile (onboarding)
```ts
await supabase.from("profiles").upsert({
  id: user.id, // must be your own auth user id
  first_name, zip_code, dietary_prefs,
  is_adult: true, // required to be true
  accepted_terms_at: new Date().toISOString(),
});
```
You can write only these columns. Trying to write `verified` or `proof_type` fails.

### Verify (mock)
```ts
const { error } = await supabase.rpc("complete_verification", {
  p_proof_type: "benefitscal", // or ebtedge, propel, card_photo
});
```
This marks the user verified. No image or document is sent or stored. It needs a
profile first (`Create your profile first` otherwise).

## 3. Rules the database enforces (you don't need to)

- Sold-out and expired (after the end of the `best_by` day, LA time) bags are hidden from the feed.
- Free bags (`price_cents = 0`) are visible to verified users only.
- You can't set `verified` yourself, or create a reservation directly.
- Two people can't take the same last bag.

## 4. Handy facts

- Money is integer cents. Divide by 100 to show dollars; `0` means Free.
- Pickup codes look like `PLNTY-XXXXXX`. A store marks no-shows manually, which returns the bags to stock.
- Fields that exist only in the frontend's fake data (`distance_mi`, `emoji`, `image_key`, `near_metro`, `includes`, the `*_label` fields) are not in the database. Keep them in the frontend, or ask to add a column.
- Reset the demo data on demo day by re-running `supabase/seed.sql` in the Supabase SQL Editor.
- Questions about the database or a new field? Ask Sofia. Change names in `data-contract.md` first.
