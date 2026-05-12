# GHENO Milestones

Source: Linear project `Gheno rotors`
Last synced: 2026-05-11

This file is the local milestone index for execution. Use it as the default planning source unless it is explicitly stale.

## Milestones

| Milestone                                 | Status     | Target     | Goal                                                                                                                             |
| ----------------------------------------- | ---------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `M0: Discovery And Project Definition`    | `verified` | 2026-05-01 | Audit the store, references, categories, commerce handoff, and Portuguese content architecture.                                  |
| `M1: Vite Architecture Setup`             | `verified` | 2026-05-08 | Create the frontend foundation: Vite, React, TypeScript, Tailwind, shadcn/ui, routing, quality tooling, and deployment baseline. |
| `M2: Landing Page MVP`                    | `verified` | 2026-05-15 | Build the responsive marketing experience: hero, proof bar, component showcase, technology proof, B2B teaser, CTA, and footer.   |
| `M3: B2B Lead Capture`                    | `verified` | 2026-05-22 | Add the B2B form, validation states, Resend delivery, and abuse protection.                                                      |
| `M4: Nuvemshop Commerce Bridge`           | `verified` | 2026-05-29 | Wire commerce CTAs to Nuvemshop and track outbound commerce intent.                                                              |
| `M5: SEO, Analytics, Performance, And QA` | `active`   | 2026-06-05 | Prepare launch metadata, analytics, accessibility, responsiveness, and performance.                                              |
| `M6: Deferred Integration Research`       | `planned`  | 2026-06-12 | Research post-MVP integrations and advanced animation decisions.                                                                 |

## Dependency Order

1. `M0` must establish the visual system, content architecture, and store destination map.
2. `M1` builds the technical foundation needed for implementation.
3. `M2` builds the landing page sections on top of that foundation.
4. `M3` adds the B2B capture flow.
5. `M4` connects store destinations and commerce tracking.
6. `M5` hardens the launch candidate.
7. `M6` stays out of the MVP critical path.

## Status Notes

- `M1` is already implemented in the local codebase and was re-verified on `2026-05-11` with `npm run test`, `npm run lint`, `npm run typecheck`, `npm run build`, and `npm run format:check`.
- `M2` is now unblocked locally because the missing `LUA-17` content-architecture artifact has been restored in `docs/project/landing-page-content-architecture.md`.
- The first `M2` homepage slice is implemented: Portuguese hero, proof bar, live catalog CTA, B2B secondary path, and regression coverage.
- `LUA-15` is now documented locally in `docs/project/storefront-audit.md`, including the live URL baseline, published brake-pad inventory shape, and the broken `Pastilhas de freio` category link.
- `LUA-18` is now documented locally in `docs/project/store-destination-map.md`, including the current fallback behavior for unpublished store categories.
- `LUA-17` is now documented locally in `docs/project/landing-page-content-architecture.md`, including the Portuguese homepage narrative, section order, and CTA hierarchy.
- Linear ticket comments were synced on `2026-05-12` after the correct `Luabagg` workspace/project became visible.

## Detailed Files

- [current-focus.md](./current-focus.md)
- [timeline.md](./timeline.md)
- [m0-discovery-and-project-definition.md](./m0-discovery-and-project-definition.md)
- [m1-vite-architecture-setup.md](./m1-vite-architecture-setup.md)
- [m2-landing-page-mvp.md](./m2-landing-page-mvp.md)
- [m3-b2b-lead-capture.md](./m3-b2b-lead-capture.md)
- [m4-nuvemshop-commerce-bridge.md](./m4-nuvemshop-commerce-bridge.md)
- [m5-seo-analytics-performance-and-qa.md](./m5-seo-analytics-performance-and-qa.md)
- [m6-deferred-integration-research.md](./m6-deferred-integration-research.md)
- [landing-page-content-architecture.md](./landing-page-content-architecture.md)
- [storefront-audit.md](./storefront-audit.md)
- [store-destination-map.md](./store-destination-map.md)
