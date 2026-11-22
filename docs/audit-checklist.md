# Teammate test guide — Sparetime (Nov 21)

A walk-through anyone can follow with **no background** to check the app before we merge
and redeploy. You don't need to know the code. Just follow the steps, and whenever
something looks wrong, note it (see [How to report a problem](#how-to-report-a-problem)
at the bottom).

## Before you start

### Open the app (easiest — just a link)

Open this link on your phone or computer — no install, no login:

**https://fall-2026-shipathon-team-2.vercel.app**

On a computer, make the window **phone-size** to see it as people will: open DevTools
(F12) → the phone/tablet icon (top-left of DevTools) → set the width to **375 px**. On a
phone it's already the right size.

> **⚠️ Which link to use — please read.** PR #18 is merged, so **the public link above**
> (the same "Live demo" link as in the README) shows the merged app. Newer work shows up
> there as later PRs merge. To check work that **isn't merged yet**, use the preview link
> in the **latest open pull request** on GitHub (Vercel posts it as a comment). Older
> branch preview links (like `...-git-sparetime-frontend-...`) may no longer be the
> newest. If a link ever asks you to log in or shows an error, tell Vichea.

### Run it locally instead (optional, only if you have the code)

1. Open a terminal in the project folder and run `npm run dev`.
2. Open **http://localhost:3000**, and set the window to **375 px** as above.

### Start clean

The app saves your account **on this device/browser** (under your phone number), so you
may be picking up where someone left off.

- **Log out** (Account → Log out) ends the session but **keeps your account** — sign
  back in with the same number and your bookings are still there. Good for testing that
  re-login restores data.
- To test **completely from scratch**, use **Account → Start fresh on this device** (under
  Log out). That wipes every account in this browser and can't be undone.

> **Some states depend on the clock** — a booking in the next hour, a booking whose time
> already passed, "it's today". **Spin City Laundry** has off-peak times **every day**
> (9 am–9 pm), so you can book it for today on any day (weekends too) and walk the
> whole flow. For states that need a time already passed, ask Claude to *set up test
> bookings*.

---

## 1. Sign up (first run)

- [ ] **Welcome → Get started.**
- [ ] **Phone number** — the field is **empty**. Type any US-format number (e.g.
  `555-123-4567`). It formats as you type and only a valid US number lets you continue.
  - [ ] There is **no opt-in checkbox**. One line reads *"We'll text you a code to
    confirm your number. Message and data rates may apply."* and a **Demo** note says no
    texts are sent and the code appears on the next screen.
- [ ] **Code** — the 6-digit code shows on the next screen, labelled **Demo** (no real
  text is sent). Type it. A **wrong** code is rejected with a clear message.
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
- [ ] **Confirm & browse** goes straight to Deals (no reminders question yet — that
  comes after your first booking; see section 4).

## 2. Sign in (returning person)

- [ ] From **Welcome**, tap **Sign in** (not Get started).
- [ ] The screen says **"Welcome back"** (its own screen, not the sign-up one): no
  sign-up progress bar, the line says *"a one-time sign-in code"*, and there's a
  **"New to Sparetime? Create an account"** link.
- [ ] Entering your number + the demo code brings you straight to Deals.
- [ ] **Re-login restores your data:** book something, **Log out**, then **Sign in**
  with the **same number** → your booking and favorites are **still there** (not an
  empty account).

## 3. Browse the Deals

- [ ] **Good morning/afternoon/evening, {your name}** shows at the top (your real name).
- [ ] **Search** by a service, shop or area narrows the list.
- [ ] **Filters** (day, time of day, distance, transit, price) update a live
  **"Show N offers"**; **Clear all** resets them.
- [ ] **Settings gear** at the top right of Deals opens Settings.
- [ ] **"See all N offers"** shows the rest of the list in place; **"Show less"**
  shortens it again. Long deal titles wrap to 2 lines instead of being cut off.
- [ ] **Map** — tap Map. It's a **drawn** map with price pins (labelled as illustrative,
  not a real street map). Selecting a pin shows "Save $X" and "See open times", and the
  pop-up stays fully on screen.
  - [ ] The map **stays still**; offers are in a **slide-up panel**. Tapping the panel's
    top moves it fully up / down, dragging works, and the list only scrolls when the
    panel is fully up.
- [ ] **Hearts** save a place to **Favorites**; the Favorites tab lists only saved
  places; empty state shows when none.
  - [ ] Removing a place on the Favorites tab shows **"Removed [place] · Undo"**; **Undo**
    puts it back in the same spot.

## 4. Book a time

- [ ] Open any offer → **Pick a time** → choose a slot → **Confirm** → **Book slot**.
- [ ] You land on **Booked** with a real booking ID and 6-digit code.
- [ ] **O5b Reminders prompt** — right after your **first** booking (only then, only
  once), the sheet *"Get a reminder before each booking?"* appears. There's no example
  notification.
  - [ ] **Also send booking texts** is **off** by default; switching it on shows the
    text-message fine print (message frequency, rates, Reply STOP).
  - [ ] **Also tell me about new offers** is off by default.
  - [ ] **Turn on reminders** → the browser asks to allow notifications.
  - [ ] **Not now** closes it without asking.
  - [ ] Book again later → the sheet does **not** come back.
  - [ ] Later: Account → Settings → **Booking reminders** and **Booking texts** match
    what you chose here.
- [ ] **Back buttons** — most back arrows go to the screen's **logical parent** (e.g. a
  booking → My bookings, Show code → the booking, Settings → Account), not to the home
  screen. **Terms** and **Privacy** use the browser's back (one step back).
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

- [ ] **Show code** — open a today booking (Spin City Laundry works any day) →
  **Show my code**.
  - [ ] **Done** (the demo stand-in for the shop confirming) only works on the **day of
    the visit**; for a later booking the code shows but Done waits.
  - [ ] **All done** and **Rate your visit** only show for a checked-in visit.
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
- [ ] **How bookings work** — the limit matches your real kept/missed visits: 1 at a
  time for a new account, 2 after 2 show-ups, no limit after 4; **two misses in total**
  (no-shows or cancelling less than 2 hours before) reset it to 1.
- [ ] **Settings** — notification switches (Booking reminders, **Booking texts**, Offer
  alerts, Favorites); tapping **anywhere on a row** flips its switch. **Language** row shows
  **"Soon"**; if your browser **blocks** notifications, a note explains it.
  - [ ] **Area** and **Services** (tag icon) show what **you** entered at sign-up (your
    area, your chosen services), still marked "Soon".
- [ ] **Privacy and your data** — retention text; Download my data shows "Soon".
  - [ ] **Delete account** → confirm sheet → your account is **really erased** on this
    phone and you land on Welcome with *"Your account was deleted from this phone."*
    Signing in with the same number afterwards goes through sign-up again (a new,
    empty account).

## 8. Everywhere (quick sweep)

- [ ] Nothing is cut off or overlapping at **375 px** wide.
- [ ] Every button and link **does something** (no dead taps).
- [ ] Screens slide in and out when you move between pages.
- [ ] **On an iPhone:** tapping a text box doesn't zoom the page in, and opening
  **Filters** doesn't make the page bounce.
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
