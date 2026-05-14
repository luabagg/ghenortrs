# Checkout Boundary

Last updated: 2026-05-13

## What the marketing site owns

The `ghenortrs` Vite app is a marketing and lead-capture surface. It owns:

- Landing page content and navigation
- Product family presentation (`/componentes`)
- Owned company and contact pages (`/sobre`, `/contato`)
- B2B access entry and lead capture form (`/b2b`) — presents a login-style gate for approved sellers and collects registration requests via Resend

## What Nuvemshop owns

All transactional commerce is handled by the Nuvemshop storefront at
`https://store.ghenortrs.com.br`. This includes:

- Product catalog and inventory
- Cart and checkout flow
- Payment processing
- Order confirmation and fulfillment emails

The marketing site never touches cart state, product inventory, or payment data.

## CTA handoff contract

Outbound commerce CTAs keep product purchase intent on Nuvemshop while contact
and B2B intent stay on owned routes:

| Intent                           | Destination URL                                    |
| -------------------------------- | -------------------------------------------------- |
| Browse / buy (Pastilhas)         | `https://store.ghenortrs.com.br/produtos/`         |
| Enquire (Cubos / Aros / Rotores) | `/contato`                                         |
| B2B access request               | `/b2b`                                             |
| Social contact                   | `https://www.instagram.com/gheno_rtrs/`            |

See [store-destination-map.md](./store-destination-map.md) for per-category routing rationale.

## Outbound click tracking

Every click on a Nuvemshop CTA fires an `outbound_commerce_click` event via
`src/lib/tracking.ts`. The event payload includes:

- `section` — the `data-section` attribute of the nearest ancestor (`hero`,
  `component-families`, `b2b-teaser`, `closing-cta`, `footer`,
  `componentes-page`)
- `destination` — the full store URL that was clicked

The tracker pushes to `window.dataLayer` (GTM-compatible) and calls
`window.gtag` if present. Wire up a GTM container or GA4 stream to consume
these events.

## Future native commerce work (out of MVP scope)

The following are explicitly deferred and require a separate milestone:

- Native product data ingestion from Nuvemshop API
- In-app cart or add-to-cart interactions
- Native checkout or payment handling
- Inventory sync or real-time stock display
- Bling ERP integration for order management
- Nuvemshop webhooks for fulfillment state

Any work touching these areas should be scoped under `M4+` and reviewed
against the Nuvemshop API terms before implementation.
