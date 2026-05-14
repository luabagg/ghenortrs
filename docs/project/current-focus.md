# Current Focus

Last synced: 2026-05-13

## Active Milestone

`M7: Design Polish And Navigation Corrections`

## Objective

Address post-launch visual, navigation, footer, and public commerce-boundary corrections
without reopening the completed MVP milestones. `M0` through `M6` remain verified and form
the launch-ready baseline.

## M4 Completion Summary

All `M4` issues code-complete as of 2026-05-12:

- `LUA-31` Commerce CTA wiring — all CTAs verified against
  [store-destination-map.md](./store-destination-map.md); Pastilhas → `/produtos/`,
  Cubos/Aros/Rotores → owned `/contato`, generic store CTAs → `/produtos/`
- `LUA-32` Outbound commerce tracking — `src/lib/tracking.ts` event-delegation listener;
  fires `outbound_commerce_click` with `section` + `destination` to `window.dataLayer`
  and `window.gtag`; `data-section` attributes added to all key section wrappers
- `LUA-33` Checkout boundary documentation — [checkout-boundary.md](./checkout-boundary.md)
  documents what Nuvemshop owns, the CTA handoff contract, and deferred native commerce scope

## M5 Progress (as of 2026-05-12)

Done:

- `LUA-34` SEO metadata — complete meta block in `index.html`: title, description,
  keywords, robots, OG, Twitter Card, favicon (logo-square.jpg), apple-touch-icon (iteration 34)
- `LUA-35` Analytics events — `trackFormEvent` added to `src/lib/tracking.ts`; fires
  `b2b_form_submit_attempt`, `b2b_form_validation_error`, `b2b_form_submit_success`, and
  `b2b_form_submit_error` to `window.dataLayer` (GTM) and `window.gtag` (GA4) without
  blocking interaction (iteration 37)
- `LUA-36` Responsive visual QA — `overflow-x: clip` on body prevents any element causing
  page horizontal scroll; `min-w-0` added to all 4 proof bar text containers (iteration 38)
- `LUA-37` Accessibility QA — `prefers-reduced-motion` guard on hero carousel auto-rotate;
  nav dropdown now also opens on keyboard focus via `group-focus-within`; mobile menu focuses
  close button on open via `useRef` (iteration 38)

- `LUA-38` Performance pass — Google Fonts moved from render-blocking CSS `@import` to
  `<link>` tags with preconnect hints in `index.html`; `<link rel="preload">` added for
  the LCP hero image; `width`/`height` attributes added to all logo `<img>` elements to
  eliminate CLS (iteration 39)

## M5 Completion Summary

All `M5` issues code-complete as of 2026-05-12:

- `LUA-34` SEO metadata — complete meta block, favicon, OG, Twitter Card
- `LUA-35` Analytics events — `trackFormEvent` for B2B form conversion paths
- `LUA-36` Responsive visual QA — overflow-x:clip, min-w-0 proof bar containers
- `LUA-37` Accessibility QA — reduced-motion, keyboard nav dropdown, focus-on-open
- `LUA-38` Performance pass — font preconnect, LCP preload, logo CLS elimination

## M6 Completion Summary

All `M6` research issues completed as of 2026-05-12:

- `LUA-39` Bling inventory sync — deferred; not required for MVP; Nuvemshop handles
  inventory; revisit only if real-time stock badges or B2B lead-to-order automation is
  requested (see `docs/project/research/lua-39-bling-inventory-sync-recommendation.md`)
- `LUA-40` Instagram video display — deferred; viable as v1.1 section using Basic
  Display API + Vercel Edge Function proxy; not in v1 design
  (see `docs/project/research/lua-40-instagram-display-recommendation.md`)
- `LUA-41` Spline and Hyperframe — recommended against for v1; both add runtime weight
  and reliability risk; existing CSS transitions are sufficient
  (see `docs/project/research/lua-41-spline-hyperframe-recommendation.md`)
- `LUA-42` v1 animation scope decision — CSS-only, no third-party animation runtime;
  hero carousel + CSS hover transitions + reduced-motion guard cover v1 needs
  (see `docs/project/research/lua-42-v1-animation-scope-decision.md`)

## Project Status

Milestones `M0` through `M6` are **verified**. New post-launch milestones were added on
2026-05-13:

- `M7: Design Polish And Navigation Corrections` — verified backlog for glass, sticky header,
  footer/social fixes, owned contact/about routes, public CTA semantics, and B2B teaser
  one-CTA polish. `LUA-43` through `LUA-48` and `LUA-59` are complete locally.
- `M8: Search And Command Experience` — planned backlog; `LUA-50` through `LUA-52` are
  complete locally, while the working search implementation waits on the source/ranking
  specification in `LUA-49`.
- `M9: B2B Seller Access` — planned backlog for owned `/b2b`, registration handoff, and
  registered-seller email SSO. `LUA-55` is complete locally with a presentational login
  gate plus registration request path; the real auth/access model remains in `LUA-54`.

## Post-Launch Candidates (Not In Active Scope)

- Scroll-driven section reveals (`IntersectionObserver`, no dependency, low effort)
- Instagram feed section (Basic Display API, requires client OAuth + token rotation)
- 3D rotor showcase (Spline self-hosted, revisit after performance budget confirmed)
- Bling inventory sync (requires client to provision Bling OAuth credentials)
