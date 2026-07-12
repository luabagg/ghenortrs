import { readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { XMLParser, XMLValidator } from 'fast-xml-parser';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_MAP_PATH = resolve(ROOT, 'src/catalog/commerce-map.json');
const DEFAULT_OUTPUT_PATH = resolve(ROOT, 'src/search/store-search-index.json');

const WORD_OVERRIDES = new Map([
  ['gheno', 'GHENO'],
  ['go', 'GO'],
  ['heavyduty', 'HEAVYDUTY'],
  ['sram', 'SRAM'],
  ['shimano', 'Shimano'],
  ['magura', 'Magura'],
  ['hayes', 'Hayes'],
  ['hope', 'Hope'],
  ['trp', 'TRP'],
  ['xtr', 'XTR'],
  ['xd', 'XD'],
  ['hg', 'HG'],
  ['zee', 'Zee'],
  ['saint', 'Saint'],
  ['evo', 'EVO'],
]);

const LOWERCASE_WORDS = new Set(['da', 'de', 'do', 'e']);

class SitemapFetchError extends Error {}

function asArray(value) {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function assertCommerceMap(value) {
  if (
    !value ||
    typeof value !== 'object' ||
    typeof value.storeOrigin !== 'string' ||
    typeof value.sitemapUrl !== 'string' ||
    typeof value.searchUrl !== 'string' ||
    !Array.isArray(value.families)
  ) {
    throw new Error('Invalid commerce map');
  }

  for (const family of value.families) {
    if (
      typeof family.id !== 'string' ||
      typeof family.label !== 'string' ||
      !['store', 'contact'].includes(family.commerce) ||
      typeof family.href !== 'string' ||
      !Array.isArray(family.categoryPaths) ||
      !Array.isArray(family.productPathPatterns) ||
      !Array.isArray(family.terms)
    ) {
      throw new Error(`Invalid commerce family: ${family?.id ?? 'unknown'}`);
    }
  }

  return value;
}

function humanizeProductSlug(slug) {
  const normalized = slug.replace(/-27-5$/, '-27.5');
  return normalized
    .split('-')
    .filter(Boolean)
    .map((word, index) => {
      const override = WORD_OVERRIDES.get(word.toLowerCase());
      if (override) return override;
      if (index > 0 && LOWERCASE_WORDS.has(word.toLowerCase())) {
        return word.toLowerCase();
      }
      if (/^[a-z]+\d+$/i.test(word)) return word.toUpperCase();
      return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
    })
    .join(' ');
}

function findFamilyForProduct(slug, families) {
  return families.find((family) =>
    family.productPathPatterns.some((pattern) => slug.startsWith(pattern)),
  );
}

function findFamilyForCategory(pathname, families) {
  return families.find((family) => family.categoryPaths.includes(pathname));
}

function createProductEntry(urlRecord, url, slug, family) {
  const images = asArray(urlRecord.image);
  const firstImage = images[0];
  const image =
    firstImage && typeof firstImage === 'object' && typeof firstImage.loc === 'string'
      ? firstImage.loc
      : null;
  const title = humanizeProductSlug(slug);

  return {
    id: `product:${slug}`,
    kind: 'product',
    title,
    href: family.commerce === 'store' ? url.toString() : family.href,
    image,
    family: family.id,
    commerce: family.commerce,
    modifiedAt:
      typeof urlRecord.lastmod === 'string' ? urlRecord.lastmod : null,
    terms: [...new Set([title, slug, family.label, ...family.terms])],
    featured: false,
  };
}

function createCategoryEntry(urlRecord, family) {
  return {
    id: `category:${family.id}`,
    kind: 'category',
    title: family.label,
    href: family.href,
    image: null,
    family: family.id,
    commerce: family.commerce,
    modifiedAt:
      typeof urlRecord.lastmod === 'string' ? urlRecord.lastmod : null,
    terms: [...new Set([family.label, ...family.terms])],
    featured: true,
  };
}

export function parseStoreSitemap(xml, commerceMapInput) {
  const commerceMap = assertCommerceMap(commerceMapInput);
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
  const parsed = parser.parse(xml);
  const urlRecords = asArray(parsed?.urlset?.url);
  const expectedOrigin = new URL(commerceMap.storeOrigin).origin;
  const entries = [];
  const categoryIds = new Set();

  for (const urlRecord of urlRecords) {
    if (!urlRecord || typeof urlRecord.loc !== 'string') continue;
    const url = new URL(urlRecord.loc);
    if (url.origin !== expectedOrigin) {
      throw new Error(`Unexpected sitemap origin: ${url.origin}`);
    }
    if (url.pathname.startsWith('/pt/')) continue;

    const productMatch = url.pathname.match(/^\/produtos\/([^/]+)\/$/);
    if (productMatch) {
      const slug = productMatch[1];
      const family = findFamilyForProduct(slug, commerceMap.families);
      if (!family) {
        throw new Error(`Unmapped Nuvemshop product: ${url.pathname}`);
      }
      entries.push(createProductEntry(urlRecord, url, slug, family));
      continue;
    }

    const family = findFamilyForCategory(url.pathname, commerceMap.families);
    if (family && !categoryIds.has(family.id)) {
      categoryIds.add(family.id);
      entries.push(createCategoryEntry(urlRecord, family));
    }
  }

  return entries.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === 'category' ? -1 : 1;
    return a.title.localeCompare(b.title, 'pt-BR');
  });
}

async function fetchSitemap(url, fetchImpl, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(url, {
      headers: { accept: 'application/xml,text/xml;q=0.9' },
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new SitemapFetchError(
        `Nuvemshop sitemap request failed with HTTP ${response.status}`,
      );
    }
    return await response.text();
  } catch (error) {
    if (error instanceof SitemapFetchError) throw error;
    throw new SitemapFetchError(
      error instanceof Error ? error.message : 'Nuvemshop sitemap request failed',
    );
  } finally {
    clearTimeout(timeout);
  }
}

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

export async function syncStoreSearchIndex({
  commerceMapPath = DEFAULT_MAP_PATH,
  outputPath = DEFAULT_OUTPUT_PATH,
  fetchImpl = fetch,
  timeoutMs = 10_000,
  now = () => new Date(),
  warn = console.warn,
} = {}) {
  const commerceMap = assertCommerceMap(await readJson(commerceMapPath));
  let xml;

  try {
    xml = await fetchSitemap(commerceMap.sitemapUrl, fetchImpl, timeoutMs);
  } catch (error) {
    if (error instanceof SitemapFetchError) {
      try {
        await readFile(outputPath, 'utf8');
        warn(`Store search sync skipped; committed index retained: ${error.message}`);
        return { status: 'stale', outputPath };
      } catch {
        throw error;
      }
    }
    throw error;
  }

  const entries = parseStoreSitemap(xml, commerceMap);
  if (entries.length === 0) {
    throw new Error('Nuvemshop sitemap produced an empty search index');
  }

  const payload = {
    source: commerceMap.sitemapUrl,
    generatedAt: now().toISOString(),
    entries,
  };
  const temporaryPath = `${outputPath}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  await rename(temporaryPath, outputPath);
  return { status: 'updated', outputPath, entries: entries.length };
}

const isCli =
  process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isCli) {
  syncStoreSearchIndex()
    .then((result) => {
      const detail = result.entries ? ` (${result.entries} entries)` : '';
      console.log(`Store search index ${result.status}${detail}`);
    })
    .catch((error) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    });
}
