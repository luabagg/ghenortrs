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

## M3 Progress (as of 2026-05-12)

Done:

- `LUA-27` B2B lead form UI — 5-field form (Empresa, CNPJ, Telefone/WhatsApp, E-mail, Necessidades) with loading/success/error/no-config states and left-column value-prop checklist
- `LUA-28` Form validation — inline errors for required fields, CNPJ 14-digit check, Brazilian phone DDD check, email regex
- `LUA-30` Abuse protection — honeypot field + duplicate-submit guard (button disabled during loading)

Remaining:

- `LUA-29` Resend email delivery — blocked on server-side endpoint; form falls back to WhatsApp link when `VITE_B2B_SUBMIT_URL` is unset

## Next Tasks

1. Configure `VITE_B2B_SUBMIT_URL` with a Resend-backed serverless endpoint (e.g., Vercel function or Netlify Function).
2. Wire Resend delivery in the serverless function — not client-side.
3. Keep [DESIGN.md](../../DESIGN.md) as the authoritative visual system.
4. Keep [store-destination-map.md](./store-destination-map.md) tied to any CTA routing.

## Immediate Success Criteria

- Valid leads are delivered via Resend when `VITE_B2B_SUBMIT_URL` is configured.
- Missing configuration continues to fail safely to WhatsApp fallback.
- `npm run test`, `npm run lint`, `npm run typecheck`, `npm run build`, and `npm run format:check` stay green.

## Not In Scope Yet

- Nuvemshop commerce bridge (M4)
- Analytics, SEO, and performance tuning (M5)
- Spline, Hyperframe, Instagram, or Bling research (M6)

## Next Milestone After This

`M4: Nuvemshop Commerce Bridge`

Use [m2-landing-page-mvp.md](./m2-landing-page-mvp.md) as the verified landing surface baseline while implementing `M3`.
