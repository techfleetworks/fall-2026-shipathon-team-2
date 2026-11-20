# fall-2026-shipathon-team-2

> Working name — the app name is still being decided.

Tech Fleet Catalyst Cup Shipathon 2026 · Team 2

**Live demo:** https://fall-2026-shipathon-team-2.vercel.app

> **Direction change (Nov 19):** the app is no longer about groceries. It now
> books **off-peak time slots** at local service businesses, at a discount.
> The old grocery docs are kept for history and marked as replaced. See
> [docs/personas.md](docs/personas.md) for the persona vote.

## The problem

Local service businesses (hair salons, laundromats, car repair, childcare and more) have empty time slots, especially on weekday mornings and afternoons. Those slots earn nothing. Families on a tight budget pay full price for the same services at busy times, or go without.

This app connects the two: local, independent businesses fill their off-peak slots at a discount, and customers book them and pay the business in person.

**Launch area:** Palms, LA County.

## Who it's for

The persona is **being chosen by the team**. Three candidates are in [docs/personas.md](docs/personas.md) for a vote.

Our mission is still **low-income families**. The MVP does not check eligibility (no verification flow), so this is a stated goal, not an enforced rule.

## MVP: the core loop

Find an off-peak slot → book it → get a code → show the code at the business → pay the discounted price there.

Two task flows (see [docs/screens-and-flows.md](docs/screens-and-flows.md) for the screens):

| Flow | Route | What it does |
|---|---|---|
| 1. Find & book | `/reserve` | Browse off-peak slots by service and time, book one, get a code |
| 2. My bookings | `/pickup` | Show the booking code at the business |

Rules:
- Anyone can book. There is no eligibility check in the MVP.
- Customers pay the business in person, at the discounted price. The app takes no payment.
- A booking holds the slot until its start time. After that the slot is gone.

Nice-to-have if time allows: business-side flows (posting slots).

## Tech stack

- [Next.js](https://nextjs.org) (App Router, TypeScript, Tailwind CSS)
- [Supabase](https://supabase.com) for the database and sign-in (Supabase Auth)
- [Vercel](https://vercel.com) for hosting

## Run it locally

You need [Node.js](https://nodejs.org) 22 or newer (required by the Supabase libraries). Check with `node --version`.

```bash
git clone https://github.com/techfleetworks/fall-2026-shipathon-team-2.git
cd fall-2026-shipathon-team-2
npm install
cp .env.example .env.local   # then fill in the Supabase keys
npm run dev
```

Open http://localhost:3000.

## Project structure

```
src/app/
  page.tsx          Home
  reserve/page.tsx  Flow 1: find & book
  pickup/page.tsx   Flow 2: my bookings, show the code
```

Routes are provisional and may change after the screen review.

## Documents

| Document | What it covers |
|---|---|
| [docs/personas.md](docs/personas.md) | Persona candidates for the team vote |
| [docs/screens-and-flows.md](docs/screens-and-flows.md) | Flows and screens for the off-peak model |
| [docs/data-contract-v2.md](docs/data-contract-v2.md) | Proposed database model (pending agreement) |
| [docs/data-contract.md](docs/data-contract.md) | Grocery model v1 (current in code, being replaced) |
| [docs/privacy-and-retention.md](docs/privacy-and-retention.md) | Draft privacy terms and data retention |
| [DESIGN.md](DESIGN.md) | Visual design system (frontend) |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Team workflow |

## Working together

Read [CONTRIBUTING.md](CONTRIBUTING.md) before your first change. Short version: never push straight to `main`; make a branch, open a pull request, and get one teammate to review it.

## Timeline

| Milestone | Date |
|---|---|
| MVP scope locked | Fri Nov 13 |
| Hi-fi prototype | Wed Nov 18 |
| Direction change and docs | Thu Nov 19 |
| Feature freeze | Fri Nov 20 |
| All deliverables in | Sun Nov 22 |

## Team

| Name | Role | Owns |
|---|---|---|
| Sofia Aguilar | Backend | Supabase: database, sign-in, security rules |
| Vichea Tephang and Sara (last name to confirm) | Frontend | Screens, design system and Vercel |

## License

[MIT](LICENSE) © 2026 Tech Fleet Professional Association
