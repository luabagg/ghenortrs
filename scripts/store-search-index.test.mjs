import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  parseStoreSitemap,
  syncStoreSearchIndex,
} from './store-search-index.mjs';

const SITEMAP_FIXTURE = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://store.ghenortrs.com.br/produtos/cubo-dianteiro-gheno-go/</loc>
    <lastmod>2026-05-24T21:41:24Z</lastmod>
    <image:image>
      <image:loc>https://cdn.example.com/cubo.webp</image:loc>
    </image:image>
  </url>
  <url>
    <loc>https://store.ghenortrs.com.br/pt/produtos/cubo-dianteiro-gheno-go/</loc>
    <lastmod>2026-05-24T21:41:24Z</lastmod>
    <image:image>
      <image:loc>https://cdn.example.com/cubo.webp</image:loc>
    </image:image>
  </url>
  <url>
    <loc>https://store.ghenortrs.com.br/produtos/disco-elite-3-223mm/</loc>
    <lastmod>2026-05-21T15:37:28Z</lastmod>
    <image:image>
      <image:loc>https://cdn.example.com/rotor.webp</image:loc>
    </image:image>
  </url>
  <url>
    <loc>https://store.ghenortrs.com.br/cubos/</loc>
    <lastmod>2026-05-21T15:21:20Z</lastmod>
  </url>
</urlset>`;

const COMMERCE_MAP = {
  storeOrigin: 'https://store.ghenortrs.com.br',
  sitemapUrl: 'https://store.ghenortrs.com.br/sitemap.xml',
  searchUrl: 'https://store.ghenortrs.com.br/search/',
  families: [
    {
      id: 'cubos',
      label: 'Cubos',
      commerce: 'store',
      href: 'https://store.ghenortrs.com.br/cubos/',
      categoryPaths: ['/cubos/'],
      productPathPatterns: ['cubo-'],
      terms: ['hub', 'boost'],
    },
    {
      id: 'rotores',
      label: 'Rotores',
      commerce: 'contact',
      href: '/contato',
      categoryPaths: ['/freios/discos-de-freio/'],
      productPathPatterns: ['disco-', 'rotor-'],
      terms: ['rotor', 'disco'],
    },
  ],
};

describe('parseStoreSitemap', () => {
  it('deduplicates language variants and applies commerce destinations', () => {
    const entries = parseStoreSitemap(SITEMAP_FIXTURE, COMMERCE_MAP);

    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'product:cubo-dianteiro-gheno-go',
          family: 'cubos',
          commerce: 'store',
          href: 'https://store.ghenortrs.com.br/produtos/cubo-dianteiro-gheno-go/',
          image: 'https://cdn.example.com/cubo.webp',
        }),
        expect.objectContaining({
          id: 'product:disco-elite-3-223mm',
          family: 'rotores',
          commerce: 'contact',
          href: '/contato',
          image: 'https://cdn.example.com/rotor.webp',
        }),
        expect.objectContaining({
          id: 'category:cubos',
          kind: 'category',
          family: 'cubos',
          href: 'https://store.ghenortrs.com.br/cubos/',
        }),
      ]),
    );
    expect(
      entries.filter((entry) => entry.id.includes('cubo-dianteiro')),
    ).toHaveLength(1);
  });

  it('maps brand-first pastilha slugs by substring pattern', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://store.ghenortrs.com.br/produtos/hayes-dominion-a4-pastilha-de-freio-gheno-ultra/</loc>
    <lastmod>2026-08-02T12:00:00Z</lastmod>
  </url>
</urlset>`;
    const map = {
      ...COMMERCE_MAP,
      families: [
        {
          id: 'pastilhas',
          label: 'Pastilhas de freio',
          commerce: 'store',
          href: 'https://store.ghenortrs.com.br/freios/pastilhas-de-freio/',
          categoryPaths: ['/freios/pastilhas-de-freio/'],
          productPathPatterns: ['disk-brake-pads-', 'pastilha-de-freio-'],
          terms: ['pastilha', 'hayes'],
        },
        ...COMMERCE_MAP.families,
      ],
    };

    const entries = parseStoreSitemap(xml, map);

    expect(entries).toEqual([
      expect.objectContaining({
        id: 'product:hayes-dominion-a4-pastilha-de-freio-gheno-ultra',
        family: 'pastilhas',
        commerce: 'store',
        title: 'Hayes Dominion A4 Pastilha de Freio GHENO Ultra',
        href: 'https://store.ghenortrs.com.br/produtos/hayes-dominion-a4-pastilha-de-freio-gheno-ultra/',
      }),
    ]);
  });

  it('rejects malformed XML with source location', () => {
    expect(() => parseStoreSitemap('<urlset><url></urlset>', COMMERCE_MAP)).toThrow(
      /Invalid Nuvemshop sitemap at \d+:\d+:/,
    );
  });

  it('rejects unexpected sitemap origins', () => {
    const xml = SITEMAP_FIXTURE.replace(
      'https://store.ghenortrs.com.br/produtos/cubo-dianteiro-gheno-go/',
      'https://example.com/produtos/cubo-dianteiro-gheno-go/',
    );

    expect(() => parseStoreSitemap(xml, COMMERCE_MAP)).toThrow(
      /Unexpected sitemap origin/,
    );
  });
});

describe('syncStoreSearchIndex', () => {
  const temporaryDirectories = [];

  afterEach(async () => {
    await Promise.all(
      temporaryDirectories.splice(0).map((path) =>
        rm(path, { force: true, recursive: true }),
      ),
    );
  });

  async function createPaths() {
    const directory = await mkdtemp(join(tmpdir(), 'gheno-search-'));
    temporaryDirectories.push(directory);
    const commerceMapPath = join(directory, 'commerce-map.json');
    const outputPath = join(directory, 'store-search-index.json');
    await writeFile(commerceMapPath, JSON.stringify(COMMERCE_MAP), 'utf8');
    return { commerceMapPath, outputPath };
  }

  it('writes a deterministic generated index', async () => {
    const paths = await createPaths();
    const result = await syncStoreSearchIndex({
      ...paths,
      fetchImpl: async () => new Response(SITEMAP_FIXTURE),
      now: () => new Date('2026-07-12T00:00:00Z'),
    });

    expect(result).toMatchObject({ status: 'updated', entries: 3 });
    expect(JSON.parse(await readFile(paths.outputPath, 'utf8'))).toMatchObject({
      generatedAt: '2026-07-12T00:00:00.000Z',
      entries: expect.arrayContaining([
        expect.objectContaining({ id: 'category:cubos' }),
      ]),
    });
  });

  it('retains a committed index when the store is unreachable', async () => {
    const paths = await createPaths();
    const committedIndex = '{"entries":[{"id":"existing"}]}\n';
    const warnings = [];
    await writeFile(paths.outputPath, committedIndex, 'utf8');

    const result = await syncStoreSearchIndex({
      ...paths,
      fetchImpl: async () => {
        throw new TypeError('network unavailable');
      },
      warn: (message) => warnings.push(message),
    });

    expect(result.status).toBe('stale');
    expect(await readFile(paths.outputPath, 'utf8')).toBe(committedIndex);
    expect(warnings[0]).toMatch(/committed index retained/);
  });

  it('does not replace a valid index with malformed XML', async () => {
    const paths = await createPaths();
    const committedIndex = '{"entries":[{"id":"existing"}]}\n';
    await writeFile(paths.outputPath, committedIndex, 'utf8');

    await expect(
      syncStoreSearchIndex({
        ...paths,
        fetchImpl: async () => new Response('<urlset><url></urlset>'),
      }),
    ).rejects.toThrow(/Invalid Nuvemshop sitemap/);
    expect(await readFile(paths.outputPath, 'utf8')).toBe(committedIndex);
  });
});
