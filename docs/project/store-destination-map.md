# Store Destination Map

Last verified: 2026-07-12
Source: live Nuvemshop storefront (`https://store.ghenortrs.com.br/`), public sitemap (`https://store.ghenortrs.com.br/sitemap.xml`), and user-confirmed inventory

## Current Catalog Reality

- The live sitemap exposes 20 canonical product URLs after duplicate `/pt/` variants are removed: 13 brake-pad SKUs, 4 hubs, 2 rims, and 1 rotor page.
- Verified online category pages exist for `/freios/pastilhas-de-freio/`, `/cubos/`, and `/aros/`.
- Brake pads, hubs, and rims are available online.
- Rotors and mass dampers are not in inventory. Their public intent routes to owned `/contato` even when the sitemap exposes a store page.
- The marketing site never owns cart or checkout; those steps remain in Nuvemshop.

## CTA Routing Contract

| Category | Public CTA | Destination | Rule |
| --- | --- | --- | --- |
| `Pastilhas` | `Ver pastilhas` | `https://store.ghenortrs.com.br/freios/pastilhas-de-freio/` | Search results may link to an exact product page. |
| `Cubos` | `Ver cubos` | `https://store.ghenortrs.com.br/cubos/` | Search results may link to an exact product page. |
| `Aros` | `Ver aros` | `https://store.ghenortrs.com.br/aros/` | Search results may link to an exact product page. |
| `Rotores` | `Consultar rotores` | `/contato` | Do not infer stock from the sitemap rotor page. |
| `Mass dampers` | `Falar com a GHENO` | `/contato` | Do not make an inventory claim. |

## Implementation Notes

- Generic store CTAs may use `https://store.ghenortrs.com.br/produtos/`.
- Family-specific CTAs use the exact destinations above.
- `src/catalog/commerce-map.json` is the executable copy of this contract and overrides sitemap URLs when stock is unavailable.
- Run `pnpm search:sync` after Nuvemshop catalog changes.
- A new or renamed product family must update this file and the commerce map before the search sync succeeds.
