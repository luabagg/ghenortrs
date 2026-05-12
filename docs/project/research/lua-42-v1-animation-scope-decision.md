# LUA-42: v1 Animation Scope Decision

Research completed: 2026-05-12
Status: **Decision made — CSS-only, no third-party runtime**

## Decision

v1 animation scope is limited to CSS transitions and the existing React `useState`/`useEffect`
hero carousel. No Spline, Hyperframe, Framer Motion, or other animation runtime will be added
in the MVP.

## Rationale

The current implementation achieves the required motion with zero additional dependencies:

| Motion                                            | Technique                                                          | Status  |
| ------------------------------------------------- | ------------------------------------------------------------------ | ------- |
| Hero background crossfade (3 slides, 6s interval) | CSS `transition-opacity duration-1000` + React `useEffect`         | Shipped |
| Nav dropdown open/close                           | Tailwind `group-hover:visible group-hover:opacity-100`             | Shipped |
| Keyboard-accessible nav dropdown                  | `group-focus-within:visible group-focus-within:opacity-100`        | Shipped |
| Product card hover lift                           | Tailwind `hover:` transition                                       | Shipped |
| Mobile menu overlay                               | CSS `translate-x` with Tailwind transition                         | Shipped |
| Anchor scroll                                     | `scroll-behavior: smooth` on `:root`                               | Shipped |
| Reduced-motion override                           | `@media (prefers-reduced-motion: reduce)` disables all transitions | Shipped |

Adding Spline or Hyperframe in v1 would increase the JS bundle from ~95 KB gzip and introduce
third-party network and maintenance dependencies without a proportional UX benefit.
See [lua-41-spline-hyperframe-recommendation.md](./lua-41-spline-hyperframe-recommendation.md).

## Reduced-Motion Requirements

All animations in v1 are CSS transitions disabled by the global `prefers-reduced-motion`
media query in `styles.css`. The hero carousel has an additional JS guard:

```ts
if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
```

Any future animation added to the codebase must either:

1. Use only CSS transitions (automatically covered by the global media query), or
2. Check `prefers-reduced-motion` via `window.matchMedia` before starting a JS animation

## Performance Budget

Current build: **318 KB JS / 42 KB CSS uncompressed** (95 KB JS / 7 KB CSS gzip).

Animation additions that push gzip JS beyond **120 KB** require explicit sign-off. This
covers the typical 25–30 KB gzip cost of Framer Motion and leaves no room for Spline.

## Post-v1 Animation Candidates

These are explicitly deferred and not in scope until post-MVP:

1. **Scroll-driven section reveals** — `IntersectionObserver` fade-in on section entry
   (low cost, no dependency, good candidate for v1.1)
2. **Product card 3D rotor** — Spline self-hosted scene on the /componentes Rotores card
   (medium cost, revisit after performance budget confirmed)
3. **Scroll parallax on hero** — Subtle `transform: translateY` on hero text
   (requires perf measurement on mid-range Android before enabling)
