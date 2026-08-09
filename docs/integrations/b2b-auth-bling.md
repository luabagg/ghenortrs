# B2B auth and Bling catalog

Goal: add credentials only. The code paths are already wired.

## What you get

| Surface | Behavior |
|---|---|
| `/b2b` | Register (pending seller) or magic-link login |
| Unapproved login | Session ok; catalog blocked (`pending` / `rejected`) |
| Approved login | `/b2b/catalogo` — Bling cache, min qty, quote request |
| Public site search | Nuvemshop sitemap index (B2C) |
| Checkout | None in B2B. Quote goes to human follow-up via Resend |

## 1. Supabase

1. Create a project.
2. Run SQL in `supabase/migrations/20260801000000_b2b_sellers_bling.sql`.
3. Enable Auth → Providers → Email.
4. Set Auth → URL config:
   - Site URL: `https://ghenortrs.vercel.app`
   - Redirect URLs: `https://ghenortrs.vercel.app/b2b`, `http://localhost:5173/b2b`
5. Copy these values:
   - Project URL → `VITE_SUPABASE_URL` and `SUPABASE_URL`
   - `anon` key → `VITE_SUPABASE_ANON_KEY` and `SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server only)

Optional: Auth Hook or SMTP via Resend for branded magic links.

## 2. Resend

1. Verify the sending domain (for example `ghenortrs.com.br`).
2. Create an API key. Set `RESEND_API_KEY`.
3. Set `RESEND_TO_EMAIL` to the GHENO inbox.
4. Optional: `RESEND_FROM=GHENO B2B <noreply@…>`.

Resend sends:

- New seller registration alert (plus short-lived signed approve link when admin secret is set)
- Seller approval email
- B2B quote requests
- Legacy `api/b2b-submit.ts` fallback

## 3. Bling OAuth app

1. Create an app at [Bling Developers](https://developer.bling.com.br).
2. Set redirect URI: `https://ghenortrs.vercel.app/api/bling-oauth-callback`
3. Set `BLING_CLIENT_ID`, `BLING_CLIENT_SECRET`, `BLING_REDIRECT_URI`.
4. Set a strong `B2B_ADMIN_APPROVE_SECRET`.
5. Start OAuth with an admin POST (header secret only; no query secret):

```bash
curl -X POST "https://ghenortrs.vercel.app/api/bling-oauth-start" \
  -H "X-Admin-Secret: YOUR_ADMIN_SECRET"
```

Open the JSON field `authorizeUrl` in a browser. The `state` value is a short-lived signed token.

6. Sync the catalog:

```bash
curl -X POST "https://ghenortrs.vercel.app/api/bling-sync" \
  -H "X-Admin-Secret: YOUR_ADMIN_SECRET"
```

Or run locally after tokens exist in Supabase:

```bash
pnpm catalog:sync
```

Schedule `bling-sync` each hour if stock or price must stay current.

## 4. Approve a seller

Registration emails include a short-lived signed link when `B2B_ADMIN_APPROVE_SECRET` is set:

```text
/api/admin-approve-seller?token=SIGNED_TOKEN
```

- `GET` shows a confirmation page only. It never changes seller status.
- Confirm with the HTML form `POST`. The token is bound to the seller email and the current `sellers.updated_at` value. Replay after approval fails.

Or call the admin JSON API (header secret only):

```bash
curl -X POST "https://ghenortrs.vercel.app/api/admin-approve-seller" \
  -H "Content-Type: application/json" \
  -H "X-Admin-Secret: YOUR_ADMIN_SECRET" \
  -d '{"email":"loja@example.com","status":"approved"}'
```

Statuses for the JSON API: `approved` | `rejected` | `suspended` | `pending`.

## 5. Analytics (GTM)

When `VITE_GTM_ID` is set, `app/root.tsx` loads the GTM script.

B2B and commerce events go through `app/lib/tracking.ts` into `dataLayer` (and `gtag` when present):

| Event | When | Payload |
|---|---|---|
| `b2b_form_submit_attempt` | User submits B2B registration | `form`: `b2b_lead` |
| `b2b_form_validation_error` | Client or server validation fails | `form`: `b2b_lead` or `b2b_seller_register`, `error_count` |
| `b2b_form_submit_success` | Registration succeeds and alert is sent | `form`: `b2b_seller_register` |
| `b2b_form_submit_partial_success` | Registration persists, alert failed or not configured | `form`: `b2b_seller_register` |
| `b2b_form_submit_error` | Registration server error | `form`: `b2b_seller_register` |
| `outbound_commerce_click` | Click to `store.ghenortrs.com.br` | `section`, `destination` |

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
- `RESEND_API_KEY`
- `RESEND_TO_EMAIL`
- `RESEND_FROM` (optional)
- `B2B_ADMIN_APPROVE_SECRET`
- `B2B_DEFAULT_MIN_QUANTITY`
- `BLING_CLIENT_ID`
- `BLING_CLIENT_SECRET`
- `BLING_REDIRECT_URI`

## 7. Local dev notes

- Vite does not run `/api/*`. Point `VITE_SITE_URL` at a deployed preview, or use `vercel dev`.
- Without Supabase public env, `/b2b` stays registration-only (legacy Resend path).
- The magic link must redirect to `/b2b` on the same origin you opened.

## 8. API map

| Method | Path | Auth |
|---|---|---|
| POST | `/api/b2b-register` | optional Bearer |
| GET | `/api/b2b-session` | Bearer optional |
| GET | `/api/b2b-catalog` | approved seller |
| POST | `/api/b2b-quote` | approved seller; body includes `requestKey` UUID; idempotent per seller+key; `complete:false` keeps selection for retry |
| GET | `/api/admin-approve-seller?token=` | signed short-lived token (HTML confirm only) |
| POST | `/api/admin-approve-seller` (form `token`) | signed short-lived token (approve) |
| POST | `/api/admin-approve-seller` (JSON) | `X-Admin-Secret` |
| POST | `/api/bling-oauth-start` | `X-Admin-Secret` → JSON `{ authorizeUrl }` |
| GET | `/api/bling-oauth-callback` | Bling redirect + signed `state` |
| POST | `/api/bling-sync` | `X-Admin-Secret` |
| POST | `/api/b2b-submit` | legacy lead email |

## 9. Security notes

- Never put `SUPABASE_SERVICE_ROLE_KEY` or Bling secrets in `VITE_*`.
- Never put `B2B_ADMIN_APPROVE_SECRET` in generated URLs, HTML, JSON bodies, or logs.
- Admin routes accept the long-lived secret only via the `X-Admin-Secret` header.
- Seller approval email links use a short-lived HMAC token scoped to email + `sellers.updated_at`.
- OAuth `state` is a short-lived HMAC token with purpose `bling_oauth_state`.
- Seller rows: users can select their own row only. Writes use the service role.
- `bling_oauth_tokens`: service role only.
- Catalog RLS: approved sellers read active products. The API also checks status.
