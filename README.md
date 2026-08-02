# ghenortrs

GHENO rotors marketing + B2B site on **Remix (Vite)** + React + TypeScript.

Styling tokens live in `DESIGN.md` / `app/styles.css`. Planning lives in Linear project `Gheno rotors`.

## Commands

```bash
pnpm install
pnpm dev          # remix vite:dev
npm test             # vitest
pnpm typecheck    # tsc
pnpm lint         # eslint
pnpm build        # search:sync + remix vite:build
npm start            # remix-serve production server
pnpm search:sync  # refresh Nuvemshop search index
pnpm catalog:sync # pull Bling catalog cache
```

## App layout

- `app/routes/*` — Remix file routes (pages + `/api/*` resource routes)
- `app/components/*` — UI (GHENO design system)
- `app/server/*` — server handlers (B2B, Bling, Resend, Supabase)
- `public/` — static assets + `llms.txt`

## Environment

Copy `.env.example` → `.env` / Vercel project env. Public browser vars still use the `VITE_*` prefix.

## B2B auth + Bling catalog

1. Apply `supabase/migrations/20260801000000_b2b_sellers_bling.sql`
2. Fill credentials (see `docs/integrations/b2b-auth-bling.md`)
3. Connect Bling OAuth once via `/api/bling-oauth-start?secret=…`
4. Sync products: `pnpm catalog:sync` or `POST /api/bling-sync`

Public marketing search remains Nuvemshop-based (`pnpm search:sync`).
