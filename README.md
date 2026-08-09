# ghenortrs

GHENO rotors marketing and B2B site.

Stack: Remix (Vite), React, TypeScript.

Style tokens: `DESIGN.md` and `app/styles.css`.

Plan work in Linear project `Gheno rotors`.

## Commands

```bash
pnpm install
pnpm dev          # remix vite:dev
pnpm test         # vitest run
pnpm test:watch   # vitest
pnpm typecheck    # tsc
pnpm lint         # eslint
pnpm build        # search:sync + remix vite:build
pnpm start        # remix-serve production server
pnpm search:sync  # refresh Nuvemshop search index
pnpm catalog:sync # pull Bling catalog cache
```

## App layout

- `app/routes/*` — Remix file routes (pages and `/api/*` resource routes)
- `app/components/*` — UI (GHENO design system)
- `app/server/*` — server handlers (B2B, Bling, Resend, Supabase)
- `public/` — static assets and `llms.txt`

## Environment

Copy `.env.example` to `.env`.

Also set the same keys in the Vercel project.

Public browser vars use the `VITE_*` prefix.

## B2B auth and Bling catalog

1. Apply `supabase/migrations/20260801000000_b2b_sellers_bling.sql`.
2. Set credentials. See `docs/integrations/b2b-auth-bling.md`.
3. Connect Bling OAuth once via `POST /api/bling-oauth-start` with `X-Admin-Secret`, then open the returned `authorizeUrl`.
4. Sync products: `pnpm catalog:sync` or `POST /api/bling-sync` with `X-Admin-Secret`.

Public marketing search still uses Nuvemshop (`pnpm search:sync`).
