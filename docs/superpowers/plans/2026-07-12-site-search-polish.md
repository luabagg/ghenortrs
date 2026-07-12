# Site Search, Catalog Truth, and Visual Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a stable, searchable GHENO marketing site whose commerce facts match the live Nuvemshop catalog, whose navigation does not shift, whose typography and motion follow `DESIGN.md`, and whose SEO/GEO documentation reflects the same public truth.

**Architecture:** Keep one versioned commerce map as the source of family availability and destinations. Generate a committed client-side search index from the public Nuvemshop sitemap with a real XML parser, then combine those store entries with local routes in a reusable accessible command-search component. Use Motion only through one reduced-motion-aware image primitive and targeted staggered highlights; keep all visual values on existing design tokens.

**Tech Stack:** React 19, TypeScript 6, Vite 8, Tailwind CSS 4, Vitest/Testing Library, Playwright, Motion for React, fast-xml-parser, Nuvemshop public sitemap/search.

## Global Constraints

- Treat the user's 2026-07-11 inventory statement as authoritative: brake pads, hubs, and rims are available online; rotors and mass dampers are not in inventory and route to owned contact.
- Remove the `ATIVO NO CATÁLOGO` and `CONSULTA COMERCIAL` labels from active component cards.
- Remove `Tecnologia` from header, mobile, command, and footer navigation; the logo remains the explicit home control.
- Use only tokens and rationale from `DESIGN.md`; do not invent colors, spacing scales, typography families, or component variants.
- Keep Nuvemshop checkout external. Never expose OAuth credentials or claim native inventory/checkout.
- Search must work with the committed index if Nuvemshop is temporarily unavailable during a build.
- All motion must respect `prefers-reduced-motion` and must not block first render.
- Preserve the user's unrelated changes in the main worktree.
- Update `public/llms.txt` and all affected local project files whenever public commerce or route facts change.

---

### Task 1: Central commerce truth and Nuvemshop search index

**Files:**
- Create: `src/catalog/commerce-map.json`
- Create: `src/catalog/commerce.ts`
- Create: `scripts/store-search-index.mjs`
- Create: `scripts/store-search-index.test.mjs`
- Create: `src/search/store-search-index.json`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Produces: `CommerceFamilyId`, `CommerceMode`, `COMMERCE_FAMILIES`, and `getCommerceFamily(id)` from `src/catalog/commerce.ts`.
- Produces: `parseStoreSitemap(xml, commerceMap)` and `syncStoreSearchIndex(options)` from `scripts/store-search-index.mjs`.
- Produces: JSON shape `{ source, generatedAt, entries: StoreSearchEntry[] }`, where each entry contains `id`, `kind`, `title`, `href`, `image`, `family`, `commerce`, `modifiedAt`, and `terms`.

- [ ] **Step 1: Add failing parser and commerce-map tests**

```js
import { describe, expect, it } from 'vitest';

import { parseStoreSitemap } from './store-search-index.mjs';

const commerceMap = {
  storeOrigin: 'https://store.ghenortrs.com.br',
  families: [
    {
      id: 'cubos',
      label: 'Cubos',
      commerce: 'store',
      href: 'https://store.ghenortrs.com.br/cubos/',
      productPathPatterns: ['cubo-'],
      terms: ['hub', 'boost'],
    },
    {
      id: 'rotores',
      label: 'Rotores',
      commerce: 'contact',
      href: '/contato',
      productPathPatterns: ['disco-', 'rotor-'],
      terms: ['rotor', 'disco'],
    },
  ],
};

it('deduplicates pt variants and applies authoritative commerce destinations', () => {
  const entries = parseStoreSitemap(SITEMAP_FIXTURE, commerceMap);
  expect(entries).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: 'product:cubo-dianteiro-gheno-go',
        family: 'cubos',
        commerce: 'store',
        href: 'https://store.ghenortrs.com.br/produtos/cubo-dianteiro-gheno-go/',
      }),
      expect.objectContaining({
        id: 'product:disco-elite-3-223mm',
        family: 'rotores',
        commerce: 'contact',
        href: '/contato',
      }),
    ]),
  );
  expect(entries.filter((entry) => entry.id.includes('cubo-dianteiro'))).toHaveLength(1);
});
```

- [ ] **Step 2: Run parser test and verify failure**

Run: `rtk pnpm vitest run scripts/store-search-index.test.mjs`

Expected: FAIL because `store-search-index.mjs` does not exist.

- [ ] **Step 3: Add dependencies and scripts**

```json
{
  "scripts": {
    "search:sync": "node scripts/store-search-index.mjs",
    "build": "pnpm search:sync && tsc -b && vite build"
  },
  "dependencies": {
    "motion": "^12.42.2"
  },
  "devDependencies": {
    "fast-xml-parser": "^5.9.3"
  }
}
```

Run: `rtk pnpm add motion && rtk pnpm add -D fast-xml-parser`

Expected: package and lockfile retain existing dependencies and add only these two packages.

- [ ] **Step 4: Implement the versioned commerce map**

```json
{
  "storeOrigin": "https://store.ghenortrs.com.br",
  "sitemapUrl": "https://store.ghenortrs.com.br/sitemap.xml",
  "searchUrl": "https://store.ghenortrs.com.br/search/",
  "families": [
    {
      "id": "pastilhas",
      "label": "Pastilhas de freio",
      "commerce": "store",
      "href": "https://store.ghenortrs.com.br/freios/pastilhas-de-freio/",
      "productPathPatterns": ["disk-brake-pads-", "pastilha-de-freio-"],
      "terms": ["pastilha", "freio", "brake pads", "elite", "ultra"]
    },
    {
      "id": "cubos",
      "label": "Cubos",
      "commerce": "store",
      "href": "https://store.ghenortrs.com.br/cubos/",
      "productPathPatterns": ["cubo-"],
      "terms": ["cubo", "hub", "boost", "dianteiro", "traseiro"]
    },
    {
      "id": "aros",
      "label": "Aros",
      "commerce": "store",
      "href": "https://store.ghenortrs.com.br/aros/",
      "productPathPatterns": ["aro-"],
      "terms": ["aro", "rim", "heavyduty", "27.5", "29"]
    },
    {
      "id": "rotores",
      "label": "Rotores",
      "commerce": "contact",
      "href": "/contato",
      "productPathPatterns": ["disco-", "rotor-"],
      "terms": ["rotor", "disco", "223mm"]
    },
    {
      "id": "mass-dampers",
      "label": "Mass dampers",
      "commerce": "contact",
      "href": "/contato",
      "productPathPatterns": ["mass-damper-"],
      "terms": ["mass damper", "amortecimento"]
    }
  ]
}
```

- [ ] **Step 5: Implement strict XML validation, namespace parsing, normalization, and resilient sync**

```js
const validation = XMLValidator.validate(xml);
if (validation !== true) {
  const { line, col, msg } = validation.err;
  throw new Error(`Invalid Nuvemshop sitemap at ${line}:${col}: ${msg}`);
}

const parser = new XMLParser({
  removeNSPrefix: true,
  isArray: (_name, path) =>
    path === 'urlset.url' || path === 'urlset.url.image',
});

const canonicalUrls = parsed.urlset.url.filter(
  ({ loc }) => !new URL(loc).pathname.startsWith('/pt/'),
);
```

`syncStoreSearchIndex` must use an abort timeout, write atomically through a sibling temporary file, and retain the existing committed index with a warning when network fetch fails. XML/schema errors must fail instead of silently replacing valid data.

- [ ] **Step 6: Run sync and parser tests**

Run: `rtk pnpm search:sync && rtk pnpm vitest run scripts/store-search-index.test.mjs`

Expected: generated index contains the current canonical Nuvemshop products once each; tests PASS.

### Task 2: Search ranking and accessible reusable UI

**Files:**
- Create: `src/search/search-types.ts`
- Create: `src/search/search-engine.ts`
- Create: `src/search/search-engine.test.ts`
- Create: `src/components/search/store-search.tsx`
- Create: `src/components/search/store-search.test.tsx`
- Modify: `src/components/navigation/app-header.tsx`
- Modify: `src/components/navigation/mobile-menu-overlay.tsx`
- Modify: `src/app.test.tsx`

**Interfaces:**
- Produces: `SearchEntry`, `SearchResult`, `normalizeSearchText(value)`, and `searchCatalog(query, entries, limit?)`.
- Produces: `<StoreSearch autoFocus? mode="desktop" | "mobile" onNavigate? />`.
- Consumes: generated store index and local route entries.

- [ ] **Step 1: Write failing ranking tests**

```ts
it('matches accents, compatibility models, and English storefront names', () => {
  expect(searchCatalog('pastilha hayes a4', entries)[0]?.id).toBe(
    'product:disk-brake-pads-ultra-hayes-dominion-a4',
  );
  expect(searchCatalog('cubo boost xd', entries)[0]?.family).toBe('cubos');
  expect(searchCatalog('aro 29', entries)[0]?.family).toBe('aros');
});

it('returns consultation routes for unavailable families', () => {
  expect(searchCatalog('rotor 223', entries)[0]).toMatchObject({
    family: 'rotores',
    commerce: 'contact',
    href: '/contato',
  });
});
```

- [ ] **Step 2: Run ranking tests and verify failure**

Run: `rtk pnpm vitest run src/search/search-engine.test.ts`

Expected: FAIL because search engine does not exist.

- [ ] **Step 3: Implement deterministic token ranking**

```ts
export function normalizeSearchText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/[^a-z0-9.]+/g, ' ')
    .trim();
}

export function searchCatalog(query: string, entries: SearchEntry[], limit = 8) {
  const normalized = normalizeSearchText(query);
  if (!normalized) return entries.filter(({ featured }) => featured).slice(0, limit);
  const tokens = normalized.split(/\s+/);
  return entries
    .map((entry) => ({ entry, score: scoreEntry(entry, normalized, tokens) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title, 'pt-BR'))
    .slice(0, limit)
    .map(({ entry, score }) => ({ ...entry, score }));
}
```

- [ ] **Step 4: Write failing interaction tests**

```tsx
it('filters products and opens the exact Nuvemshop product', async () => {
  render(<StoreSearch autoFocus mode="desktop" />);
  fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar na GHENO' }), {
    target: { value: 'hayes a4' },
  });
  expect(
    screen.getByRole('link', { name: /Disk Brake Pads Ultra Hayes Dominion A4/i }),
  ).toHaveAttribute(
    'href',
    'https://store.ghenortrs.com.br/produtos/disk-brake-pads-ultra-hayes-dominion-a4/',
  );
});

it('offers the official Nuvemshop search when no indexed item matches', async () => {
  render(<StoreSearch mode="desktop" />);
  fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar na GHENO' }), {
    target: { value: 'produto inexistente' },
  });
  expect(
    screen.getByRole('link', { name: 'Buscar “produto inexistente” na loja GHENO' }),
  ).toHaveAttribute(
    'href',
    'https://store.ghenortrs.com.br/search/?q=produto%20inexistente',
  );
});
```

- [ ] **Step 5: Implement searchbox, listbox, empty state, no-results fallback, and keyboard selection**

`StoreSearch` must autofocus only when requested, expose a labelled `searchbox`, render at most eight results, use `aria-activedescendant` with ArrowUp/ArrowDown, activate the selected link with Enter, and encode the query in `https://store.ghenortrs.com.br/search/?q=<query>`. Store entries open their canonical Nuvemshop page; owned routes use `Link`; contact-only entries use `/contato`.

- [ ] **Step 6: Integrate desktop and mobile search**

Replace `QuickCommandPanel`'s static navigation list with `<StoreSearch autoFocus mode="desktop" />`. Add `<StoreSearch mode="mobile" onNavigate={onClose} />` above mobile quick actions. Keep shortcut help limited to implemented shortcuts.

- [ ] **Step 7: Run focused search tests**

Run: `rtk pnpm vitest run src/search/search-engine.test.ts src/components/search/store-search.test.tsx src/app.test.tsx`

Expected: PASS.

### Task 3: Header geometry and navigation truth

**Files:**
- Modify: `src/components/navigation/app-header.tsx`
- Modify: `src/components/navigation/app-header-data.ts`
- Modify: `src/components/navigation/mobile-menu-actions.tsx`
- Modify: `src/components/navigation/app-footer-data.ts`
- Modify: `src/components/navigation/app-footer.tsx`
- Modify: `src/app.test.tsx`

**Interfaces:**
- Header layout invariant: desktop grid columns remain `minmax(0,1fr) auto minmax(0,1fr)` before and after search opens.
- Navigation invariant: no user-facing `Tecnologia` navigation item; logo remains `Início GHENO`.

- [ ] **Step 1: Add failing navigation and geometry contract tests**

```tsx
it('keeps desktop header columns stable and omits Tecnologia navigation', () => {
  renderApp('/');
  expect(screen.getByTestId('desktop-header-layout')).toHaveClass(
    'sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]',
  );
  expect(screen.queryByRole('link', { name: 'Tecnologia' })).toBeNull();
  expect(screen.getByRole('link', { name: 'Início GHENO' })).toHaveAttribute('href', '/');
});
```

- [ ] **Step 2: Run contract test and verify failure**

Run: `rtk pnpm vitest run src/app.test.tsx`

Expected: FAIL on old flex layout and `Tecnologia` links.

- [ ] **Step 3: Replace flex distribution with a stable three-column header grid**

```tsx
<div
  data-testid="desktop-header-layout"
  className="mx-auto flex max-w-[90rem] items-center ... sm:grid sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]"
>
  <div className="justify-self-start"><HeaderBrand /></div>
  <div className="hidden sm:block"><HeaderNavigation /></div>
  <DesktopUtilityCluster className="justify-self-end" />
</div>
```

The open panel stays absolutely positioned and cannot contribute width to grid track sizing.

- [ ] **Step 4: Remove `Tecnologia` and update store category destinations**

Pastilhas route to `/freios/pastilhas-de-freio/`; Cubos route to `/cubos/`; Aros route to `/aros/`; Rotores route to owned `/contato`. Apply this to header dropdown, mobile actions, footer, and search suggestions.

- [ ] **Step 5: Verify browser geometry**

Run a Playwright measurement at 1440×900 that records the desktop nav bounding box before and after clicking search.

Expected: `Math.abs(after.x - before.x) <= 0.5` and no horizontal overflow.

### Task 4: Typography, component cards, and operational highlights

**Files:**
- Modify: `src/styles.css`
- Modify: `src/components/landing/operational-highlights-section.tsx`
- Modify: `src/components/landing/component-families-data.ts`
- Modify: `src/components/landing/component-families-section-parts.tsx`
- Modify: `src/components/landing/home-hero-section.tsx`
- Modify: `src/components/landing/section-cards.tsx`
- Modify: `src/components/pages/components-page-data.ts`
- Modify: `src/components/pages/components-page-sections.tsx`
- Modify: `src/components/pages/home-page.tsx`
- Modify: `src/components/navigation/app-footer.tsx`
- Modify: `src/app.test.tsx`

**Interfaces:**
- Body default: Manrope weight 500, line-height suitable for `body-md`.
- `h1`: Sora 700; `h2` and `h3`: Sora 650; headings use balanced wrapping and body copy uses pretty wrapping.
- Component card data uses `commerce: 'store' | 'contact'`; no `eyebrow` or `isLive` compatibility API remains.

- [ ] **Step 1: Add failing typography and commerce-copy tests**

```tsx
it('shows online inventory accurately without status badges', () => {
  renderApp('/');
  expect(screen.getByText(/Pastilhas, cubos e aros disponíveis na loja/i)).toBeInTheDocument();
  expect(screen.queryByText('ATIVO NO CATÁLOGO')).toBeNull();
  expect(screen.queryByText('CONSULTA COMERCIAL')).toBeNull();
  expect(screen.getByRole('link', { name: /Ver cubos/i })).toHaveAttribute(
    'href',
    'https://store.ghenortrs.com.br/cubos/',
  );
});
```

- [ ] **Step 2: Run app tests and verify failure**

Run: `rtk pnpm vitest run src/app.test.tsx`

Expected: FAIL on stale labels, copy, and URLs.

- [ ] **Step 3: Apply the design-file typography weights globally**

```css
body {
  font-weight: 500;
  line-height: 1.65;
}

h1,
h2,
h3 {
  font-family: var(--font-heading);
  font-weight: 650;
  text-wrap: balance;
}

h1 {
  font-weight: 700;
}

p {
  text-wrap: pretty;
}
```

- [ ] **Step 4: Replace terse operational copy and shrink the highlight panel**

Use these exact pairs:

```ts
[
  ['Compre online', 'Pastilhas, cubos e aros na Nuvemshop'],
  ['Encontre o modelo', 'Busca por sistema, medida e compatibilidade'],
  ['Consulte a equipe', 'Rotores e mass dampers sob consulta'],
  ['Venda profissional', 'Cadastro para oficinas e revendas'],
]
```

Constrain the panel to `max-w-[64rem]`, use four compact near-square cells at desktop, reduce icon/text density, and preserve a readable 2×2 mobile grid.

- [ ] **Step 5: Replace stale family copy and destinations**

Hero, family intro, closing CTA, component page, and footer must state that pastilhas/cubos/aros are online and rotors are handled by contact. Remove card status badges entirely. Use specific category URLs instead of the generic `/produtos/` where a family is named.

- [ ] **Step 6: Run app and primitive tests**

Run: `rtk pnpm vitest run src/app.test.tsx src/components/ui/primitives.test.tsx`

Expected: PASS.

### Task 5: Reduced-motion-aware image immersion

**Files:**
- Create: `src/components/motion/scroll-image.tsx`
- Create: `src/components/motion/scroll-image.test.tsx`
- Modify: `src/components/landing/section-cards.tsx`
- Modify: `src/components/landing/technical-proof-section.tsx`
- Modify: `src/components/landing/competition-proof-section.tsx`
- Modify: `src/components/landing/operational-highlights-section.tsx`

**Interfaces:**
- Produces: `<ScrollImage effect="zoom" | "parallax" ...ImgHTMLAttributes />`.
- Uses `motion/react` imports only: `motion`, `useReducedMotion`, `useScroll`, `useTransform`.

- [ ] **Step 1: Add failing reduced-motion component test**

```tsx
it('renders a meaningful image and exposes the motion primitive', () => {
  render(<ScrollImage alt="Cubo GHENO" effect="zoom" src="/cubo.jpg" />);
  expect(screen.getByRole('img', { name: 'Cubo GHENO' })).toHaveAttribute(
    'data-motion-image',
    'zoom',
  );
});
```

- [ ] **Step 2: Implement the reusable scroll-linked image**

```tsx
const target = useRef<HTMLImageElement>(null);
const reduceMotion = useReducedMotion();
const { scrollYProgress } = useScroll({
  target,
  offset: ['start end', 'end start'],
});
const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.04]);
const y = useTransform(scrollYProgress, [0, 1], ['-3%', '3%']);

return (
  <motion.img
    ref={target}
    data-motion-image={effect}
    style={reduceMotion ? undefined : effect === 'zoom' ? { scale } : { y, scale: 1.04 }}
    {...imageProps}
  />
);
```

- [ ] **Step 3: Replace immersive landing images, not logos or product thumbnails**

Use `zoom` on technical and component-family imagery; use restrained `parallax` on competition imagery. Preserve every existing alt, loading, opacity, crop, border, and overlay decision. Do not animate hero carousel layout.

- [ ] **Step 4: Add staggered operational reveal**

Render each cell with `motion.div`, `initial={reduceMotion ? false : { opacity: 0, y: 12 }}`, `whileInView={{ opacity: 1, y: 0 }}`, `viewport={{ once: true, amount: 0.5 }}`, and index-based delay capped below 240 ms.

- [ ] **Step 5: Verify motion and reduced motion in browser**

Playwright checks desktop scroll transforms change between two scroll positions. A second context with `reducedMotion: 'reduce'` checks `transform` is absent or `none`.

### Task 6: SEO, GEO, and public documentation synchronization

**Files:**
- Modify: `src/seo/seo-config.ts`
- Modify: `src/seo/route-seo.tsx`
- Modify: `src/seo/route-seo.test.tsx`
- Modify: `build/route-pages.ts`
- Modify: `build/route-pages.test.ts`
- Modify: `index.html`
- Modify: `public/llms.txt`
- Modify: `public/sitemap.xml`
- Modify: `src/components/navigation/app-shell.tsx`
- Modify: `docs/project/current-focus.md`
- Modify: `docs/project/milestones.md`
- Modify: `docs/project/timeline.md`
- Modify: `docs/project/m8-search-and-command-experience.md`
- Modify: `docs/project/m7-design-polish-and-navigation-corrections.md`
- Create: `docs/project/search-source-ranking-spec.md`

**Interfaces:**
- SEO descriptions and structured data use the same commerce facts as the central map.
- `WebSite`, `Organization`, `WebPage`, `BreadcrumbList`, and `ItemList` remain factual; no unsupported Product/Offer claims.
- App shell exposes `<a href="#main-content">Pular para o conteúdo</a>` and `<main id="main-content">`.

- [ ] **Step 1: Add failing route metadata and static-render tests**

```tsx
it('describes the current online inventory', () => {
  renderRouteSeo('/componentes');
  expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
    'content',
    expect.stringMatching(/pastilhas, cubos e aros.*loja online/i),
  );
});
```

```ts
it('renders crawlable category destinations in static route HTML', () => {
  const html = renderRouteHtml(template, componentsSeo);
  expect(html).toContain('https://store.ghenortrs.com.br/cubos/');
  expect(html).toContain('https://store.ghenortrs.com.br/aros/');
  expect(html).toContain('/contato');
});
```

- [ ] **Step 2: Update metadata, image alt metadata, and factual ItemList URLs**

Add `twitter:image:alt` handling alongside `og:image:alt`. Point ItemList entries for pastilhas/cubos/aros to their store category URLs and rotors to `/contato`. Keep canonical URLs on `https://ghenortrs.vercel.app` until a verified marketing-domain deployment exists.

- [ ] **Step 3: Add skip link and main target**

```tsx
<a
  className="sr-only z-50 rounded-button bg-primary px-4 py-3 text-on-primary focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
  href="#main-content"
>
  Pular para o conteúdo
</a>
<main id="main-content">...</main>
```

- [ ] **Step 4: Update GEO and project truth**

`public/llms.txt` must explicitly state: online store inventory includes brake pads, hubs, and rims; rotors and mass dampers require contact; search links directly to Nuvemshop product/category pages; checkout stays external. Mark `LUA-49` specification and `LUA-53` implementation complete locally in M8, attach the source/ranking rules, and change M8 from planned to verified only after tests and runtime QA pass.

- [ ] **Step 5: Run SEO/static build tests**

Run: `rtk pnpm vitest run src/seo/route-seo.test.tsx build/route-pages.test.ts && rtk pnpm build`

Expected: route metadata tests PASS; generated `.html` routes contain their canonical, structured data, crawlable headings, and correct category links.

### Task 7: Full verification and Linear handoff

**Files:**
- Modify only if verification reveals a root cause in an in-scope file.

**Interfaces:**
- Produces: evidence for every user requirement and an explicit note if Linear write access is unavailable.

- [ ] **Step 1: Run complete automated gates**

Run:

```bash
rtk pnpm test -- --run
rtk pnpm lint
rtk pnpm typecheck
rtk pnpm format:check
rtk pnpm build
```

Expected: every command exits 0. The previous formatting failures are resolved only in files touched by this work or by a scoped formatting pass.

- [ ] **Step 2: Run desktop and mobile browser QA**

At 1440×900 and 390×844 verify search open/close, query `hayes a4`, query `cubo boost xd`, query `aro 29`, no-result fallback, exact destinations, no nav shift, no horizontal overflow, card copy, footer links, image scroll motion, and reduced-motion behavior.

- [ ] **Step 3: Audit SEO/GEO output**

Inspect built `/index.html`, `/componentes.html`, `/b2b.html`, `/sobre.html`, `/contato.html`, `/404.html`, `robots.txt`, `sitemap.xml`, and `llms.txt`. Confirm no stale `Tecnologia` nav or old availability claims remain outside historical plans.

- [ ] **Step 4: Synchronize Linear if a writable connector exists**

Update `LUA-49` with `docs/project/search-source-ranking-spec.md`, ranking rules, and Nuvemshop source evidence. Update `LUA-53` with test/build/browser evidence and remaining limitations. If no writable connector exists, record that exact external blocker in the final handoff without claiming Linear synchronization.

- [ ] **Step 5: Review worktree diff**

Run: `rtk git status --short && rtk git diff --check && rtk git diff --stat`

Expected: only scoped implementation, tests, generated index, and synchronized docs are changed; no artifacts, credentials, or unrelated user files.

## Self-review

- Spec coverage: Tasks 1–2 cover live Nuvemshop search and source/ranking; Task 3 covers the measured nav flicker and `Tecnologia`; Task 4 covers typography, operational panel, inventory, and removed labels; Task 5 covers scroll immersion; Task 6 covers SEO/GEO/docs; Task 7 covers Linear and proof.
- Placeholder scan: implementation steps define concrete interfaces, copy, commands, package versions, and expected behavior.
- Type consistency: `commerce` uses only `store | contact` in map, generated entries, search results, and cards. Family IDs are `pastilhas | cubos | aros | rotores | mass-dampers` across all consumers.
