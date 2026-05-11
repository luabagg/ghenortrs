# Current Focus

Last synced: 2026-05-11

## Active Milestone

`M1: Vite Architecture Setup`

## Objective

Close the frontend-foundation milestone with a verified local baseline while backfilling the remaining discovery artifacts that still gate `M2`.

## Next Tasks

1. Keep [DESIGN.md](/Users/luabagg/development/personal/ghenortrs/DESIGN.md) as the authoritative visual system for the implemented shell and primitives.
2. Treat the current Vite/React/Tailwind/shadcn foundation as verified and avoid reopening setup decisions unless a defect is found.
3. Treat `LUA-15` and `LUA-18` as locally documented; the remaining discovery blocker is `LUA-17`'s Portuguese landing-page content architecture.
4. Use [m1-vite-architecture-setup.md](/Users/luabagg/development/personal/ghenortrs-gnhf-worktrees/you-need-to-implemen-9db8a2/docs/project/m1-vite-architecture-setup.md) as the implementation contract for any new UI work.
5. Do not advance `M2` beyond shell-level experiments until the missing `M0` docs are restored locally.

## Immediate Success Criteria

- The M1 foundation stays green on `test`, `lint`, `typecheck`, `build`, and `format:check`.
- Discovery gaps are explicit instead of being hidden by the already-implemented shell.
- The current CTA destination contract and storefront audit are documented locally, including the fallback rules for unpublished categories and broken category links.
- `M2` has a clear dependency boundary: use the current app foundation, but wait for finalized content/store docs before full landing-page buildout.

## Not In Scope Yet

- Full landing page implementation
- B2B form implementation
- Analytics, SEO, and performance tuning
- Spline, Hyperframe, Instagram, or Bling research

## Next Milestone After This

`M2: Landing Page MVP`

Use [m1-vite-architecture-setup.md](/Users/luabagg/development/personal/ghenortrs/docs/project/m1-vite-architecture-setup.md) as the verified technical baseline until a dedicated `M2` implementation brief is written.
