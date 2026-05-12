# Current Focus

Last synced: 2026-05-12

## Active Milestone

`M5: SEO, Analytics, Performance, And QA`

## Objective

Harden the launch candidate with metadata, analytics, accessibility, responsive QA, and
performance validation. `M4` Nuvemshop Commerce Bridge is verified and provides outbound
click tracking. `M3` B2B Lead Capture is verified and provides the lead path. `M2` landing
page is verified and provides the marketing surface.

## M4 Completion Summary

All `M4` issues code-complete as of 2026-05-12:

- `LUA-31` Commerce CTA wiring — all CTAs verified against
  [store-destination-map.md](./store-destination-map.md); Pastilhas → `/produtos/`,
  Cubos/Aros/Rotores → `/contato/`, generic store CTAs → `/produtos/`
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

Remaining:

- `LUA-38` Performance pass

## Immediate Success Criteria

- `LUA-38`: Mobile Lighthouse performance target is 85 or higher.
- `npm run test`, `npm run lint`, `npm run typecheck`, `npm run build`, and
  `npm run format:check` stay green.

## Not In Scope Yet

- Nuvemshop native cart or checkout (M4+ scope)
- Spline, Hyperframe, Instagram, or Bling research (M6)

## Next Milestone After This

`M6: Deferred Integration Research`
