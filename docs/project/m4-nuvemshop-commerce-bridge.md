# M4: Nuvemshop Commerce Bridge

Status: planned
Target: 2026-05-29
Depends on: `M2: Landing Page MVP`
Linear milestone: `M4: Nuvemshop Commerce Bridge`

## Goal

Connect the marketing surface to the current Nuvemshop commerce flow without implementing a custom checkout.

## Linear Issues

- `LUA-31` Wire all commerce CTAs to Nuvemshop
- `LUA-32` Add outbound commerce tracking
- `LUA-33` Document checkout boundary and commerce ownership

## Deliverables

- Verified outbound commerce CTAs
- Section-aware outbound click tracking
- Checkout boundary documentation
- Clear future-work notes for native product data, cart, or inventory

## Included Scope

- Store CTA wiring
- Product/category CTA wiring
- Footer commerce links
- Outbound event naming
- Commerce boundary documentation

## Excluded Scope

- Native cart
- Native checkout
- Product data ingestion
- Inventory sync
- Payment handling

## Exit Criteria

- Every visible commerce CTA has a valid destination or documented fallback.
- Users do not land on dead checkout paths.
- Outbound click events identify source section and destination.
- Checkout remains owned by Nuvemshop.
- Future native commerce work is explicitly marked out of MVP scope.

## Recommended Order

1. Re-check [store-destination-map.md](./store-destination-map.md) against the live store.
2. Wire or correct all commerce CTAs.
3. Add outbound tracking.
4. Document the checkout boundary.

## Risks

- Store taxonomy changes can invalidate CTA destinations.
- Tracking must not block navigation.
- Native checkout assumptions would expand the project beyond the approved MVP.
