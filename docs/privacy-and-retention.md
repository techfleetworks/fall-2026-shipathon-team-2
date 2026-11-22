# Privacy and retention — DRAFT

**Demo draft, last updated Nov 21, 2026. This is a placeholder for the demo and is
not legal advice.** A lawyer must review it before any real launch. Do not claim in
any text or in the pitch that the policy has been reviewed.

**Childcare is left out for now** — it involves children and needs a qualified
review. The MVP is for adults aged 18 and over.

## Plain-language summary (put this on `/privacy`)

Sparetime helps you find and book discounted off-peak time slots for everyday
services, like haircuts and laundry, from small local businesses. We collect only
what we need to do that, we do not sell your data, and you can delete it at any
time.

> We never ask you to prove your income.

## What we collect

- **Account details:** your first name and your US mobile phone number. We sign
  you in with a 6-digit code. In this demo, the code is shown on screen and no
  text message is sent. There is no password, and the code is used once and not
  kept.
- **Location:** your ZIP code, so we can show businesses near you. If a map is
  used, device location is used only while you are on the map and is not stored.
- **Bookings:** what you booked, with which business, your time slot, and whether
  you showed up. We use this to set how many bookings you can hold at once.
- **Preferences:** any settings you choose (for example service filters), so we can
  tailor the slots we show.
- **Consent record:** which version of the policy you agreed to, and when.
- **Security logs:** sign-in attempts and error logs.

> **In this demo:** no text message is sent (the 6-digit code is shown on screen),
> and everything you enter (phone number, first name, ZIP code, bookings and
> preferences) is saved only on your device, in this browser. None of it is sent
> to a server. "Start fresh on this device" in Account deletes it.

## What we do not collect

- **Income, benefits or any proof of need.** We never ask you to prove your income.
- **Payment card numbers.** You pay the business directly, in cash.
- **Children's names or details.** Sparetime is for adults aged 18 and over.

## How we use it

To show available slots, hold your booking, give you a booking code, set your
booking limit, and keep the service safe. We do not use it for advertising.

## Who we share it with

We do not sell or rent your personal data. A business sees only what it needs to
serve you: your first name, your booking code and your time slot. We use service
providers to run the app (for example hosting and sign-in), and they may only use
your data to provide that service. We may disclose data if the law requires it.

## How long we keep it

| Data | What we keep | How long | Why |
|---|---|---|---|
| Account | Phone number, first name | Until you delete your account, or 12 months after your last login | Needed to sign in |
| ZIP code | Home ZIP | Until you change it or delete your account | Shows nearby offers |
| Live location | Not stored | Session only | Privacy by default |
| Active bookings | Service, business, time slot, booking code | Until the booking ends | Needed to complete the visit |
| Past bookings | Service, business, date, showed up or missed | 12 months, then deleted | Support questions |
| Booking count | How many bookings you showed up for, and misses | Until you delete your account | Sets how many bookings you can hold at once |
| Preferences | Settings you choose | Until you edit them or delete your account | Tailors the slots you see |
| Consent records | Policy version and timestamp | 3 years after account deletion | Proof of agreement |
| Security logs | Sign-in attempts, error logs | 90 days | Fraud and bug prevention |
| Deleted accounts | Everything above, except consent records | Removed within 30 days of your request | Your right to delete |

## Your choices and rights

You can view and edit your information in Settings, download your data, or delete
your account at any time. If you live in **California** you also have the right to
know what we collect, to request deletion or correction, and not to be treated
differently for using these rights. This is a demo, so there's no privacy contact yet; a real address will be
added before launch. To delete everything now, use "Start fresh on this device"
in Account.

## Security

Encrypted connections and access controls; each user can read only their own
records. No system is perfectly secure, so keep your phone and your sign-in codes
to yourself.

## Children

Sparetime is for adults aged 18 and over. We do not knowingly collect data from
children.

## Changes

If we make important changes, we will tell you in the app before they take effect.

## Terms points to match the app (short version, for `/terms`)

- You must be **18 or older**.
- You pay the business directly; **Sparetime does not process payments**.
- Businesses, not Sparetime, provide and are responsible for the services.
- Booking limits follow the **trust ladder** (screens-and-flows §5).
- You can **cancel up to 2 hours before**; later cancelling counts as a miss.
- Do not resell bookings or share codes.
- Slots depend on what businesses have open.
- These terms follow **California** law.
- Legal entity name and address: _to be added_ (**planned public benefit
  corporation, not yet filed**).

## What to build for the demo (must-haves — code, deferred with §4)

- `/privacy` and `/terms` pages, linked in the footer and Settings.
- A required consent checkbox at sign-up ("I agree to the Terms and Privacy
  Policy", both linked) that saves a `consents` row (user id, policy version,
  timestamp).
- A one-line note at sign-up: "We never ask you to prove your income."
- Settings with links to both policies plus "Download my data" and "Delete my
  account".
- The scheduled cleanup job (pg_cron) can be shown as built or documented as
  planned — say which in the pitch.

## Open items (do not state as final)

- The real **privacy/support contact email** and **legal entity** text.
- Which retention items are **built** vs **planned** for the demo.
- Which privacy law applies beyond California, and **who reviews this draft**.
