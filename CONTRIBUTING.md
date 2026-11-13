# Contributing

Two developers share this repo with a hard deadline, so these few rules keep us from overwriting each other's work.

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
- **Split work by flow** so you rarely edit the same files: one person owns `/reserve`, the other owns `/verify` and `/pickup`. Shared pieces (layout, components in `src/components/`) need a heads-up in the team chat.
- **Pull `main` into your branch daily** (`git pull origin main`) so conflicts stay small.
- **Never commit keys.** Real values go in `.env.local`, which git ignores. If you add a new variable, add a placeholder to `.env.example`.
- **Run `npm run lint` and `npm run build` before opening a pull request.** If the build fails, Vercel will fail too.

## Feature freeze

After **Fri Nov 20**, only bug fixes and demo polish get merged. If we're behind, we cut nice-to-haves; we don't move the freeze.
