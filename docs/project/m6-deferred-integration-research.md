# M6: Deferred Integration Research

Status: verified
Target: 2026-06-12
Depends on: `M5: SEO, Analytics, Performance, And QA`
Linear milestone: `M6: Deferred Integration Research`

## Goal

Research post-MVP integrations and advanced motion choices without blocking the launch path.

## Linear Issues

- `LUA-39` Research Bling inventory sync
- `LUA-40` Research Instagram video display
- `LUA-41` Research Spline and Hyperframe for animated cards
- `LUA-42` Decide v1 animation scope

## Deliverables

- Bling inventory sync recommendation —
  [lua-39-bling-inventory-sync-recommendation.md](./research/lua-39-bling-inventory-sync-recommendation.md)
- Instagram display recommendation —
  [lua-40-instagram-display-recommendation.md](./research/lua-40-instagram-display-recommendation.md)
- Spline/Hyperframe recommendation —
  [lua-41-spline-hyperframe-recommendation.md](./research/lua-41-spline-hyperframe-recommendation.md)
- v1 animation scope decision —
  [lua-42-v1-animation-scope-decision.md](./research/lua-42-v1-animation-scope-decision.md)

## Included Scope

- Integration feasibility research
- API/authentication constraints
- Performance and reliability tradeoffs
- Maintenance and authoring workflow notes
- Reduced-motion requirements for any proposed animation

## Excluded Scope

- Production integration implementation
- Inventory source-of-truth migration
- Heavy animation implementation
- Launch-blocking scope changes

## Exit Criteria

- Each research topic has a written recommendation.
- Performance and maintenance tradeoffs are explicit.
- MVP remains independent from Bling, Instagram, Spline, and Hyperframe unless a later decision changes scope.
- Animation scope includes reduced-motion behavior.

## Recommended Order

1. Research Bling inventory sync.
2. Research Instagram display options.
3. Research Spline/Hyperframe for animated product storytelling.
4. Decide the v1 animation scope from the findings.

## Risks

- Pulling research into active implementation can destabilize launch scope.
- Third-party embed or animation choices can hurt reliability and mobile performance.
- Inventory sync decisions need operational ownership, not just technical feasibility.
