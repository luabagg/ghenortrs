# Loading Baseline

Last synced: 2026-05-11
Milestone: `M1: Vite Architecture Setup`
Linear issue: `LUA-11`

## Goal

Define the first GHENO loading-state contract so `M2` and `M3` can reuse the Dot Matrix loader intentionally instead of treating it as decoration.

## Active Primitive

- The current shared loading primitive is `DotMatrixLoader` in [src/components/ui/dot-matrix-loader.tsx](../../src/components/ui/dot-matrix-loader.tsx).
- It is already exercised on `/componentes` as the placeholder for future catalog and product-family loading.
- The component should stay accessible: `role="status"`, a descriptive `aria-label`, and reduced-motion-safe behavior are part of the baseline.

## Usage Rules

- Use Dot Matrix loaders only for real waiting states: async form submission, lazy product/media loading, or remote catalog hydration.
- Pair each loader with short, concrete copy that explains what is loading.
- Keep loaders inside the same card, panel, or section that owns the waiting state.
- Remove the loader as soon as the loaded content or resulting state is available.

## Approved M1 Patterns

### Components Catalog

- `/componentes` uses the loader while future component families, finishes, and technical proof points are being fetched or assembled.
- The loader belongs in the content column, not as a full-screen takeover.

### B2B Form Submission

- The future `M3` B2B submit action should swap the submit button into an in-place submitting state rather than replacing the whole form.
- Preferred pattern: keep the form fields visible, disable editing during submit, and show a compact Dot Matrix loader next to submit copy such as `Enviando contato comercial`.
- Use a short confirmation or error state in the same card after submit completes so the user never loses context.

### Lazy Media Or Product Blocks

- If `M2` adds media-heavy sections or deferred product cards, place the loader inside the card or media frame that is waiting on content.
- Do not stack multiple independent Dot Matrix loaders in the same viewport unless the user can clearly distinguish the loading regions.

## Anti-Patterns

- Do not use Dot Matrix loaders as ambient decoration in hero sections, nav chrome, or static cards.
- Do not show a loader when data is already available locally.
- Do not replace explanatory text with loader-only UI; every waiting state should still communicate what is happening.

## Validation

1. `DotMatrixLoader` stays reusable from the shared UI layer rather than being duplicated per route.
2. At least one B2B submission pattern is documented before `M3` starts implementing delivery.
3. Loader placement remains tied to specific async work, not general visual flair.
