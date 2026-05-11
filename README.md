# ghenortrs

GHENO's frontend foundation is a Vite + React + TypeScript app for the first implementation milestone.

## Commands

- `npm run dev` starts the local app.
- `npm run test` runs Vitest.
- `npm run lint` runs ESLint.
- `npm run typecheck` runs the TypeScript build graph without emitting app assets.
- `npm run build` creates the production bundle in `dist/`.
- `npm run preview` serves the built bundle locally.

## Environment

Copy [.env.example](/Users/luabagg/development/personal/ghenortrs-gnhf-worktrees/you-need-to-implemen-9db8a2/.env.example) to `.env.local` when you need local overrides. The current app does not consume env vars yet; the file exists to lock the deployment contract for later milestones.

## Deployment Baseline

The `M1` deployment assumptions live in [docs/project/deployment-baseline.md](/Users/luabagg/development/personal/ghenortrs-gnhf-worktrees/you-need-to-implemen-9db8a2/docs/project/deployment-baseline.md). The app is currently a static SPA bundle and will require host rewrites to `index.html` for direct navigation to client routes.
