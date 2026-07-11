# Quality Audit — 2026-07-11

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

## Verified Healthy

- `/`, `/componentes`, `/b2b`, `/sobre`, `/contato`, and the not-found view render without browser console or page errors.
- No horizontal overflow was detected on audited desktop or mobile viewports.
- Production TypeScript/Vite build, ESLint, and Vitest pass.

## Open: Product Specification Required

These are visible incomplete behaviors, but implementing them here would require fake or fragile behavior and would violate the project rules.

### Search surfaces are navigation-only

- Desktop and mobile surfaces visually promise search, but current implementation only exposes fixed navigation links.
- Blocker: `M8/LUA-49` still lacks the approved content-source and ranking specification.
- Required next decision: define indexed content, matching/ranking, empty state, and route behavior; then implement `LUA-53` as real search or relabel/remove the search affordances.

### B2B access button is presentational

- `/b2b` accepts an email and shows a “Continuar” button with no authentication action.
- Blocker: `M9/LUA-54` still lacks the real access model, registration handoff, and seller SSO contract.
- Required next decision: approve identity provider, account eligibility, session model, error states, and protected-route boundary before wiring the control.

## Verification Commands

```bash
pnpm test -- --run
pnpm lint
pnpm build
```

Runtime verification used Playwright Chromium against `pnpm preview --host 127.0.0.1` for all public routes at both audited viewport sizes.
