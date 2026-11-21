# ADR-0004: Sparetime — off-peak service booking as the MVP (replaces groceries)

## Date and status
2026-11-20. Accepted. (Documents the product-direction decision; supersedes the
grocery product direction. The stack and design ADRs 0001–0003 still stand.)

## Context
The app first shipped as a grocery-reservation web app (reserve surplus "bags"
from local stores, with an eligibility/verification flow). On Nov 19 the team
pivoted the product direction, and on Nov 20 settled the name and MVP scope:

- The product is now **Sparetime** (one word; "Plenty" until Nov 20, "Sparehour"
  in one hi-fi footer). It books **discounted off-peak time slots** at small local
  businesses — the customer books a slot, gets a code, shows it, and pays the
  business in cash in person.
- The MVP narrows to **job-readiness services** (haircut/barber, laundry/dry
  cleaning, nails/grooming) for a job-seeker persona (**Dana**), though the
  audience is low-income individuals and families across LA County.
- Key product decisions: **no income verification** anywhere; **no payment** in the
  app; **no AI agent**; a **planned** public benefit corporation; revenue model
  undecided; demo uses **fake businesses**.

The code and Supabase schema are still the grocery version; only the docs have
pivoted so far. We needed a recorded decision before reworking them.

## Options
- **Pivot to off-peak service booking (Sparetime)**
  - Good: stronger "idle capacity → affordable service with dignity" story for the
    rubric; removes the verification flow and its privacy risk; reuses the existing
    list → detail → book → show-code structure and the design system unchanged.
  - Bad: real code + SQL rework in a short window; overlaps the backend data model;
    some items (reminder channel, show-up control, revenue) still open.
- **Keep the grocery app, pitch off-peak as "what's next"**
  - Good: lowest risk; a working demo already exists.
  - Bad: the submitted product would not match the team's current vision or docs.
- **Full rebuild of new screens from scratch**
  - Good: cleanest result.
  - Bad: not feasible before the Nov 22 deadline with this team.

## Decision
Adopt **Sparetime off-peak service booking** as the MVP, with job-readiness
services and the Dana persona. Reuse the existing screen structure and design
system; re-skin the data and copy rather than rebuild. Carry no income
verification and no in-app payment. Keep the grocery docs as superseded history.

## Consequences
- Easier: a clearer impact story; a simpler, shorter booking flow (~4–5 taps); no
  verification/proof code or data to maintain.
- Harder: the frontend must move from `stores/listings/reservations` to
  `businesses/services/slots/bookings` and add trust-ladder logic; the Supabase
  schema/seed must follow (data-contract-v2); several items stay open and must not
  be built as final (reminder channel, demo show-up control, trust-ladder DB
  fields, revenue, legal/contact text).
- Next: decide §4 code-pivot depth with the team; Sofia applies schema v2 + seed;
  build `/privacy` and `/terms`, the sign-up consent checkbox, and Settings
  (data download / account deletion); fix the "Sparehour" footer to "Sparetime".
