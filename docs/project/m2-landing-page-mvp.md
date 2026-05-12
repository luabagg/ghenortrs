# M2: Landing Page MVP

Status: active
Target: 2026-05-15
Depends on: `M0: Discovery And Project Definition`, `M1: Vite Architecture Setup`
Linear milestone: `M2: Landing Page MVP`

## Goal

Build the responsive GHENO marketing homepage on top of the verified discovery and frontend foundation.

## Current Status

`M2` is active and unblocked. The first homepage slice is already implemented locally: Portuguese hero, proof bar, live catalog CTA, B2B secondary path, and regression coverage.

Continue from [landing-page-content-architecture.md](./landing-page-content-architecture.md). Do not reopen `M1` setup decisions unless a real defect is found.

## Linear Issues

- `LUA-19` Build responsive navigation
- `LUA-20` Build hero section
- `LUA-21` Build trust and proof bar
- `LUA-22` Build component showcase section
- `LUA-23` Build technology proof section
- `LUA-24` Build B2B teaser section
- `LUA-25` Build competition and real-world proof section
- `LUA-26` Build final CTA and footer

## Deliverables

- Responsive navigation
- Portuguese homepage hero with correct CTA hierarchy
- Proof bar grounded in verified store and commerce facts
- Component-family section for `Pastilhas`, `Cubos`, `Aros`, and `Rotores`
- Technical proof section without invented specifications
- B2B teaser section
- Final CTA band and footer links
- Regression coverage for implemented homepage behavior

## Included Scope

- Homepage section implementation
- Responsive layout behavior
- Existing primitive reuse
- CTA destination wiring according to the current destination map
- Copy implementation from the approved Portuguese content architecture

## Excluded Scope

- B2B form implementation
- Resend email delivery
- Analytics instrumentation
- SEO/social metadata
- Performance and accessibility launch QA
- Native cart, checkout, or inventory sync

## Exit Criteria

- All documented homepage sections are implemented in the intended order.
- Primary store CTAs route to the live catalog destination.
- Consultation-led component CTAs route to the documented contact fallback.
- The page follows `DESIGN.md` without introducing new visual systems.
- Regression tests cover the key visible content and CTA destinations.
- `npm run test`, `npm run lint`, `npm run typecheck`, `npm run build`, and `npm run format:check` pass.

## Recommended Order

1. Keep the completed hero/proof-bar slice stable.
2. Build the component-family section from `LUA-22`.
3. Build the technical proof section from `LUA-23`.
4. Build the B2B teaser from `LUA-24`.
5. Build the competition/real-world proof section from `LUA-25`.
6. Build the final CTA and footer from `LUA-26`.
7. Run the full M1 verification command set before closing M2.

## Risks

- Reopening setup decisions will slow the homepage build without improving the user experience.
- Inventing new CTA destinations will break the store handoff contract.
- Adding unsupported specs, fake metrics, or unverifiable proof will weaken the brand position.
- Letting B2B form work enter this milestone will blur the dependency boundary with `M3`.

## Supporting Docs

- [landing-page-content-architecture.md](./landing-page-content-architecture.md)
- [store-destination-map.md](./store-destination-map.md)
- [storefront-audit.md](./storefront-audit.md)
- [m1-vite-architecture-setup.md](./m1-vite-architecture-setup.md)
