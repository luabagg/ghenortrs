# Landing Page Content Architecture

Last defined: 2026-07-12
Scope owner: `LUA-17`
Depends on: [DESIGN.md](../../DESIGN.md), [storefront-audit.md](./storefront-audit.md), [store-destination-map.md](./store-destination-map.md)

## Goal

Define the Portuguese narrative, section order, and CTA hierarchy for the MVP landing page so `M2` can implement a real marketing surface without reopening discovery work.

## Messaging Rules

- Write in Brazilian Portuguese with direct, technical, performance-first language.
- Speak like a premium MTB component brand, not like a generic marketplace.
- Keep the promise honest: `Pastilhas`, `Cubos`, and `Aros` can point at verified Nuvemshop categories.
- Use `Rotores` as proof-of-range with owned contact; do not imply stock.
- Let the copy sell control, braking confidence, durability, and race-readiness; avoid vague lifestyle claims.

## Page Narrative

The landing page should move in a simple sequence:

1. Establish GHENO as a high-performance MTB components brand.
2. Route brake-pad, hub, and rim demand to verified store categories and products.
3. Show rotors without implying inventory.
4. Reinforce technical credibility.
5. Split consumer and commercial intent clearly.
6. End with one unambiguous store CTA plus a secondary commercial path.

## Section Architecture

| Order | Section                   | Purpose                                                                                    | Portuguese content direction                                                                                                                                                                                                                                                                                                 | Primary CTA                                                        | Secondary CTA                                                        |
| ----- | ------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------- |
| `1`   | `Hero`                    | State brand position and route the two main intents immediately.                           | Eyebrow: `COMPONENTES MTB DE ALTO DESEMPENHO`. Headline direction: `Pastilhas e componentes GHENO para quem exige frenagem, controle e consistência na trilha.` Support copy should frame GHENO as a technical, race-ready brand built for riders, oficinas, and lojistas who value performance over generic catalog volume. | `Ver catálogo GHENO` -> `https://store.ghenortrs.com.br/produtos/` | `Falar com GHENO B2B` -> `/b2b`                                      |
| `2`   | `Proof bar`               | Give fast credibility without turning the page into fake telemetry.                        | Three short proof lines only: `Catálogo ativo no ar`, `Checkout delegado à Nuvemshop`, `Atendimento comercial para linhas sem catálogo publicado`.                                                                                                                                                                           | None                                                               | None                                                                 |
| `3`   | `Famílias de componentes` | Present the four product families and split CTA behavior honestly by availability.         | `Pastilhas`, `Cubos`, and `Aros` route to verified online categories. `Rotores` explains the family and routes to contact without a stock claim.                                                                              | Family CTA per routing contract                                    | None                                                                 |
| `4`   | `Prova técnica`           | Explain why the products feel engineered, not generic.                                     | Section should cover friction consistency, heat management, finish quality, and component reliability in concise, mechanical language. Avoid invented specs or unsupported numbers.                                                                                                                                          | `Explorar componentes` -> `/componentes`                           | None                                                                 |
| `5`   | `B2B teaser`              | Invite shops, workshops, and distributors into the commercial path.                        | Headline direction: `Atendimento comercial para oficinas, revendas e distribuidores.` Copy should route approved sellers toward access and let non-registered sellers request approval from the login screen.                                                                                                                | `Acessar produtos B2B` -> `/b2b`                                   | None                                                                 |
| `6`   | `Closing CTA band`        | Finish with a single strongest consumer CTA and one honest fallback for non-catalog lines. | Headline direction: `Compre o que já está pronto para rodar. Consulte o que ainda depende de atendimento.` Keep the contrast section short and decisive.                                                                                                                                                                     | `Ver loja online` -> `https://store.ghenortrs.com.br/produtos/`    | `Ver componentes` -> `/componentes`                                  |
| `7`   | `Footer`                  | Mirror verified outbound destinations and legal links.                                     | Include brand sign-off plus the live product catalog, owned `Contato` and `Sobre`, privacy, and Instagram. Do not show YouTube until an official channel exists.                                                                                                                                                              | `Ver loja online` -> `https://store.ghenortrs.com.br/produtos/`    | Remaining footer links                                               |

## CTA Hierarchy

### Global priority

1. `Ver catálogo GHENO`
2. `Falar com GHENO B2B`
3. Family-specific consultation CTAs
4. Footer/legal links

### CTA contract

| Context             | Label                 | Destination                                | Rule                                                                                                         |
| ------------------- | --------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Hero + closing band | `Ver catálogo GHENO`  | `https://store.ghenortrs.com.br/produtos/` | This is the default high-priority commerce CTA for the MVP.                                                  |
| Hero + B2B teaser   | `Solicitar cadastro B2B` | `/b2b`                                 | Internal route to the working commercial registration request.                                               |
| `Pastilhas` card    | `Ver pastilhas`       | `https://store.ghenortrs.com.br/freios/pastilhas-de-freio/` | Verified online category.                                                         |
| `Cubos` card        | `Ver cubos`           | `https://store.ghenortrs.com.br/cubos/`    | Verified online category.                                                                                     |
| `Aros` card         | `Ver aros`            | `https://store.ghenortrs.com.br/aros/`     | Verified online category.                                                                                     |
| `Rotores` card      | `Consultar rotores`   | `/contato`                                 | Same rule as `Cubos`.                                                                                        |
| Generic fallback    | `Contato comercial`   | `/contato`                                 | Use when the user intent is real but the store cannot fulfill it directly yet.                               |

## Section-Level Content Boundaries

- The hero should sell GHENO as a brand and open the two main journeys. It should not explain every product family in detail.
- The product-family section should be the only place where per-category CTA behavior changes.
- The technical-proof section should explain feel, control, and engineering discipline. It should not fabricate lab claims.
- The B2B section should promise conversation and context, not immediate account creation or automated quotation.
- The closing CTA band should reduce choice again after the mid-page detail.

## Implementation Notes For `M2`

- Preserve the section order above unless user research or new store reality forces a change.
- Reuse the existing `/componentes` and `/b2b` shell routes as internal extensions of the homepage narrative.
- The homepage treats `Pastilhas`, `Cubos`, and `Aros` as live commerce families and keeps `Rotores` as a clear contact path.
- If store taxonomy changes before `M4`, update this document and [store-destination-map.md](./store-destination-map.md) in the same session.
