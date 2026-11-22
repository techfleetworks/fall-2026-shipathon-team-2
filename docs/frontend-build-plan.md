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
- ☑ `BookingTicket` — business, service, date/time, code, status; the P-flow card.
- `InfoBox` — tonal panel for rules/notes (e.g. "cash at the shop", limit info).
- ☑ `BottomSheet` — scrim + handle, Elevation 3 (Verify-to-reserve, cancel, time pick).
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
- ☑ O2e · Wrong code — `825:5747` (branch of /verify)
- ☑ O3 · What brings you here — `825:4159` → `/reason`
- ☐ O3c · Tell us in your words — `825:5097` → `/reason/custom` — **saved for later (team decision, Nov 21)**
- ☑ O4 · When works — `825:4199` → `/timing`
- ☑ O5 · About you — `825:4237` → `/about`
- ☑ O5b · Booking reminders — `825:5519` (branch of /about)
- ☑ O5l · Use your location — `825:5591` (branch of /about)

### Browse & book
- ☑ H1 · Deals — `825:4273` → `/deals`
- ☑ H1m · Deals (map) — `825:5340` → `/deals/map`
- ☑ H1e · No results — `825:5781` (empty state of /deals)
- ☑ R3 · Filters — `825:4357` (sheet on /deals)
- ☑ R5 · Offer — `825:4489` → `/offer/[id]`
- ☑ R5t · Pick a time — `825:4594` → `/offer/[id]/time`
- ☑ R5x · Slot just taken — `825:5832` (error on pick/confirm)
- ☑ R6 · Confirm — `825:4638` → `/confirm`
- ☑ R6b · One booking at a time — `825:4700` (limit-reached state)

### After booking
- ☑ P1 · Booked — `825:4772` → `/booked/[id]`
- ☑ P1c · Cancel booking? — `825:5645` (dialog)
- ☑ P2 · Reminder — `825:3999` (notification reference)
- ☑ P3 · It’s today — `825:4824` → `/today/[id]`
- ☑ P3m · Missed booking — `825:4875` → `/today/[id]` missed state
- ☑ P4 · Show code — `825:4915` → `/code/[id]`
- ☑ P4o · Show code (offline) — `825:5879` (offline state)
- ☑ P5 · All done — `825:4955` → `/saved/[id]`
- ☑ P6 · Rate your visit — `825:5956` → `/rate/[id]` (needs 336px; tight at 375)

### Account & support
- ☑ H2 · My bookings — `825:5016` → `/bookings`
- ☑ H3 · Account — `825:5058` → `/account`
- ☑ H3s · Settings — `825:5215` → `/account/settings`
- ☑ H3p · Privacy and your data — `825:5289` → `/account/privacy`
- ☑ H3b · How bookings work — `825:5709` → `/account/how-bookings-work`
- ☑ H3d · Your details — `825:5922` → `/account/details`
- ☑ H4 · Favorites — `825:5167` → `/favorites`

### Business side (BLOCKER — not in Figma yet)
- ☑ Business confirms (built from the design system; not in Figma) — design + build (`/staff/confirm`): code entry · wrong code ·
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
- 2026-11-21 — Find & book: H1 Deals, R5 Offer, R5t Pick time, R6 Confirm built +
  verified. Added OfferCard, InfoBox, ButtonLink. Removed the old grocery `(app)`
  route group (replaced by these). Param routes use `export const instant = false`
  (Cache Components). Flow: Deals → Offer → Pick time → Confirm → `/booked/[id]`.
- 2026-11-21 — Real Figma images (option A): exported the demo shop photos +
  Fresh Cuts logo to `public/figma/`, and mirrored the Figma businesses, prices
  and photos exactly in `mock-data.ts` (Fresh Cuts, Studio 7, Main St, Spin City,
  Prime Press). Wired photos into OfferCard, Offer hero + logo, Confirm thumbnail;
  added the Deals "See all" + "From your favorites" row. Note: Splash/Welcome app
  mark is still the SVG recreation (the green Fresh Cuts mark is a business logo,
  separate from the app icon) — swap to the exact Figma app-icon export if wanted.
- 2026-11-21 — Splash/Welcome now use the exact Figma app-icon export (`1e3ad6a`).
- 2026-11-21 — After booking: P1 Booked, P1c Cancel sheet (+ cancelled state), P3 It’s
  today, P4 Show code, P5 All done built + verified at 375px. Added BookingTicket,
  BottomSheet (native `<dialog>`), PageHeader, decorative QrCode (not scannable — staff
  type the 6-digit pin). Mock booking gained `ref`/`pin`/`dayLabel`/`timeRange`; Confirm
  now reads `ref`. Flow: Confirm → `/booked/bk1` → Show my code → `/code/bk1` → Done →
  `/saved/bk1` (Done stands in for the missing business-confirm screen). `/today/bk1`
  is reachable by URL until My bookings (H2) links to it. Add to calendar downloads a
  real .ics; Get directions opens Google Maps. Note: the Figma Fresh Cuts logo export
  is lettering only, so P5 draws the badge circle behind it.
- 2026-11-21 — Bottom-nav tabs: H2 My bookings, H3 Account, H4 Favorites built +
  verified at 375px (nav no longer 404s). Upcoming shows the demo booking (→ `/booked/bk1`);
  the Figma empty state renders when nothing is booked. Past = Spin City + Prime Press
  (`pastBookings`), with Book again → offer. "Saved this month" is now computed
  (`monthSavings`) so H2 ($30 · 2) and P5 ($46 · 3) agree — Figma's "$16 · 1" didn't
  add up once past visits are listed. Account rows without a screen yet (details,
  booking limit, settings, support) show "Soon" and aren't tappable; Privacy → `/privacy`;
  Log out → `/welcome` (no real session yet). Favorites hearts toggle locally (reset on
  reload). Deals "See all" favorites now links to `/favorites`. Added `lock` icon.
- 2026-11-21 — Account sub-screens: H3d Your details (inline first-name edit with
  validation; phone change "Soon"), H3b How bookings work (status from `limitStatus()`),
  H3s Settings (notification switches; Area/Search "Soon"; Terms → `/terms`), H3p Privacy
  (retention per `docs/privacy-and-retention.md` — bookings 12 months; Delete account →
  confirm sheet → status; Download my data "Soon"). Account rows now link to these; only
  Customer support (no Figma screen) stays "Soon". Added shared `ListGroup`/`ListRow` and
  globe/accessibility/shield icons. **Data change:** `user.keptCount` 0 → 2 to match the
  two past bookings, so the limit reads "2 at a time" (Figma showed 1). All edits are
  demo-local until Supabase is wired.
- 2026-11-21 — **Real sign-up (step 1 of the "working app" plan).** New `src/lib/account.ts`
  keeps the person's own account on the device (localStorage) behind hooks, so Supabase
  can replace it in one file. Phone starts empty, formats as typed, validates a US
  number. **Demo code:** a random 6-digit code is generated and shown in a "text
  message" banner labelled "Demo: in the live app this code arrives by text message"
  (real SMS needs a paid provider + US carrier registration); the code is really
  checked (O2e copy on mismatch) with a 30 s resend. "Call me instead" removed (can't
  work in the demo). Reason/timing/About start blank; Continue waits for an answer;
  About needs name + area + a service. Every "Dana" replaced by the typed name
  (Deals "Good morning/afternoon/evening, {name}", Confirm, Account, Your details).
  Splash sends signed-up people to Deals. Log out clears the device. Sample `user`
  keeps only kept/miss counts until history goes real (step 3).
- 2026-11-21 — **Every shop bookable, real dates (step 2).** Sample business data now has
  each shop's description, hours, off-peak window, transit, "Includes" and 9 offers (Figma's
  "9 offers"; Fresh Cuts keeps Figma copy). `src/lib/slots.ts` builds open times for today
  + 2 days from off-peak hours (past times skipped; ~30% shown taken). Per-category words
  (chair / machine / counter slot). Pick a time → draft → Confirm → **real booking** on
  the device (ref, 6-digit pin). Confirm enforces the trust-ladder limit (R6b). Booked
  auto-switches to "It's today"; cancel <2 h counts as a miss; missed/cancelled/done
  states; Reschedule replaces the old booking. Show code "Done" (demo stand-in for the
  shop confirming) marks it kept; All done + month savings come from real kept visits.
  My bookings Upcoming is real; Past/favorites are still sample until step 3. Deals:
  live availability, sorted soonest, "For you" = sign-up services, real count. Fixed
  swapped Spin City / Prime Press photos from the Figma export.
- 2026-11-21 — **Empty history (step 3).** Removed all sample user history (past bookings,
  favorites, kept/miss counts) from `mock-data.ts`; only businesses are sample now. New
  accounts start empty and fill from real use: My bookings Upcoming/Past + "saved this
  month" come from the device's bookings; booking limit (Account, How bookings work,
  Confirm) from real kept/missed visits. Favorites: real hearts (offer page photo, Deals
  cards) save a place, with a "Saved to Favorites · View" message (8 s, pauses on
  hover/focus); Favorites tab lists saved places newest first with live offer status
  ("3 offers on Mon 23"); empty state when none; Deals "From your favorites" row shows
  real favorites and hides when empty. Offer cards restructured so the heart is its own
  button (no button inside a link).
- 2026-11-21 — **Deals: search, filters, drawn map (step 4).** Shared browse state
  (`src/lib/browse.ts`) for list + map: search (service/shop/area/category), tabs and the R3
  Filters sheet (day, time of day, distance, transit, price; live "Show N offers", real
  badge, Clear all). H1e No results. H1m at `/deals/map` is a **drawn** map (pins at
  illustrative positions, not real coordinates — sample shops use real addresses), with
  selected pin "Save $X" and "See open times" shortcut. Deals cleanup: real counts, "See
  all N offers" only when narrowed, settings icon → Settings, dead "Learn more" replaced by
  an honest note. Started `docs/notes-for-judges.md`.
- 2026-11-21 — **Remaining screens.** P2 reminder: in-app card 1 h before (+ browser
  notification if allowed) and a **demo-only** lock-screen page `/demo/reminder` (to be
  removed later). P3m missed (Figma styling, limit from history). P4o offline notice on
  Show code. R5x "isn't available any more" banner on Pick a time with nearest open time
  pre-selected (triggered when the picked time started/closed; true "someone else
  booked it" needs the shared backend). O5b reminders sheet after About (asks browser
  permission; Settings switches now saved to the profile). O5l location: nearest LA
  neighborhood from a built-in list, coordinates not kept. P6 rate (stars + tags, saved
  to the visit). Business confirms `/staff/confirm`: staff type the 6-digit code; only a
  matching open booking is confirmed. O3c not built: the team decided to save it for
  a later version (Figma designs it as an assistant).
- 2026-11-21 — **Audit fixes (23), committed with the screens above in `1601329`.**
  Code review (16): bottom sheets call `onClose` only on user dismiss (fixed "reminders
  saved as OFF"); R5x prefers the same day; stale R5x notice ignored after 10 min
  (`slotGone.at`); only confirmed visits can be rated; Shop view accepts only today's
  open booking; in-app reminder card follows the booking's "Remind me", browser
  notification needs the reminders choice; location result ignored after "Not now",
  status resets; unique sheet title ids (`useId`); reminder card no longer a live region;
  star rating = one tab stop + arrow keys; focus moves to the success message after
  rating / shop confirm; silent spacer cell on Missed ticket; neutral R5x copy "It's no
  longer open for booking."; "missed 2 or more" copy; Settings note when the browser
  blocks notifications; location copy no longer claims distances. Vichea's audit (6 + a
  hint): Sign in has its own "Welcome back" screen (`/signin`, shared
  `components/onboarding/phone-step.tsx`); "See all N offers" remembers the view and
  shows "← Back to …" (`seeAll`/`undoSeeAll` in `browse.ts`); back buttons go one step
  back (`components/ui/back-button.tsx` on Offer, Pick a time, Terms, Privacy); "Save
  [shop] to favorites" on All done and Booked; Language row "Soon"; About-you hint
  "Laundry is wash & fold. Clothing care is pressing & dry cleaning." Security note added
  to notes-for-judges and ADR-0006: the 6-digit code must be checked server-side with a
  wrong-attempt limit in a real version. Teammate test guide: `docs/audit-checklist.md`.
- _(add each screen as it lands)_
