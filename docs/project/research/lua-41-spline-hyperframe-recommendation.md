# LUA-41: Spline and Hyperframe for Animated Product Cards

Research completed: 2026-05-12
Status: **Recommended against for v1**

## Summary

Neither Spline nor Hyperframe should be introduced in v1. Both add reliability and
performance risk that outweigh the benefit for a launch-candidate landing page. CSS
transitions already in place cover the v1 animation need.

## Spline

**What it is:** A browser-based 3D design tool that exports interactive WebGL scenes as a
hosted `<script>` embed or a self-hosted `.splinecode` file loaded via `@splinetool/runtime`.

**Pros:**

- Visually impressive 3D product showcases — a rotor spinning on hover, for example
- No Three.js expertise needed; design tool is WYSIWYG

**Cons:**

- Runtime dependency (~200–400 KB minified gzip) loaded on every page — doubles the
  current 95 KB gzip JS budget in the worst case
- Spline-hosted embeds add a third-party network dependency; a Spline outage or CDN
  slowdown directly affects the landing page
- WebGL fallback on older Android devices and aggressive battery-saving modes is
  unreliable — the scene may render as a blank box on ~5–10% of mobile traffic
- `prefers-reduced-motion` compliance requires custom JS guards around the runtime
  init; Spline does not expose a native reduced-motion API
- Authoring workflow: requires a separate Spline project maintained outside the repo;
  any asset update requires re-export and redeploy

**Verdict:** Not suitable for v1. Revisit if there is a specific product hero moment
(e.g., 3D rotor exploded view) that cannot be achieved with CSS + static images.

## Hyperframe

**What it is:** A prototyping and motion-design tool focused on scroll-driven and
gesture-driven micro-interactions, typically targeting React via a generated component
export.

**Pros:**

- Scroll-based section transitions and parallax effects achievable without writing
  animation code from scratch
- Produces React components that integrate into the existing Vite + React architecture

**Cons:**

- Relatively niche tooling with limited community support and uncertain long-term
  maintenance — a dependency risk for a production site
- Generated component output is often verbose and hard to maintain manually; diffs are
  opaque and refactoring is tied to re-running the export pipeline
- Scroll-driven parallax adds layout-recomputation cost on the main thread — can
  degrade INP on mid-range Android devices during scroll
- Reduced-motion compliance requires per-component opt-out; there is no global toggle
  in the generated output

**Verdict:** Not suitable for v1. Revisit only if a dedicated motion designer owns the
Hyperframe project file long-term.

## What Is Already Sufficient for v1

The current implementation already uses:

- CSS `transition-opacity duration-1000` for the hero background carousel crossfade
- Tailwind `hover:` and `group-hover:` transitions on nav dropdowns and product cards
- `group-focus-within:` transitions for keyboard-accessible nav dropdown
- `@media (prefers-reduced-motion: reduce)` guard disabling all CSS transitions globally
- `scroll-behavior: smooth` for anchor navigation

These provide adequate motion for a launch candidate without adding any runtime weight
or authoring overhead.

## When to Revisit

Revisit Spline if:

- A 3D product showcase is added as a distinct section (not replacing existing cards)
- The Spline scene is self-hosted (`.splinecode` file in `public/`) to remove CDN dependency
- A performance budget gate is added to CI to catch any regression

Revisit Hyperframe if:

- A dedicated motion/design system role is established with ongoing ownership
- Scroll-driven animations are approved as a v2 feature with explicit performance targets
