# Screens and flows — off-peak service model

**Status: proposal.** Frontend (Vichea and Sara) confirms the screens. Routes
and names follow the README and may change.

## Flow 1 — Find & book (`/reserve`)

| Step | Screen | What the user sees | What the user does |
|---|---|---|---|
| 1 | Deals list | Off-peak slots near Palms, with service, business, time and discounted price | Filter by service or time, tap a slot |
| 2 | Slot detail | Business name and address, service, time, regular price, discounted price, seats left | Choose the number of seats, tap **Book** |
| 3 | Confirmation | Booking code, time, address, and what to bring | Save or show the code |

Rules shown on screen:
- The price is the discounted price. The customer pays the business in person.
- Full slots and past slots don't appear.

## Flow 2 — My bookings (`/pickup`)

| Step | Screen | What the user sees | What the user does |
|---|---|---|---|
| 1 | My bookings | Upcoming bookings with status (booked, checked in, cancelled) | Tap a booking |
| 2 | Booking code | Large code and QR, business name, time | Show it at the business |
| 3 | Done | Status updates after the business checks the code | Rate the service (optional, later) |

## Removed from the MVP

- Verify eligibility (the old `/verify` flow and benefit-proof screens).
- Free items and the "verified only" rule.
- Chloe-specific copy, and the "Skip" verify toggle.

## Open questions for the team

- **Cancellation:** can a customer cancel, and how close to the start time?
- **Child-related bookings:** the app may book daycare or babysitting. Do we ask
  for a child's first name? (See the privacy draft.)
- **Screens to add:** a business sign-in and a slot-posting screen are
  nice-to-haves only.
