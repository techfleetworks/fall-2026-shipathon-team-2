# Privacy terms and data retention — DRAFT

**Status: draft for team review. This is not legal advice.** A qualified person
must review it before it is shown to real users. It covers childcare services,
which involve children and need extra care.

## What we collect

| Data | Why | Stored where |
|---|---|---|
| Email address | Sign-in | Supabase Auth |
| First name | Greeting, and the name the business sees on a booking | `profiles` |
| ZIP code | Show nearby businesses | `profiles` |
| Confirmation that the user is an adult, and the time they accepted terms | Account rules | `profiles` |
| Bookings (slot, seats, code, status) | Show the booking, check it at the business | `bookings` |

## What we do not collect

- Income, benefit or proof documents, or any ID. (The verify flow is removed.)
- Payment details. The customer pays the business in person.
- Phone number, precise location, or a photo.
- **Children's information in the MVP.** If the team decides to ask for a
  child's first name for childcare bookings, this section must change first.

## What a business sees

Only the booking code, the slot, the number of seats, and the customer's first
name. Nothing else.

## How long we keep data (proposed, to confirm)

| Data | Keep for | Then |
|---|---|---|
| Account and profile | Until the user deletes their account | Deleted |
| Bookings | 12 months after the slot time | Deleted |
| Sign-in logs (Supabase default) | Per Supabase's policy | Per Supabase's policy |

## Deleting an account

A user can ask to delete their account. The team deletes the profile and
bookings within 30 days. **The process for requests is not yet built.** Who
receives requests, and how, must be decided.

## Open questions

- Should bookings be kept at all after the slot time? (Shorter is safer.)
- Childcare: do we ask for child details, and if so, what is the minimum?
- Which privacy law applies to the launch area, and who checks this draft?
