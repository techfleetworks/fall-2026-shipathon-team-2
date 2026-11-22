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

- **Look & feel comes from the Sparetime Figma design system** —
  see [ADR-0005](docs/adr/0005-sparetime-figma-design-system.md). DESIGN.md's old
  green/purple palette and Inter font are **out of date**; use DESIGN.md for
  product and UX rules only.
- **Palette (from Figma):** primary violet `#63539c` (`action-primary`, primary
  buttons/active), accent rose `#924750`, success green `#2d694a`
  (`status-positive`), danger `#b12a2f`, neutral text `#1b1b1b`, light-grey canvas
  `#e8e8e8`, white cards, plus service-category colours (haircut, laundry, care).
- **Fonts:** **Bricolage Grotesque** (bold) for display & headlines
  (`font-display`); **Plus Jakarta Sans** for titles, body, labels and buttons
  (`font-sans`, the default). Both are loaded with `next/font` in
  `src/app/layout.tsx`. Use the type-scale utilities (`text-display`,
  `text-title-sm`, `text-body-md`, `text-label-lg`, …) rather than raw sizes.
- **Tokens live in `src/app/globals.css`** in its `@theme` block, with role-based
  names mirroring Figma (e.g. `bg-action-primary`, `text-text-primary`,
  `bg-surface-card`, `bg-status-positive`, `border-border-default`). Style
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
- Keep the sample data in `src/lib/mock-data.ts` matching `docs/data-contract-v2.md`.
