# ADR-0007: Final booking rules, and booking texts are opt-in after the first booking

## Date and status
2026-11-22. Accepted. (Settles items ADR-0004 left open: the trust-ladder rules and
the reminder channel, and where the "sign-up consent checkbox" goes. ADR-0004 and
ADR-0006 are not replaced.)

## Context
ADR-0004 left the trust ladder "open, must not be built as final", and its next
steps included a consent checkbox on sign-up. Before the database script (PR #20)
is run and before judging, the team needed final rules that the app, the Terms
page and the database all follow.

Testing the sign-up screens also showed a problem: the phone screen had a
required "I agree to receive booking texts" checkbox. People could not sign up
without opting in, and it was unclear how someone who opted out would still get
their sign-in code.

## Options

**Booking limit after misses**
- Option 1: two misses lock the limit at 1 for good.
  - Good: simple to build.
  - Bad: the app tells people to "show up to book more", but nothing they do helps.
- Option 2: two misses in total reset the limit to 1, and the ladder starts over.
  - Good: matches the app's wording; people can earn trust back by showing up.
  - Bad: the count has to be worked out in time order, not as simple totals.

**Late cancellation (less than 2 hours before)**
- Option 1: the seat stays taken.
  - Good: simple.
  - Bad: the spot goes unused, which defeats the purpose for the shop.
- Option 2: the seat goes back right away, but it still counts as a miss.
  - Good: the shop can still fill it; the miss still discourages late cancels.
  - Bad: none for the demo.

**Where the texting opt-in lives**
- Option 1: a required checkbox on the phone screen.
  - Good: consent collected up front.
  - Bad: blocks sign-up; mixes the one-time sign-in code with optional texts,
    which confuses people.
- Option 2: phone screens only send the code; optional booking texts are offered
  later.
  - Good: the common pattern; tapping "Send code" is the request for that one
    text; optional texts are asked when they make sense.
  - Bad: fewer people may opt in to booking texts.

## Decision

**Booking and cancellation rules (final)**
- A new account holds **1** booking at a time.
- After **2** show-ups, **2** at once.
- After **4** show-ups, **no limit**.
- **Two misses in total** (a no-show, or cancelling less than 2 hours before)
  reset the limit to 1, and the ladder **starts over**: show-ups count again from
  0, so people earn it back.
- Cancelling is free up to **2 hours before**. A later cancel counts as a miss,
  but the seat goes back to other people **right away**.
- Payment is **cash at the shop** at the start of the visit. Nothing is charged in
  the app.

**Texts**
- The sign-up and sign-in phone screens only send the **one-time code**. Tapping
  "Send code" is the request for that one text ("Message and data rates may
  apply"). There is no checkbox on these screens.
- **Booking texts** (confirmations and reminders) are optional and **off by
  default**. They are offered in the reminders prompt right after the first
  booking, and can be changed any time in Settings → Booking texts. The SMS fine
  print (frequency, rates, Reply STOP) shows when they are turned on.
- Opting out of booking texts never blocks sign-in codes.

## Consequences
- Easier: the app, the Terms page, the README and the judge notes all state the
  same rules; sign-up has one less step.
- Built in the app (PRs #21, #22): `historyCounts` in `src/lib/account.ts`,
  `bookingLimit` / `limitStatus` in `src/lib/mock-data.ts`, the phone screen
  (`src/components/onboarding/phone-step.tsx`) and the reminders prompt
  (`src/components/onboarding/reminders-sheet.tsx`).
- Next (database, Sofia): before running the schema v2 SQL (PR #20),
  `booking_limit()` needs the reset-and-start-over rule, `cancel_booking()` needs
  to return the seat on a late cancel (still a miss), and the slots read policy
  needs to hide a booked slot from its owner once it starts.
- Next (real launch): a person who blocks all texts from us (for example by
  replying STOP) can't receive sign-in codes; a real app needs another way in,
  such as an emailed code. The demo sends no texts, so it isn't affected.
- Legal wording (Terms, SMS fine print) is a demo draft and needs a lawyer's review
  before launch.
