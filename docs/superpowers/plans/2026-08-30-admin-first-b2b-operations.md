# Admin-first B2B Operations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move B2B management into authenticated admin workflows while retaining safe email approval and providing one-time seller catalog-access links and pasted price-list imports.

**Architecture:** Private Remix route actions call focused server services after `requireAdmin`; public routes are retained only for approval confirmation and the Bling OAuth callback. New database tables store durable admin roles, consumed approval capabilities, and redacted audit events. Supabase Auth generates seller magic links; the application sends them through Resend without disclosing the link to the browser.

**Tech Stack:** Remix, React, TypeScript, Drizzle ORM/PostgreSQL, Supabase Auth SSR/admin API, Resend, Vitest, Tailwind.

**Spec:** `docs/superpowers/specs/2026-08-30-admin-first-b2b-operations-design.md`

## Global Constraints

- `/admin` is internal; do not add it to `public/llms.txt`.
- All daily operational actions require `requireAdmin`; no browser-supplied shared secret.
- Keep only `/admin/approve?token=…` and `/api/bling-oauth-callback` public.
- Approval GETs are read-only; POST atomically consumes a one-time token and applies the state change.
- Seller catalog access is an existing-user Supabase `magiclink`, sent only by server-side Resend.
- Product sync and price imports must not alter `visible_b2b`; price imports update only the selected tier.
- Use existing `AdminChrome`, Button/Input/Label/Table primitives and `DESIGN.md` dark technical tokens.
- Audit metadata never contains bearer links/tokens, OAuth codes, headers, or raw pasted price data.

---

### Task 1: Establish durable operations schema and query boundaries

**Files:**

- Modify: `app/server/db/schema.ts`
- Modify: `app/server/db/queries.ts`
- Create: `drizzle/0002_admin_first_operations.sql`
- Modify: `app/server/db/queries.test.ts`

**Interfaces:**

- Produces `adminUsers`, `emailActionTokens`, `adminAuditEvents` schema exports.
- Produces `isAdminUser`, `countAdminUsers`, `createAdminUser`, `listAdminUsers`, `deleteAdminUser`, `createEmailActionToken`, `consumeEmailActionToken`, `insertAdminAuditEvent`, and `listAdminAuditEvents` query functions.

- [ ] **Step 1: Write failing query tests for audit redaction and one-time token consumption**

```ts
it('consumes an approval token once', async () => {
  await createEmailActionToken({
    jtiHash: 'hash',
    purpose: 'approve-seller',
    sellerId: 'seller',
    expiresAt: future,
  });
  expect(await consumeEmailActionToken('hash', now)).toMatchObject({
    sellerId: 'seller',
  });
  expect(await consumeEmailActionToken('hash', now)).toBeNull();
});

it('stores audit metadata without sensitive keys', async () => {
  await expect(
    insertAdminAuditEvent({
      action: 'seller.access_link.sent',
      metadata: { actionLink: 'secret' },
    }),
  ).rejects.toThrow('sensitive audit metadata');
});
```

- [ ] **Step 2: Run the focused test and verify it fails because the functions are absent**

Run: `pnpm vitest run app/server/db/queries.test.ts`

Expected: FAIL with missing exports/functions.

- [ ] **Step 3: Add the schema and migration**

```ts
export const adminUsers = pgTable('admin_users', {
  userId: uuid('user_id').primaryKey(),
  email: text('email').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .notNull()
    .defaultNow(),
  createdBy: uuid('created_by'),
});

export const emailActionTokens = pgTable('email_action_tokens', {
  jtiHash: text('jti_hash').primaryKey(),
  purpose: text('purpose').notNull(),
  sellerId: uuid('seller_id')
    .notNull()
    .references(() => sellers.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
  consumedAt: timestamp('consumed_at', { withTimezone: true, mode: 'string' }),
});
```

Create SQL matching the Drizzle schema, including `admin_audit_events` with nullable target IDs, JSON metadata, outcome, and timestamps. Implement `consumeEmailActionToken` as one `UPDATE … WHERE consumed_at IS NULL AND expires_at >= now RETURNING` query. Reject metadata keys matching `token|secret|code|link|authorization` before insertion.

- [ ] **Step 4: Re-run focused tests**

Run: `pnpm vitest run app/server/db/queries.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/server/db/schema.ts app/server/db/queries.ts app/server/db/queries.test.ts drizzle/0002_admin_first_operations.sql
git commit -m "feat: add admin operations persistence"
```

### Task 2: Move admin authorization from runtime allowlist to bootstrap-backed roles

**Files:**

- Modify: `app/server/env.ts`
- Modify: `.env.example`
- Modify: `app/server/require-admin.server.ts`
- Create: `app/server/admin-users.ts`
- Create: `app/server/admin-users.test.ts`
- Modify: `app/server/admin-emails.test.ts`

**Interfaces:**

- Consumes Task 1 `countAdminUsers`, `isAdminUser`, `createAdminUser`, and audit insertion.
- Produces `ensureAdminUser(user): Promise<boolean>` called by `requireAdmin`.

- [ ] **Step 1: Write failing bootstrap and role tests**

```ts
it('bootstraps only the configured first admin while no role exists', async () => {
  expect(await ensureAdminUser(bootstrapUser)).toBe(true);
  expect(await ensureAdminUser(otherUser)).toBe(false);
});

it('does not consult bootstrap emails after an admin exists', async () => {
  await createAdminUser(existing);
  expect(await ensureAdminUser(bootstrapUser)).toBe(false);
});
```

- [ ] **Step 2: Run the test and verify failure**

Run: `pnpm vitest run app/server/admin-users.test.ts`

Expected: FAIL because `ensureAdminUser` is missing.

- [ ] **Step 3: Implement bootstrap-only role resolution**

Replace `ADMIN_EMAILS` with optional `ADMIN_BOOTSTRAP_EMAILS` in `ServerEnv`. `ensureAdminUser` returns true for an existing DB role; when role count is zero, it permits only a matching bootstrap email, inserts the role, and audits `admin.bootstrap`. Update `requireAdmin` to call it after Supabase `getUser`; sign out and redirect forbidden users as today.

- [ ] **Step 4: Re-run focused tests and existing email parsing tests**

Run: `pnpm vitest run app/server/admin-users.test.ts app/server/admin-emails.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/server/env.ts .env.example app/server/require-admin.server.ts app/server/admin-users.ts app/server/admin-users.test.ts app/server/admin-emails.test.ts
git commit -m "feat: use database-backed admin roles"
```

### Task 3: Make approval email links one-time, POST-confirmed capabilities

**Files:**

- Modify: `app/server/signed-token.ts`
- Modify: `app/server/signed-token.test.ts`
- Modify: `app/server/b2b-register.ts`
- Modify: `app/server/admin-approve-seller.ts`
- Modify: `app/routes/admin.approve.tsx`
- Modify: `app/routes/api.admin-approve-seller.ts`
- Modify: `app/server/resend.ts`
- Modify: `app/server/env.ts`

**Interfaces:**

- Produces `buildApproveSellerToken(input, approvalLinkSecret)` with `{ purpose, email, status: 'approved', jti, exp }`.
- Produces `confirmEmailSellerApproval(token): Promise<ApplySellerStatusResult>`.

- [ ] **Step 1: Add failing token tests**

```ts
it('includes a unique jti in each approval token', () => {
  expect(buildApproveSellerToken({ email: 'a@b.com' }, secret)).not.toEqual(
    buildApproveSellerToken({ email: 'a@b.com' }, secret),
  );
});

it('rejects a token used for a different purpose', () => {
  expect(verifyToken(token, secret, 'bling-oauth')).toBeNull();
});
```

- [ ] **Step 2: Add failing confirmation service tests**

```ts
it('does not mutate seller status while rendering the approval page', async () => {
  await loader({ request: approvalGet });
  expect(updateSellerStatus).not.toHaveBeenCalled();
});

it('consumes a valid approval token before approving exactly once', async () => {
  await expect(confirmEmailSellerApproval(token)).resolves.toMatchObject({
    ok: true,
    status: 'approved',
  });
  await expect(confirmEmailSellerApproval(token)).resolves.toMatchObject({
    ok: false,
    error: 'token_used',
  });
});
```

- [ ] **Step 3: Run tests to confirm failure**

Run: `pnpm vitest run app/server/signed-token.test.ts app/routes/admin.approve.test.tsx`

Expected: FAIL with missing `jti` and/or route test fixture.

- [ ] **Step 4: Implement the capability flow**

Rename the environment field to `approvalLinkSecret`. On registration, sign only `status: 'approved'`, hash the `jti` with SHA-256, and persist it with seven-day expiry. The GET loader verifies signature/expiry and reads seller details only. Add an `action` that accepts `intent=confirm-approval` and token, atomically consumes `jtiHash`, then calls `applySellerStatus`. Render a normal existing Button/Form confirmation. Retain legacy GET `/api/admin-approve-seller?token=` as a redirect, remove its POST secret authorization entirely, and return 410 for other methods.

- [ ] **Step 5: Run focused tests**

Run: `pnpm vitest run app/server/signed-token.test.ts app/routes/admin.approve.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add app/server/signed-token.ts app/server/signed-token.test.ts app/server/b2b-register.ts app/server/admin-approve-seller.ts app/routes/admin.approve.tsx app/routes/api.admin-approve-seller.ts app/server/resend.ts app/server/env.ts
git commit -m "feat: confirm seller email approvals safely"
```

### Task 4: Generate and send seller catalog access links from Admin

**Files:**

- Modify: `app/server/supabase.ts`
- Create: `app/server/seller-access-link.ts`
- Create: `app/server/seller-access-link.test.ts`
- Modify: `app/server/resend.ts`
- Modify: `app/routes/admin._index.tsx`
- Modify: `app/components/admin/admin-chrome.tsx`

**Interfaces:**

- Produces `sendSellerCatalogAccessLink({ sellerId, actor }): Promise<{ ok: true } | { ok: false; error: string }>`.
- Uses `createAuthAdminClient().auth.admin.generateLink({ type: 'magiclink', email, options: { redirectTo } })` and `buildSellerCatalogAccessHtml`.

- [ ] **Step 1: Write service tests**

```ts
it('sends a Supabase magic link only for an approved seller', async () => {
  await expect(
    sendSellerCatalogAccessLink({ sellerId: approved.id, actor }),
  ).resolves.toEqual({ ok: true });
  expect(generateLink).toHaveBeenCalledWith(
    expect.objectContaining({ type: 'magiclink', email: approved.email }),
  );
});

it.each(['pending', 'rejected', 'suspended'])(
  'refuses %s sellers',
  async (status) => {
    await expect(
      sendSellerCatalogAccessLink({ sellerId: seller(status).id, actor }),
    ).resolves.toEqual({ ok: false, error: 'seller_not_approved' });
  },
);
```

- [ ] **Step 2: Run the service tests to verify failure**

Run: `pnpm vitest run app/server/seller-access-link.test.ts`

Expected: FAIL because the service does not exist.

- [ ] **Step 3: Implement safe generation and delivery**

Read the seller by ID and require status `approved`. Generate the link only in the server service, send `data.properties.action_link` with a new Resend template, and never return it. Set redirect destination to the approved `/b2b/catalogo` path on `siteUrl`; verify that route is listed in Supabase redirect URLs. Audit only `sellerId`, destination path, and delivery outcome.

- [ ] **Step 4: Add admin action and UI**

Add `intent=send-catalog-access` to the existing protected Sellers route action. Render a `Enviar acesso` Button only on approved rows. Show an existing token-compliant success/error message after redirect; do not use a query string for email or link data.

- [ ] **Step 5: Run focused tests**

Run: `pnpm vitest run app/server/seller-access-link.test.ts app/components/admin/admin-chrome.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add app/server/supabase.ts app/server/seller-access-link.ts app/server/seller-access-link.test.ts app/server/resend.ts app/routes/admin._index.tsx app/components/admin/admin-chrome.tsx
git commit -m "feat: send seller catalog access links"
```

### Task 5: Bind Bling OAuth to the admin browser and eliminate secret endpoints

**Files:**

- Create: `app/server/bling-oauth-state.ts`
- Create: `app/server/bling-oauth-state.test.ts`
- Modify: `app/server/bling-oauth-start.ts`
- Modify: `app/server/bling-oauth-callback.ts`
- Modify: `app/routes/api.bling-oauth-start.ts`
- Modify: `app/routes/api.bling-sync.ts`
- Modify: `app/routes/admin.produtos.tsx`
- Modify: `app/server/env.ts`
- Modify: `app/server/bling.ts`

**Interfaces:**

- Produces `startBlingOAuth(request): Promise<Response>` and `validateBlingOAuthCallback(request): Promise<{ valid: boolean; headers: Headers }>`.
- Deletes secret checks and `BLING_OAUTH_INVITE_STATE` acceptance.

- [ ] **Step 1: Write OAuth-state tests**

```ts
it('accepts only the state issued in the current HttpOnly cookie', async () => {
  const start = await startBlingOAuth(adminRequest);
  expect(await validateBlingOAuthCallback(callbackWith(start))).toMatchObject({
    valid: true,
  });
});

it('rejects callbacks without or with mismatched state cookies', async () => {
  await expect(
    validateBlingOAuthCallback(foreignCallback),
  ).resolves.toMatchObject({ valid: false });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `pnpm vitest run app/server/bling-oauth-state.test.ts`

Expected: FAIL because state cookie helpers do not exist.

- [ ] **Step 3: Implement cookie-bound flow**

Use a Remix `createCookie` with `httpOnly: true`, `secure: true` in production, `sameSite: 'lax'`, and a 15-minute lifetime. A random nonce is both OAuth `state` and cookie value. Admin Products route action starts the flow after `requireAdmin`, commits the cookie, and redirects to Bling. Callback verifies exact state equality, clears cookie in every response, stores tokens, audits a redacted result, and redirects to `/admin/produtos` with a one-time flash cookie. Delete the `/api/bling-oauth-start` and `/api/bling-sync` route modules; retain only the callback route.

- [ ] **Step 4: Run focused OAuth tests**

Run: `pnpm vitest run app/server/bling-oauth-state.test.ts app/server/signed-token.test.ts`

Expected: PASS; remove obsolete OAuth-state token tests.

- [ ] **Step 5: Commit**

```bash
git add app/server/bling-oauth-state.ts app/server/bling-oauth-state.test.ts app/server/bling-oauth-start.ts app/server/bling-oauth-callback.ts app/routes/api.bling-oauth-callback.ts app/routes/admin.produtos.tsx app/server/env.ts app/server/bling.ts
git rm app/routes/api.bling-oauth-start.ts app/routes/api.bling-sync.ts
git commit -m "feat: secure Bling OAuth through admin"
```

### Task 6: Add protected Bling status and catalog synchronization controls

**Files:**

- Modify: `app/server/bling.ts`
- Modify: `app/server/db/queries.ts`
- Modify: `app/routes/admin.produtos.tsx`
- Create: `app/server/bling-admin.test.ts`

**Interfaces:**

- Produces `getBlingConnectionStatus(): Promise<{ connected: boolean; expiresAt: string | null }>`.
- Extends Products action intents with `sync-bling`.

- [ ] **Step 1: Write failing service/action tests**

```ts
it('reports disconnected without persisted tokens', async () => {
  await expect(getBlingConnectionStatus()).resolves.toEqual({
    connected: false,
    expiresAt: null,
  });
});

it('runs sync only through an admin action and audits the upsert count', async () => {
  await action({ request: adminSyncRequest });
  expect(syncBlingProductsToCache).toHaveBeenCalledOnce();
});
```

- [ ] **Step 2: Run tests and verify failure**

Run: `pnpm vitest run app/server/bling-admin.test.ts`

Expected: FAIL with missing status function/action intent.

- [ ] **Step 3: Implement status, sync, UI feedback**

Read the singleton token row without exposing raw token fields. Add connection status, `Conectar/Reconectar Bling`, and `Sincronizar catálogo` to a bordered existing-surface panel above the product search. `sync-bling` calls `syncBlingProductsToCache(defaultMinQuantity)`, audits count and outcome, and uses flash data to show timestamp/count or generic error.

- [ ] **Step 4: Run focused tests**

Run: `pnpm vitest run app/server/bling-admin.test.ts app/server/db/queries.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/server/bling.ts app/server/db/queries.ts app/routes/admin.produtos.tsx app/server/bling-admin.test.ts
git commit -m "feat: manage Bling sync in admin"
```

### Task 7: Replace the CLI CSV importer with signed pasted-TSV preview/commit

**Files:**

- Create: `app/server/price-list-import.ts`
- Create: `app/server/price-list-import.test.ts`
- Modify: `app/server/db/queries.ts`
- Modify: `app/routes/admin.produtos.tsx`
- Modify: `app/server/env.ts`
- Modify: `app/server/signed-token.ts`
- Delete: `scripts/bling-price-list-import.mjs`
- Delete: `scripts/bling-price-list-import.test.mjs`
- Modify: `package.json`

**Interfaces:**

- Produces `parsePastedPriceList(text)`, `buildPriceImportPreview(tier, text)`, `signPriceImportPreview(preview, secret)`, and `commitPriceImport(preview)`.
- Parser result includes `matched`, `unchanged`, `missingSkus`, `skipped`, and `conflicts`.

- [ ] **Step 1: Write parser tests for supplied table shape**

```ts
const text =
  'Produto\tSku\tGTIN/EAN\tR$ Preço no Bling\tR$ Preço da lista\nHayes\tPADS-ULTR-HAYE-DOMI\t\t183,61\t61,49';
expect(parsePastedPriceList(text)).toMatchObject({
  rows: [{ sku: 'PADS-ULTR-HAYE-DOMI', priceCents: 6149 }],
});
expect(() =>
  parsePastedPriceList('Produto Sku Preço da lista\nHayes SKU 61,49'),
).toThrow('tab-separated');
expect(() => parsePastedPriceList(conflictingDuplicate)).toThrow(
  'conflicting duplicate SKU',
);
```

- [ ] **Step 2: Write preview/commit invariant tests**

```ts
it('changes only the chosen tier after a valid signed confirmation', async () => {
  const preview = await buildPriceImportPreview('pro', text);
  await commitPriceImport(
    verifyPriceImportPreview(signPriceImportPreview(preview, secret), secret),
  );
  expect(updateTierPrices).toHaveBeenCalledWith('pro', expect.any(Array));
});

it('rejects a modified or expired preview token', () => {
  expect(() => verifyPriceImportPreview(tampered, secret)).toThrow(
    'invalid preview',
  );
});
```

- [ ] **Step 3: Run parser tests and verify failure**

Run: `pnpm vitest run app/server/price-list-import.test.ts`

Expected: FAIL because the module does not exist.

- [ ] **Step 4: Implement deterministic TSV parsing and preview**

Normalize headers with NFD accent folding. Require tab delimiters and columns matching `sku` and `preço da lista`; parse Brazilian currency with the existing cents helper. Collapse exact duplicate SKU+price rows and reject conflicting duplicates. Fetch cached products by SKU, calculate matched/unchanged/missing/skipped outcomes, and sign a compact preview payload with a 15-minute expiration using a purpose-specific signed-token payload. Do not include raw paste text in token/audit metadata.

- [ ] **Step 5: Implement admin preview and commit actions**

Add `intent=preview-price-list` and `intent=commit-price-list` to the protected Products action. Render tier select, textarea, preview table/summary, and explicit `Confirmar importação` form with only signed preview token. Use a database transaction to update the selected price column by SKU and audit counts. Preserve `visibleB2b`, active, and all non-tier columns.

- [ ] **Step 6: Run focused tests**

Run: `pnpm vitest run app/server/price-list-import.test.ts app/server/br-money.test.ts`

Expected: PASS.

- [ ] **Step 7: Remove CLI surface and commit**

```bash
git rm scripts/bling-price-list-import.mjs scripts/bling-price-list-import.test.mjs
pnpm pkg delete scripts.prices:import
git add app/server/price-list-import.ts app/server/price-list-import.test.ts app/server/db/queries.ts app/routes/admin.produtos.tsx app/server/env.ts app/server/signed-token.ts package.json
git commit -m "feat: import pasted Bling price lists in admin"
```

### Task 8: Add audited bulk catalog visibility controls

**Files:**

- Modify: `app/server/db/queries.ts`
- Modify: `app/routes/admin.produtos.tsx`
- Modify: `app/server/db/queries.test.ts`

**Interfaces:**

- Produces `updateProductsVisibleB2b(ids: number[], visibleB2b: boolean)`.
- Adds `intent=bulk-visibility` with `productIds[]` and explicit `visibleB2b`.

- [ ] **Step 1: Write failing bulk-update tests**

```ts
it('updates exactly selected product IDs to an explicit visibility value', async () => {
  await updateProductsVisibleB2b([1, 2], false);
  expect(sql).toContain('where "bling_products"."id" in');
});
```

- [ ] **Step 2: Run focused tests to verify failure**

Run: `pnpm vitest run app/server/db/queries.test.ts`

Expected: FAIL with missing bulk function.

- [ ] **Step 3: Implement explicit bulk action and controls**

Add a checkbox per product row and a page form that submits selected IDs plus `show`/`hide` actions. Validate integer IDs and explicit boolean target; never implement an implicit toggle. Audit only count/target/query, not all raw submitted values.

- [ ] **Step 4: Run focused tests and commit**

Run: `pnpm vitest run app/server/db/queries.test.ts`

Expected: PASS.

```bash
git add app/server/db/queries.ts app/server/db/queries.test.ts app/routes/admin.produtos.tsx
git commit -m "feat: manage product visibility in bulk"
```

### Task 9: Build administrator management and activity screens

**Files:**

- Modify: `app/components/admin/admin-chrome.tsx`
- Create: `app/routes/admin.configuracao.tsx`
- Create: `app/routes/admin.atividade.tsx`
- Create: `app/routes/admin.configuracao.test.tsx`
- Create: `app/routes/admin.atividade.test.tsx`
- Modify: `app/server/admin-users.ts`

**Interfaces:**

- Uses Tasks 1–2 role/audit services.
- Adds AdminChrome sections `settings` and `activity`.

- [ ] **Step 1: Write failing authorization/last-admin tests**

```ts
it('prevents deleting the final administrator', async () => {
  await expect(removeAdmin({ actorId: onlyAdmin, targetId: onlyAdmin })).resolves.toEqual({ ok: false, error: 'last_admin' });
});

it('renders audit events without sensitive metadata', async () => {
  render(<AdminActivity />);
  expect(screen.queryByText(/secret|token/i)).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `pnpm vitest run app/routes/admin.configuracao.test.tsx app/routes/admin.atividade.test.tsx`

Expected: FAIL because routes/services are absent.

- [ ] **Step 3: Implement role management and activity listing**

Configuration accepts an authenticated Supabase user email, resolves its user ID using the server admin client, creates the role, and prevents removing the final admin. Activity requires admin, lists newest audit events, uses compact tables and existing surfaces, and formats only allowlisted metadata fields. Record every role mutation.

- [ ] **Step 4: Run focused tests and commit**

Run: `pnpm vitest run app/routes/admin.configuracao.test.tsx app/routes/admin.atividade.test.tsx`

Expected: PASS.

```bash
git add app/components/admin/admin-chrome.tsx app/routes/admin.configuracao.tsx app/routes/admin.atividade.tsx app/routes/admin.configuracao.test.tsx app/routes/admin.atividade.test.tsx app/server/admin-users.ts
git commit -m "feat: add admin roles and activity history"
```

### Task 10: Remove old operational paths and update documentation

**Files:**

- Modify: `docs/integrations/b2b-auth-bling.md`
- Modify: `.env.example`
- Modify: `README.md` if it names old scripts/endpoints
- Modify: `package.json`
- Delete: `scripts/bling-catalog-sync.mjs`
- Modify: `app/server/bling.ts`
- Modify: `public/llms.txt` only if any public B2B access behavior/canonical route wording changed

**Interfaces:**

- Removes `catalog:sync`, `prices:import`, `B2B_ADMIN_APPROVE_SECRET`, `ADMIN_EMAILS`, `BLING_OAUTH_INVITE_STATE`, `/api/bling-sync`, and `/api/bling-oauth-start` from operational documentation.

- [ ] **Step 1: Write a documentation regression check**

```bash
! rg 'B2B_ADMIN_APPROVE_SECRET|BLING_OAUTH_INVITE_STATE|catalog:sync|prices:import|api/bling-sync|api/bling-oauth-start' README.md docs .env.example package.json
```

- [ ] **Step 2: Update the runbook**

Document Supabase redirect URLs for seller magic links and Bling callback; document the bootstrap admin environment variable; state that admins connect/sync Bling, paste price lists, manage visibility, and send seller access links in `/admin`. Explain approval-email confirmation behavior and remove secret/curl instructions.

- [ ] **Step 3: Remove the sync script and package entry**

```bash
git rm scripts/bling-catalog-sync.mjs
pnpm pkg delete scripts.catalog:sync
```

- [ ] **Step 4: Run the regression check and formatting**

Run: `pnpm format:check && ! rg 'B2B_ADMIN_APPROVE_SECRET|BLING_OAUTH_INVITE_STATE|catalog:sync|prices:import|api/bling-sync|api/bling-oauth-start' README.md docs .env.example package.json`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add docs/integrations/b2b-auth-bling.md .env.example README.md package.json public/llms.txt app/server/bling.ts
git commit -m "docs: centralize B2B operations in admin"
```

### Task 11: Full verification and migration handoff

**Files:**

- Modify only if verification exposes a defect.

- [ ] **Step 1: Generate and inspect migration SQL**

Run: `pnpm db:generate && git diff -- drizzle`

Expected: migration matches `admin_users`, `email_action_tokens`, and `admin_audit_events` schema without unrelated changes.

- [ ] **Step 2: Run all automated checks**

Run: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`

Expected: all commands exit 0.

- [ ] **Step 3: Perform manual smoke checks**

1. Bootstrap an admin once, then verify a non-role user is forbidden.
2. Register a seller; opening approval GET must not approve it; POST confirmation approves once.
3. Send catalog access to approved seller and verify the received Supabase magic link signs in at `/b2b/catalogo`; suspend seller and verify catalog API denies access.
4. Connect Bling from `/admin/produtos`, return through callback, and sync catalog.
5. Paste the provided TSV price-list into each tier flow; verify preview counts, duplicates, missing SKU handling, and confirmed tier-only writes.
6. Verify activity contains redacted records and no link/token/code content.

- [ ] **Step 4: Commit any verification fixes and record deployment requirements**

```bash
git status --short
git log --oneline --max-count=12
```

Record required production values: `B2B_APPROVAL_LINK_SECRET`, `ADMIN_BOOTSTRAP_EMAILS` (only until first role exists), Supabase redirect URLs for `/b2b/catalogo` and `/admin/login/callback`, Bling callback URL, database migration, and Resend configuration.
