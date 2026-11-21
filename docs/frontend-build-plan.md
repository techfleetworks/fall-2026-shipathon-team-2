# Sparetime frontend build — master plan & handoff

**Purpose:** everything needed to build the Sparetime frontend from the Figma design
system, in order, so any session (including a fresh Claude account on this same repo)
can continue with no re-exploration. Keep this file updated as the single source of
truth for build progress.

Last updated: 2026-11-21.

---

## 0. How to continue in a NEW session / account

1. Open this repo; work on branch **`sparetime-frontend`** (foundation + component kit
   are committed there). Read, in order: this file, `CLAUDE.md`, `AGENTS.md`,
   `src/app/globals.css`, and `src/components/ui/*`.
2. **Figma:** file key `l3nYaHafMl1IaYZMpB70A3`, page **"DS cleanup (working)"**
   (node `825:3933`). It holds the design system (`Design System`, node `825:6316`) and
   all screens (`Sparetime · Prototype`, node `825:3968`). Create a Figma MCP session for
   the file, then per screen use `get_screenshot` (look), `get_variable_defs` (tokens),
   and `get_design_context` (specs; load the figma-design-to-code skill first).
3. **Design tokens are already extracted** into `globals.css` `@theme` (see §3). Don't
   re-derive them — build against the existing utilities.
4. Build each remaining screen (§8) from its node ID using the component kit (§4), then
   verify with a screenshot (`localhost:3000/<route>` via `npm run dev`). Tick it off in §8.
5. Follow the repo's **UX** and **accessibility** skills (`.claude/skills/`) on every
   screen: contrast ≥4.5:1, 48px targets, focus rings, all four states, never meaning by
   colour alone.

---

## 1. Product & scope

Sparetime books discounted **off-peak slots** at small local businesses (haircuts,
laundry, clothing care) in LA County. The customer finds a slot, books it, gets a code,
shows it, and **pays the business in cash**. Persona: getting ready for a job.

Build the **happy path as a real app** (real sign-up, real bookings, real booking-limit
logic). We are building **mock-data first** (UI against fake data), then wiring Supabase.
**Goal: ALL screens** (see §8). Order: sign-up → find & book → show up → account/support,
then branches/edge states, then data wiring.

---

## 2. Stack & conventions

- Next.js 16 (App Router, TypeScript, Turbopack), React 19, Tailwind v4 (**CSS-first, no
  `tailwind.config.js`** — tokens in `globals.css`), Supabase (auth + bookings), Vercel.
- Mobile-first: designed at **390px, must also work at 375px**; centered column on wider
  viewports (component `Screen` handles this). **No dark mode, no animations** (out of scope).
- Components live in `src/components/ui`. Shared helpers in `src/lib`. One route per screen.
- Classnames via `cn()` (`src/lib/cn.ts`). Use the design-token utilities, never raw hex.
- **DESIGN.md is superseded for look & feel** (ADR-0005). Use it only for product rules
  not in the Figma Rules frame. Tokens/fonts come from Figma (see §3).
- Naming: the Figma system was authored as "Plenty"; in code everything is **Sparetime**.

---

## 3. Design system (DONE — in `globals.css`)

Fonts (via `next/font` in `layout.tsx`): **Bricolage Grotesque** (display/headline, Bold)
+ **Plus Jakarta Sans** (titles/body/labels). Utilities: `font-display`, default `font-sans`.

Token utilities generated from `@theme` (role-based, mirror Figma):
- **Color roles:** `action-primary` #63539c, `action-secondary` #63597c, `on-action` #fff,
  `on-tint-primary` #4a3c82, `surface-default`/`surface-card` #fff, `surface-subtle` #e8defe,
  `surface-muted` #f0f0f0, `bg-canvas` #e8e8e8, `text-primary` #1b1b1b, `text-secondary`
  #474747, `accent-primary` #924750, `accent-surface` #cfbcff, `panel-subtle` #fedadc,
  `danger-primary` #b12a2f, `danger-surface` #ffdad6, `status-positive` #2d694a,
  `status-positive-surface` #b0f1cb, `border-default` #c6c6c6, `border-control` #777,
  `focus-ring` #ae6068, `disabled-text` #5e5e5e, `disabled-bg` #f0f0f0.
  Plus full ramps `primary-0..100`, `secondary/accent/destructive/success/neutral-*`.
- **Categories:** `category-haircut` #a8431a / `-surface` #ffe4d6; `category-laundry`
  #1d5c9e / #ddebfc; `category-care` #7a5800 / #fdedbf.
- **Radius:** `rounded-xs` 4, `-sm` 8, `-md` 12, `-lg` 16, `-xl` 28, `-full`.
- **Elevation:** `shadow-e1`, `shadow-e2`, `shadow-e3`.
- **Type scale:** `text-display` 34/40, `text-headline-lg` 30/36, `text-headline-sm` 26/32,
  `text-title-lg` 22/28, `text-title-md` 20/26, `text-title-sm` 16/22, `text-body-lg` 15/22,
  `text-body-md` 14/20, `text-body-sm` 12/17, `text-label-lg` 15/20, `text-label-md` 13/18,
  `text-label-sm` 12/16.
- **Spacing:** Tailwind defaults already equal the Figma 4–40 scale (`p-1`=4 … `p-10`=40).

Verify page: `/style-check`. Design-system section node IDs: Color `825:6418`, Typography
`825:6772`, Layout/spacing/shape `825:6871`, Components `825:7193`, Icons `825:7674`,
Voice `825:7867`, Guardrails `825:7969`, Philosophy `825:8087`, Accessibility `825:8159`,
Brand `838:7847`.

---

## 4. Component kit

**Built** (`src/components/ui`, gallery at `/components`):
`button`, `icon-button`, `icon` (icon set), `chip`, `text-field`, `choice` (RadioRow,
CheckboxRow), `switch`, `badge` (CategoryBadge, StatusBadge, SavePill), `spinner`
(Spinner, LoadingRow), `screen` (Screen, AppBar, ScreenBody, BottomActionBar), `nav-bar`
(bottom nav), `tabs` (secondary).

**To build (composite — build with their first screen, then reuse):**
- `OfferCard` — business photo, name, category badge, price (reg → paid), SavePill,
  distance/time. Used on Deals (H1), Favorites.
- `BookingTicket` — business, service, date/time, code, status; the P-flow card.
- `InfoBox` — tonal panel for rules/notes (e.g. "cash at the shop", limit info).
- `BottomSheet` — scrim + handle, Elevation 3 (Verify-to-reserve, cancel, time pick).
- `Dialog` — centered, title = what happens, destructive action right in red (cancel).
- `SegmentedControl` — two options + check (Deals List/Map).
- `BookingCode` — large 6-char code display (SPRT-XXXXXX) for Show code (P4).

---

## 5. Rules (logic Figma can't show — from the handoff "Rules" frame)

- **Booking limit (trust ladder):** 1 active booking to start; **2 at once after 2 kept
  visits**; **no limit after 2 more kept visits** (4 total kept); **2 misses (total) reset
  to 1**.
- **Cancellation:** cancelling **< 2 hours** before the slot counts as a **miss**.
- **Missed:** a booking is missed when there's no staff confirmation by the end of the slot.
- **Payment:** **cash only, in person, at the start.** The app never takes money.
- **Savings:** "You saved" = **regular price − paid price**, summed per month.
- **Sign-up:** **phone number + one-time 6-digit code** (no email/password).
- Eligibility: **18+**, no income verification anywhere.

---

## 6. Flow & routing map

Happy path: **Welcome → Offers → Offer detail → Pick time → Confirm → Booked → Reminder →
Show code → Business confirms → "You saved $X".**

Proposed routes (one per screen; `[id]` = booking/offer id):
- Onboarding: `/` → `/splash` (O0a, auto-advances) → `/welcome` (O0) → `/phone` (O1) →
  `/verify` (O2; wrong-code O2e inline) → `/reason` (O3; custom O3c) → `/timing` (O4) →
  `/about` (O5; reminders O5b, location O5l inline/sheet).
- Browse & book (bottom nav visible): `/deals` (H1; map `/deals/map` H1m; filters sheet R3;
  empty H1e) → `/offer/[id]` (R5; sold-out, slot-taken R5x) → `/offer/[id]/time` (R5t) →
  `/confirm` (R6; limit-reached R6b).
- After booking: `/booked/[id]` (P1; cancel dialog P1c; <2h warning) → `/today/[id]` (P3;
  missed P3m) → `/code/[id]` (P4; offline P4o) → `/saved/[id]` (P5) → `/rate/[id]` (P6).
- Account (bottom nav): `/bookings` (H2, Upcoming/Past) · `/account` (H3) ·
  `/account/settings` (H3s) · `/account/privacy` (H3p) · `/account/how-bookings-work`
  (H3b) · `/account/details` (H3d) · `/favorites` (H4).
- Reminder P2 = visual notification reference only (no real push).
- **BLOCKER — Business confirms:** no Figma screen yet. Stub `/staff/confirm` (enter
  6-digit code → "Confirm visit"), OR a "Mark as done" the staff taps. Needed so a booking
  can be marked kept and the limit can rise. Flag to the designer.

---

## 7. Mock data (see `src/lib/mock-data.ts`)

Shape (mirrors `docs/data-contract-v2.md`): `Business { id, name, category, photo, logo,
area, distanceMi }`, `Service { id, businessId, name, regularPrice, offPeakPrice }`,
`Slot { id, serviceId, startsAt, taken }`, `Booking { id, slotId, code, status:
'booked'|'today'|'kept'|'missed'|'cancelled', createdAt }`, `User { firstName, phone,
keptCount, missCount, limit }`. Fake businesses only; photos are AI/placeholder. Keep copy
and numbers consistent across screens (Tue 24, 2:30 pm; $12 paid / $28 regular; 12:30 pm
cancel deadline; cash at the shop).

---

## 8. Screen checklist (Figma node IDs + status)

File key `l3nYaHafMl1IaYZMpB70A3`. Status: ☐ todo · ◐ in progress · ☑ done.

### Onboarding / sign-up
- ☑ O0a · Splash — `825:4055` → `/splash`
- ☑ O0 · Welcome — `825:4074` → `/welcome`
- ☑ O1 · Phone — `825:4097` → `/phone`
- ☑ O2 · Code — `825:4128` → `/verify`
- ☐ O2e · Wrong code — `825:5747` (branch of /verify)
- ☑ O3 · What brings you here — `825:4159` → `/reason`
- ☐ O3c · Tell us in your words — `825:5097` → `/reason/custom`
- ☑ O4 · When works — `825:4199` → `/timing`
- ☑ O5 · About you — `825:4237` → `/about`
- ☐ O5b · Booking reminders — `825:5519` (branch of /about)
- ☐ O5l · Use your location — `825:5591` (branch of /about)

### Browse & book
- ☐ H1 · Deals — `825:4273` → `/deals`
- ☐ H1m · Deals (map) — `825:5340` → `/deals/map`
- ☐ H1e · No results — `825:5781` (empty state of /deals)
- ☐ R3 · Filters — `825:4357` (sheet on /deals)
- ☐ R5 · Offer — `825:4489` → `/offer/[id]`
- ☐ R5t · Pick a time — `825:4594` → `/offer/[id]/time`
- ☐ R5x · Slot just taken — `825:5832` (error on pick/confirm)
- ☐ R6 · Confirm — `825:4638` → `/confirm`
- ☐ R6b · One booking at a time — `825:4700` (limit-reached state)

### After booking
- ☐ P1 · Booked — `825:4772` → `/booked/[id]`
- ☐ P1c · Cancel booking? — `825:5645` (dialog)
- ☐ P2 · Reminder — `825:3999` (notification reference)
- ☐ P3 · It's today — `825:4824` → `/today/[id]`
- ☐ P3m · Missed booking — `825:4875` → `/today/[id]` missed state
- ☐ P4 · Show code — `825:4915` → `/code/[id]`
- ☐ P4o · Show code (offline) — `825:5879` (offline state)
- ☐ P5 · All done — `825:4955` → `/saved/[id]`
- ☐ P6 · Rate your visit — `825:5956` → `/rate/[id]` (needs 336px; tight at 375)

### Account & support
- ☐ H2 · My bookings — `825:5016` → `/bookings`
- ☐ H3 · Account — `825:5058` → `/account`
- ☐ H3s · Settings — `825:5215` → `/account/settings`
- ☐ H3p · Privacy and your data — `825:5289` → `/account/privacy`
- ☐ H3b · How bookings work — `825:5709` → `/account/how-bookings-work`
- ☐ H3d · Your details — `825:5922` → `/account/details`
- ☐ H4 · Favorites — `825:5167` → `/favorites`

### Business side (BLOCKER — not in Figma yet)
- ☐ Business confirms — design + build (`/staff/confirm`): code entry · wrong code ·
  visit confirmed.

---

## 9. Blockers / open items for the team

- **Business-confirm screen** is not drawn (see §6). Needed for the limit logic.
- **Rules frame**: the logic in §5 should also live in a Figma "Rules" note frame.
- Two screen copies existed in Figma; **"DS cleanup (working)" is canonical** (the other,
  "Design System & Final Screens", and the Pitch Deck page are not the build source).
- Decision pending: are O3–O5 preferences in v1? (We are building them; confirm.)
- P6 rating chip row needs 336px and won't fit at 375 — off-path.

---

## 10. Verification

Per screen: `npm run dev` → open the route → `read_console_messages` (no errors) →
screenshot at 390/375 → compare to the Figma node screenshot → fix → tick §8. Spot-check
rather than exhaustively re-screenshot once a pattern is proven. Run `npm run lint` and
`npm run build` before opening a PR.

---

## 11. Progress log

- 2026-11-21 — Phase 0 (tokens, fonts, ADR-0005) committed `1974b5f`.
- 2026-11-21 — Phase 1 component kit committed `65d84ba`.
- 2026-11-21 — This plan + shared infra (mock data, shell) added.
- 2026-11-21 — Onboarding batch 1: Splash, Welcome, Phone, Code built + verified;
  added logo, StepBar, StepShell; root `/` redirects to `/splash`.
- 2026-11-21 — Onboarding batch 2: O3 Reason, O4 Timing, O5 About built + verified;
  added RadioCard. Sign-up flow complete → `/deals`.
- _(add each screen as it lands)_
