# ADR-0005: Adopt the Sparetime Figma design system (supersedes DESIGN.md look & feel)

## Date and status
2026-11-21. Accepted. (Supersedes the "Green & Purple" visual system described in
[`DESIGN.md`](../../DESIGN.md) for all look & feel. ADRs 0001–0004 still stand; this
ADR only changes the visual design source, not the stack or product direction.)

## Context
`DESIGN.md` defined a green/purple palette and an Inter/system font stack, with tokens
hand-written in `src/app/globals.css`. The team has since built a complete, high-fidelity
**Sparetime design system in Figma** (file "Shipathon Team 2" → page "DS cleanup
(working)"), with proper variables and styles: a full colour system (primary violet
`#63539c`, accent, danger, success, neutral ramps, plus service-category colours),
a Bricolage Grotesque + Plus Jakarta Sans type scale, spacing (4–40), corner radii
(none → full), and elevation. The screens (≈35, happy-path flow) are drawn against it.

A teammate's handoff checklist states plainly: **"DESIGN.md is out of date for look and
feel. Use it only for product rules not covered by the Figma Rules frame."** The new
system also uses **purple for primary actions** — taken from Figma, not from DESIGN.md's
older purple.

## Options
- **Adopt the Figma design system as the source of truth; re-generate tokens from its
  variables.** Good: matches what the team actually designed; one source of truth; the
  screens already target it. Bad: the repo's existing green/purple tokens and any code
  referencing them must be migrated.
- **Keep DESIGN.md's green/purple system.** Good: no migration. Bad: the submitted app
  would not match the team's design; wasted design work; contradicts the handoff.

## Decision
Adopt the **Sparetime Figma design system**. Regenerate `globals.css` tokens directly
from the Figma variables, using **role-based names that mirror the Figma CSS syntax**
(`--color-action-primary`, `--color-text-primary`, `surface/text/action/border`, etc.),
renamed **Plenty → Sparetime**. Keep tokens CSS-first in `globals.css`'s `@theme` block
(no `tailwind.config.js`), per the stack decision. `DESIGN.md` is retained for product
rules only and marked superseded for look & feel.

## Consequences
- Easier: `globals.css` now matches Figma one-to-one, so screens can be built to spec
  without guessing colours or type.
- Harder: components/pages still referencing the old tokens (`--primary` green,
  `--savings`, `--accent-soft`, etc.) must be migrated or removed as the grocery UI is
  replaced by the Sparetime screens.
- Notes: no dark mode and no animation tokens (out of scope for v1). The "Rules" logic
  (booking limit, cancellation window, savings math, phone + OTP sign-up) lives in a
  Figma Rules frame / this repo's docs, not in the visual system.
