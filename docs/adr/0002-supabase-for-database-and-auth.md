# ADR-0002: Supabase for the database and auth

## Date and status
2026-11-18. Accepted. (Backend decision — Sofia owns; documented here for the team.)

## Context
The app needs a database (stores, listings, profiles, reservations), user
sign-in, and rules that can't be bypassed from the client — e.g. only verified
users can reserve free bags, and no one can set their own `verified` flag. We need
this fast, on a free tier, for the Shipathon.

## Options
- **Supabase (Postgres + Auth + Row-Level Security + RPC functions)**
  - Good: managed Postgres with RLS so rules are enforced server-side; built-in
    auth (password + magic link); SQL functions (`reserve_listing`,
    `complete_verification`) for atomic, trusted operations; generous free tier;
    good Next.js client libraries.
  - Bad: RLS/policies have a learning curve; another service + env vars to manage.
- **Firebase (Firestore + Auth)**
  - Good: fast to start; mature auth.
  - Bad: NoSQL model fits our relational data (stores→listings→reservations)
    worse; security rules are less expressive than SQL + RLS.
- **Custom API + hosted Postgres**
  - Good: full control.
  - Bad: far more to build and host in three weeks; we'd hand-roll auth.

## Decision
Supabase: Postgres for the four contract tables, Supabase Auth for sign-in, RLS
for access rules, and SQL functions for the actions that must be trusted
(reserving a bag, completing verification). Field/table names follow
[`docs/data-contract.md`](../data-contract.md).

## Consequences
- Easier: security lives in the database (RLS), not the client; reserving is
  atomic so two people can't take the last bag; auth is off the shelf.
- Harder: the frontend must go through the documented RPCs/queries (see
  [`docs/backend-api.md`](../backend-api.md)); env vars needed in Vercel; the
  schema must be applied to the live Supabase project, not just merged.
- Next: wire the frontend from fake data to Supabase (the J-integration tasks);
  set `NEXT_PUBLIC_SUPABASE_URL` + publishable key in Vercel.
