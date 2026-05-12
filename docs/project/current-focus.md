# Current Focus

Last synced: 2026-05-12

## Active Milestone

`M3: B2B Lead Capture`

## Objective

Build the B2B lead-capture form: form fields, validation, Resend email delivery, and abuse protection. The `M2` landing page is verified and provides the context surface users land on before entering the commercial path.

## M2 Completion Summary

All `M2` sections verified as of 2026-05-12:

- Responsive navigation with mobile hamburger overlay and command-palette menu
- Hero section with real GHENO logo, MTB action image, correct CTA hierarchy
- Proof bar (2×2 grid on mobile, 4-column on desktop) with icon-led items
- Component families section (2-column mobile, 4-column desktop) with product images
- Technical proof section: stats grid (+300°C / 4× compostos), checklist, rotor product shot
- Competition proof section: 4-image horizontal carousel / 4-column desktop grid
- B2B teaser section with value prop grid and image rail
- Closing CTA band and 5-column footer

Linear tickets `LUA-19` through `LUA-26` are code-complete and verified.

## Next Tasks

1. Implement the B2B lead-capture form on the `/b2b` route.
2. Add form field validation (company, CNPJ, needs/message).
3. Wire Resend email delivery to the contact endpoint.
4. Add basic abuse protection (rate limiting or honeypot).
5. Keep [DESIGN.md](../../DESIGN.md) as the authoritative visual system.
6. Keep [store-destination-map.md](./store-destination-map.md) tied to any CTA routing.

## Immediate Success Criteria

- B2B form submits and delivers via Resend.
- Form has client-side validation for required fields.
- The `/b2b` route matches the design's visual language (no new token invention).
- `npm run test`, `npm run lint`, `npm run typecheck`, `npm run build`, and `npm run format:check` stay green.

## Not In Scope Yet

- Nuvemshop commerce bridge (M4)
- Analytics, SEO, and performance tuning (M5)
- Spline, Hyperframe, Instagram, or Bling research (M6)

## Next Milestone After This

`M4: Nuvemshop Commerce Bridge`

Use [m2-landing-page-mvp.md](./m2-landing-page-mvp.md) as the verified landing surface baseline while implementing `M3`.
