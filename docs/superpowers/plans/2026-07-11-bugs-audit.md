# Bug Audit And Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix reproducible navigation-dialog and document-heading defects, then preserve the audit evidence and unsupported blockers.

**Architecture:** Keep fixes inside existing React components. Make `PageIntro` accept an explicit semantic heading level, and make the keyboard-shortcuts dialog own focus, Escape handling, and focus restoration. Record defects that cannot be solved without the missing M8/M9 specifications instead of adding fake behavior.

**Tech Stack:** React 19, React Router 7, TypeScript 6, Vitest, Testing Library, Playwright.

## Global Constraints

- No hacks, shims, fake search, fake authentication, or invented business facts.
- Follow `DESIGN.md`; do not introduce design tokens.
- Preserve existing routes, commerce destinations, tracking, and B2B form behavior.

---

### Task 1: Correct B2B heading hierarchy

**Files:**

- Modify: `src/components/landing/section-cards.tsx`
- Modify: `src/components/pages/b2b-page-sections.tsx`
- Test: `src/app.test.tsx`

**Interfaces:**

- Consumes: existing `PageIntro` title string.
- Produces: optional `headingLevel?: 1 | 2`, defaulting to `1`.

- [x] Add a B2B route test asserting one `h1` and an `h2` for the registration subsection.
- [x] Run `pnpm test -- --run` and confirm the new assertion fails.
- [x] Render the `PageIntro` title through a typed `h1`/`h2` component and pass `headingLevel={2}` in `B2BLeadIntroSection`.
- [x] Run `pnpm test -- --run` and confirm all tests pass.

### Task 2: Repair shortcuts-dialog keyboard behavior

**Files:**

- Modify: `src/components/navigation/app-header.tsx`
- Test: `src/app.test.tsx`

**Interfaces:**

- Consumes: existing search trigger and `KeyboardShortcutsDialog` close callback.
- Produces: Escape closes the active shortcuts dialog; opening focuses its close control; closing restores focus to the search trigger.

- [x] Add tests for Escape close and focus restoration.
- [x] Run `pnpm test -- --run` and confirm they fail.
- [x] Add trigger/dialog refs and dialog-scoped focus/Escape lifecycle without global mutable state.
- [x] Run `pnpm test -- --run` and confirm all tests pass.

### Task 3: Document audit and verify production behavior

**Files:**

- Create: `docs/project/quality-audit-2026-07-11.md`

**Interfaces:**

- Consumes: source inspection, baseline checks, and Playwright route audit.
- Produces: durable fixed/open issue register with evidence and blockers.

- [x] Document each reproduced defect, root cause, resolution, verification, and unsupported M8/M9 blocker.
- [x] Run `pnpm test -- --run`, `pnpm lint`, `pnpm build`, and Playwright route/overflow/console checks.
- [x] Commit the independently reviewable work.

### Task 4: Remove misleading incomplete features and prerender route content

**Files:**

- Modify: `src/components/navigation/app-header.tsx`
- Modify: `src/components/navigation/mobile-menu-overlay.tsx`
- Modify: `src/components/landing/b2b-teaser-section.tsx`
- Modify: `src/components/pages/b2b-page-sections.tsx`
- Modify: `src/seo/seo-config.ts`
- Modify: `build/route-pages.ts`
- Modify: `src/app.test.tsx`
- Modify: `build/route-pages.test.ts`
- Modify: `public/llms.txt`
- Modify: `docs/project/current-focus.md`
- Modify: `docs/project/milestones.md`
- Modify: `docs/project/timeline.md`
- Modify: `docs/project/m9-b2b-seller-access.md`

**Interfaces:**

- Consumes: existing quick-navigation links, working B2B registration form, and typed `SEO_ROUTES` registry.
- Produces: accurately labeled navigation, no inert login control, fact-bounded B2B copy, and meaningful static route content inside every generated root.

- [x] Relabel desktop shortcut UI as quick navigation and remove the inert mobile search prompt.
- [x] Remove the presentational B2B login, unsupported commercial promises, and unsupported response deadline while preserving the working registration request.
- [x] Add typed static headings and links to `SEO_ROUTES`; inject escaped semantic content into every generated route and noindex 404 page.
- [x] Synchronize `llms.txt` and all affected local M8/M9 planning files.
- [x] Run unit, build, static-output, and desktop/mobile browser verification before commit.
