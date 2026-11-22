# Notes for judges — what's real in the Sparetime demo, and why

Sparetime is built as a **working app**, not a click-through prototype: what you type
is really used, bookings are really created, and the rules (booking limit, cancel
window, savings) really run. A few parts are deliberately simulated for the demo.
This page lists each one and why.

## What is real

- **Your account.** Sign-up uses the phone number and name you type. Nothing is
  pre-filled. No text is sent, so **any US phone number works** — the code appears
  on screen (see below).
- **Your bookings.** Picking a time and tapping **Book slot** creates a real booking
  with its own booking ID and 6-digit code. It shows in **My bookings**, can be
  cancelled or rescheduled, and moves to **Past** when the visit is done.
- **The rules.** All calculated from your real activity:
  - **Booking limit (the trust ladder):** a new account holds 1 booking at a time;
    after 2 show-ups, 2 at once; after 4 show-ups, no limit. **Two misses in total**
    (no-shows, or cancelling less than 2 hours before) reset the limit to 1 and the
    ladder starts over — you earn it back by showing up.
  - **Cancelling** is free up to 2 hours before. Later counts as a miss, but the
    slot is freed for someone else right away.
  - **Payment:** cash at the shop. Nothing is charged in the app.
  - **"You saved $X"** is the regular price minus the price you paid.
- **Your favorites.** Tapping a heart saves that place; the Favorites tab shows only
  places you saved. Removing one shows "Removed [place] · Undo".
- **Delete account** (Account → Privacy and your data) really erases your account on
  this phone and returns you to Welcome ("Your account was deleted from this phone.").
- **Dates and times.** Open times are built from each shop's off-peak hours and your
  real clock: today, tomorrow and the next day. Past times are skipped. **Spin City
  Laundry** has off-peak times **every day** (10 am–2 pm), so the whole flow —
  booking for today, Show code, the shop check-in, All done and Rate — works on any
  day, weekends included.
- **Search and filters** narrow the offers you see by service, shop, area, day, time
  of day, distance, transit and price.

## What is simulated, and why

| What | How the demo handles it | Why |
|---|---|---|
| **The businesses** | The 5 shops, their services, prices, hours, descriptions and photos are **sample data**. | We haven't partnered with or spoken to any businesses yet, so we couldn't present real information on a business's behalf. The shops are fictional; photos are AI-generated. |
| **The sign-up code** | The phone screen says "We'll text you a code to confirm your number" (or "a one-time sign-in code" on Welcome back) and "Message and data rates may apply", with a *Demo* note that no texts are sent. The app creates a random 6-digit code and shows it on the **next screen**. Because no text is actually sent, **you can use any US phone number** — the code is still really checked (a wrong code is rejected). | Real text messages need a paid SMS provider (e.g. Twilio) and US carrier registration (A2P 10DLC), which takes days to weeks. In the live app this code arrives by text. |
| **The map** | **Deals → Map** shows a **drawn map** with price pins, not a real street map. The map stays still and the offers sit in a slide-up panel. | The sample shops use real LA street addresses. A real map would put pins on real buildings that may hold real businesses, which could suggest a real shop is on Sparetime when it isn't. A drawn map shows how the feature works without that risk (and without depending on a live map service during the pitch). |
| **The shop confirming your visit** | On **Show code**, tapping **Done** stands in for the shop confirming you showed up (it only works on the day of the visit; **All done** and **Rate your visit** only appear for checked-in visits). There is also a simple **shop view** (`/staff/confirm`, linked from Show code) where staff type your 6-digit code; only the right code confirms the visit. | The business side of the app isn't designed or built yet. The shop view is a stand-in built from our design system, and in the demo it checks bookings saved on the same phone. **Security note:** this check happens **on the device**, which is fine for a demo but not safe for real money. A real version must verify the 6-digit code **on the server**, tied to that booking, with a **limit on wrong attempts** (so a code can't be guessed) — i.e. proper authorization and rate limiting, never a client-side check. |
| **"Sorry, that time isn't available any more"** | Appears on **Pick a time** if the time you chose has started or closed before you confirm, with the nearest open time already selected. | With everything saved on one phone, nobody else can book your time first. That case needs the shared database. |
| **Where your data is saved** | Your account, bookings and favorites are saved **on this device** (in the browser), under your phone number. **Log out** ends the session; signing back in with the same number **restores your account**. A separate **Start fresh on this device** wipes everything in that browser (for handing a demo phone to the next person). | The database (Supabase) is set up but not connected to these screens yet, so data is per-device: it doesn't follow you to another phone or browser until it is. |
| **Reminders** | Right after your **first** booking, the app asks **once** whether you want reminders, with two optional switches (both off unless you turn them on): **Also send booking texts** and offer alerts. An hour before a booking, a reminder card appears in the app (and a browser notification if you allowed notifications). The booking-texts choice is saved (and can be changed in Settings → **Booking texts**), but no texts are sent. | Reminders by text need the same SMS provider as above. |
| **Lock-screen reminder page** (`/demo/reminder`, linked from a booking as *Demo: see the reminder on a phone's lock screen*) | Recreates a phone's lock screen showing the "Your haircut is in 1 hour" notification for your real next booking. Tapping it opens the booking. | **For demonstration only — to be removed later.** We needed it to show the show-up flow starting from someone's phone screen. In the real app this notification comes from the phone itself, not from a page in the app. |

## Not built yet (marked "Soon" in the app)

- Customer support, changing your phone number, changing your area and search
  preferences in Settings (Settings shows what you chose at sign-up, but editing
  is "Soon"), and "Download my data".
- The business-side screens (posting off-peak slots; a full shop app for confirming
  visits).
- Typing your reason "in your own words" at sign-up (designed in Figma as an
  AI assistant). The team decided to save this for a later version.

## Tips for trying it

- Start from **Welcome → Get started**. Use any US-format phone number; the code
  appears on the next screen. (Already have an account? **Sign in** goes to
  **Welcome back**, which has a "New to Sparetime? Create an account" link.)
- Book **Spin City Laundry** for today (it has times every day). If you then try to
  book another shop, you'll see the **one booking at a time** rule.
- On **Show code**, tap **Done** to finish the visit and see **You saved $X**, then
  **Rate your visit**.
- **Account → Log out** ends the session; sign back in with the same number and
  your bookings are still there. **Start fresh on this device** (under Log out)
  wipes the browser for the next person.
