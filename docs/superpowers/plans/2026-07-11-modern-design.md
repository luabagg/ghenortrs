# Modern Design Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the GHENO landing page feel cleaner, more precise, and more performance-led while preserving all routes, content flows, and interaction behavior.

**Architecture:** Keep the React/Tailwind structure intact and concentrate changes in shared surface styling plus landing-page composition. Use only the colors, typography, spacing, and 8px minimum radius already defined by `DESIGN.md`; reduce decoration and large panel rounding instead of introducing a new visual language.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, Vite, Vitest, Playwright

## Global Constraints

- Preserve existing functionality, routes, links, tracking attributes, and accessibility semantics.
- Use only `DESIGN.md` tokens: black/graphite/white/red palette, Sora/Manrope type, documented spacing, and `rounded.sm` (8px) for tightened surfaces.
- Keep red scarce and purposeful.
- Prefer asymmetric, product-led layouts over centered or soft card-heavy composition.
- Support desktop and mobile without horizontal page overflow.

---

### Task 1: Flatten the global visual field

**Files:**

- Modify: `src/styles.css`

**Interfaces:**

- Consumes: Tailwind theme tokens sourced from `DESIGN.md`.
- Produces: restrained page background and compact 8px surface radius utility token.

- [x] **Step 1: Replace the broad decorative red page glow with the documented near-black background.**
- [x] **Step 2: Map shared panel surfaces to the existing 8px `rounded.sm` value.**
- [x] **Step 3: Run `pnpm test -- --run` and confirm all tests pass.**

### Task 2: Sharpen the landing-page hierarchy

**Files:**

- Modify: `src/components/landing/home-hero-section.tsx`
- Modify: `src/components/landing/operational-highlights-section.tsx`
- Modify: `src/components/pages/home-page.tsx`

**Interfaces:**

- Consumes: current hero carousel, commerce links, and operational proof content.
- Produces: cleaner hero typography, quieter proof bar, and flatter closing CTA.

- [x] **Step 1: Remove the redundant hero badge and increase headline authority without changing its message.**
- [x] **Step 2: Restyle the proof bar as a precise technical rail using dividers and compact corners.**
- [x] **Step 3: Flatten the closing CTA and use spacing/borders rather than oversized rounding and shadow.**
- [x] **Step 4: Run focused component tests and confirm behavior remains unchanged.**

### Task 3: Replace soft card language with technical framing

**Files:**

- Modify: `src/components/landing/component-families-section-parts.tsx`
- Modify: `src/components/landing/section-cards.tsx`
- Modify: `src/components/landing/technical-proof-section.tsx`
- Modify: `src/components/landing/competition-proof-section.tsx`

**Interfaces:**

- Consumes: existing product data, imagery, links, and proof content.
- Produces: compact-corner product/media surfaces and flatter stat blocks.

- [x] **Step 1: Tighten product and media corners to 8px and reduce floating-card cues.**
- [x] **Step 2: Convert technical statistics into a bordered rail with square internal divisions.**
- [x] **Step 3: Keep competition imagery dominant using compact framing and restrained overlays.**
- [x] **Step 4: Run `pnpm lint`, `pnpm test -- --run`, and `pnpm build`; expect zero errors.**

### Task 4: Rendered visual QA

**Files:**

- Create: `artifacts/design/home-desktop.png`
- Create: `artifacts/design/home-mobile.png`

**Interfaces:**

- Consumes: production build or local Vite server.
- Produces: desktop and mobile evidence of layout quality.

- [x] **Step 1: Start the local server and capture the homepage at desktop width.**
- [x] **Step 2: Capture the homepage at mobile width.**
- [x] **Step 3: Inspect both captures for overflow, text collision, broken images, oversized rounding, and weak CTA hierarchy.**
- [x] **Step 4: Run Prettier against every changed source and plan file.**
- [x] **Step 5: Commit the implementation and verification artifacts.**
