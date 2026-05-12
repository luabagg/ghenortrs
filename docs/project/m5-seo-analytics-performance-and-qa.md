# M5: SEO, Analytics, Performance, And QA

Status: active
Target: 2026-06-05
Depends on: `M2: Landing Page MVP`, `M3: B2B Lead Capture`, `M4: Nuvemshop Commerce Bridge`
Linear milestone: `M5: SEO, Analytics, Performance, And QA`

## Goal

Harden the launch candidate with metadata, analytics, accessibility, responsive QA, and performance validation.

## Linear Issues

- `LUA-34` Add SEO metadata and social preview assets — **Done** (2026-05-12, iteration 34)
- `LUA-35` Add analytics events for key conversion paths — **Done** (2026-05-12, iteration 37)
- `LUA-36` Run responsive visual QA — **Done** (2026-05-12, iteration 38)
- `LUA-37` Run accessibility QA — **Done** (2026-05-12, iteration 38)
- `LUA-38` Run performance pass

## Deliverables

- Portuguese SEO metadata
- Canonical and social preview metadata
- Conversion analytics events
- Responsive visual QA findings and fixes
- Accessibility QA findings and fixes
- Mobile performance pass

## Included Scope

- Metadata
- Analytics event wiring
- Responsive layout validation
- Keyboard and focus validation
- Color contrast checks
- Reduced-motion checks
- Bundle and media performance review

## Excluded Scope

- New landing-page sections
- New B2B product workflows
- Deferred animation research
- Inventory or platform integrations

## Exit Criteria

- Metadata is complete for the landing page.
- Key conversion events are recorded without blocking interaction.
- No mobile horizontal overflow or incoherent text overlap remains.
- Main navigation and form flows are keyboard usable.
- Non-essential motion respects reduced-motion settings.
- Mobile Lighthouse performance target is 85 or higher.

## Recommended Order

1. Add metadata and social preview strategy.
2. Add analytics events.
3. Run responsive visual QA.
4. Run accessibility QA.
5. Run performance pass.
6. Re-run the full verification command set.

## Risks

- Analytics failures must not block user actions.
- Heavy media or animation can compromise mobile performance.
- QA fixes should preserve the established M2/M3 scope instead of adding new features.
