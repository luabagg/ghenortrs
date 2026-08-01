# ghenortrs

GHENO's frontend foundation is a Vite + React + TypeScript app for the first implementation milestone.

## Commands

- `corepack enable` ensures the pinned pnpm version is available.
- `pnpm install` installs dependencies from `pnpm-lock.yaml`.
- `pnpm dev` starts the local app.
- `pnpm test` runs Vitest.
- `pnpm lint` runs ESLint.
- `pnpm typecheck` runs the TypeScript build graph without emitting app assets.
- `pnpm build` creates the production bundle in `dist/`.
- `pnpm preview` serves the built bundle locally.

pnpm is pinned in `package.json`. New dependency resolution is guarded by
`minimumReleaseAge: 10080` in `pnpm-workspace.yaml`, which requires package
versions to be at least seven days old before pnpm selects them.

## Environment

Copy [.env.example](.env.example) to `.env.local` when you need local
overrides. The current app does not consume env vars yet; the file exists to
lock the deployment contract for later milestones.

## Deployment Baseline

The app is a static SPA bundle. Host rewrites must send client routes to
`index.html` for direct navigation. Planning and milestone status live in
Linear project `Gheno rotors`.

## B2B auth + Bling catalog

Seller-gated B2B catalog scaffolding is in place. Plug credentials only:

1. Apply `supabase/migrations/20260801000000_b2b_sellers_bling.sql`
2. Fill `.env.example` → Vercel + `.env.local` (see `docs/integrations/b2b-auth-bling.md`)
3. Connect Bling OAuth once via `/api/bling-oauth-start?secret=…`
4. Sync products: `pnpm catalog:sync` or `POST /api/bling-sync`

Public marketing search remains Nuvemshop-based (`pnpm search:sync`).
