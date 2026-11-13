# fall-2026-shipathon-team-2

> Working name — the app name is still being decided.

Tech Fleet Catalyst Cup Shipathon 2026 · Team 2

## The problem

Single-income parents are stretched thin by rising grocery prices, while small local food businesses throw away good surplus food every week. This app connects the two: small, independent stores (not big chains) list surplus groceries, and verified low-income single parents reserve them for free or at a discount and pick them up.

**Launch area:** Palms, LA County.

## Who it's for

**Chloe Bennett**, 29, single mom of Leo (5). Hybrid customer success rep living in Palms on one ~$48k income, with under $200 a month to spare. No safety net, handles every errand alone, and feels inflation hardest on essentials.

## MVP: the core loop

Filter → reserve → choose a pickup window → get a code/QR → pick up.

Three task flows:

| Flow | Route | What it does |
|---|---|---|
| 1. Find & reserve | `/reserve` | Browse nearby surplus, reserve items, choose a pickup window |
| 2. Verify eligibility | `/verify` | Confirm eligibility via SNAP/EBT, Medicaid or other benefit proof. Mocked for the MVP — no image is stored |
| 3. Pick up | `/pickup` | Show a code/QR at the store to collect the order |

Rules: free items are for verified users only. Discounted items are paid at the store.

Nice-to-have if time allows: business-side flows (posting surplus).

## Tech stack

- [Next.js](https://nextjs.org) (App Router, TypeScript, Tailwind CSS)
- [Supabase](https://supabase.com) for the database and sign-in (Supabase Auth)
- [Vercel](https://vercel.com) for hosting

## Run it locally

You need [Node.js](https://nodejs.org) 20 or newer.

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
  reserve/page.tsx  Flow 1: find & reserve
  verify/page.tsx   Flow 2: verify eligibility
  pickup/page.tsx   Flow 3: pick up with code
```

## Working together

Read [CONTRIBUTING.md](CONTRIBUTING.md) before your first change. Short version: never push straight to `main`; make a branch, open a pull request, and get one teammate to review it.

## Timeline

| Milestone | Date |
|---|---|
| MVP scope locked | Fri Nov 13 |
| Hi-fi prototype | Wed Nov 18 |
| Feature freeze | Fri Nov 20 |
| All deliverables in | Sun Nov 22 |

## Team

_Add names and roles here._

## License

[MIT](LICENSE) © 2026 Tech Fleet Professional Association
