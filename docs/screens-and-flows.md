# Screens and flows — Sparetime MVP

**Status: current (Nov 20, 2026).** One happy path: **find, book, show up.** There
are no other MVP flows. Target: about **4–5 taps** to a booking (was 9–10).

> **What was built (Nov 21).** The app follows the team's Figma screens and three
> flows (Gentle onboarding → Find and book → Show up). Differences from this doc:
> sign-up is **phone number + one-time code first** (Figma O1–O5), not a ZIP field
> with no account; services are **haircuts, laundry and clothing care**; reminders
> are **in-app only**; and **Done** on Show code stands in for the business
> confirming. Screen-by-screen status: [frontend-build-plan.md](frontend-build-plan.md).
> Demo approach: [ADR-0006](adr/0006-working-demo-on-device-data.md).

Routes and names follow the README. The MVP has no up-front account screen and no
separate services-preference screen.

## The one flow: find → book → show up

| # | Screen | Change | Content and action |
|---|---|---|---|
| 1 | Welcome | Change | "Save on everyday services near you." ZIP field. Button: **See offers near me**. No account screen up front. |
| 2 | Offers list | Change | Cards: business, time, regular price, now price, "Save $X". Filter chips (service type) replace the old services-preference screen. Tap an offer. |
| 3 | Offer detail | Add | Address, price math, open slots. Tap: **pick a time**. |
| 4 | Confirm | Change | Summary and "pay at shop". Message: "You can hold 1 booking at a time. Show up 2 times to hold 2." Ask for email **only if the person is new**. Button: **Book this time**. |
| 5 | Booked | Change | Short booking code, "You will save $X", directions, **Change or cancel**. |
| 6 | Reminder | Keep | 2 hours before: time, address, code, "Cannot make it? Cancel." |
| 7 | Arrive and show code | Keep | Person shows the code at the counter. |
| 8 | Business confirms | Keep | Business confirms and serves. This counts as a **show-up**. |
| 9 | You saved $X | Change | Total saved and progress toward holding 2 (e.g. "1 of 2 visits to hold 2"). Button: **Book another** (back to step 2). |

### Price math (shown on offer detail and confirm)

A slot shows: business, time, **regular price**, **now price** (the discounted
price), and **"Save $X"**, where X = regular price − now price. The same numbers
appear on the offer detail and the confirmation screens.

## Booking rules (use in app logic, copy and Terms)

### Trust ladder (final: 2 shows)

1. A new account can hold **1** active booking at a time.
2. After the person has **shown up for 2 bookings**, they can hold **2** at a time.
3. After completing those, the limit opens fully (if they want to book 10, they can).
4. **Two misses in total** reset the limit back to 1.
5. A show-up is counted when the business confirms the booking (flow step 8).

### Cancellation, payment, eligibility

- **Cancellation:** cancel up to **2 hours before** the booking time. Cancelling
  later counts as a miss. A booking that is not attended also counts as a miss.
- **Payment:** nothing is charged in the app. The person pays the business in
  **cash at the visit**. Sparetime does not process payments and never stores card
  numbers.
- **Who can use it:** anyone aged **18 or older**, at any time. No income proof.

## States to build for each screen

Empty search results, slot already taken, slot passed, booking limit reached,
network failure, loading. Placeholder images are fine (fake businesses).

## Copy rules

- Plain words (about 8th-grade level), warm tone.
- Use "savings" and "community" — **never "charity"**, and never ask anyone to
  prove need. No shame language.
- Rename labels that still say "Deals near Palms" or use grocery wording (pickup,
  listing, window, dietary tags, EBT).

## Cut from the old flow

Job tap, interview or start date, the separate services-preference screen, the
up-front account screen, verify/benefit-proof screens, the "verified only" rule,
and the "Skip" verify toggle.

## Later (not in the MVP)

Saved preferences and favorites, partner-referral path, bus-route hints, "Book
same time next week", and SMS reminders (needs new backend).

## Open items (do not build as final — ask Vichea)

- **Reminder channel (step 6):** how the reminder reaches people. SMS is "Later."
  Suggested default: an **in-app reminder only**.
- **Business confirms show-up (step 8):** not documented for the demo. Suggested:
  a **demo-only control** that marks the booking as showed up.

> **FigJam note:** the board (Section 5) says "show up 3 times to hold 2" (step 4)
> and "1 of 3 visits" (step 9). The correct number is **2** — use 2 in the app copy.
