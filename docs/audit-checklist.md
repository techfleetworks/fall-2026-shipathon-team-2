# Audit checklist — new screens (Nov 21)

A click-through to check the newest screens yourself before committing. Run the app
(`npm run dev`, then http://localhost:3000), use a phone-size window (375 px wide),
and tick each box. Note anything that looks off next to the item.

> **Start clean:** Account → **Log out** clears everything on this device.
> **Some states depend on the clock** (a booking within the next hour, a booking that
> already passed). Today is a weekend and the sample shops only have weekday slots, so
> ask Claude to *set up test bookings* if you want to see those states now.

## 1. Sign-up extras

- [ ] **O5l Use my location** — Welcome → Get started → phone → code → … → *About you*.
  Tap the **pin** in "Area or ZIP code". A sheet explains why; tap **Use my location**.
  - [ ] Your browser asks for permission (allow or block — both should be handled).
  - [ ] Allowed: the area fills with the nearest LA neighborhood name.
  - [ ] Blocked / outside LA: a clear message asks you to type it instead.
- [ ] **O5b Reminders sheet** — fill in name, area, a service, tap **Confirm & browse**.
  - [ ] The sheet "Get a reminder before each booking?" appears **once**.
  - [ ] **Turn on reminders** → the browser asks to allow notifications.
  - [ ] **Not now** → goes to Deals without asking.
  - [ ] Account → Settings: the **Booking reminders** switch matches what you chose.

## 2. Booking states

- [ ] **R5x Time not available** — book a time, then wait until it has started before
  tapping **Book slot** (or ask Claude to set this up).
  - [ ] Pick a time shows the red "Sorry, … isn't available any more" banner.
  - [ ] The nearest open time is already selected; Continue works.
- [ ] **P2 In-app reminder** — needs a booking starting within the next hour.
  - [ ] Deals and My bookings show "Your haircut is in … min" at the top.
  - [ ] Tapping it opens the booking.
  - [ ] Turning **Booking reminders** off in Settings hides it.
- [ ] **P2 Lock-screen demo page** — open a booking → *Demo: see the reminder on a
  phone's lock screen* (or go to `/demo/reminder`).
  - [ ] Looks like the Figma lock screen; shows your next booking's shop and time.
  - [ ] Tapping the notification opens the booking.
  - [ ] The bottom label says it is a demo screen.
- [ ] **P3m Missed booking** — a booking whose time passed without being confirmed.
  - [ ] Purple "Missed" header, "You missed your … slot", "Charged: Nothing".
  - [ ] Booking limit shown; **Find another time** and **How bookings work** work.

## 3. At the counter

- [ ] **P4o Offline** — on **Show code**, turn on airplane mode (or browser DevTools →
  Network → Offline).
  - [ ] "You're offline. Your code still works." appears; the code is still shown.
- [ ] **Shop view** — on Show code, tap **open the shop's view** (or go to
  `/staff/confirm`).
  - [ ] A wrong 6-digit code is rejected with a clear message.
  - [ ] The code from Show code confirms the visit: "[Name] is checked in · Collect $X cash".
  - [ ] The booking now shows as done in My bookings → Past.

## 4. After the visit

- [ ] **P6 Rate your visit** — All done → **Rate your visit**.
  - [ ] No stars are pre-selected; **Submit rating** stays off until you pick one.
  - [ ] Chips (On time, Friendly, Clean, Value) toggle on and off.
  - [ ] Submitting shows "Thanks for rating …"; All done no longer shows the button.
  - [ ] **Skip** goes back to Deals.

## 5. Everywhere

- [ ] Nothing is cut off or overlapping at 375 px wide.
- [ ] Every button and link does something (no dead taps).
- [ ] Keyboard: **Tab** reaches every control in order, with a visible focus ring;
  **Esc** closes sheets.
- [ ] Wording reads naturally (no "Dana", no "PL-" booking IDs, no lowercase day names).
- [ ] Demo-only things are labelled as demo (code banner, lock-screen page, shop view,
  map caption).
- [ ] [Notes for judges](notes-for-judges.md) matches what you saw.
