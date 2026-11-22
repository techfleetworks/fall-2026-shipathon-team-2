# Notes for judges — what's real in the Sparetime demo, and why

Sparetime is built as a **working app**, not a click-through prototype: what you type
is really used, bookings are really created, and the rules (booking limit, cancel
window, savings) really run. A few parts are deliberately simulated for the demo.
This page lists each one and why.

## What is real

- **Your account.** Sign-up uses the phone number and name you type. Nothing is
  pre-filled.
- **Your bookings.** Picking a time and tapping **Book slot** creates a real booking
  with its own booking ID and 6-digit code. It shows in **My bookings**, can be
  cancelled or rescheduled, and moves to **Past** when the visit is done.
- **The rules.** The trust-ladder booking limit (1 at a time, 2 after 2 kept
  visits, no limit after 4; 2 misses reset it), the 2-hour cancel window, and
  "You saved $X" (regular price minus the price you paid) are all calculated from
  your real activity.
- **Your favorites.** Tapping a heart saves that place; the Favorites tab shows only
  places you saved.
- **Dates and times.** Open times are built from each shop's off-peak hours and your
  real clock: today, tomorrow and the next day. Past times are skipped.
- **Search and filters** narrow the offers you see by service, shop, area, day, time
  of day, distance, transit and price.

## What is simulated, and why

| What | How the demo handles it | Why |
|---|---|---|
| **The businesses** | The 5 shops, their services, prices, hours, descriptions and photos are **sample data**. | We haven't partnered with or spoken to any businesses yet, so we couldn't present real information on a business's behalf. The shops are fictional; photos are AI-generated. |
| **The sign-up code** | The app creates a random 6-digit code and shows it in a "text message" banner labelled *Demo*. The code is really checked (a wrong code is rejected). | Real text messages need a paid SMS provider (e.g. Twilio) and US carrier registration (A2P 10DLC), which takes days to weeks. In the live app this code arrives by text. |
| **The map** | **Deals → Map** shows a **drawn map** with price pins, not a real street map. | The sample shops use real LA street addresses. A real map would put pins on real buildings that may hold real businesses, which could suggest a real shop is on Sparetime when it isn't. A drawn map shows how the feature works without that risk (and without depending on a live map service during the pitch). |
| **The shop confirming your visit** | On **Show code**, tapping **Done** stands in for the shop confirming you showed up. | The business side of the app (where staff confirm visits and post slots) isn't built yet. |
| **Where your data is saved** | Your account, bookings and favorites are saved **on this device** (in the browser). **Log out** clears them so the next person starts fresh. | The database (Supabase) is set up but not connected to these screens yet. Data doesn't follow you to another phone or browser until it is. |
| **Reminders** | "Remind me 1 hour before" is shown in the app only. | Reminders by text need the same SMS provider as above. |

## Not built yet (marked "Soon" in the app)

- Customer support, changing your phone number, choosing your area and search
  preferences in Settings, and "Download my data".
- The business-side screens (posting off-peak slots, confirming visits).

## Tips for trying it

- Start from **Welcome → Get started**. Use any US-format phone number; the code
  appears on screen.
- Book any shop. If you book one and try another, you'll see the **one booking at a
  time** rule.
- On **Show code**, tap **Done** to finish the visit and see **You saved $X**.
- **Account → Log out** resets everything on that device.
