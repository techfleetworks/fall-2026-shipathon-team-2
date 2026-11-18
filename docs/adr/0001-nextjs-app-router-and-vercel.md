# ADR-0001: Next.js (App Router) on Vercel for the web app

## Date and status
2026-11-18. Accepted. (Documents a decision already in effect.)

## Context
We're building a mobile-first web app for the Shipathon in ~3 weeks with a small
team. The program defines a "finished product" as a launched URL **hosted on
Vercel**, and gives the team Claude Code. We needed a framework that's fast to
build in, deploys easily to Vercel, and handles routing, data fetching, and
server logic for later Supabase integration.

## Options
- **Next.js (App Router) + Vercel**
  - Good: first-class Vercel hosting + automatic PR preview deploys; file-based
    routing; server components/actions for secure Supabase calls; one framework
    for UI + server; strong Claude Code familiarity.
  - Bad: App Router + Next 16 "Cache Components" has sharp edges (no `new Date()`
    during render, read route `params` inside `<Suspense>`); needs Node 22+.
- **Plain React SPA (Vite) + separate host**
  - Good: simpler mental model; very fast dev server.
  - Bad: no built-in server layer (harder to keep Supabase calls server-side);
    routing/data-fetching are bolt-ons; not the native Vercel path.
- **Other full-stack frameworks (Remix, SvelteKit)**
  - Good: capable alternatives.
  - Bad: less team familiarity; no advantage over Next for a Vercel target.

## Decision
Next.js 16 (App Router, TypeScript, Tailwind CSS v4, Turbopack), deployed on
Vercel. It matches the required host, gives us previews for free, and the server
layer sets up clean Supabase integration.

## Consequences
- Easier: Vercel deploys and per-PR previews; SSR/partial-prerender; one codebase
  for UI and server logic.
- Harder: must respect Cache Components rules (see `AGENTS.md`); needs Node 22+;
  preview URLs are login-gated on the free plan (share the production URL).
- Next: keep server-only secrets in server components/actions; set
  `NEXT_PUBLIC_SUPABASE_*` env vars in Vercel when wiring the backend.
