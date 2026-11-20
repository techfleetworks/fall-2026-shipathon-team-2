# ADR-0003: Design system as CSS-first tokens in Tailwind v4

## Date and status
2026-11-18. Accepted.

## Context
Two people work on the frontend and the design is still evolving. We need one
source of truth for colors, type, and spacing so the look stays consistent and a
redesign is cheap — ideally re-skinning the whole app from one place. The project
uses Tailwind CSS v4, which is CSS-first.

## Options
- **CSS-first `@theme` tokens in `globals.css` (Tailwind v4)**
  - Good: the v4-native way; define semantic tokens once (`--color-primary`, …)
    and get `bg-primary` / `text-muted` utilities automatically; change values in
    one file to re-skin everything; documented in `DESIGN.md`.
  - Bad: differs from most online guides (which assume v3); easy to reach for a
    JS config out of habit.
- **`tailwind.config.js` (Tailwind v3 style)**
  - Good: familiar from older tutorials.
  - Bad: **not how v4 works** — adds a redundant/legacy config; fights the toolchain.
- **Plain CSS / CSS Modules**
  - Good: no framework coupling.
  - Bad: no utility system; more boilerplate; harder to keep consistent.

## Decision
Define semantic design tokens in `src/app/globals.css` via `@theme`, documented in
`DESIGN.md`. Components use the generated utilities (`bg-primary`, `text-muted`,
etc.) and never hardcode hex. There is **no `tailwind.config.js`**.

## Consequences
- Easier: a design change (colors, fonts, spacing) is a one-file edit that
  propagates everywhere; components stay stable across reskins.
- Harder: contributors must know to edit `@theme`, not create a JS config;
  `DESIGN.md` must be kept in sync (CLAUDE.md enforces reading it).
- Next: when the hi-fi is finalized, update the `@theme` tokens + `DESIGN.md`
  first, then apply any per-screen deltas.
