# B2B Tier Prices Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Import Start/Pro/Max Bling list CSV prices by SKU, keep sync-safe `visible_b2b`, and show each seller only their volume-tier price in catalog/quotes.

**Architecture:** Bling API sync remains product master but must not overwrite tier prices or `visible_b2b`. A CLI imports one CSV per tier. `sellers.volume` → `resolveSellerTier` → catalog/quote use `price_*_cents`.

**Tech Stack:** Remix, Drizzle, Postgres, Vitest, Node ESM scripts (`pnpm`).

**Spec:** `docs/superpowers/specs/2026-08-29-b2b-tier-prices-design.md`

## Global Constraints

- Match key for price import: **SKU** (trim, exact).
- Tier thresholds (integer volume points): start `volume <= 1000`; pro `volume > 1000 && volume < 5000`; max `volume >= 5000`.
- Bling product sync **must not** overwrite `visible_b2b`, `price_start_cents`, `price_pro_cents`, `price_max_cents`.
- Catalog filter: `active AND visible_b2b AND tier_price IS NOT NULL`.
- Public catalog `priceCents` = seller tier price (not Bling base `price_cents`).
- BR money parse: `61,49` → 6149; `1.234,56` → 123456.
- No PDF parsing; no fake price-list API; no admin UI in v1.
- Portuguese seller-facing copy only when adding UI strings.
- Commit after each task; do not push unless asked.
- Prefer `pnpm test` / `pnpm exec vitest run <file>` for verification.

## File map

| File | Responsibility |
| --- | --- |
| `app/server/db/schema.ts` | Columns: `visible_b2b`, `price_*_cents`, `sellers.volume` |
| `app/server/db/queries.ts` | Catalog filter, tier price select, sync upsert exclusion, price-by-sku update |
| `app/server/seller-tier.ts` | `resolveSellerTier`, tier→column helper |
| `app/server/br-money.ts` | BR money → cents |
| `scripts/bling-price-list-import.mjs` | CLI import |
| `app/server/b2b-catalog.ts` | Tier-aware catalog response |
| `app/server/b2b-session.ts` | Expose `tier` / `volume` |
| `app/server/b2b-quote.ts` | Validate against tier prices |
| `app/b2b/types.ts` | Client types for tier |
| `docs/integrations/b2b-auth-bling.md` | Ops runbook |
| `package.json` | `prices:import` script |

---

### Task 1: Schema + sync-safe upsert

**Files:**
- Modify: `app/server/db/schema.ts`
- Modify: `app/server/db/queries.ts` (`upsertBlingProducts` conflict set)
- Modify: `app/server/db/queries.test.ts`
- Modify: `supabase/migrations/` — add new SQL file `20260829200000_b2b_tier_prices.sql` for ops who use SQL editor

**Interfaces:**
- Produces: `blingProducts.visibleB2b`, `priceStartCents`, `priceProCents`, `priceMaxCents`; `sellers.volume`
- Produces: upsert does not set those product columns on conflict

- [ ] **Step 1: Extend schema**

Add to `blingProducts`:
- `visibleB2b: boolean('visible_b2b').notNull().default(true)`
- `priceStartCents: integer('price_start_cents')`
- `priceProCents: integer('price_pro_cents')`
- `priceMaxCents: integer('price_max_cents')`

Add to `sellers`:
- `volume: integer('volume').notNull().default(0)`

- [ ] **Step 2: Fix upsert**

In `upsertBlingProducts`, remove `active: sql\`excluded.active\`` wait — keep `active` from sync. **Do not add** visible/tier price fields to the insert values from sync path; and **do not** put them in `onConflictDoUpdate.set`. Sync insert rows should omit the new columns so DB defaults apply on insert.

Update `upsertBlingProducts` input type: do not require the new columns.

- [ ] **Step 3: Tests**

Extend `queries.test.ts` schema contract to assert new column names exist on the table objects.

Add SQL migration mirroring columns for Supabase SQL Editor users.

- [ ] **Step 4: Commit**

```bash
git add app/server/db/schema.ts app/server/db/queries.ts app/server/db/queries.test.ts supabase/migrations/20260829200000_b2b_tier_prices.sql
git commit -m "feat(b2b): add tier price columns and sync-safe visibility"
```

- [ ] **Step 5: Push schema to DB if `POSTGRES_*` available**

`pnpm db:push --force` (or document for ops). Non-blocking if no network.

---

### Task 2: Tier + BR money pure modules (TDD)

**Files:**
- Create: `app/server/seller-tier.ts`
- Create: `app/server/seller-tier.test.ts`
- Create: `app/server/br-money.ts`
- Create: `app/server/br-money.test.ts`

**Interfaces:**
- Produces: `export type SellerTier = 'start' | 'pro' | 'max'`
- Produces: `export function resolveSellerTier(volume: number): SellerTier`
- Produces: `export function tierPriceColumn(tier: SellerTier): 'priceStartCents' | 'priceProCents' | 'priceMaxCents'`
- Produces: `export function parseBrMoneyToCents(raw: string): number | null`

- [ ] **Step 1: Failing tests for tier boundaries**

```ts
expect(resolveSellerTier(0)).toBe('start');
expect(resolveSellerTier(1000)).toBe('start');
expect(resolveSellerTier(1001)).toBe('pro');
expect(resolveSellerTier(4999)).toBe('pro');
expect(resolveSellerTier(5000)).toBe('max');
```

- [ ] **Step 2: Failing tests for money**

```ts
expect(parseBrMoneyToCents('61,49')).toBe(6149);
expect(parseBrMoneyToCents('R$ 1.234,56')).toBe(123456);
expect(parseBrMoneyToCents('')).toBeNull();
```

- [ ] **Step 3: Implement modules; run `pnpm exec vitest run app/server/seller-tier.test.ts app/server/br-money.test.ts`**

- [ ] **Step 4: Commit**

```bash
git commit -m "feat(b2b): add seller tier resolver and BR money parser"
```

---

### Task 3: Price list CSV import CLI

**Files:**
- Create: `scripts/bling-price-list-import.mjs`
- Create: `scripts/bling-price-list-import.test.mjs` (or colocate parse helpers tested via vitest if easier — prefer extracting pure parse to `app/server/price-list-import.ts` and thin `.mjs` wrapper that dynamic-imports built code is awkward; keep parse in `.mjs` and unit-test with node:test OR put shared parse in `app/server/br-money.ts` + header detection in `app/server/price-list-csv.ts` tested by vitest, CLI calls those via `tsx`/`node --import`)

**Preferred shape for this repo:** put CSV header resolution + row mapping in `app/server/price-list-csv.ts` (vitest), CLI `scripts/bling-price-list-import.mjs` uses `postgres` + env like other scripts, imports compiled logic by duplicating thin CLI-only argv — OR run via `node --experimental-strip-types` if available.

Simplest match to `bling-catalog-sync.mjs`: implement import fully in `.mjs`, export pure functions for testing with `node --test` or vitest on `.mjs`.

**Interfaces:**
- Consumes: `parseBrMoneyToCents` (duplicate small helper in `.mjs` OR import from built path — **Ruling for implementer:** duplicate money parse in `.mjs` by importing from `../app/server/br-money.ts` using `pnpm exec tsx scripts/bling-price-list-import.ts` — change to TypeScript script `scripts/bling-price-list-import.ts` run with `pnpm exec tsx` if tsx is available; else pure `.mjs` with inlined parse matching `br-money.ts` tests).

Check package for `tsx`. If absent, use `.mjs` with shared test vectors only.

- CLI: `--tier=start|pro|max --file=path [--apply-name-hints]`
- Uses `DATABASE_URL` or `POSTGRES_*` fallbacks (same as drizzle.config)
- Updates one price column by SKU; skips missing SKUs with warning
- Exit 1 if file has data rows but updates === 0

- [ ] **Step 1: Implement + unit tests for header detection** (SKU + preço da lista)

- [ ] **Step 2: Wire `package.json`:** `"prices:import": "node scripts/bling-price-list-import.mjs"`

- [ ] **Step 3: Commit**

```bash
git commit -m "feat(b2b): add Bling price list CSV import CLI"
```

---

### Task 4: Catalog + session tier pricing

**Files:**
- Modify: `app/server/db/queries.ts` — `listActiveCatalogProducts(query, limit, tier)`, `listActiveProductsByIds(ids, tier)`, `buildCatalogSearchSql`
- Modify: `app/server/b2b-catalog.ts`
- Modify: `app/server/b2b-session.ts`
- Modify: `app/b2b/types.ts`
- Modify: `app/server/db/queries.test.ts`
- Modify: any session response consumers if types break tests

**Interfaces:**
- Consumes: `resolveSellerTier`, seller.volume
- Produces: catalog products with `priceCents` = tier column
- Produces: session `{ seller, tier, volume }` (tier on session root or seller — prefer `tier` + `volume` on session response next to seller)

- [ ] **Step 1: Update SQL builder tests** for `visible_b2b` and `isNotNull(tierPrice)`

- [ ] **Step 2: Implement query + catalog + session**

- [ ] **Step 3: Run vitest for affected files; fix client types**

- [ ] **Step 4: Commit**

```bash
git commit -m "feat(b2b): serve catalog prices by seller volume tier"
```

---

### Task 5: Quote validation against tier prices

**Files:**
- Modify: `app/server/b2b-quote.ts`
- Modify: `app/b2b/schemas.ts` if quote items include client prices (check — if not, attach server prices into saved line items + email)
- Test: add `app/server/b2b-quote` coverage if patterns exist; else extend schemas test / new unit for price attach helper

**Interfaces:**
- Consumes: `listActiveProductsByIds` with tier filter
- Persist `unitPriceCents` on each line item from server tier price
- Email HTML should show unit price when available

- [ ] **Step 1: Read current quote schema + resend HTML builder**

- [ ] **Step 2: Attach tier unit prices server-side; reject products without tier price**

- [ ] **Step 3: Commit**

```bash
git commit -m "feat(b2b): attach tier unit prices on quote requests"
```

---

### Task 6: Docs

**Files:**
- Modify: `docs/integrations/b2b-auth-bling.md` — import steps, volume, visibility
- Modify: `docs/superpowers/specs/2026-08-29-b2b-tier-prices-design.md` — status: approved
- Modify: `public/llms.txt` — one line that B2B prices are tiered wholesale lists, not public store prices (if commerce-facing)

- [ ] **Step 1: Update runbook**

- [ ] **Step 2: Commit**

```bash
git commit -m "docs: B2B tier price import and visibility ops"
```

---

## Spec coverage check

| Spec item | Task |
| --- | --- |
| Schema columns + sync exclusion | 1 |
| resolveSellerTier + money parse | 2 |
| 3× CSV import CLI + hints flag | 3 |
| Catalog filter + tier priceCents + session tier | 4 |
| Quote uses tier prices | 5 |
| Ops docs / llms | 6 |
