# ghenortrs

GHENO rotors marketing + B2B site on **Remix (Vite)** + React + TypeScript.

Styling tokens live in `DESIGN.md` / `app/styles.css`. Planning lives in Linear project `Gheno rotors`.

## Commands

```bash
npm install --legacy-peer-deps
npm run dev          # remix vite:dev
npm test             # vitest
npm run typecheck    # tsc
npm run lint         # eslint
npm run build        # search:sync + remix vite:build
npm start            # remix-serve production server
npm run search:sync  # refresh Nuvemshop search index
npm run catalog:sync # pull Bling catalog cache
```

> `pnpm install` currently fails on a registry metadata bug for `@remix-run/dev` transitive `execa`. Use npm with `--legacy-peer-deps` until that clears. `@vercel/remix@2.16.7` peers `@remix-run/dev@2.16.7` while the app pins Remix `2.17.2` (same as thermalaquec).

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
4. Sync products: `npm run catalog:sync` or `POST /api/bling-sync`

Public marketing search remains Nuvemshop-based (`npm run search:sync`).
