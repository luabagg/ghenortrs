# Typography And Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace vague, repetitive, unsupported public copy with concise Brazilian Portuguese product and B2B information that matches GHENO's verified commerce boundaries.

**Architecture:** Keep the existing routes, sections, CTA destinations, and component structure. Edit copy at its current source, remove decorative labels when the heading already supplies context, and update assertions that intentionally protect the revised public message.

**Tech Stack:** React 19, TypeScript, Vitest, Testing Library, Vite, Tailwind CSS

## Global Constraints

- Do not invent technical specifications, validation claims, availability, or service promises.
- Pastilhas may link to the live public catalog; Cubos, Aros, and Rotores remain consultation-led.
- Preserve Portuguese-first hierarchy, existing route behavior, and the single B2B teaser CTA.
- Do not change visual tokens or styling except to close spacing left by removed text.

---

### Task 1: Homepage message and proof copy

**Files:**

- Modify: `src/components/landing/home-hero-section.tsx`
- Modify: `src/components/landing/operational-highlights-section.tsx`
- Modify: `src/components/landing/component-families-section-parts.tsx`
- Modify: `src/components/landing/component-families-data.ts`
- Modify: `src/components/landing/technical-proof-section.tsx`
- Modify: `src/components/landing/competition-proof-section.tsx`
- Modify: `src/components/landing/b2b-teaser-section.tsx`
- Modify: `src/components/pages/home-page.tsx`
- Test: `src/app.test.tsx`

- [ ] **Step 1: Replace assertions for the hero label, generic slogans, and unsupported technical numbers with assertions for concise, source-backed copy.**
- [ ] **Step 2: Run `pnpm test -- --run src/app.test.tsx` and verify the revised assertions fail against the old copy.**
- [ ] **Step 3: Remove `GHENO COMPONENTES`, delete unsupported numerical claims, state catalog/consultation boundaries directly, and reduce repeated “performance real/de verdade” phrasing.**
- [ ] **Step 4: Run `pnpm test -- --run src/app.test.tsx` and verify the homepage tests pass.**

### Task 2: Product, B2B, contact, about, navigation, and system copy

**Files:**

- Modify: `src/App.tsx`
- Modify: `src/components/pages/components-page-data.ts`
- Modify: `src/components/pages/components-page-sections.tsx`
- Modify: `src/components/pages/about-page.tsx`
- Modify: `src/components/pages/contact-page.tsx`
- Modify: `src/components/pages/b2b-page-sections.tsx`
- Modify: `src/components/pages/b2b-form.tsx`
- Modify: `src/components/navigation/app-footer.tsx`
- Modify: `src/components/navigation/mobile-menu-actions.tsx`
- Modify: `src/components/navigation/mobile-menu-overlay.tsx`
- Modify: `src/components/ui/dot-matrix-loader.tsx`
- Test: `src/app.test.tsx`

- [ ] **Step 1: Add route-level assertions for clear availability, contact, form, and error-state copy where existing coverage already renders those surfaces.**
- [ ] **Step 2: Run the targeted app test and verify new assertions fail.**
- [ ] **Step 3: Replace internal implementation language, unsupported product details, redundant badges, “Novo” decoration, and vague institutional prose with actionable copy.**
- [ ] **Step 4: Run the targeted app test and verify it passes.**

### Task 3: Verification and handoff

**Files:**

- Review: all files changed in Tasks 1-2

- [ ] **Step 1: Run `rg -n 'GHENO COMPONENTES|\+300°C|sem fade|performance real|MTB de verdade|arquitetura do MVP|Loading state|Novo' src` and confirm no unwanted public phrase remains.**
- [ ] **Step 2: Run `pnpm test -- --run`, `pnpm lint`, and `pnpm build`; resolve every regression without workarounds.**
- [ ] **Step 3: Review `git diff --check` and the complete diff for copy accuracy, commerce-boundary consistency, and accidental styling changes.**
- [ ] **Step 4: Commit the focused implementation with a clear conventional commit message.**
