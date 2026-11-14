# Contributing

Three developers (Sofia Aguilar, Vichea Tephang and Sara) share this repo with a hard deadline, so these few rules keep us from overwriting each other's work.

## The workflow

1. **Start from the latest `main`:**
   ```bash
   git checkout main
   git pull
   ```
2. **Make a branch** for one piece of work:
   ```bash
   git checkout -b feature/reserve-list
   ```
   Name it by type: `feature/…`, `fix/…`, `docs/…`, `chore/…`.
3. **Commit small and often**, with messages that say what changed: `Add pickup window picker`, not `updates`.
4. **Push your branch and open a pull request:**
   ```bash
   git push -u origin feature/reserve-list
   ```
   GitHub will show a link to open the pull request.
5. **Get one teammate to review**, then merge. Delete the branch after merging.

## Rules

- **Never push straight to `main`.** `main` is what gets deployed to Vercel.
- **Split work by layer** so we rarely edit the same files. Frontend (Vichea and Sara) owns all screens: `src/app/` and `src/components/`, plus Vercel. Backend (Sofia) owns Supabase (tables, sign-in, security rules, any SQL in `supabase/`) and the connection code in `src/lib/supabase/`. The data contract (table and field names) is shared: change it only after telling the rest of the team in the team chat.
- **Pull `main` into your branch daily** (`git pull origin main`) so conflicts stay small.
- **Never commit keys.** Real values go in `.env.local`, which git ignores. If you add a new variable, add a placeholder to `.env.example`.
- **Run `npm run lint` and `npm run build` before opening a pull request.** If the build fails, Vercel will fail too.

## Feature freeze

After **Fri Nov 20**, only bug fixes and demo polish get merged. If we're behind, we cut nice-to-haves; we don't move the freeze.
