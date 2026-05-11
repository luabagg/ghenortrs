# Store Destination Map

Last verified: 2026-05-11
Source: live Nuvemshop storefront (`https://store.ghenortrs.com.br/`) and sitemap (`https://store.ghenortrs.com.br/sitemap.xml`)

## Current Catalog Reality

- The live sitemap currently exposes 13 product URLs, and every published product is a brake-pad SKU.
- The store navigation exposes `Freios` and `Pastilhas de freio`, but the dedicated `/freios/` and `/freios/pastilhas-de-freio/` collection pages currently render empty-result states.
- There are no published `Cubos`, `Aros`, or `Rotores` category URLs in the sitemap, and direct slug checks for `/cubos/`, `/aros/`, and `/rotores/` return `404`.
- The only reliable commerce listing page for launch-day CTA handoff is `/produtos/`.

## CTA Routing Contract

| Category    | Preferred destination                                       | Destination status              | Safe fallback CTA    | Safe fallback URL                          | Notes                                                                                                                          |
| ----------- | ----------------------------------------------------------- | ------------------------------- | -------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `Pastilhas` | `https://store.ghenortrs.com.br/freios/pastilhas-de-freio/` | Page exists but currently empty | `Ver catálogo GHENO` | `https://store.ghenortrs.com.br/produtos/` | Use the catalog fallback until the collection page actually renders the published brake-pad inventory.                         |
| `Cubos`     | No verified category page                                   | Missing                         | `Consultar cubos`    | `https://store.ghenortrs.com.br/contato/`  | Do not point a category CTA at `/produtos/` here; the current catalog would mislead users because it contains only brake pads. |
| `Aros`      | No verified category page                                   | Missing                         | `Consultar aros`     | `https://store.ghenortrs.com.br/contato/`  | Same rule as `Cubos`: use an availability/contact CTA until a real commerce destination exists.                                |
| `Rotores`   | No verified category page                                   | Missing                         | `Consultar rotores`  | `https://store.ghenortrs.com.br/contato/`  | Keep the CTA honest about availability rather than routing to an unrelated catalog page.                                       |

## Implementation Notes

- For any generic "Loja" CTA, use `https://store.ghenortrs.com.br/produtos/` instead of the empty `Freios` collection pages.
- If the landing page must show all four product families before the store taxonomy is fixed, split the CTA behavior:
  - `Pastilhas` can remain commerce-directed via the catalog fallback.
  - `Cubos`, `Aros`, and `Rotores` should use consultation-style copy that routes to store contact.
- Re-audit this file before `M4` if Nuvemshop categories or product families are added.
