# Sparetime

Tech Fleet Catalyst Cup Shipathon 2026 · Team 2

**Live demo:** https://fall-2026-shipathon-team-2.vercel.app

> **Judges, start here:** [Notes for judges](docs/notes-for-judges.md) explains
> what in the demo is real, what is simulated (sample businesses, an on-screen
> sign-up code, a drawn map), and why.

Sparetime connects low-income people with discounted off-peak services from
small local businesses. Our MVP starts with **job-readiness services**
(grooming, laundry) for job seekers like Dana.

> **Name:** the product is **Sparetime** (one word). It was called Plenty
> until Nov 20, 2026. Earlier the project was a grocery-reservation app; those
> old docs are kept for history and marked as replaced.

## Vision

Turning small-business idle time into affordable everyday services for LA's
low-income individuals and families, at a time that fits their day.

Low-income families and individuals stretch every dollar and have no time to
hunt for deals. Sparetime helps them save on everyday services like haircuts
and laundry in minutes, with dignity: savings and community, never charity.
People using Sparetime are customers getting a fair price on a real service —
we do not hand out aid, and we never ask anyone to prove need.

## The problem

Small local businesses (barbers, salons, laundromats) have quiet off-peak hours
— idle chairs and machines that earn nothing. Meanwhile low-income families pay
full price for the same services at busy times, or go without. Sparetime connects
the two: businesses fill their off-peak slots at a discount, and customers book
them and pay the business in cash, in person.

## Who it's for

- **Primary:** low-income individuals and families across **Los Angeles County**
  — parents, single adults, and anyone on a tight budget. Job seekers are one
  group within this audience, not all of it.
- **Secondary:** small local businesses with open capacity during off-peak hours.

The MVP focuses on **job-readiness services** — **haircuts, laundry and clothing
care** (pressing and dry cleaning) — and on **Dana**, a job seeker (see
[docs/personas.md](docs/personas.md)). That keeps the demo concrete; it does not
narrow the product to job-readiness. (Nails and grooming were in the earlier scope
and are left for later; see [ADR-0006](docs/adr/0006-working-demo-on-device-data.md).)

**Launch area:** LA County. The demo's sample shops are in **Westlake, Downtown LA,
South Park and Little Tokyo**.

## Unique value proposition

We connect low-income individuals with small local businesses offering
discounted, bookable off-peak services — with **no income verification required**.

## MVP: the core loop

**Find → book → show up**, in about 4–5 taps:

1. A business lists **services** and publishes **slots** — specific open times at
   a discounted price.
2. A slot shows the business, the time, the **regular price**, the **now price**,
   and **"Save $X"** (regular price − now price).
3. The customer signs up with a **phone number and a one-time 6-digit code**, tells
   us their area and the services they need, then browses offers, filters them,
   opens an offer, picks an open slot, and books it. The slot is held for them.
4. They get a short **booking code**, show it at the counter, and the business
   confirms and serves. That counts as a show-up.
5. They pay the business **in cash, in person**, at the discounted price.

Rules:

- **Anyone 18 or older can book.** There is no eligibility check and no income
  verification, anywhere.
- The app **never takes payment** and never stores card numbers.
- A **trust ladder** limits how many bookings one person can hold: a new account
  holds 1 at a time; after showing up for 2 bookings they can hold 2 at once;
  after showing up for 4 there is no limit. **Two misses in total** (no-shows, or
  cancelling less than 2 hours before) reset the limit to 1 and the ladder starts
  over — people earn it back by showing up. (See
  [docs/screens-and-flows.md](docs/screens-and-flows.md).)
- **Cancelling is free up to 2 hours before.** Cancelling later counts as a miss,
  but the slot is freed for someone else right away.

For the MVP, businesses and slots are **sample data** (fictional businesses,
AI-generated pictures). Business-side screens for posting slots are not built.

## What the demo shows

The demo is a **working app**, not a click-through prototype. Everything the
person does is real; only the businesses are sample data.

**Works end to end**

- **Sign-up** — the phone number and name you type (nothing is pre-filled), a
  6-digit code that is really checked, then your reason, timing, area and
  services. No texts are sent, so **you can use any US phone number** — the code
  appears on the next screen. "Good morning, [your name]" on Deals.
- **Find** — every offer from 5 sample shops (9 offers), with **live open times**
  from each shop's off-peak hours. **Search**, service tabs, a **Filters** sheet
  (day, time of day, distance, transit, price) and a **map view** with a
  slide-up offers panel.
- **Book** — any shop and service: pick a real time, confirm, get a booking ID and
  code. The **trust-ladder limit** is enforced ("one booking at a time" for new
  accounts). **Reschedule** and **cancel** (cancelling less than 2 hours before
  counts as a miss). Right after your **first** booking, Sparetime asks once
  whether you want reminders (with optional booking texts and offer alerts).
- **Show up** — "It's today" on the day, **Show code** at the counter (plus a
  simple shop view where staff type your code), then **You saved $X**, your
  monthly total and **Rate your visit**. **Spin City Laundry** has off-peak times
  every day (9 am–9 pm), so the whole flow works on any day, weekends included.
- **Your history** — **My bookings** (upcoming and past), **Favorites** (tap a
  heart to save a place; removing one can be undone), and **Account** (your
  details, how bookings work, settings, privacy, log out). **Delete account**
  really erases your account on this phone. A new account starts empty.

**Simulated, and why** (full details in [Notes for judges](docs/notes-for-judges.md))

| What | Why |
|---|---|
| **Sample businesses** | We haven't partnered with or spoken to any shops yet, so we couldn't present real information on a business's behalf. |
| **Sign-up code shown on screen** (labelled *Demo*) | Real texts need a paid SMS provider and US carrier registration (days to weeks). No text is sent, so **any US number works** for the demo; the code is still really checked. |
| **Drawn map** | The sample shops use real LA addresses; a real map would put pins on real buildings that may hold real businesses. |
| **"Done" on Show code** stands in for the shop confirming the visit (on the day of the visit) | The business side isn't built yet. |
| **Data saved on the device** (kept per phone number; **Log out** keeps your account and signing back in restores it, **Start fresh on this device** wipes it) | Supabase is set up but not yet connected to these screens. |

**Try it:** Welcome → **Get started**, use any US-format phone number (no text is
sent — the code appears on the next screen), book **Spin City Laundry** for today
(it has times every day), then tap **Done** on Show code to finish the visit. **Account → Log out** keeps your account (sign back in with
the same number to restore it); **Start fresh on this device** wipes it.

## What we decided (and what's still open)

- **No income verification**, no AI agent in the app, and **no payment** through
  the app (cash at the business).
- Sparetime is a **planned public benefit corporation** (not yet filed).
- **Revenue model: not yet decided** — treat it as an open assumption.
- **Demo approach** (Nov 21): a working app with on-device data, an on-screen
  sign-up code and a drawn map, so every flow works without a paid SMS provider or
  real businesses. See [ADR-0006](docs/adr/0006-working-demo-on-device-data.md).
- Reminders are **in-app only** for now (the optional "booking texts" choice is
  saved, but no texts are sent yet); the business confirming a show-up is stood
  in by **Done** on the Show code screen.
- Open items still to settle: connecting these screens to Supabase (the backend
  fields behind the trust ladder), real SMS, and the business-side screens.

## Tech stack

- [Next.js](https://nextjs.org) (App Router, TypeScript, Tailwind CSS)
- [Supabase](https://supabase.com) for the database and sign-in (Supabase Auth)
- [Vercel](https://vercel.com) for hosting

## Run it locally

You need [Node.js](https://nodejs.org) 22 or newer (required by the Supabase
libraries). Check with `node --version`.

```bash
git clone https://github.com/techfleetworks/fall-2026-shipathon-team-2.git
cd fall-2026-shipathon-team-2
npm install
cp .env.example .env.local   # then fill in the Supabase keys
npm run dev
```

Open http://localhost:3000.

## Documents

| Document | What it covers |
|---|---|
| [docs/notes-for-judges.md](docs/notes-for-judges.md) | What in the demo is real, what is simulated, and why |
| [docs/frontend-build-plan.md](docs/frontend-build-plan.md) | Screen-by-screen build status and progress log |
| [docs/adr/](docs/adr) | Architecture decisions (ADRs) |
| [docs/personas.md](docs/personas.md) | Dana, the MVP persona |
| [docs/screens-and-flows.md](docs/screens-and-flows.md) | The find → book → show-up flow and screens |
| [docs/data-contract-v2.md](docs/data-contract-v2.md) | Database model (businesses, services, slots, profiles, bookings) |
| [docs/data-contract.md](docs/data-contract.md) | Grocery model v1 (history, replaced) |
| [docs/privacy-and-retention.md](docs/privacy-and-retention.md) | Draft privacy policy and data retention |
| [DESIGN.md](DESIGN.md) | Visual design system (frontend) |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Team workflow |

## Working together

Read [CONTRIBUTING.md](CONTRIBUTING.md) before your first change. Short version:
never push straight to `main`; make a branch, open a pull request, and get one
teammate to review it.

## Timeline

| Milestone | Date |
|---|---|
| MVP scope locked | Fri Nov 13 |
| Hi-fi prototype | Wed Nov 18 |
| Direction change and docs | Thu Nov 19 |
| Sparetime rebrand + MVP scope (job-readiness, Dana) | Thu Nov 20 |
| Launch target | Sat Nov 21 |
| All deliverables in | Sun Nov 22 |

## Team

| Name | Role | Owns |
|---|---|---|
| Sofia Aguilar | Backend | Supabase: database, sign-in, security rules |
| Vichea Tephang and Sara | Frontend | Screens, design system and Vercel |

## License

[MIT](LICENSE) © 2026 Tech Fleet Professional Association
