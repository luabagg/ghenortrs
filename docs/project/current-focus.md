# Current Focus

Last synced: 2026-05-11

## Active Milestone

`M2: Landing Page MVP`

## Objective

Use the verified `M0` discovery layer and `M1` frontend baseline to start building the real landing-page experience.

## Next Tasks

1. Keep [DESIGN.md](../../DESIGN.md) as the authoritative visual system for the landing page.
2. Use [landing-page-content-architecture.md](./landing-page-content-architecture.md) as the source of truth for section order, Portuguese messaging, and CTA hierarchy.
3. Treat the current Vite/React/Tailwind/shadcn shell as verified and avoid reopening setup decisions unless a defect is found.
4. Keep [store-destination-map.md](./store-destination-map.md) tied to any CTA copy or routing work so category promises stay honest.
5. Continue `M2` by expanding the homepage beyond the completed hero/proof-bar slice into the remaining documented sections.

## Recent Progress

- The first `M2` homepage slice is implemented: Portuguese hero, proof bar, live catalog CTA, B2B secondary path, and regression coverage.
- Linear issue updates are still pending because the currently connected Linear workspace does not expose the `LUA-*` issues.

## Immediate Success Criteria

- The M2 homepage implementation follows the documented section order instead of inventing structure ad hoc.
- Consumer and commercial CTA copy stays aligned with the verified store-routing contract.
- The M1 foundation stays green on `test`, `lint`, `typecheck`, `build`, and `format:check` while homepage work begins.
- New landing-page implementation work uses the existing shell and primitives rather than reopening tooling or token decisions.

## Not In Scope Yet

- Full landing page implementation
- B2B form implementation
- Analytics, SEO, and performance tuning
- Spline, Hyperframe, Instagram, or Bling research

## Next Milestone After This

`M3: B2B Lead Capture`

Use [m1-vite-architecture-setup.md](./m1-vite-architecture-setup.md) as the verified technical baseline while implementing `M2`.
