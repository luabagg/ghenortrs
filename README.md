# ghenortrs

GHENO's frontend foundation is a Vite + React + TypeScript app for the first implementation milestone.

## Commands

- `corepack enable` ensures the pinned pnpm version is available.
- `pnpm install` installs dependencies from `pnpm-lock.yaml`.
- `pnpm dev` starts the local app.
- `pnpm test` runs Vitest.
- `pnpm lint` runs ESLint.
- `pnpm typecheck` runs the TypeScript build graph without emitting app assets.
- `pnpm build` creates the production bundle in `dist/`.
- `pnpm preview` serves the built bundle locally.

pnpm is pinned in `package.json`. New dependency resolution is guarded by
`minimumReleaseAge: 10080` in `pnpm-workspace.yaml`, which requires package
versions to be at least seven days old before pnpm selects them.

## Environment

Copy [.env.example](.env.example) to `.env.local` when you need local
overrides. The current app does not consume env vars yet; the file exists to
lock the deployment contract for later milestones.

## Deployment Baseline

The `M1` deployment assumptions live in
[docs/project/deployment-baseline.md](docs/project/deployment-baseline.md). The
app is currently a static SPA bundle and will require host rewrites to
`index.html` for direct navigation to client routes.
