# Search Source And Ranking Specification

Last verified: 2026-07-12
Milestone: `M8: Search And Command Experience`
Issues: `LUA-49`, `LUA-53`

## Decision

The public search combines a committed Nuvemshop index with owned-site routes. It does not call the authenticated Nuvemshop API and does not expose credentials in the browser.

## Sources

1. `https://store.ghenortrs.com.br/sitemap.xml` supplies canonical product/category URLs, modification dates, and product images.
2. `src/catalog/commerce-map.json` supplies authoritative family availability, destinations, aliases, and category paths.
3. `src/search/search-data.ts` supplies owned routes: `/componentes`, `/b2b`, `/sobre`, and `/contato`.

`scripts/store-search-index.mjs` validates and parses XML with `fast-xml-parser`, removes duplicate `/pt/` variants, classifies entries through the commerce map, and writes `src/search/store-search-index.json` atomically. `pnpm search:sync` refreshes the committed index. `pnpm build` runs the same synchronization first.

If Nuvemshop is temporarily unreachable and a committed index exists, build retains that index and reports a warning. Malformed XML, an unknown origin, an unmapped product, or an empty parsed index fails synchronization so incorrect commerce facts cannot silently ship.

## Commerce Rules

| Family | Mode | Destination |
| --- | --- | --- |
| Pastilhas | Online store | `https://store.ghenortrs.com.br/freios/pastilhas-de-freio/` or exact product URL |
| Cubos | Online store | `https://store.ghenortrs.com.br/cubos/` or exact product URL |
| Aros | Online store | `https://store.ghenortrs.com.br/aros/` or exact product URL |
| Rotores | Contact | `/contato` |
| Mass dampers | Contact | `/contato` |

The sitemap proves discoverability, not stock. `commerce-map.json` therefore overrides the destination for rotors and mass dampers even when a public store URL exists.

## Normalization And Ranking

- Normalize Unicode to NFD, remove diacritics, lowercase with the `pt-BR` locale, replace punctuation with spaces, and preserve decimal points.
- Split the query into tokens. Every token must occur in the combined title and alias terms; partial multi-intent matches are not returned.
- Rank an exact normalized title first, then a full-query title substring, then entries containing every token in the title, then alias-only matches.
- Add a small deterministic preference for products over categories over owned pages.
- Add a small preference when title words start with the query token.
- Resolve score ties alphabetically with `pt-BR` collation.
- Return at most eight results.

An empty query shows featured family categories. A query with no indexed result links to the official Nuvemshop search at `https://store.ghenortrs.com.br/search/?q=<encoded-query>`.

## Interaction Contract

- Desktop opens through the search button or `Cmd+K`/`Ctrl+K` and autofocuses the searchbox.
- Mobile exposes the same search at the top of the menu without desktop shortcut copy.
- Arrow keys move the active result; Enter follows it; Escape closes the desktop search.
- Exact store results use canonical Nuvemshop URLs. Owned routes use React Router links.
- Search and opening animation respect keyboard focus and reduced-motion preferences.

## Verification

- Parser and resilience tests: `scripts/store-search-index.test.mjs`
- Ranking tests: `src/search/search-engine.test.ts`
- Search UI tests: `src/components/search/store-search.test.tsx`
- Shell integration tests: `src/app.test.tsx`
- Runtime QA: desktop `1440×900`, mobile `390×844`, and reduced-motion browser context
