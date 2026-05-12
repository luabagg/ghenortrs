# Landing Page Content Architecture

Last defined: 2026-05-11
Scope owner: `LUA-17`
Depends on: [DESIGN.md](../../DESIGN.md), [storefront-audit.md](./storefront-audit.md), [store-destination-map.md](./store-destination-map.md)

## Goal

Define the Portuguese narrative, section order, and CTA hierarchy for the MVP landing page so `M2` can implement a real marketing surface without reopening discovery work.

## Messaging Rules

- Write in Brazilian Portuguese with direct, technical, performance-first language.
- Speak like a premium MTB component brand, not like a generic marketplace.
- Keep the promise honest: only `Pastilhas` can point at a live commerce catalog today.
- Use `Cubos`, `Aros`, and `Rotores` as proof-of-range and commercial-intent sections, not fake live-catalog promises.
- Let the copy sell control, braking confidence, durability, and race-readiness; avoid vague lifestyle claims.

## Page Narrative

The landing page should move in a simple sequence:

1. Establish GHENO as a high-performance MTB components brand.
2. Prove that the current live catalog is real and immediately shopable for brake pads.
3. Show the broader component families without pretending all of them are already purchasable online.
4. Reinforce technical credibility.
5. Split consumer and commercial intent clearly.
6. End with one unambiguous store CTA plus a secondary commercial path.

## Section Architecture

| Order | Section                   | Purpose                                                                                    | Portuguese content direction                                                                                                                                                                                                                                                                                                 | Primary CTA                                                        | Secondary CTA                                                        |
| ----- | ------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------- |
| `1`   | `Hero`                    | State brand position and route the two main intents immediately.                           | Eyebrow: `COMPONENTES MTB DE ALTO DESEMPENHO`. Headline direction: `Pastilhas e componentes GHENO para quem exige frenagem, controle e consistência na trilha.` Support copy should frame GHENO as a technical, race-ready brand built for riders, oficinas, and lojistas who value performance over generic catalog volume. | `Ver catálogo GHENO` -> `https://store.ghenortrs.com.br/produtos/` | `Falar com GHENO B2B` -> `/b2b`                                      |
| `2`   | `Proof bar`               | Give fast credibility without turning the page into fake telemetry.                        | Three short proof lines only: `Catálogo ativo no ar`, `Checkout delegado à Nuvemshop`, `Atendimento comercial para linhas sem catálogo publicado`.                                                                                                                                                                           | None                                                               | None                                                                 |
| `3`   | `Famílias de componentes` | Present the four product families and split CTA behavior honestly by availability.         | Intro direction: `Uma linha pensada para frenagem, rolagem e montagem com critério técnico.` Each family card gets a short statement: `Pastilhas` = live commerce today; `Cubos`, `Aros`, and `Rotores` = consultation/commercial availability.                                                                              | Family CTA per routing contract                                    | None                                                                 |
| `4`   | `Prova técnica`           | Explain why the products feel engineered, not generic.                                     | Section should cover friction consistency, heat management, finish quality, and component reliability in concise, mechanical language. Avoid invented specs or unsupported numbers.                                                                                                                                          | `Explorar componentes` -> `/componentes`                           | None                                                                 |
| `5`   | `B2B teaser`              | Invite shops, workshops, and distributors into the commercial path.                        | Headline direction: `Atendimento comercial para oficinas, revendas e distribuidores.` Copy should promise direct conversation around mix, availability, and technical context, not self-serve onboarding.                                                                                                                    | `Abrir frente B2B` -> `/b2b`                                       | `Contato comercial` -> `https://store.ghenortrs.com.br/contato/`     |
| `6`   | `Closing CTA band`        | Finish with a single strongest consumer CTA and one honest fallback for non-catalog lines. | Headline direction: `Compre o que já está pronto para rodar. Consulte o que ainda depende de atendimento.` Keep the contrast section short and decisive.                                                                                                                                                                     | `Ver catálogo GHENO` -> `https://store.ghenortrs.com.br/produtos/` | `Consultar componentes` -> `https://store.ghenortrs.com.br/contato/` |
| `7`   | `Footer`                  | Mirror verified outbound destinations and legal links.                                     | Include brand sign-off plus the already-live store links: `Produtos`, `Contato`, `Politica de Privacidade`, and `Instagram`.                                                                                                                                                                                                 | `Produtos` -> `https://store.ghenortrs.com.br/produtos/`           | Remaining footer links                                               |

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
| Hero + B2B teaser   | `Falar com GHENO B2B` | `/b2b`                                     | Internal route for the commercial journey; the page itself can hand off to store contact until `M3` is live. |
| `Pastilhas` card    | `Ver catálogo GHENO`  | `https://store.ghenortrs.com.br/produtos/` | Do not use the broken `/freios/pastilhas-de-freio/` path.                                                    |
| `Cubos` card        | `Consultar cubos`     | `https://store.ghenortrs.com.br/contato/`  | Stay consultation-led until a verified category or product destination exists.                               |
| `Aros` card         | `Consultar aros`      | `https://store.ghenortrs.com.br/contato/`  | Same rule as `Cubos`.                                                                                        |
| `Rotores` card      | `Consultar rotores`   | `https://store.ghenortrs.com.br/contato/`  | Same rule as `Cubos`.                                                                                        |
| Generic fallback    | `Contato comercial`   | `https://store.ghenortrs.com.br/contato/`  | Use when the user intent is real but the store cannot fulfill it directly yet.                               |

## Section-Level Content Boundaries

- The hero should sell GHENO as a brand and open the two main journeys. It should not explain every product family in detail.
- The product-family section should be the only place where per-category CTA behavior changes.
- The technical-proof section should explain feel, control, and engineering discipline. It should not fabricate lab claims.
- The B2B section should promise conversation and context, not immediate account creation or automated quotation.
- The closing CTA band should reduce choice again after the mid-page detail.

## Implementation Notes For `M2`

- Preserve the section order above unless user research or new store reality forces a change.
- Reuse the existing `/componentes` and `/b2b` shell routes as internal extensions of the homepage narrative.
- The homepage should visually prioritize `Pastilhas` as the only live commerce family without visually demoting the other families into dead ends.
- If store taxonomy changes before `M4`, update this document and [store-destination-map.md](./store-destination-map.md) in the same session.
