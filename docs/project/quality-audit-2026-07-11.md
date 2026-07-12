# Quality Audit — 2026-07-11

> Historical audit. The search limitation below was superseded on 2026-07-12 by [search-source-ranking-spec.md](./search-source-ranking-spec.md) and the working Nuvemshop index.

Scope: public routes at desktop `1440×900` and mobile `390×844`, navigation dialogs, document headings, build, lint, and component tests.

## Fixed

### B2B route exposed two `h1` elements

- Reproduction: load `/b2b`; Playwright found two level-one headings.
- Root cause: reusable `PageIntro` always rendered `h1`, including the registration subsection below the page hero.
- Resolution: `PageIntro` now accepts `headingLevel={1 | 2}`; B2B registration intro uses `h2` while page hero remains the sole `h1`.
- Regression evidence: `src/app.test.tsx` asserts one `h1` and the registration heading at level two.

### Keyboard-shortcuts dialog ignored its advertised Escape action

- Reproduction: open desktop command panel, choose “Ver todos atalhos do teclado”, press Escape; dialog remained open.
- Root cause: document-level Escape handling only closed the command panel state, not the separate shortcuts-dialog state.
- Resolution: dialog owns its Escape listener, focuses its visible close control on mount, and restores focus to the search trigger on close. `Ctrl/⌘+K` no longer opens a second command layer behind the dialog.
- Regression evidence: `src/app.test.tsx` covers initial focus, Escape close, and focus restoration.

### Misleading search affordances

- Reproduction: desktop and mobile surfaces visually promised search but only exposed fixed links.
- Root cause: M8 shortcut infrastructure was presented as a finished search control before content-source and ranking decisions existed.
- Resolution: desktop control and shortcut copy now say “Navegação rápida”; the inert mobile search prompt and false compatibility-search action were removed. Real search remains planned under `M8/LUA-49` and `LUA-53`.

### Presentational B2B login and unsupported promises

- Reproduction: `/b2b` accepted an email through a “Continuar” button with no action and promised unverified prices, margins, policies, support, and response timing.
- Root cause: planned M9 authentication and commercial details were represented before requirements or source evidence existed.
- Resolution: removed the inert login gate and unsupported promises. `/b2b` now offers only the working registration-request form. Authentication remains planned under `M9/LUA-54` and `LUA-57`.

### Generated route documents had empty bodies without JavaScript

- Reproduction: production route HTML contained complete metadata but only an empty `<div id="root"></div>` body.
- Root cause: route generation transformed the document head without publishing route content for non-JavaScript crawlers and agents.
- Resolution: the typed SEO registry now supplies a factual route heading and primary links. Build generation escapes and inserts semantic `main`, `h1`, description, and navigation content for every canonical route plus the noindex 404 page.
- Regression evidence: `build/route-pages.test.ts` checks every generated route for non-empty static content, and production artifact inspection verifies one static body and heading per document.

## Verified Healthy

- `/`, `/componentes`, `/b2b`, `/sobre`, `/contato`, and the not-found view render without browser console or page errors.
- No horizontal overflow was detected on audited desktop or mobile viewports.
- Production TypeScript/Vite build, ESLint, and Vitest pass.
- Every generated route contains meaningful static content before JavaScript runs.

## Verification Commands

```bash
pnpm test -- --run
pnpm lint
pnpm build
```

Runtime verification used Playwright Chromium against `pnpm preview --host 127.0.0.1` for all public routes at both audited viewport sizes.
