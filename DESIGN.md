---
version: alpha
name: GHENO Components
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
    fontSize: 72px
    fontWeight: 700
    lineHeight: 0.94
    letterSpacing: -0.05em
  h2:
    fontFamily: 'Sora'
    fontSize: 48px
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
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.55
  body-md:
    fontFamily: 'Manrope'
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.65
  body-sm:
    fontFamily: 'Manrope'
    fontSize: 14px
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
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: 0.12em
rounded:
  sm: 8px
  md: 14px
  lg: 22px
  xl: 30px
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
    height: 52px
  button-secondary:
    backgroundColor: '{colors.background-soft}'
    textColor: '{colors.primary}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    padding: 14px
    height: 52px
  card:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.primary}'
    rounded: '{rounded.lg}'
    padding: '{spacing.lg}'
  card-glass:
    backgroundColor: '{colors.surface-glass}'
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
    height: 52px
  section-band-light:
    backgroundColor: '{colors.success}'
    textColor: '{colors.on-primary}'
    rounded: '0px'
    padding: '{spacing.xl}'
  meta-label:
    backgroundColor: '{colors.accent-dark}'
    textColor: '{colors.on-accent}'
    typography: '{typography.eyebrow}'
    rounded: '{rounded.full}'
    padding: '{spacing.sm}'
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

GHENO should feel like race equipment, not lifestyle merch and not generic ecommerce. The personality is dark, engineered, aggressive, credible, and premium. Interfaces should feel precise and durable, with clear hierarchy and very little decorative noise.

The design language comes from MTB performance culture: hard contrast, technical details, product-first imagery, and direct calls to action. The red is a pressure point, not a wash. Most of the UI should stay black, graphite, smoke, and white so the accent keeps its force.

## Colors

- **Primary:** Main text on dark surfaces. Use for headlines, important labels, and high-emphasis UI.
- **Secondary:** Supporting copy, metadata, helper text, and lower-emphasis UI.
- **Accent:** The only primary highlight color. Use for main CTAs, active states, small category tags, arrows, and selected emphasis words.
- **Accent Dark:** Use inside the brand gradient, darker hover states, and intense red surfaces that need more depth than flat red.
- **Background:** Default page background. It should read as near-black, not charcoal gray.
- **Background Soft:** Secondary dark area for subtle section separation without creating a new visual theme.
- **Surface:** Product cards, content blocks, and dark grouped panels.
- **Surface Elevated:** Higher-elevation cards and controls that need a stronger edge against the page.
- **Surface Glass:** Mobile menu sheets, command palette overlays, and translucent floating panels.
- **Border:** Default dark stroke for cards, dividers, and panels.
- **Border Strong:** Inputs, outlined buttons, and focus-adjacent UI where extra definition is needed.
- **Brand Gradient Base:** Base red for brand-gradient recipes derived from the logo. Build the actual gradient in implementation using `#E81414` and `#C70303`.

Red should stay scarce enough to signal importance. Do not tint whole sections red. Let black carry most of the composition.
When translucency is needed, treat `surface-glass` as the base color and apply opacity in code. Treat `overlay` as the base black for scrims and darkening layers.

## Typography

The type system should separate impact from readability.

- Use `h1` for hero headlines and only the most important page-level statements.
- Use `h2` for major section headers.
- Use `h3` for feature blocks, card titles, and product-family statements.
- Use `body-lg` for short supporting copy near hero areas and commercial statements.
- Use `body-md` for standard paragraphs and explanatory copy.
- Use `body-sm` for metadata, captions, helper copy, and dense UI text.
- Use `label` for buttons, tabs, field labels, and inline CTA text.
- Use `eyebrow` for small uppercase section markers such as `COMPONENTES`, `TECNOLOGIA`, or `B2B`.

Headlines should feel compressed and forceful, with tight tracking and short lines. Body copy should stay clean and neutral so the product and imagery carry the emotion.

## Layout

Layouts should feel asymmetric and intentional. Avoid centered, template-looking hero sections. The first screen should place copy, imagery, and CTA weight in a way that feels directional and fast.

Use large vertical spacing between sections and tighter spacing inside components. Cards can be dense, but the page-level rhythm should breathe. Product grids should feel like a system of parts, not a marketplace.

Use dark sectional bands to control pacing. A light band is allowed only when it clarifies a commercial or B2B block and creates a deliberate contrast break, as seen in the reference direction.

On mobile, preserve hierarchy by stacking without flattening the design. The hero should still feel dramatic. Menus and overlays should use smoked-glass panels with strong blur, large radii, and clear icon/text rows.

## Media And Imagery

Use real MTB action imagery, product macro shots, rotor/cube/rim silhouettes, and technical closeups. Images should feel fast, dirty, metallic, and real.

Prefer one dominant image per section over many small decorative images. Product renders and photos should be dark, high-contrast, and tightly cropped. Technical diagrams can use fine red leader lines and small annotations, but only when the information is credible.

Do not add fake telemetry, fake engineering numbers, or meaningless dashboard motifs.

## Components

### Buttons

Primary buttons should be unmistakable and use the flat accent red. They should feel compact and forceful, not bloated. Use secondary outlined buttons for alternate actions on dark backgrounds.

Avoid more than one red primary CTA per local group unless the hierarchy is genuinely shared. Arrow icons are appropriate when they reinforce forward motion.
In implementation, secondary buttons should usually gain their outline from `border-strong` even though that stroke is described here rather than encoded as a component sub-token.

### Cards

Cards should feel like product housings: dark, edged, slightly dense, and structured. Use thin borders and restrained shadows. Product cards should prioritize image, family label, product name, short proof line, and a single CTA.

Do not use soft pastel cards, oversized floating shadows, or empty generic marketing cards.

### Navigation And Menus

Desktop navigation should be lean and confident. Mobile navigation can become a smoked-glass command surface with search, grouped actions, and icon-led rows. This is one of the few places where translucency is encouraged.
Use `surface-glass` with opacity and blur in code for these layers. Add thin strokes using `border` or `border-strong`.

### Forms

Labels belong above inputs. Field styling should stay dark, clear, and trustworthy. Validation states should be direct and readable, never playful. The B2B form should feel credible for Brazilian distributors, workshops, and resellers.

### Trust Bars And Proof Blocks

Proof blocks should use short, concrete claims with restrained line icons or technical symbols. They support the hero and should never overpower it.

## Motion

Motion should feel mechanical and purposeful. Use it to clarify hierarchy, reveal content, or confirm state changes. Short fades, slide-ins, and image parallax are acceptable if they stay smooth on mobile.

Reduced motion support is required. Avoid heavy animation systems unless the visual gain is material. Motion should never block first render or distract from conversion paths.

## Do's And Don'ts

- Do use the token names in this file instead of inventing close alternatives.
- Do keep the page predominantly black, graphite, white, and red.
- Do use the brand gradient when a logo-derived red surface is needed.
- Do preserve Portuguese-first hierarchy and direct product-led messaging.
- Do make mobile layouts feel intentional, not merely collapsed desktop layouts.
- Do keep contrast WCAG AA compliant.
- Don't introduce purple, blue, or rainbow gradients.
- Don't use default-looking shadcn, MUI, or startup-dashboard styling.
- Don't add fake metrics, fake technical data, or decorative charts.
- Don't center every section or use generic three-card SaaS layouts.
- Don't overuse red for decoration or background fill.
- Don't mix soft rounded consumer UI with sharp technical dark UI in the same view.

## Implementation Notes

- Build the logo-inspired red gradient in code as `radial-gradient(circle at 0% 0%, #E81414 0%, #C70303 52%, #C70303 72%, #E81414 100%)`.
- Use `border` and `border-strong` for strokes even though the current schema does not support border tokens inside component definitions.
- Use alpha and blur in implementation for glass panels and overlays; the hex tokens here are base colors for the linter-compatible source of truth.
