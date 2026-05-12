# LUA-39: Bling Inventory Sync Recommendation

Research completed: 2026-05-12
Status: **Deferred — not required for MVP**

## Summary

Bling ERP integration is not required for the GHENO landing page MVP. The current
architecture routes commerce entirely to Nuvemshop, which manages its own inventory
display. A Bling sync would only matter if inventory levels or product availability
should be shown directly on the GHENO landing page — which is not in the current design.

## What Is Bling

Bling is a Brazilian cloud ERP widely used by small-to-medium e-commerce businesses.
It provides inventory management, order management, NFe emission, and financial controls.
Many Nuvemshop stores sync stock and orders through Bling via a native integration.

## How the Current Architecture Works

```
GHENO landing page
       │
       └──▶ Nuvemshop store (store.ghenortrs.com.br)
                   │
                   └──▶ Bling (if configured — external to landing page scope)
```

The landing page is a static marketing surface. It links to Nuvemshop for all commerce
operations. If the client has Bling connected to Nuvemshop, inventory management already
flows through that channel without any landing page involvement.

## When Bling Integration Would Matter for the Landing Page

1. **Real-time stock badges** — showing "Em estoque" / "Esgotado" per product on the
   landing page cards, pulling from Bling stock levels via its REST API
2. **Lead-to-order workflow** — converting B2B form leads into Bling orders or contacts
   automatically, without manual re-entry
3. **Wholesale pricing display** — showing B2B pricing tiers sourced from Bling price
   tables directly on the B2B teaser section

None of these are in the current design or Linear backlog.

## Bling API Feasibility (if needed later)

- **API version:** Bling API v3 (REST, OAuth 2.0 client credentials flow)
- **Base URL:** `https://www.bling.com.br/Api/v3/`
- **Auth:** Client credentials grant; access tokens expire after 1 hour; refresh tokens
  required for persistent server-side sync
- **Rate limit:** 3 requests/second per credential pair (confirmed per Bling docs as of 2025)
- **Key endpoints for this use case:**
  - `GET /produtos` — product list with stock quantity
  - `GET /produtos/{id}/estoques` — per-warehouse stock for a product
  - `POST /contatos` — create a contact record from a B2B lead
  - `POST /pedidos` — create a wholesale order

**Implementation pattern for real-time stock badges:**

A Vercel Edge Function (same pattern as `api/b2b-submit.ts`) would query Bling's product
endpoint, cache the response in Vercel's Edge Cache for 5 minutes, and return stock
status to the frontend. This avoids exposing the Bling client secret to the browser.

**Operational constraint:** Bling credentials are per-Bling-account and must be
provisioned by the store owner. The GHENO client must create an integration app in their
Bling account and share the client ID and secret.

## Recommendation

**Do not implement Bling integration in v1.** The current Nuvemshop handoff is
sufficient for the MVP. If the client requests real-time stock visibility or B2B
lead-to-order automation, revisit with a scoped feature spec that includes:

- Which specific data points from Bling appear on the landing page
- Acceptable staleness (e.g., 5-minute cache vs. real-time)
- Who owns the Bling credential rotation and monitoring

## Risks of Early Integration

- Bling API credential expiry causes silent failures on the landing page if unmonitored
- Rate limit (3 req/s) is easy to exceed if stock badge requests are not cached at the
  edge — each page load would consume 4 product requests for the current catalog
- Adding Bling as a dependency couples landing page availability to Bling uptime
