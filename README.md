# ghenortrs

This site is the GHENO rotors marketing site and B2B site.

The stack is Remix (Vite), React, and TypeScript.

Style tokens are in `DESIGN.md` and `app/styles.css`.

Plan work in the Linear project `Gheno rotors`.

Write docs, code comments, commit messages, PR descriptions, reports, and technical replies in ASD-STE100 Simplified Technical English.

Keep `public/llms.txt` and on-site copy in Brazilian Portuguese.

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
pnpm search:sync  # update the Nuvemshop search index
pnpm catalog:sync # get the Bling catalog cache
```

## App layout

- `app/routes/*` — Remix file routes. These files are pages and `/api/*` resource routes.
- `app/components/*` — UI components. These components use the GHENO design system.
- `app/server/*` — Server handlers. These handlers serve B2B, Bling, Resend, and Supabase.
- `public/` — Static files. This folder also has `llms.txt`.

## Environment

Copy `.env.example` to `.env`.

Set the same keys in the Vercel project.

Public browser variables use the `VITE_*` prefix.

## B2B auth and Bling catalog

1. Apply `supabase/migrations/20260801000000_b2b_sellers_bling.sql`.
2. Set credentials. See `docs/integrations/b2b-auth-bling.md`.
3. Connect Bling OAuth one time. Send `POST /api/bling-oauth-start` with `X-Admin-Secret`. Then open the `authorizeUrl` from the response.
4. Sync products. Run `pnpm catalog:sync`. You can also send `POST /api/bling-sync` with `X-Admin-Secret`.

Public marketing search uses Nuvemshop. Run `pnpm search:sync` to update the index.

This site does not do checkout. Retail purchase goes to the Nuvemshop store.
