# B2B tier prices + visibility override

Date: 2026-08-29  
Status: draft (awaiting review)  
Related: Bling catalog sync (`app/server/bling.ts`), B2B catalog (`app/server/b2b-catalog.ts`)

## Problem

1. Not every Bling product should appear in the B2B portal. Sellers need a **local visibility override** that survives product sync.
2. GHENO has **three Bling price lists** (Start / Pro / Max) with **custom per-SKU prices**, used when issuing NFEs. The Bling API v3 does **not** expose price lists.
3. The portal must show each approved seller the price for **their** tier only.

## Goals

- Keep Bling API sync as product master (name, stock, image, base `preco`, Bling `situacao` → `active`).
- Import tier prices from **three Bling list exports** (one file per list), matched by SKU.
- Local `visible_b2b` flag not overwritten by Bling product sync.
- Seller tier derived from configurable volume thresholds; catalog returns that tier’s price.
- Same three lists remain maintained in Bling UI for NFE (operational process; not automated via API).

## Non-goals (v1)

- Parsing Bling PDF exports.
- Calling a non-existent price-list API.
- Auto-computing volume from real purchase/ERP history (no in-app order history yet).
- Admin UI for toggles (CSV + SQL / `db:studio` is enough for v1).
- Showing all three tier prices to a seller.
- Changing Nuvemshop / B2C search.

## Constraints

- Bling API: `GET /produtos` only for catalog master data.
- List export shape (confirmed sample): columns `Produto`, `Sku`, `GTIN/EAN`, `R$ Preço no Bling`, `R$ Preço da lista`. Brazilian decimal comma (`61,49`).
- Match key: **SKU** (required). Name and base Bling price in the export are ignored for pricing.
- Tier thresholds (BRL volume units as used by GHENO ops — store as integer “volume points” or cents; see Data model):

  | Tier  | Rule                          |
  | ----- | ----------------------------- |
  | start | `volume <= 1000`              |
  | pro   | `volume < 5000` (and > 1000)  |
  | max   | `volume >= 5000`              |

- NFE continues to use the three lists inside Bling; portal prices must stay aligned by re-importing the same exports GHENO uses when lists change.

## Architecture

```text
Bling OAuth + GET /produtos
        │
        ▼
  bling-sync (existing)
        │  writes: name, sku, stock, image, price_cents (base),
        │          active (from situacao), raw, …
        │  MUST NOT overwrite: visible_b2b, price_start/pro/max_cents
        ▼
  bling_products (Postgres)
        ▲
        │  prices:import --tier=start|pro|max --file=…
        │  writes: price_*_cents by SKU; optional visibility hints
        │
Three CSV/XLSX exports from Bling list UI
        │
        └── (human) same files / same data kept as Bling listas for NFE

sellers.volume ──► resolveTier() ──► catalog API picks price_*_cents
catalog filter: active AND visible_b2b AND tier price IS NOT NULL
```

## Data model

### `bling_products` additions

| Column               | Type                      | Notes                                      |
| -------------------- | ------------------------- | ------------------------------------------ |
| `visible_b2b`        | `boolean not null default true` | Local override; sync never overwrites |
| `price_start_cents`  | `integer null`            | From Start list export                     |
| `price_pro_cents`    | `integer null`            | From Pro list export                       |
| `price_max_cents`    | `integer null`            | From Max list export                       |

Existing `price_cents` remains the Bling base/catalog price from API (informational / fallback only; **not** shown as the seller quote price when a tier price exists).

Existing `active` remains Bling `situacao` mapping.

### `sellers` additions

| Column     | Type                         | Notes                                      |
| ---------- | ---------------------------- | ------------------------------------------ |
| `volume`   | `integer not null default 0` | Ops-set volume used for tier (v1)          |

Optional derived (not stored required): tier via `resolveSellerTier(volume)`.

v1 assignment: admin/SQL/approve flow sets `volume` (or a future admin field). No automatic history.

### Sync upsert change

`upsertBlingProducts` conflict `set` list **excludes**:

- `visible_b2b`
- `price_start_cents`
- `price_pro_cents`
- `price_max_cents`

On insert of a **new** row, defaults apply (`visible_b2b = true`, tier prices null).

## Import pipeline

### CLI

```bash
pnpm prices:import --tier=start --file=./exports/start.csv
pnpm prices:import --tier=pro --file=./exports/pro.csv
pnpm prices:import --tier=max --file=./exports/max.csv
```

Implementation: `scripts/bling-price-list-import.mjs` (or `.ts` via existing tooling), package script `prices:import`.

### File rules

- Accept CSV (and TSV if trivial). XLSX only if low-cost; CSV is required.
- Header detection: normalize headers (trim, case-fold). Require a SKU column matching `/^sku$/i` and a list-price column matching the Bling export label (e.g. contains `preço da lista` / `preco da lista`) or a stable alias `price_lista`.
- Parse money: strip `R$`, spaces; treat `,` as decimal separator when both `.` and `,` absent as thousands, or standard BR `1.234,56` → cents.
- Upsert by `sku = excluded.sku` (exact trim). If SKU missing in `bling_products`, log warning and skip (product sync must run first).
- Update only the column for `--tier`.
- Exit non-zero if zero rows updated and file had data rows (misconfigured headers).

### Visibility hints (optional flag)

`--apply-name-hints`:

- If product `name` starts with `[INATIVO]` or `[INTERNO]` (case-sensitive brackets as in sample), set `visible_b2b = false`.
- Do not set `true` from hints (never re-enable via hint).
- Default: hints **off**; ops enable when importing a full list after cleanup.

Manual override: SQL / studio `update bling_products set visible_b2b = false where sku = …`.

## Catalog API / UI behavior

### Filter

`active = true AND visible_b2b = true AND <tier_price_column> IS NOT NULL`

### Price in response

Replace public `priceCents` with the seller’s tier price (or add `priceCents` as tier price and keep `basePriceCents` optional — prefer **single `priceCents` = tier price** so existing UI keeps working).

### Seller payload

Include `tier: 'start' | 'pro' | 'max'` and optionally `volume` for display (“sua tabela: Pro”).

### Quotes

`b2b-quote` must validate line prices against the **same** tier price the seller would see (reject client-supplied underpay), using server-side lookup by product id + seller tier.

## Tier resolution

```ts
function resolveSellerTier(volume: number): 'start' | 'pro' | 'max' {
  if (volume >= 5000) return 'max';
  if (volume > 1000) return 'pro';
  return 'start';
}
```

Thresholds live in one server module (constants or env later). Document units: same numeric scale GHENO uses for “1000 / 5000” (not BRL cents unless ops decide otherwise — **v1: plain integer volume points**, not cents).

## Operational process (NFE alignment)

1. Maintain Start / Pro / Max lists in Bling (for NFE).
2. Export each list → three files.
3. Run product sync if SKUs changed: `POST /api/bling-sync`.
4. Run three `pnpm prices:import` commands.
5. Spot-check portal as a seller on each tier.

No automated push from portal → Bling lists in v1.

## Testing

- Unit: money parse (`61,49` → 6149; `1.234,56` → 123456).
- Unit: `resolveSellerTier` boundaries (1000, 1001, 4999, 5000).
- Unit: normalize/import row → correct column.
- Unit/integration: product sync upsert does not clear tier prices or `visible_b2b`.
- Catalog query: inactive / `visible_b2b=false` / null tier price excluded.
- Quote: price mismatch rejected.

## Rollout

1. Schema migrate / `drizzle-kit push` for new columns.
2. Deploy code (sync exclusion + catalog/quote tier logic).
3. Set seller `volume` for test accounts.
4. Import three list files.
5. Verify `[INATIVO]` / `[INTERNO]` handling (hints or manual).
6. Update `docs/integrations/b2b-auth-bling.md` with import steps.
7. Update `public/llms.txt` only if externally visible B2B pricing behavior needs LLM guidance.

## Open decisions (resolved in this spec)

| Topic                         | Decision                                              |
| ----------------------------- | ----------------------------------------------------- |
| Sync source for list prices   | Three CSV exports, not API, not PDF                   |
| Join key                      | SKU                                                   |
| Mid band 2500–5000            | Pro until &lt; 5000; Max at &gt;= 5000                |
| Volume source v1              | Ops-set `sellers.volume`                              |
| Visibility                    | `visible_b2b`, sync-safe                              |
| Portal price display          | Single tier price as `priceCents`                     |

## Future (explicitly later)

- Admin UI for visibility + volume.
- Auto volume from quotes/orders.
- Optional Spreadsheet SoT that also generates Bling import files.
- XLSX native import if ops need it.
