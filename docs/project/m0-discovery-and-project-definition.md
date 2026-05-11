# M0: Discovery And Project Definition

Status: active
Target: 2026-05-01
Depends on: none
Linear milestone: `M0: Discovery And Project Definition`

## Goal

Lock the inputs that implementation depends on: GHENO visual rules, landing-page story structure, current store boundaries, and CTA destination mapping.

## Downstream Status

`M1` has already been implemented locally ahead of full `M0` closure. `M0` still owns the remaining store audit and content architecture artifacts that must exist before `M2` can move beyond the verified shell.

## Linear Issues

- `LUA-15` Audit current Nuvemshop storefront
- `LUA-16` Extract GHENO visual system from references
- `LUA-17` Define Portuguese landing page content architecture
- `LUA-18` Map product and category destinations

## Deliverables

- `DESIGN.md` as the visual system source of truth
- Store audit notes covering current categories, product naming, key links, and checkout boundary
- Landing page section outline with CTA hierarchy
- Destination map for `Pastilhas`, `Cubos`, `Aros`, and `Rotores`

## Included Scope

- Reference analysis
- Copy and section planning
- Store CTA mapping
- Documentation that defines the handoff into implementation

## Excluded Scope

- React/Vite implementation work
- Route setup
- Component library installation
- B2B form build
- Analytics and SEO implementation

## Exit Criteria

- The visual system can guide implementation without needing to reopen the references.
- Primary and secondary CTAs are named and placed.
- Store destinations are known or have explicit fallbacks.
- The landing page/store boundary is documented.

## Recommended Order

1. Finalize visual rules from `LUA-16`.
2. Audit the current storefront from `LUA-15`.
3. Define section architecture from `LUA-17`.
4. Refresh the `LUA-18` destination map only if the live store taxonomy changes.
5. Freeze the discovery outputs and move to `M1`.

## Risks

- Starting implementation before destination mapping exists will create CTA rework.
- Starting component work before the content hierarchy is locked will cause layout churn.
- Letting discovery sprawl into implementation will blur milestone boundaries.

## Local Outputs

- [store-destination-map.md](/Users/luabagg/development/personal/ghenortrs-gnhf-worktrees/you-need-to-implemen-9db8a2/docs/project/store-destination-map.md) captures the current Nuvemshop CTA routing contract and fallbacks for unpublished categories.
