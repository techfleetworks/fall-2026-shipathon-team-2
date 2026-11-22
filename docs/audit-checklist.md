# Teammate test guide — Sparetime (Nov 21)

A walk-through anyone can follow with **no background** to check the app before we merge
and redeploy. You don't need to know the code. Just follow the steps, and whenever
something looks wrong, note it (see [How to report a problem](#how-to-report-a-problem)
at the bottom).

## Before you start

### Run the app

1. Open a terminal in the project folder
   (`C:\Users\osogr\source\repos\fall-2026-shipathon-team-2`).
2. Start it:

   ```powershell
   npm run dev
   ```

3. Open **http://localhost:3000** in your browser.
4. Make the window **phone-size**: open DevTools (F12) → the phone/tablet icon
   (top-left of DevTools) → set the width to **375 px**. This is how people will use it.

> Prefer the live version instead? Ask Vichea for the Vercel "Live demo" link in the
> README. Everything below works the same there.

### Start clean

The app saves your account **on this device/browser** (under your phone number), so you
may be picking up where someone left off.

- **Log out** (Account → Log out) ends the session but **keeps your account** — sign
  back in with the same number and your bookings are still there. Good for testing that
  re-login restores data.
- To test **completely from scratch**, use **Account → Start fresh on this device** (under
  Log out). That wipes every account in this browser and can't be undone.

> **Some states depend on the clock** — a booking in the next hour, a booking whose time
> already passed, "it's today". Today is a weekend and the sample shops only have
> **weekday** slots, so if you want to see those states now, ask Claude to *set up test
> bookings*.

---

## 1. Sign up (first run)

- [ ] **Welcome → Get started.**
- [ ] **Phone number** — the field is **empty**. Type any US-format number (e.g.
  `555-123-4567`). It formats as you type and only a valid US number lets you continue.
- [ ] **Code** — a 6-digit code appears in a banner labelled **Demo** (no real text is
  sent). Type it. A **wrong** code is rejected with a clear message.
- [ ] **Reason / Timing** — nothing is pre-selected; **Continue** stays off until you
  pick an answer.
- [ ] **About you** — needs your **name**, an **area/ZIP**, and at least one **service**.
  - [ ] Hint under services reads: *"Laundry is wash & fold. Clothing care is pressing &
    dry cleaning."*
  - [ ] **O5l Use my location** — tap the **pin** in "Area or ZIP code". A sheet explains
    why; tap **Use my location**.
    - [ ] Your browser asks for permission (allow **or** block — both should be handled).
    - [ ] Allowed: the area fills with the nearest LA neighborhood name.
    - [ ] Blocked / outside LA: a clear message asks you to type it instead.
- [ ] **O5b Reminders sheet** — after **Confirm & browse**, the sheet *"Get a reminder
  before each booking?"* appears **once**.
  - [ ] **Turn on reminders** → the browser asks to allow notifications.
  - [ ] **Not now** → goes to Deals without asking.
  - [ ] Later: Account → Settings → the **Booking reminders** switch matches what you
    chose here.

## 2. Sign in (returning person)

- [ ] From **Welcome**, tap **Sign in** (not Get started).
- [ ] The screen says **"Welcome back"** (its own screen, not the sign-up one).
- [ ] Entering your number + the demo code brings you straight to Deals.
- [ ] **Re-login restores your data:** book something, **Log out**, then **Sign in**
  with the **same number** → your booking and favorites are **still there** (not an
  empty account).

## 3. Browse the Deals

- [ ] **Good morning/afternoon/evening, {your name}** shows at the top (your real name).
- [ ] **Search** by a service, shop or area narrows the list.
- [ ] **Filters** (day, time of day, distance, transit, price) update a live
  **"Show N offers"**; **Clear all** resets them.
- [ ] **"See all N offers"** — tapping it shows all, and a **"← Back to For you"**
  (or "← Back to …") link returns you to the view you came from.
- [ ] **Map** — tap Map. It's a **drawn** map with price pins (labelled as illustrative,
  not a real street map). Selecting a pin shows "Save $X" and "See open times".
- [ ] **Hearts** save a place to **Favorites**; the Favorites tab lists only saved
  places; empty state shows when none.

## 4. Book a time

- [ ] Open any offer → **Pick a time** → choose a slot → **Confirm** → **Book slot**.
- [ ] You land on **Booked** with a real booking ID and 6-digit code.
- [ ] **Back buttons** (on Offer, Pick a time, Terms, Privacy) go **one step back**, not
  to the home screen.
- [ ] **Save [shop] to favorites** link appears on **Booked** and on **All done**.
- [ ] Booking a second shop while one is open shows the **one booking at a time** rule.

### Clock-dependent booking states *(ask Claude to set these up)*

- [ ] **R5x Time not available** — if the time you picked has already started/closed,
  **Pick a time** shows a neutral banner *"It's no longer open for booking."* with the
  nearest open time already selected; Continue works.
- [ ] **P2 In-app reminder** — with a booking starting within the next hour, Deals and
  My bookings show "Your haircut is in … min" at the top; tapping it opens the booking;
  turning **Booking reminders** off in Settings hides it.
- [ ] **P2 Lock-screen demo page** — open a booking → *Demo: see the reminder on a
  phone's lock screen* (or `/demo/reminder`). Looks like the Figma lock screen, shows
  your next booking, tapping opens it, and the bottom label says it's a demo screen.
- [ ] **P3m Missed booking** — a booking whose time passed without being confirmed:
  purple "Missed" header, "Charged: Nothing", booking limit shown; **Find another time**
  and **How bookings work** work.

## 5. At the counter

- [ ] **Show code** — open a today booking → **Show my code**.
- [ ] **P4o Offline** — turn on airplane mode (or DevTools → Network → **Offline**):
  "You're offline. Your code still works." appears and the code is still shown.
- [ ] **Shop view** — tap **open the shop's view** (or `/staff/confirm`):
  - [ ] A **wrong** 6-digit code is rejected with a clear message.
  - [ ] The right code confirms: "[Name] is checked in · Collect $X cash".
  - [ ] The booking then shows as **done** in My bookings → Past.

## 6. After the visit

- [ ] **P6 Rate your visit** — from **All done** → **Rate your visit**.
  - [ ] No stars are pre-selected; **Submit rating** stays off until you pick one.
  - [ ] You can move the stars with **arrow keys** (one tab stop).
  - [ ] Chips (On time, Friendly, Clean, Value) toggle on and off.
  - [ ] Submitting shows "Thanks for rating …"; All done no longer shows the button.
  - [ ] **Skip** goes back to Deals.

## 7. Account & settings

- [ ] **Your details** — first name edits inline; phone change shows **"Soon"**.
- [ ] **How bookings work** — the limit matches your real kept/missed visits.
- [ ] **Settings** — notification switches; **Language** row shows **"Soon"**; if your
  browser **blocks** notifications, a note explains it.
- [ ] **Privacy** — retention text; Delete account → confirm sheet; Download my data
  shows "Soon".

## 8. Everywhere (quick sweep)

- [ ] Nothing is cut off or overlapping at **375 px** wide.
- [ ] Every button and link **does something** (no dead taps).
- [ ] **Keyboard:** Tab reaches every control in order with a visible focus ring; **Esc**
  closes sheets. After rating or a shop confirm, focus moves to the success message.
- [ ] Wording reads naturally (no "Dana", no "PL-" booking IDs, no lowercase day names).
- [ ] Demo-only things are labelled as demo (code banner, lock-screen page, shop view,
  map caption).
- [ ] [Notes for judges](notes-for-judges.md) matches what you saw.

---

## How to report a problem

When something looks or behaves wrong, write it down so it can be fixed fast. For each
problem, note:

1. **Which screen** you were on (e.g. "Pick a time", or the URL in the address bar).
2. **What you did** — the exact steps to get there (so it can be reproduced).
3. **What you expected** to happen.
4. **What actually happened.**
5. **A screenshot** if you can (Windows: **Win + Shift + S**).
6. **Where:** your window width (375 px?) and the browser (Chrome, etc.).

Send the list to Vichea, or drop it in the team chat. A small, clear note beats a long
vague one — one problem per entry.
