# Bling connect + sync — what you do now

## 0. Supabase Auth URLs (or magic links go to localhost)

Dashboard → Authentication → URL Configuration:

- **Site URL:** `https://www.ghenortrs.com.br`
- **Redirect URLs** (exact, or a `/**` wildcard for that origin):
  - `https://www.ghenortrs.com.br/b2b`
  - `https://www.ghenortrs.com.br/admin/login/callback`
  - `http://localhost:5173/b2b`
  - `http://localhost:5173/admin/login/callback`
  - `http://localhost:3000/b2b`
  - `http://localhost:3000/admin/login/callback`

If `emailRedirectTo` is not on that list, Supabase ignores it and uses Site URL (`/?code=`). The app then forwards that PKCE landing to `/b2b` and exchanges the code there. A leftover localhost Site URL still sends production emails to localhost — keep Site URL on the public origin.

Request the magic link on the same origin you will open it (PKCE). Do not request from `localhost` and open the mail on production, or the other way around.

---

## 1. Connect OAuth (once, in the browser)

**Preferred:** open (real secret from Vercel / `.env`):

```text
https://www.ghenortrs.com.br/api/bling-oauth-start?secret=YOUR_ADMIN_SECRET
```

Bling dashboard **link de convite** uses a static hex `state`. Our callback
rejects that unless production has `BLING_OAUTH_INVITE_STATE` set to that same
`state=` value. Copy it from the invite URL, redeploy, then use the invite link.

1. Log in to Bling if asked.
2. Authorize the app.
3. You should see JSON: `Bling conectado…`

| Error                   | Meaning                                                   |
| ----------------------- | --------------------------------------------------------- |
| `unauthorized`          | Wrong secret                                              |
| `invalid_state`         | Invite link without `BLING_OAUTH_INVITE_STATE`, or expired start-flow state |
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
- One-click approve from registration email: `/admin/approve?token=…` (HTML OK page; no admin login — the signed token is the credential). Old `/api/admin-approve-seller?token=…` links redirect there.
- Programmatic approve: `POST /api/admin-approve-seller` with `X-Admin-Secret` and `{"email":"…","status":"approved"}`.
- Full env names: `BLING_*`, `B2B_ADMIN_APPROVE_SECRET`, `ADMIN_EMAILS`, `DATABASE_URL` / `POSTGRES_*`, `SUPABASE_*`, `RESEND_*`.
