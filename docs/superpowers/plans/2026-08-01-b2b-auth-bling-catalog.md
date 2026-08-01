# B2B Auth + Bling Catalog Implementation Plan

> **For agentic workers:** Implement task-by-task. Steps use checkbox syntax.

**Goal:** Ship a seller-gated B2B catalog (no checkout) with Supabase email magic-link auth, one-time approval, Bling-sourced products/search, and Resend notifications — ready for credential plug-in.

**Architecture:** Public site stays Vite static. `/b2b` becomes an auth gate (login + registration). Approved sellers reach `/b2b/catalog` backed by Vercel Edge APIs. Supabase stores sellers + Bling OAuth tokens + product cache. Bling is the catalog SoT; public Nuvemshop search remains for the marketing site.

**Tech Stack:** Vite/React, Supabase Auth + Postgres, Vercel Edge Functions, Resend, Bling API v3 OAuth.

## Global Constraints

- No native checkout/cart — quote/contact only after selection.
- Checkout boundary for B2C stays Nuvemshop.
- Secrets never in `VITE_*`.
- Portuguese-first seller copy.
- Minimum order quantity enforced on quote requests.
- Local planning docs are not the SoT; Linear is.

## Files

| Path | Responsibility |
|---|---|
| `supabase/migrations/*` | sellers, bling tokens, product cache, RLS |
| `api/_shared/*` | env, http, supabase admin, bling, resend, sellers |
| `api/b2b-*.ts` / `api/bling-*.ts` / `api/admin-*.ts` | edge endpoints |
| `src/b2b/*` | client auth, types, config |
| `src/components/b2b/*` | login, pending, catalog, quote UI |
| `scripts/bling-catalog-sync.mjs` | offline/CI catalog sync |
| `docs/integrations/b2b-auth-bling.md` | plug-in runbook |

## Tasks

- [x] T1: DB migration + env contract + shared API libs
- [x] T2: Auth/seller/catalog/quote/Bling/admin edge routes
- [x] T3: Frontend gate + catalog + quote flow
- [x] T4: Bling sync script + search index bridge
- [x] T5: Tests, llms.txt, README, Linear M9 notes
