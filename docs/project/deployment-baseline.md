# Deployment Baseline

Last synced: 2026-05-11
Milestone: `M1: Vite Architecture Setup`
Linear issue: `LUA-14`

## Goal

Define the minimum deployment contract for the Vite app so later milestones can add B2B delivery, commerce links, and launch instrumentation without revisiting the hosting baseline.

## Current Baseline

- Output is a static Vite bundle produced by `npm run build`.
- The app is a client-side SPA and needs rewrite-to-`/index.html` behavior for direct requests to `/componentes`, `/b2b`, and future nested routes.
- The runtime contract is browser-only right now; there is no server code, no secrets, and no backend dependency in `M1`.
- Any environment value exposed to the browser must use the `VITE_` prefix.

## Environment Contract

Use [.env.example](../../.env.example) as the source of truth for local setup.

| Variable                 | Purpose                                                                | First consumer |
| ------------------------ | ---------------------------------------------------------------------- | -------------- |
| `VITE_SITE_URL`          | Canonical site origin for metadata and outbound link generation.       | `M5`           |
| `VITE_GHENO_STORE_URL`   | Default Nuvemshop/storefront destination when commerce CTAs are wired. | `M4`           |
| `VITE_B2B_CONTACT_EMAIL` | Baseline commercial contact address before form delivery is added.     | `M3`           |

## Deploy Assumptions

- Prefer static hosting that can serve the `dist/` directory and support SPA rewrites.
- Keep production and preview builds on the same `npm run build` command so the quality gate stays identical across environments.
- Do not introduce non-`VITE_` client configuration until a server/runtime is added in a later milestone.
- If a host-specific config is added later, it should only encode rewrites, cache headers, and the build output path unless a milestone explicitly adds more.

## Validation

1. `npm run build` produces a deployable `dist/` directory.
2. `npm run preview` serves the same built bundle locally for smoke checks.
3. Direct navigation to known routes must be backed by host rewrites once a deployment target is chosen.
