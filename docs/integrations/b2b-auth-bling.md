# B2B Auth + Bling Catalog — plug-in runbook

Goal: you only plug credentials. Code paths are already wired.

## What you get

| Surface            | Behavior                                                       |
| ------------------ | -------------------------------------------------------------- |
| `/b2b`             | Register (pending seller) **or** magic-link login              |
| Unapproved login   | Session ok, catalog blocked (`pending` / `rejected`)           |
| Approved login     | `/b2b/catalogo` — Bling-cached catalog, min qty, quote request |
| Public site search | Still Nuvemshop sitemap index (B2C)                            |
| Checkout           | None in B2B. Quote → human follow-up via Resend                |

## 1. Supabase

1. Create a project.
2. Run SQL in `supabase/migrations/20260801000000_b2b_sellers_bling.sql`.
3. Auth → Providers → Email enabled.
4. Auth → URL config:
   - Site URL: `https://www.ghenortrs.com.br`
   - Redirect URLs: `https://www.ghenortrs.com.br/b2b`, `http://localhost:5173/b2b`
5. Copy:
   - Project URL → `VITE_SUPABASE_URL` + `SUPABASE_URL`
   - `anon` key → `VITE_SUPABASE_ANON_KEY` + `SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (**server only**, Auth admin only)
   - Database → Connection string → Transaction pooler → `DATABASE_URL` (**server only**, Drizzle)

Optional: Auth Hook / SMTP via Resend for branded magic links.

## 2. Resend

1. Verify sending domain (e.g. `ghenortrs.com.br`).
2. Create API key → `RESEND_API_KEY`.
3. Set `RESEND_TO_EMAIL` (GHENO inbox).
4. Optional `RESEND_FROM=GHENO B2B <noreply@…>`.

Used for:

- New seller registration alert (+ approve link when admin secret set)
- Seller approval email
- B2B quote requests

## 3. Bling OAuth app

1. Create app at [Bling Developers](https://developer.bling.com.br).
2. Redirect URI: `https://www.ghenortrs.com.br/api/bling-oauth-callback`
3. Set `BLING_CLIENT_ID`, `BLING_CLIENT_SECRET`, `BLING_REDIRECT_URI`.
4. Set a strong `B2B_ADMIN_APPROVE_SECRET`.
5. Connect once in the browser (one-time admin step):

```text
https://www.ghenortrs.com.br/api/bling-oauth-start?secret=YOUR_ADMIN_SECRET
```

6. Sync catalog:

```bash
curl -X POST "https://www.ghenortrs.com.br/api/bling-sync" \
  -H "X-Admin-Secret: YOUR_ADMIN_SECRET"
```

Or locally (after tokens exist in Supabase):

```bash
pnpm catalog:sync
```

Schedule `bling-sync` (cron / GitHub Action) every hour if stock/price matter.

### Tier prices (Start / Pro / Max)

Wholesale prices in `/b2b/catalogo` come from three Bling price lists, **not** the Nuvemshop store or Bling base `preco`. Each approved seller sees one tier based on `sellers.volume`.

**Schema** — run `supabase/migrations/20260829200000_b2b_tier_prices.sql` in the Supabase SQL editor, or locally:

```bash
pnpm db:push
```

Adds `sellers.volume` and on `bling_products`: `visible_b2b`, `price_start_cents`, `price_pro_cents`, `price_max_cents`.

**Seller volume → tier**

| Tier  | Rule                          |
| ----- | ----------------------------- |
| start | `volume <= 1000`              |
| pro   | `1001 <= volume < 5000`       |
| max   | `volume >= 5000`              |

Set volume via SQL / Drizzle Studio, e.g. `update sellers set volume = 2500 where email = 'loja@example.com';`.

**Import list prices**

1. Maintain Start / Pro / Max lists in Bling (same lists used for NFE).
2. Export each list to CSV (`Sku` + list-price column from Bling export).
3. Run product sync first so SKUs exist (`pnpm catalog:sync` or `POST /api/bling-sync`).
4. Import each tier (requires `DATABASE_URL`):

```bash
pnpm prices:import --tier=start --file=./exports/start.csv
pnpm prices:import --tier=pro --file=./exports/pro.csv
pnpm prices:import --tier=max --file=./exports/max.csv
```

Optional `--apply-name-hints`: if the Bling product name starts with `[INATIVO]` or `[INTERNO]`, set `visible_b2b = false`. Hints never set `visible_b2b` back to `true`. Manual hide: `update bling_products set visible_b2b = false where sku = '…';`.

**Sync-safe:** `bling-sync` updates name, stock, image, base `price_cents`, and `active` from Bling. It **does not** overwrite `visible_b2b` or `price_start/pro/max_cents`. Re-run the three imports when list prices change in Bling.

Catalog shows a product only when `active`, `visible_b2b`, and the seller’s tier price column is not null.

## 4. Approve a seller

Email link (signed token, no raw secret in the URL):

```text
/api/admin-approve-seller?token=SIGNED_TOKEN
```

Or:

```bash
curl -X POST "https://www.ghenortrs.com.br/api/admin-approve-seller" \
  -H "Content-Type: application/json" \
  -H "X-Admin-Secret: YOUR_ADMIN_SECRET" \
  -d '{"email":"loja@example.com","status":"approved"}'
```

Statuses: `approved` | `rejected` | `suspended` | `pending`.

## 5. Analytics (GTM)

When `VITE_GTM_ID` is set, `app/root.tsx` loads the GTM bootstrap script. B2B and commerce events are emitted client-side via `app/lib/tracking.ts` into `dataLayer` (and `gtag` when present):

| Event                       | When                                      | Payload                                                    |
| --------------------------- | ----------------------------------------- | ---------------------------------------------------------- |
| `b2b_form_submit_attempt`   | User submits B2B registration             | `form`: `b2b_lead`                                         |
| `b2b_form_validation_error` | Client or server validation fails         | `form`: `b2b_lead` or `b2b_seller_register`, `error_count` |
| `b2b_form_submit_success`   | Registration succeeds                     | `form`: `b2b_seller_register`                              |
| `b2b_form_submit_error`     | Registration server error                 | `form`: `b2b_seller_register`                              |
| `outbound_commerce_click`   | Click on link to `store.ghenortrs.com.br` | `section`, `destination`                                   |

Leave `VITE_GTM_ID` empty locally to skip the script.

## 6. Vercel env checklist

Public:

- `VITE_SITE_URL`
- `VITE_GTM_ID` (optional; production container ID)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_B2B_DEFAULT_MIN_QUANTITY` (optional)

Server:

- `SITE_URL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL` (transaction pooler; `prepare: false`)
- `RESEND_API_KEY`
- `RESEND_TO_EMAIL`
- `RESEND_FROM` (optional)
- `B2B_ADMIN_APPROVE_SECRET`
- `B2B_DEFAULT_MIN_QUANTITY`
- `BLING_CLIENT_ID`
- `BLING_CLIENT_SECRET`
- `BLING_REDIRECT_URI`

## 7. Local dev notes

- Remix `pnpm dev` serves `/api/*`. Magic link must redirect back to `/b2b` on the same origin you opened.
- Without public Supabase env, `/b2b` stays registration-only. Without `DATABASE_URL` / server Supabase keys, registration returns `no-config`.
- Magic-link login does not create Auth users. Registration does.

## 8. API map

| Method | Path                        | Auth               |
| ------ | --------------------------- | ------------------ |
| POST   | `/api/b2b-register`         | optional Bearer    |
| GET    | `/api/b2b-session`          | Bearer optional    |
| GET    | `/api/b2b-catalog`          | approved seller    |
| POST   | `/api/b2b-quote`            | approved seller    |
| GET    | `/api/admin-approve-seller` | signed token       |
| POST   | `/api/admin-approve-seller` | `X-Admin-Secret`   |
| GET    | `/api/bling-oauth-start`    | admin secret       |
| GET    | `/api/bling-oauth-callback` | signed OAuth state |
| POST   | `/api/bling-sync`           | `X-Admin-Secret`   |

## 9. Security notes

- Never put `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, or Bling secrets in `VITE_*`.
- One-click approve links carry a signed token, not `B2B_ADMIN_APPROVE_SECRET`.
- Bling OAuth `state` is HMAC-signed and checked on callback.
- Seller rows: users can **select own** only; writes go through Drizzle with the database URL.
- Catalog reads are approved-seller only; the API double-checks status.
