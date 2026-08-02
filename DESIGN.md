---
version: alpha
name: GHENO rotors Components
description: Dark, technical, performance-first visual system for a Brazilian MTB components landing page and B2B storefront bridge.
colors:
  primary: '#F5F5F5'
  secondary: '#A1A1AA'
  accent: '#E81414'
  accent-dark: '#C70303'
  background: '#050505'
  background-soft: '#0B0B0C'
  surface: '#111113'
  surface-elevated: '#17171A'
  surface-glass: '#18181B'
  border: '#2B2B31'
  border-strong: '#3A3A43'
  on-primary: '#050505'
  on-accent: '#FFFFFF'
  success: '#D7D9DC'
  overlay: '#000000'
  brand-gradient-base: '#E81414'
typography:
  h1:
    fontFamily: 'Sora'
    fontSize: 50px
    fontWeight: 700
    lineHeight: 0.94
    letterSpacing: -0.05em
  h2:
    fontFamily: 'Sora'
    fontSize: 50px
    fontWeight: 650
    lineHeight: 1
    letterSpacing: -0.04em
  h3:
    fontFamily: 'Sora'
    fontSize: 30px
    fontWeight: 650
    lineHeight: 1.05
    letterSpacing: -0.03em
  body-lg:
    fontFamily: 'Manrope'
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.55
  body-md:
    fontFamily: 'Manrope'
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.65
  body-sm:
    fontFamily: 'Manrope'
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: 'Manrope'
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: 0.02em
  eyebrow:
    fontFamily: 'Manrope'
    fontSize: 13px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: 0.12em
rounded:
  sm: 4px
  md: 6px
  lg: 8px
  xl: 12px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  xxl: 64px
  section: 120px
components:
  page-shell:
    backgroundColor: '{colors.background}'
    textColor: '{colors.primary}'
    rounded: '0px'
    padding: '{spacing.section}'
  button-primary:
    backgroundColor: '{colors.accent}'
    textColor: '{colors.on-accent}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    padding: 14px
    height: 48px
  button-outline:
    backgroundColor: 'transparent'
    textColor: '{colors.primary}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    padding: 14px
    height: 48px
  button-secondary:
    backgroundColor: 'transparent'
    textColor: '{colors.primary}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    padding: 14px
    height: 48px
  card:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.primary}'
    rounded: '{rounded.lg}'
    padding: '{spacing.lg}'
  card-elevated:
    backgroundColor: '{colors.surface-elevated}'
    textColor: '{colors.primary}'
    rounded: '{rounded.lg}'
    padding: '{spacing.lg}'
  input:
    backgroundColor: '{colors.background-soft}'
    textColor: '{colors.primary}'
    rounded: '{rounded.md}'
    typography: '{typography.body-md}'
    padding: '{spacing.md}'
    height: 48px
  section-band-light:
    backgroundColor: '{colors.success}'
    textColor: '{colors.on-primary}'
    rounded: '0px'
    padding: '{spacing.xl}'
  meta-label:
    backgroundColor: 'transparent'
    textColor: '{colors.secondary}'
    typography: '{typography.eyebrow}'
    rounded: '0px'
    padding: '0px'
  framed-panel:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.secondary}'
    rounded: '{rounded.lg}'
    padding: '{spacing.lg}'
  outline-panel:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.primary}'
    rounded: '{rounded.lg}'
    padding: '{spacing.lg}'
---

## Overview

GHENO rotors should feel like race equipment, not lifestyle merch and not generic ecommerce. The personality is dark, engineered, aggressive, credible, and premium. Interfaces should feel precise and durable, with clear hierarchy and very little decorative noise.

The design language comes from MTB performance culture filtered through a Stripe-like product surface: hard contrast, technical details, product-first imagery, quiet borders, square geometry, and direct calls to action. Red is a pressure point, not a wash and not a badge factory. Most of the UI should stay black, graphite, smoke, and white so the accent keeps its force.

## Colors

- **Primary:** Main text on dark surfaces. Use for headlines, important labels, and high-emphasis UI.
- **Secondary:** Supporting copy, metadata, helper text, and lower-emphasis UI.
- **Accent:** The only primary highlight color. Use for filled CTAs when conversion needs weight, selected emphasis words, and rare active states.
- **Accent Dark:** Use for darker hover states on filled accent surfaces. Prefer border-only accent treatments on heroes and promotional surfaces when a filled red button would feel loud.
- **Background:** Default page background. It should read as near-black, not charcoal gray.
- **Background Soft:** Secondary dark area for subtle section separation without creating a new visual theme.
- **Surface:** Product cards, content blocks, and dark grouped panels.
- **Surface Elevated:** Higher-elevation cards and controls that need a stronger edge against the page.
- **Surface Glass:** Reserved for mobile menu sheets and command overlays only. Do not use glass on marketing strips, trust bars, or hero overlays.
- **Border:** Default dark stroke for cards, dividers, and panels.
- **Border Strong:** Inputs, outlined buttons, and focus-adjacent UI where extra definition is needed.
- **Brand Gradient Base:** Base red for brand-gradient recipes derived from the logo. Use sparingly; prefer flat surfaces.

Red should stay scarce enough to signal importance. Do not tint whole sections red. Do not use red pill badges as section markers. Let black carry most of the composition.
When translucency is needed for overlays, treat `surface-glass` as the base color and apply opacity in code. Treat `overlay` as the base black for scrims and darkening layers.

## Typography

The type system should separate impact from readability.

- Use `h1` for hero headlines and only the most important page-level statements.
- Use `h2` for major section headers.
- Use `h3` for feature blocks, card titles, and product-family statements.
- Use `body-lg` for short supporting copy near hero areas and commercial statements.
- Use `body-md` for standard paragraphs and explanatory copy.
- Use `body-sm` for metadata, captions, helper copy, and dense UI text.
- Use `label` for buttons, tabs, field labels, and inline CTA text.
- Use `eyebrow` for quiet uppercase section markers such as `Componentes`, `Tecnologia`, or `B2B`. Eyebrows are text only — never red pills, never filled chips.

Headlines should feel compressed and forceful, with tight tracking and short lines. Body copy should stay clean and neutral so the product and imagery carry the emotion.

## Layout

Layouts should feel asymmetric and intentional, closer to Stripe than to sports-template landing pages. Avoid centered, template-looking hero sections. The first screen should place copy and CTA weight with generous breathing room, a dominant full-bleed image plane, and restrained overlays.

Use large vertical spacing between sections and tighter spacing inside components. Cards can be dense, but the page-level rhythm should breathe. Product grids should feel like a system of parts, not a marketplace.

Prefer square geometry: small radii (`sm`/`md`/`lg`), hairline borders, and flat surfaces over soft consumer rounding. Avoid glassmorphism on content rows. Avoid icon-above-title feature grids — they read as generic AI marketing.

Use dark sectional bands to control pacing. A light band is allowed only when it clarifies a commercial or B2B block and creates a deliberate contrast break.

On mobile, preserve hierarchy by stacking without flattening the design. The hero should still feel dramatic. Menus and overlays may use smoked-glass panels; marketing content should not.

## Media And Imagery

Use real MTB action imagery, product macro shots, rotor/cube/rim silhouettes, and technical closeups. Images should feel fast, dirty, metallic, and real.

Prefer one dominant image or a tight 2–3 image composition per section over image grids with tiny captions. Product renders and photos should be dark, high-contrast, and tightly cropped. Sell product quality with copy next to fewer images, not with six equal tiles.

Do not overlay red badges on images. Do not add fake telemetry, fake engineering numbers, or meaningless dashboard motifs.

## Components

### Buttons

Marketing CTAs use at most three variants:

1. **`outline`** — thin red border, transparent fill. Primary marketing CTA (hero store, B2B teaser, closing store).
2. **`secondary`** — thin white/light border, transparent fill. Alternate CTA on dark surfaces (hero secondary).
3. **`ghost`** — text only, no border. Quiet links inside sections (component families, proof).

Filled **`primary`** is reserved for form submits and other high-commitment product actions outside marketing sections. Do not invent a fourth marketing button style.

Keep buttons compact and square. Prefer thin 1px borders. Avoid pill shapes and trailing arrows on every link.

### Cards

Cards should feel like product housings: dark, edged, slightly dense, and structured. Use thin borders and almost no shadow. On the home families grid, the whole card links to `/componentes` — no per-card store arrows.

Do not use soft pastel cards, oversized floating shadows, glass panels, or empty generic marketing cards.

### Navigation And Menus

Desktop navigation should be lean and confident. Mobile navigation can become a smoked-glass command surface with search, grouped actions, and icon-led rows. This is one of the few places where translucency is encouraged.
Use `surface-glass` with opacity and blur in code for these layers. Add thin strokes using `border` or `border-strong`.

### Forms

Labels belong above inputs. Field styling should stay dark, clear, and trustworthy. Validation states should be direct and readable, never playful. The B2B form should feel credible for Brazilian distributors, workshops, and resellers.

### Trust Bars And Proof Blocks

Proof blocks should use short, concrete claims in a text-first horizontal strip with hairline dividers. No glass. No icons stacked above titles. They support the hero and should never overpower it.

Closing commerce prompts should stay light — a simple strip with one sentence and one or two links, not a dramatized card with a red badge.

## Motion

Motion should feel mechanical and purposeful. Use it to clarify hierarchy, reveal content, or confirm state changes. Short fades, slide-ins, and image parallax are acceptable if they stay smooth on mobile.

Reduced motion support is required. Avoid heavy animation systems unless the visual gain is material. Motion should never block first render or distract from conversion paths.

## Do's And Don'ts

- Do use the token names in this file instead of inventing close alternatives.
- Do keep the page predominantly black, graphite, white, and red.
- Do keep radii small and geometry square.
- Do preserve Portuguese-first hierarchy and direct product-led messaging.
- Do make mobile layouts feel intentional, not merely collapsed desktop layouts.
- Do keep contrast WCAG AA compliant.
- Don't introduce purple, blue, or rainbow gradients.
- Don't use red pill badges, red chips on images, or repeated red labels as decoration.
- Don't use glassmorphism on trust bars or marketing panels.
- Don't stack icons above titles in feature grids.
- Don't put arrows on every card CTA.
- Don't use soft large radii (`22px`+) on cards or buttons.
- Don't use default-looking shadcn, MUI, or startup-dashboard styling.
- Don't add fake metrics, fake technical data, or decorative charts.
- Don't center every section or use generic three-card SaaS layouts.
- Don't overuse red for decoration or background fill.
- Don't mix soft rounded consumer UI with sharp technical dark UI in the same view.

## Implementation Notes

- Build the logo-inspired red gradient in code as `radial-gradient(circle at 0% 0%, #E81414 0%, #C70303 52%, #C70303 72%, #E81414 100%)` only when a brand surface truly needs it.
- Map `rounded.sm/md/lg/xl` to CSS `--radius-*` and Tailwind radius tokens. Prefer `rounded-sm` / `rounded-md` / `rounded-lg` in marketing UI.
- Use `border` and `border-strong` for strokes even though the current schema does not support border tokens inside component definitions.
- Use alpha and blur in implementation for overlay navigation only; marketing sections should stay opaque.
