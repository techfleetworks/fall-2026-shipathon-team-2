# Sparetime

Tech Fleet Catalyst Cup Shipathon 2026 · Team 2

**Live demo:** https://fall-2026-shipathon-team-2.vercel.app

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

The MVP focuses on **job-readiness services** — haircut/barber, laundry/dry
cleaning, nails/grooming — and on **Dana**, a job seeker (see
[docs/personas.md](docs/personas.md)). That keeps the demo concrete; it does not
narrow the product to job-readiness.

**Launch area:** LA County, with **Palms** as the seeded demo area.

## Unique value proposition

We connect low-income individuals with small local businesses offering
discounted, bookable off-peak services — with **no income verification required**.

## MVP: the core loop

**Find → book → show up**, in about 4–5 taps:

1. A business lists **services** and publishes **slots** — specific open times at
   a discounted price.
2. A slot shows the business, the time, the **regular price**, the **now price**,
   and **"Save $X"** (regular price − now price).
3. The customer browses offers near a **ZIP code**, filters by service type, opens
   an offer, picks an open slot, and books it. The slot is held for them.
4. They get a short **booking code**, show it at the counter, and the business
   confirms and serves. That counts as a show-up.
5. They pay the business **in cash, in person**, at the discounted price.

Rules:

- **Anyone 18 or older can book.** There is no eligibility check and no income
  verification, anywhere.
- The app **never takes payment** and never stores card numbers.
- A **trust ladder** limits how many bookings one person can hold: a new account
  holds 1 at a time; after showing up for 2 bookings they can hold 2; after that
  the limit opens up. Two total misses reset it to 1. (See
  [docs/screens-and-flows.md](docs/screens-and-flows.md).)

For the MVP, businesses and slots are **seeded demo data** (fake businesses, fake
pictures). Business-side screens for posting slots are not built.

## What we decided (and what's still open)

- **No income verification**, no AI agent in the app, and **no payment** through
  the app (cash at the business).
- Sparetime is a **planned public benefit corporation** (not yet filed).
- **Revenue model: not yet decided** — treat it as an open assumption.
- Open items still to settle: how the reminder reaches people (suggested: in-app
  only), the backend fields behind the trust ladder, and the demo control for a
  business confirming a show-up.

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
