# LUA-40: Instagram Video Display Recommendation

Research completed: 2026-05-12
Status: **Deferred — not required for MVP; viable as a v1.1 section**

## Summary

Instagram display is feasible post-MVP using the Instagram Basic Display API or a
lightweight oEmbed embed per post. It is not required for launch. If added, it should be
a lazy-loaded "Feed" section below the fold, not embedded in any existing section.

## Use Case

The design does not include an Instagram feed section. The potential use case is a
"Feed GHENO" section showing recent race photos and brand content — reducing the need to
manually update reference images as new race content is published.

## Options

### Option A: Instagram Basic Display API (recommended if implemented)

- **Auth:** OAuth 2.0, user access token (requires the GHENO Instagram account owner to
  authorize once; token expires every 60 days and must be refreshed)
- **Key endpoint:** `GET /me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink`
- **Media types:** IMAGE, VIDEO, CAROUSEL_ALBUM
- **Implementation:** A Vercel Edge Function proxies the request (hides the access token),
  caches the response for 1 hour, and returns 6–9 recent posts to the frontend
- **Cost:** Free for up to 200 API calls/hour per token; well within a landing page budget
- **Maintenance:** Access tokens expire every 60 days — a cron job or manual refresh
  process is required; Vercel's `api/instagram-feed.ts` edge function can use a long-lived
  token (refreshed via the Instagram API before expiry)

**Pros:** Full control over layout and design; uses existing Vercel + React architecture;
no third-party embed script

**Cons:** Token rotation is an operational burden; the GHENO account owner must complete
the OAuth flow; video thumbnails require `thumbnail_url` (not `media_url`) for VIDEO type

### Option B: oEmbed Per Post

- Embed individual Instagram posts as iframes using Instagram's oEmbed endpoint
- Requires no auth for public posts
- **Cons:** Each post renders Instagram's own UI in a heavy sandboxed iframe; loads
  Instagram's JS bundle per post; design is not customizable; layout is not responsive by
  default; poor performance impact

**Verdict:** Option B is not suitable for a performance-conscious landing page.

### Option C: Third-Party Instagram Feed Widgets (Elfsight, Curator.io, etc.)

- Drop-in `<script>` embeds that render a grid
- **Cons:** Monthly subscription cost; third-party JS on critical path; privacy implications
  (LGPD); design can drift if the provider changes their widget

**Verdict:** Acceptable only if Option A operational overhead is explicitly rejected by
the client.

## Reduced-Motion Requirements

If a video post auto-plays in the feed, it must respect `prefers-reduced-motion`:

```ts
const reduceMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches;
videoElement.autoplay = !reduceMotion;
```

## Recommendation

**Do not implement Instagram display in v1.** The existing reference images cover the
brand content need for launch. If the client requests a live Instagram feed:

1. Use Option A (Basic Display API) with a Vercel Edge Function proxy
2. Limit initial display to 6 posts in a 3×2 grid or 2-row horizontal scroll
3. Add token-refresh automation before launch to avoid 60-day expiry silently breaking
   the feed
4. Scope it as a standalone "Feed GHENO" section below the competition proof section

## Performance Note

Each Instagram image served via `media_url` is hosted on Facebook CDN and not
controlled by the GHENO deployment. There is no opportunity to add `loading="lazy"` or
`fetchpriority` hints from the GHENO side — the browser treats each `media_url` as an
opaque third-party image. This makes the section inherently below-fold only to avoid
LCP impact.
