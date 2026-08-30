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
```

## App layout

- `app/routes/*` — Remix file routes (pages + `/api/*` resource routes)
- `app/components/*` — UI (GHENO design system)
- `app/server/*` — server handlers (B2B, Bling, Resend, Supabase Auth)
- `app/server/db/*` — Drizzle schema and Postgres queries
- `public/` — static assets + `llms.txt`

## Environment

Copy `.env.example` → `.env` / Vercel project env. Public browser vars still use the `VITE_*` prefix. Server queries also need `DATABASE_URL` (Supabase transaction pooler, port 6543).

## B2B operations

Everything runs in `/admin`. There are no operational scripts or secret URLs.

Setup, once:

1. Apply migrations: `pnpm db:migrate`.
2. Supabase → Authentication → URL Configuration. Set **Site URL** to the
   public origin, and add a `/**` redirect wildcard per origin you use
   (production plus `localhost:5173` / `localhost:3000`). Magic links need
   `/b2b`, `/b2b/catalogo`, and `/admin/login/callback`.
3. Set `ADMIN_BOOTSTRAP_EMAILS` and log in once at `/admin/login`. That
   first login writes the `admin_users` row; the variable is ignored
   afterwards.

Day to day:

| Screen                | What you do there                                             |
| --------------------- | ------------------------------------------------------------- |
| `/admin`              | Approve, suspend, or reject sellers; e-mail catalog access    |
| `/admin/produtos`     | Connect Bling, sync the catalog, paste price lists, show/hide |
| `/admin/atividade`    | Read the audit trail, newest first                            |
| `/admin/configuracao` | Grant or revoke the admin role                                |

Price lists are pasted as tab-separated text with `Sku` and
`R$ Preço da lista` columns. The preview must be confirmed before any
write, and the write touches one tier price column only.
