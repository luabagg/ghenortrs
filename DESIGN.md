---
version: alpha
name: GHENO rotors Components
description: Dark technical visual system for a Brazilian MTB components landing page and B2B storefront bridge.
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

GHENO rotors must feel like race equipment.

Do not make it look like lifestyle merch or generic ecommerce.

Keep the personality dark, engineered, aggressive, credible, and premium.

Keep interfaces precise and durable.

Use clear hierarchy and little decorative noise.

The design language mixes MTB performance culture with a Stripe-like product surface.

Use hard contrast, technical detail, product-first imagery, quiet borders, square geometry, and direct CTAs.

Use red as a pressure point.

Do not wash pages in red.

Do not use red as a badge factory.

Keep most UI black, graphite, smoke, and white so the accent stays strong.

## Colors

- **Primary:** Main text on dark surfaces. Use for headlines, important labels, and high-emphasis UI.
- **Secondary:** Supporting copy, metadata, helper text, and lower-emphasis UI.
- **Accent:** The only primary highlight. Use for filled CTAs that need weight, selected emphasis words, and rare active states.
- **Accent Dark:** Darker hover on filled accent surfaces. Prefer border-only accent on heroes and promos when filled red feels loud.
- **Background:** Default page background. Keep it near-black, not charcoal gray.
- **Background Soft:** Secondary dark area for light section separation. Do not start a new theme.
- **Surface:** Product cards, content blocks, and dark grouped panels.
- **Surface Elevated:** Higher-elevation cards and controls that need a stronger edge.
- **Surface Glass:** Mobile menu sheets and command overlays only. Do not use glass on marketing strips, trust bars, or hero overlays.
- **Border:** Default dark stroke for cards, dividers, and panels.
- **Border Strong:** Inputs, outlined buttons, and focus-adjacent UI that need more definition.
- **Brand Gradient Base:** Base red for logo-derived brand gradients. Use sparingly. Prefer flat surfaces.

Keep red scarce so it signals importance.

Do not tint whole sections red.

Do not use red pill badges as section markers.

Let black carry most of the composition.

For translucent overlays, use `surface-glass` as the base color and set opacity in code.

Use `overlay` as the base black for scrims and darkening layers.

## Typography

Separate impact from readability.

- Use `h1` for hero headlines and the most important page statements.
- Use `h2` for major section headers.
- Use `h3` for feature blocks, card titles, and product-family statements.
- Use `body-lg` for short support copy near heroes and commercial statements.
- Use `body-md` for standard paragraphs and explanatory copy.
- Use `body-sm` for metadata, captions, helper copy, and dense UI text.
- Use `label` for buttons, tabs, field labels, and inline CTA text.
- Use `eyebrow` for quiet uppercase section markers such as `Componentes`, `Tecnologia`, or `B2B`. Eyebrows are text only. Never use red pills or filled chips.

Keep headlines compressed and forceful.

Use tight tracking and short lines.

Keep body copy clean and neutral.

Let product and imagery carry emotion.

## Layout

Make layouts asymmetric and intentional.

Prefer a Stripe-like product surface over sports-template landing pages.

Avoid centered, template-looking heroes.

On the first screen, place copy and CTA with room to breathe.

Use one dominant full-bleed image plane and restrained overlays.

Use large vertical spacing between sections.

Use tighter spacing inside components.

Cards may be dense.

Keep page-level rhythm open.

Make product grids feel like a system of parts, not a marketplace.

Prefer square geometry: small radii (`sm`/`md`/`lg`), hairline borders, and flat surfaces.

Avoid soft consumer rounding.

Avoid glassmorphism on content rows.

Avoid icon-above-title feature grids. They read as generic AI marketing.

Use dark sectional bands to control pacing.

Use a light band only when it clarifies a commercial or B2B block and creates a deliberate contrast break.

On mobile, stack content and keep hierarchy.

Keep the hero dramatic.

Menus and overlays may use smoked-glass panels.

Marketing content must stay opaque.

## Media And Imagery

Use real MTB action imagery, product macros, rotor/cube/rim silhouettes, and technical closeups.

Images must feel fast, dirty, metallic, and real.

Prefer one dominant image, or a tight 2–3 image composition, per section.

Avoid image grids with tiny captions.

Keep product renders and photos dark, high-contrast, and tightly cropped.

Sell quality with copy beside fewer images.

Do not use six equal tiles.

Do not overlay red badges on images.

Do not add fake telemetry, fake engineering numbers, or empty dashboard motifs.

## Components

### Buttons

Marketing CTAs use at most three variants:

1. **`outline`** — thin red border, transparent fill. Primary marketing CTA (hero store, B2B teaser, closing store).
2. **`secondary`** — thin white/light border, transparent fill. Alternate CTA on dark surfaces (hero secondary).
3. **`ghost`** — text only, no border. Quiet links inside sections (component families, proof).

Filled **`primary`** is for form submits and other high-commitment product actions outside marketing sections.

Do not invent a fourth marketing button style.

Keep buttons compact and square.

Prefer thin 1px borders.

Avoid pill shapes.

Avoid trailing arrows on every link.

### Cards

Cards must feel like product housings: dark, edged, slightly dense, and structured.

Use thin borders and almost no shadow.

On the home families grid, the whole card links to `/componentes`.

Do not add per-card store arrows.

Do not use soft pastel cards, oversized floating shadows, glass panels, or empty generic marketing cards.

### Navigation And Menus

Keep desktop navigation lean and confident.

Mobile navigation may become a smoked-glass command surface with search, grouped actions, and icon-led rows.

This is one of the few places where translucency is allowed.

Use `surface-glass` with opacity and blur in code for these layers.

Add thin strokes with `border` or `border-strong`.

### Forms

Place labels above inputs.

Keep field styling dark, clear, and trustworthy.

Keep validation direct and readable.

Never make validation playful.

The B2B form must feel credible for Brazilian distributors, workshops, and resellers.

### Trust Bars And Proof Blocks

Use short, concrete claims in a text-first horizontal strip with hairline dividers.

No glass.

No icons stacked above titles.

Proof supports the hero.

Proof must not overpower the hero.

Keep closing commerce prompts light: one strip, one sentence, one or two links.

Do not use a dramatized card with a red badge.

## Motion

Make motion mechanical and purposeful.

Use motion to clarify hierarchy, reveal content, or confirm state changes.

Short fades, slide-ins, and image parallax are allowed when they stay smooth on mobile.

Support reduced motion.

Avoid heavy animation systems unless the visual gain is material.

Motion must not block first render.

Motion must not distract from conversion paths.

## Do's And Don'ts

- Do use the token names in this file. Do not invent close alternatives.
- Do keep the page mostly black, graphite, white, and red.
- Do keep radii small and geometry square.
- Do keep Portuguese-first hierarchy and direct product-led messaging.
- Do make mobile layouts intentional. Do not only collapse the desktop layout.
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

- Build the logo red gradient in code as `radial-gradient(circle at 0% 0%, #E81414 0%, #C70303 52%, #C70303 72%, #E81414 100%)` only when a brand surface needs it.
- Map `rounded.sm/md/lg/xl` to CSS `--radius-*` and Tailwind radius tokens. Prefer `rounded-sm` / `rounded-md` / `rounded-lg` in marketing UI.
- Use `border` and `border-strong` for strokes. The schema does not support border tokens inside component definitions.
- Use alpha and blur for overlay navigation only. Keep marketing sections opaque.
