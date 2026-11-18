# CLAUDE.md — working rules for this repo

Read this before writing any code. Also read `AGENTS.md` (framework gotchas:
Next.js 16 Cache Components, Tailwind v4, deploy notes).

## Architecture decisions (ADRs)

Read every ADR in `docs/adr` before making changes, and write a new ADR for every
big decision (hard-to-reverse choices like database, framework, hosting, or a
major architectural pattern). Use [`docs/adr/TEMPLATE.md`](docs/adr/TEMPLATE.md),
number files in order, and never erase a past ADR — supersede it with a new one
and mark the old one "Replaced by ADR-XXXX".

## Design: DESIGN.md is the source of truth — follow it every time

Before building or changing **any** UI, read [`DESIGN.md`](DESIGN.md) and build to
it. Do not invent colors, fonts, spacing, or component styles — use the system.

- **Palette (Green & Purple):** brand green `#1C8057`, deep green `#155E40`,
  light-green tint `#D7EBD2`, purple savings `#5D2E77`, warm cream canvas
  `#F4F1E9`, white cards. Green = brand/positive/active; purple = savings.
  Never swap those roles.
- **Font:** one sans family — `-apple-system, BlinkMacSystemFont, "Inter",
  system-ui, sans-serif` (SF Pro on Apple, Inter elsewhere). No serif, no mono.
- **Tokens live in `src/app/globals.css`** as semantic CSS variables exposed via
  `@theme inline` (e.g. `bg-primary`, `text-muted`, `bg-accent-soft`). Style
  components with those utilities — don't hardcode hex in components.
- **Tailwind v4 (CSS-first):** there is **no `tailwind.config.js`**. Add or change
  design tokens in `globals.css`'s `@theme` block, not a JS config.

## UX standards (enforce on every screen — from DESIGN.md §6)

- Tap targets ≥48×48px, ≥8px apart; primary actions reachable at the bottom.
- ≤4 data points per card; details go in the detail view.
- WCAG AA contrast; never convey status by color alone (pair with icon/label).
- Single-tap reserve + clear cancellation; always show status; graceful
  empty/loading/error states.
- Mobile-first (test at 375px); this ships as a **web app on Vercel** (not native).

## Workflow (from CONTRIBUTING.md)

- Never push to `main`. Branch → PR → one teammate review.
- Run `npm run lint` and `npm run build` before opening a PR.
- Keep the fake data in `src/lib/fake-data.ts` matching `docs/data-contract.md`.
