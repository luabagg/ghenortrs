# Bling connect + sync — what you do now

Everything below happens in `/admin` after you log in. There are no
secret URLs, no `curl` calls, and no import scripts.

## 0. Supabase Auth URLs (or magic links go to localhost)

Dashboard → Authentication → URL Configuration:

- **Site URL:** `https://www.ghenortrs.com.br`
- **Redirect URLs** (exact, or a `/**` wildcard for that origin):
  - `https://www.ghenortrs.com.br/b2b`
  - `https://www.ghenortrs.com.br/b2b/catalogo`
  - `https://www.ghenortrs.com.br/admin/login/callback`
  - `http://localhost:5173/b2b`
  - `http://localhost:5173/b2b/catalogo`
  - `http://localhost:5173/admin/login/callback`
  - `http://localhost:3000/b2b`
  - `http://localhost:3000/b2b/catalogo`
  - `http://localhost:3000/admin/login/callback`

`/b2b/catalogo` is required by the **Enviar acesso** button on `/admin`.
Without it, seller access links land on the Site URL instead.

If `emailRedirectTo` is not on that list, Supabase ignores it and uses Site URL (`/?code=`). The app then forwards that PKCE landing to `/b2b` and exchanges the code there. A leftover localhost Site URL still sends production emails to localhost — keep Site URL on the public origin.

Request the magic link on the same origin you will open it (PKCE). Do not request from `localhost` and open the mail on production, or the other way around.

Bling redirects back to `BLING_REDIRECT_URI`, which must be
`https://www.ghenortrs.com.br/api/bling-oauth-callback` and must match the
value registered in the Bling application.

---

## 1. First admin login

Set the bootstrap variable, then log in once at `/admin/login`:

```bash
ADMIN_BOOTSTRAP_EMAILS=voce@ghenortrs.com.br
```

The first listed e-mail that logs in becomes an administrator and is
written to `admin_users`. After that row exists, the variable is ignored.

Add or remove other administrators on `/admin/configuracao`. A person
must log in at `/admin/login` once before you can grant the role, because
the grant resolves an existing Supabase user. The last administrator
cannot be removed.

---

## 2. Connect Bling (once, in the browser)

`/admin/produtos` → **Conectar Bling**.

The button starts the OAuth flow and stores a one-time state in an
HttpOnly cookie. Bling returns to `/api/bling-oauth-callback`, which
requires the same admin session and the same cookie, then returns you to
`/admin/produtos` with the result.

| Message on `/admin/produtos` | Meaning                                                   |
| ---------------------------- | --------------------------------------------------------- |
| `Bling conectado.`           | Tokens stored; the panel shows the expiry                 |
| `Autorização cancelada`      | You declined on the Bling screen                          |
| `A conexão expirou`          | The state cookie expired (15 min) — click Conectar again  |
| `Bling não configurado`      | Production missing `BLING_CLIENT_*` / redirect — redeploy |

---

## 3. Sync products

`/admin/produtos` → **Sincronizar catálogo**.

The panel reports how many products were written and when. The sync never
overwrites tier prices or `visible_b2b`.

---

## 4. Import tier prices

`/admin/produtos` → **Tabela de preços**.

1. Pick Start, Pro, or Max.
2. Copy the price table from Bling or the spreadsheet and paste it.
   Columns must stay tab-separated, with `Sku` and `R$ Preço da lista`.
3. Click **Pré-visualizar** and read the summary: rows to change, rows
   already correct, SKUs outside the catalog, and ignored rows.
4. Click **Confirmar importação**.

The import writes one tier price column. It never changes `visible_b2b`,
Bling fields, or the seller's tier choice. It can update a SKU that is
inactive in Bling, and the preview marks those.

If the catalog changed between the preview and the confirmation, the
import is refused. Preview again.

---

## 5. Catalog visibility

`/admin/produtos` lists the cached products. Use the row buttons for one
SKU, or the checkboxes plus **Mostrar marcados** / **Ocultar marcados**
for several. Every change is recorded in `/admin/atividade`.

---

## 6. Sellers

Registration e-mails `RESEND_TO_EMAIL` with a 7-day approval link, or use
`/admin`.

- Approve, suspend, or reject on `/admin`.
- The approval e-mail link opens a confirmation page. Opening it changes
  nothing; the seller is approved only after you confirm, and the link
  works once.
- **Enviar acesso** e-mails an approved seller a magic link to
  `/b2b/catalogo`. The link is never shown on screen or written to logs.
- Sellers pick Start / Pro / Max on `/b2b/catalogo` — there is no
  assigned volume.

---

## Later / reference

- Re-run **3** when products or stock change; re-run **4** when Bling list
  prices change.
- `/admin/atividade` lists the newest admin actions: role changes, seller
  status changes, access links, Bling connect and sync, price imports,
  and visibility changes. It shows no tokens, links, or pasted content.
- Old `/api/admin-approve-seller?token=…` links redirect to
  `/admin/approve?token=…`. Any other method on that route returns 410.
- Full env names: `BLING_CLIENT_ID`, `BLING_CLIENT_SECRET`,
  `BLING_REDIRECT_URI`, `BLING_API_BASE`, `BLING_AUTH_BASE`,
  `B2B_APPROVAL_LINK_SECRET`, `ADMIN_BOOTSTRAP_EMAILS`,
  `B2B_DEFAULT_MIN_QUANTITY`, `DATABASE_URL` / `POSTGRES_*`, `SUPABASE_*`,
  `RESEND_*`.
