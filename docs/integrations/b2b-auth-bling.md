# Bling connect + sync — what you do now

---

## 1. Connect OAuth (once, in the browser)

Open (real secret from Vercel / `.env`):

```text
https://www.ghenortrs.com.br/api/bling-oauth-start?secret=YOUR_ADMIN_SECRET
```

1. Log in to Bling if asked.
2. Authorize the app.
3. You should see JSON: `Bling conectado…`

| Error                   | Meaning                                                   |
| ----------------------- | --------------------------------------------------------- |
| `unauthorized`          | Wrong secret                                              |
| `bling_not_configured`  | Production missing `BLING_CLIENT_*` / redirect — redeploy |
| `server_not_configured` | Production missing Supabase / DB env — redeploy           |

---

## 2. Sync products

**Either:**

```bash
curl -X POST "https://www.ghenortrs.com.br/api/bling-sync" \
  -H "X-Admin-Secret: YOUR_ADMIN_SECRET"
```

**Or** (same thing — local script only POSTs that URL):

```bash
export B2B_SYNC_URL=https://www.ghenortrs.com.br/api/bling-sync
pnpm catalog:sync
```

Need `"success": true` and `"upserted"` > 0.

---

## 3. Import tier price CSVs (after step 2)

```bash
pnpm prices:import --tier=start --file=./exports/start.csv
pnpm prices:import --tier=pro --file=./exports/pro.csv
pnpm prices:import --tier=max --file=./exports/max.csv
```

Hide or show SKUs in `/admin/produtos`. Import never writes `visible_b2b`.

---

## 4. Approve sellers

Registration emails `RESEND_TO_EMAIL` with a 7-day approve link, or use `/admin`.

`/admin` is the same magic-link + cookie session pattern as thermalaquec. Create the admin user in Supabase Auth (email confirmed), then set:

```bash
ADMIN_EMAILS=voce@ghenortrs.com.br
```

Login: `/admin/login`. Approve / suspend / reject sellers on `/admin`. Hide / show catalog SKUs on `/admin/produtos`. Sellers pick Start / Pro / Max on `/b2b/catalogo` — there is no assigned volume.

---

## Later / reference

- Re-run **2** when products/stock change; re-run **3** when Bling list prices change.
- Step 2 does not overwrite tier prices or `visible_b2b`. Toggle catalog visibility in `/admin/produtos`.
- Approve seller: `POST /api/admin-approve-seller` with `X-Admin-Secret` and `{"email":"…","status":"approved"}`.
- Full env names: `BLING_*`, `B2B_ADMIN_APPROVE_SECRET`, `ADMIN_EMAILS`, `DATABASE_URL` / `POSTGRES_*`, `SUPABASE_*`, `RESEND_*`.
