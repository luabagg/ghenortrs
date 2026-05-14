# GHENO Milestones

Source: Linear project `Gheno rotors`
Last synced: 2026-05-13

This file is the local milestone index for execution. Use it as the default planning source unless it is explicitly stale.

## Milestones

| Milestone                                 | Status     | Target     | Goal                                                                                                                             |
| ----------------------------------------- | ---------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `M0: Discovery And Project Definition`    | `verified` | 2026-05-01 | Audit the store, references, categories, commerce handoff, and Portuguese content architecture.                                  |
| `M1: Vite Architecture Setup`             | `verified` | 2026-05-08 | Create the frontend foundation: Vite, React, TypeScript, Tailwind, shadcn/ui, routing, quality tooling, and deployment baseline. |
| `M2: Landing Page MVP`                    | `verified` | 2026-05-15 | Build the responsive marketing experience: hero, proof bar, component showcase, technology proof, B2B teaser, CTA, and footer.   |
| `M3: B2B Lead Capture`                    | `verified` | 2026-05-22 | Add the B2B form, validation states, Resend delivery, and abuse protection.                                                      |
| `M4: Nuvemshop Commerce Bridge`           | `verified` | 2026-05-29 | Wire commerce CTAs to Nuvemshop and track outbound commerce intent.                                                              |
| `M5: SEO, Analytics, Performance, And QA` | `verified` | 2026-06-05 | Prepare launch metadata, analytics, accessibility, responsiveness, and performance.                                              |
| `M6: Deferred Integration Research`       | `verified` | 2026-06-12 | Research post-MVP integrations and advanced animation decisions.                                                                 |
| `M7: Design Polish And Navigation Corrections` | `verified` | 2026-06-19 | Fix post-launch glass, header, footer, public CTA, owned content route, operational highlight, and carousel overlay issues. |
| `M8: Search And Command Experience`       | `planned`  | 2026-06-26 | Specify and build the search/command experience once content sources, ranking, and algorithm decisions are approved.             |
| `M9: B2B Seller Access`                   | `planned`  | 2026-07-10 | Build the owned `/b2b` access path, seller registration handoff, email SSO, and protected seller shell.                         |

## Dependency Order

1. `M0` must establish the visual system, content architecture, and store destination map.
2. `M1` builds the technical foundation needed for implementation.
3. `M2` builds the landing page sections on top of that foundation.
4. `M3` adds the B2B capture flow.
5. `M4` connects store destinations and commerce tracking.
6. `M5` hardens the launch candidate.
7. `M6` stays out of the MVP critical path.
8. `M7` fixes post-launch visual, navigation, and public content issues on the verified baseline.
9. `M8` specifies search before implementing command/search behavior.
10. `M9` builds authenticated B2B seller access after the public B2B route boundary is clear.

## Status Notes

- All planned milestones `M0` through `M6` are verified locally and synced to Linear as of `2026-05-13`.
- `M7` design-polish issues are complete locally as of 2026-05-13; `M8` and `M9` retain planned specification/auth work.
- `M2` landing page implementation is complete: responsive navigation, hero, proof bar, component showcase, technology proof, competition proof, B2B teaser, final CTA, and footer.
- `M3` B2B lead capture is complete: form UI, validation states, Resend Edge Function delivery, and basic abuse protection.
- `M4` commerce bridge is complete: CTA destinations, outbound commerce tracking, and checkout boundary documentation.
- `M5` launch hardening is complete: SEO metadata, analytics events, responsive QA, accessibility QA, and performance pass.
- `M6` deferred research is complete: Bling, Instagram, Spline/Hyperframe, and v1 animation-scope recommendations are documented.
- `M7` added in Linear on 2026-05-13 with issues `LUA-43` through `LUA-48`, plus `LUA-59` for B2B teaser polish and one-CTA flow; all are complete locally.
- `M8` added in Linear on 2026-05-13 with issues `LUA-49` through `LUA-53`; `LUA-50` through `LUA-52` are complete locally, and `LUA-53` is blocked by the search specification in `LUA-49`.
- `M9` added in Linear on 2026-05-13 with issues `LUA-54` through `LUA-58`; `LUA-55` is complete locally, while auth and protected-shell work are blocked by access model and registration handoff decisions. `LUA-54` also defines where already-registered sellers enter without adding a competing teaser CTA.

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
- [m7-design-polish-and-navigation-corrections.md](./m7-design-polish-and-navigation-corrections.md)
- [m8-search-and-command-experience.md](./m8-search-and-command-experience.md)
- [m9-b2b-seller-access.md](./m9-b2b-seller-access.md)
- [landing-page-content-architecture.md](./landing-page-content-architecture.md)
- [storefront-audit.md](./storefront-audit.md)
- [store-destination-map.md](./store-destination-map.md)
