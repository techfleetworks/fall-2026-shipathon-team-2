# ADR-0006: Ship the MVP as a working demo — real user input on the device, sample businesses, simulated SMS and map

## Date and status
2026-11-21. Accepted. (Adds to ADR-0004's product scope and ADR-0002's Supabase
choice; neither is replaced. Supabase stays the target backend.)

## Context
With deliverables due Nov 22, the frontend had a clickable Figma happy path that
used hard-coded data: a pre-typed phone number and code, the name "Dana" everywhere,
one fixed Fresh Cuts booking ("Tue 24, 2:30 pm"), and sample history. Picking any
shop other than Fresh Cuts ended in a Fresh Cuts confirmation. The team wants the
demo to be a **working app** that judges can use, while being honest about what is
simulated.

Constraints:
- **No businesses contacted yet**, so we cannot present real business information.
- **Real SMS** needs a paid provider (e.g. Twilio) and US carrier registration
  (A2P 10DLC), which takes days to weeks.
- **Supabase** (ADR-0002) is set up, but the v2 schema (`data-contract-v2.md`) is
  not applied or wired to the screens yet.
- A **real map** would place pins for fictional shops at real LA street addresses.

## Options
- **Keep the clickable prototype (hard-coded happy path)**
  - Good: no work; matches Figma screenshots exactly.
  - Bad: not a working app; dead ends (e.g. laundry confirms a haircut); judges can't
    try their own details.
- **Wire everything to Supabase now (real auth, real tables)**
  - Good: closest to production.
  - Bad: depends on schema v2 and SMS being ready; too risky for the deadline.
- **Working demo: real user input saved on the device, sample businesses, simulated
  SMS and map** (chosen)
  - Good: every flow works for anyone; nothing the person sees is pre-filled; one
    file (`src/lib/account.ts`) to swap for Supabase later; no paid services.
  - Bad: data doesn't follow a person across devices; the SMS code and map are
    simulated and must be explained.

## Decision
Build the MVP as a working demo:
- **Person's data is real and saved on the device** (localStorage) behind hooks in
  `src/lib/account.ts`: profile, bookings, favorites. New accounts start empty.
  Log out clears the device.
- **Businesses are sample data** in `src/lib/mock-data.ts` (5 fictional shops,
  9 offers, hours, off-peak windows). Services are **haircuts, laundry and clothing
  care**; nails/grooming from ADR-0004 are left for later.
- **Real dates and rules**: open times come from each shop's off-peak hours and the
  person's clock (`src/lib/slots.ts`); the trust-ladder limit, 2-hour cancel window
  and savings are calculated from real activity.
- **Simulated, clearly labelled**: the sign-up code is shown in a "Demo" banner
  (still really checked); the map is drawn with illustrative pin positions; "Done"
  on Show code stands in for the business confirming.
- All of this is explained for judges in `docs/notes-for-judges.md` and the README.

## Consequences
- Easier: judges and teammates can try every flow with their own details; Figma's
  missing states (other shops, empty history, limits) now exist.
- Harder: we must keep the judge notes accurate as features change; on-device data
  means no multi-device or teammate-visible bookings.
- Next: apply schema v2 in Supabase and replace `account.ts` storage with queries;
  add an SMS provider for real codes and reminders; build the business side
  (posting slots, confirming visits); real map only once real businesses join.
- **Security (do not ship the demo's check-in as-is):** the shop view
  (`/staff/confirm`) verifies the 6-digit code **on the device**. A real version must
  verify the code **on the server**, scoped to that booking, with a **limit on wrong
  attempts** (authorization + rate limiting) so a code can't be brute-forced. The
  sign-up code is checked client-side for the same reason and has the same requirement
  once SMS and Supabase are wired. Never rely on a client-side code check for anything
  that releases a service or money.
