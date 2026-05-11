# Storefront Audit

Last verified: 2026-05-11
Source: live Nuvemshop storefront (`https://store.ghenortrs.com.br/`) and sitemap (`https://store.ghenortrs.com.br/sitemap.xml`)

## MVP-Relevant URLs

| Purpose               | URL                                                         | Status | Notes                                                                           |
| --------------------- | ----------------------------------------------------------- | ------ | ------------------------------------------------------------------------------- |
| Store root            | `https://store.ghenortrs.com.br/`                           | `200`  | Title currently renders as `Loja online de GHENOrtrs`.                          |
| Catalog root          | `https://store.ghenortrs.com.br/produtos/`                  | `200`  | Only reliable launch-day commerce listing page.                                 |
| Catalog page 2        | `https://store.ghenortrs.com.br/produtos/page/2/`           | `200`  | Exposes the 13th published product.                                             |
| Contact               | `https://store.ghenortrs.com.br/contato/`                   | `200`  | Safe fallback for unpublished categories and B2B consultation CTA.              |
| Privacy policy        | `https://store.ghenortrs.com.br/politica-de-privacidade/`   | `200`  | Footer/legal destination already live.                                          |
| Freios category       | `https://store.ghenortrs.com.br/freios/`                    | `200`  | Category page exists but exposes no product links in the current HTML response. |
| Pastilhas subcategory | `https://store.ghenortrs.com.br/freios/pastilhas-de-freio/` | `404`  | Linked from navigation, but currently not a safe CTA target.                    |
| Cubos category        | `https://store.ghenortrs.com.br/cubos/`                     | `404`  | No published commerce destination.                                              |
| Aros category         | `https://store.ghenortrs.com.br/aros/`                      | `404`  | No published commerce destination.                                              |
| Rotores category      | `https://store.ghenortrs.com.br/rotores/`                   | `404`  | No published commerce destination.                                              |

## Catalog Reality

- The sitemap currently exposes 13 published product URLs in the primary locale and all 13 are brake-pad SKUs.
- The main `/produtos/` page surfaces 12 unique product pages plus pagination to `/produtos/page/2/`, where the 13th product appears.
- No published hub, rim, or rotor product URLs appear in the sitemap.
- The current commerce experience is product-page first, not category-led.

## Published Product URLs

1. `https://store.ghenortrs.com.br/produtos/disk-brake-pads-elite-hayes-dominion-a4/`
2. `https://store.ghenortrs.com.br/produtos/disk-brake-pads-elite-magura-mt5-mt7/`
3. `https://store.ghenortrs.com.br/produtos/disk-brake-pads-elite-shimano-m785/`
4. `https://store.ghenortrs.com.br/produtos/disk-brake-pads-elite-sram-code-r/`
5. `https://store.ghenortrs.com.br/produtos/disk-brake-pads-elite-sram-maven/`
6. `https://store.ghenortrs.com.br/produtos/disk-brake-pads-ultra-hayes-dominion-a4/`
7. `https://store.ghenortrs.com.br/produtos/disk-brake-pads-ultra-hope-tech-3-v4/`
8. `https://store.ghenortrs.com.br/produtos/disk-brake-pads-ultra-magura-mt5-mt7/`
9. `https://store.ghenortrs.com.br/produtos/disk-brake-pads-ultra-shimano-xtr-dura-ace-ultegra-rs805/`
10. `https://store.ghenortrs.com.br/produtos/disk-brake-pads-ultra-shimano-zee-saint-m8120-m6120-trp-evo/`
11. `https://store.ghenortrs.com.br/produtos/disk-brake-pads-ultra-sram-code-r/`
12. `https://store.ghenortrs.com.br/produtos/disk-brake-pads-ultra-sram-guide-x0/`
13. `https://store.ghenortrs.com.br/produtos/disk-brake-pads-ultra-sram-maven/`

## What The Landing Page Can Reuse

- The store already has live destinations for generic catalog, product detail, contact, account login/register, and privacy-policy handoff.
- Product pages expose a direct `Comprar` flow via the Nuvemshop `/comprar/` form action, so checkout should remain fully delegated to the store.
- The footer already includes `Produtos`, `Contato`, `Politica de Privacidade`, and Instagram (`https://instagram.com/gheno_rtrs`), which can be mirrored as outbound destinations from the landing page.

## What The Landing Page Should Replace Or Avoid

- Do not rely on category-led routing for launch. `Pastilhas de freio` is linked in navigation but currently returns `404`, and `Freios` does not expose product links in the current HTML response.
- Do not promise live commerce for `Cubos`, `Aros`, or `Rotores`; the store has no published category or product destinations for those families.
- Do not treat the store homepage copy as the landing-page narrative. Its visible metadata is generic ecommerce copy centered on `Freios`, not the broader GHENO brand story.

## Gaps And Risks

- The store navigation currently advertises a `Pastilhas de freio` path that is broken at `404`.
- The catalog is incomplete relative to the planned landing page product families, so CTA behavior must stay honest and category-specific.
- Because the catalog spans two paginated listing pages, any launch audit that only checks `/produtos/` will undercount the live product set.
