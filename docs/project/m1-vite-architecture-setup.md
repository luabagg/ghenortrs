# M1: Vite Architecture Setup

Status: ready
Target: 2026-05-08
Depends on: `M0: Discovery And Project Definition`
Linear milestone: `M1: Vite Architecture Setup`

## Goal

Build the local frontend foundation that `M2` can implement against without revisiting app setup decisions.

## Linear Issues

- `LUA-8` Architecture setup: install and configure Vite React TypeScript
- `LUA-9` Configure Tailwind CSS and GHENO design tokens
- `LUA-10` Install and customize shadcn/ui
- `LUA-11` Add Dot Matrix loaders for real loading states
- `LUA-12` Configure routing and page shell
- `LUA-13` Set up linting, formatting, typecheck, and build commands
- `LUA-14` Prepare deployment and environment baseline

## Deliverables

- Running Vite + React + TypeScript app
- Tailwind configured with GHENO token wiring
- Base component primitives customized away from default shadcn styling
- Route shell for `/`, `/componentes`, `/b2b`, and not-found
- Working lint, typecheck, and production build commands
- Deployment/env assumptions documented

## Included Scope

- Tooling and project structure
- Token integration
- Shared layout shell
- Quality baseline
- Loader installation for real waiting states
- Loader usage rules for catalog, media, and future B2B submission states

## Excluded Scope

- Full landing page sections
- B2B submit backend
- Nuvemshop CTA wiring
- Analytics, SEO, and launch QA

## Exit Criteria

- The app runs locally.
- TypeScript, lint, and build pass.
- Tailwind compiles with the GHENO design system.
- Shared routes and layout shell exist without runtime errors.
- Default component styling has been pushed toward the GHENO visual system.

## Recommended Order

1. Complete `LUA-8` app foundation.
2. Complete `LUA-9` Tailwind and token setup.
3. Complete `LUA-13` quality commands.
4. Complete `LUA-12` routing and page shell.
5. Complete `LUA-10` component primitive setup.
6. Complete `LUA-11` loader installation rules.
7. Complete `LUA-14` deployment baseline.

## Risks

- Installing component primitives before token setup will create restyling churn.
- Building landing sections before the route shell exists will cause duplicate layout work.
- Treating shadcn defaults as final will violate the design direction from `M0`.

## Supporting Docs

- [loading-baseline.md](/Users/luabagg/development/personal/ghenortrs-gnhf-worktrees/you-need-to-implemen-9db8a2/docs/project/loading-baseline.md)
- [deployment-baseline.md](/Users/luabagg/development/personal/ghenortrs-gnhf-worktrees/you-need-to-implemen-9db8a2/docs/project/deployment-baseline.md)
