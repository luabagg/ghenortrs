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

| Error | Meaning |
| --- | --- |
| `unauthorized` | Wrong secret |
| `bling_not_configured` | Production missing `BLING_CLIENT_*` / redirect — redeploy |
| `server_not_configured` | Production missing Supabase / DB env — redeploy |

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

Optional: `--apply-name-hints` to hide `[INATIVO]` / `[INTERNO]` products.

---

## 4. Seller tier (so they see the right list)

```sql
update sellers set volume = 2500 where email = 'loja@example.com';
```

| Tier  | volume              |
| ----- | ------------------- |
| start | `<= 1000`           |
| pro   | `1001` … `< 5000`   |
| max   | `>= 5000`           |

Approve seller if needed, then login → `/b2b/catalogo`.

---

## Later / reference

- Re-run **2** when products/stock change; re-run **3** when Bling list prices change.
- Step 2 does not overwrite tier prices or `visible_b2b`.
- Approve seller: `POST /api/admin-approve-seller` with `X-Admin-Secret` and `{"email":"…","status":"approved"}`.
- Full env names: `BLING_*`, `B2B_ADMIN_APPROVE_SECRET`, `DATABASE_URL` / `POSTGRES_*`, `SUPABASE_*`, `VITE_SUPABASE_*`, `RESEND_*`.
