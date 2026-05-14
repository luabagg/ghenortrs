# M7: Design Polish And Navigation Corrections

Status: verified
Target: 2026-06-19
Depends on: `M6: Deferred Integration Research`
Linear milestone: `M7: Design Polish And Navigation Corrections`

## Goal

Fix post-launch visual and navigation issues while preserving the verified MVP commerce boundary.

## Linear Issues

- `LUA-43` Improve glass surface system across overlays and panels — **Done** (2026-05-13)
- `LUA-44` Clean up header navigation and commerce affordances — **Done** (2026-05-13)
- `LUA-45` Restyle operational highlights section as centered glass content — **Done** (2026-05-13)
- `LUA-46` Correct public CTA copy and B2C store destination semantics — **Done** (2026-05-13)
- `LUA-47` Fix footer branding, social links, and owned content routes — **Done** (2026-05-13)
- `LUA-48` Rebalance hero background carousel overlay darkness — **Done** (2026-05-13)
- `LUA-59` Polish B2B teaser visual hierarchy and one-CTA flow — **Done** (2026-05-13)

## Deliverables

- Glass surface pass using `DESIGN.md` tokens
- `liquid-glass-react` integrated as the enhanced glass layer with CSS glass fallback retained
- Sticky header with no cart or language selector
- Header logo link to home
- Centered glass treatment for `operational-highlights-section.tsx`
- Public-friendly B2C CTA copy and destination semantics
- B2B teaser with a single public CTA to the form/access-request flow
- Readable B2B image-card labels with no black text over dark photos
- Footer logo aspect-ratio fix, correct Instagram URL, and no YouTube link until an official channel exists
- Owned `Contato` and `Sobre` route plan or implementation
- Lighter hero carousel overlay

## Included Scope

- Visual polish on existing landing surfaces
- Header/footer behavior corrections
- B2C versus B2B CTA semantics
- B2B teaser contrast and button hierarchy
- Owned-site content route cleanup
- Local docs and `public/llms.txt` updates when implementation changes public route facts

## Excluded Scope

- Working search implementation
- Authenticated B2B seller access
- Native cart, checkout, or product catalog
- New color palettes outside `DESIGN.md`

## Progress

2026-05-13:

- `LUA-43` completed: added `liquid-glass-react@1.1.1`, updated `GlassPanel` to support enhanced liquid glass per surface, and added CSS fallback classes in `src/styles.css`.
- `LUA-45` completed: operational highlights now use the enhanced `GlassPanel` and centered layout.
- `LUA-44` completed: header is sticky, logo links home, cart/language controls are removed, and header/nav/mobile menu no longer use glass.
- `LUA-46` completed: public product CTAs use B2C language for the Nuvemshop catalog and B2B copy routes to owned lead capture.
- `LUA-47` completed: footer logo aspect is fixed, Instagram points to `https://www.instagram.com/gheno_rtrs/`, YouTube has been removed until an official channel exists, and `/sobre` plus `/contato` are owned routes.
- `LUA-48` completed: hero carousel overlays were lightened so the imagery is less blackened.
- `LUA-59` completed: B2B media labels use readable accent labels and the teaser has one compact CTA to `/b2b` for B2B product access.
- Search-menu related polish from `M8` also landed here because it shared the same command-panel surface: device-aware shortcut hinting, shortcut dialog, and opening animation.

## Exit Criteria

- Glass panels read as translucent smoked glass while remaining readable.
- Header is sticky and no longer exposes cart or language controls.
- Public product CTAs use B2C language for the Nuvemshop product channel.
- B2B CTAs no longer imply Nuvemshop is the B2B access path.
- B2B teaser has one primary public CTA and does not show a competing registered-seller button.
- B2B image-card labels are readable and avoid black text on dark imagery.
- Footer brand/social links are accurate and non-broken.
- Owned `Contato` and `Sobre` route decisions are reflected in implementation docs.

## Recommended Order

1. Improve the shared glass treatment.
2. Clean up header controls and sticky behavior.
3. Fix operational highlights layout.
4. Correct public CTA semantics.
5. Polish B2B teaser contrast and one-CTA flow.
6. Fix footer and owned content routes.
7. Rebalance carousel overlay darkness and run responsive QA.

## Risks

- Glass treatment can reduce readability if opacity and blur are not tuned per surface.
- Sticky header can cover anchored content if offsets are not checked.
- Contact/about route changes affect externally visible facts and must update `public/llms.txt` when implemented.
