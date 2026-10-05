import { readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { XMLParser, XMLValidator } from 'fast-xml-parser';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_MAP_PATH = resolve(ROOT, 'app/catalog/commerce-map.json');
const DEFAULT_OUTPUT_PATH = resolve(ROOT, 'app/search/store-search-index.json');

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
    family.productPathPatterns.some((pattern) => slug.includes(pattern)),
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

  return entries.sort(compareEntries);
}

function compareEntries(a, b) {
  if (a.kind !== b.kind) return a.kind === 'category' ? -1 : 1;
  return a.title.localeCompare(b.title, 'pt-BR');
}

async function fetchText(url, fetchImpl, timeoutMs, accept) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(url, {
      headers: { accept },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchSitemap(url, fetchImpl, timeoutMs) {
  try {
    return await fetchText(
      url,
      fetchImpl,
      timeoutMs,
      'application/xml,text/xml;q=0.9',
    );
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'unknown error';
    throw new SitemapFetchError(`Nuvemshop sitemap request failed: ${reason}`);
  }
}

const OG_TITLE_PATTERN = /<meta\s+property="og:title"\s+content="([^"]*)"/i;
const NAMED_ENTITIES = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' };

function decodeHtmlEntities(text) {
  return text.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (match, code) => {
    if (code.startsWith('#x') || code.startsWith('#X')) {
      return String.fromCodePoint(parseInt(code.slice(2), 16));
    }
    if (code.startsWith('#')) {
      return String.fromCodePoint(parseInt(code.slice(1), 10));
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? match;
  });
}

function readStoreProductName(html) {
  const match = html.match(OG_TITLE_PATTERN);
  const name = match ? decodeHtmlEntities(match[1]).trim() : '';
  return name || null;
}

function withTitle(entry, title) {
  return { ...entry, title, terms: [...new Set([title, ...entry.terms])] };
}

async function readCommittedTitles(outputPath) {
  try {
    const index = await readJson(outputPath);
    return new Map(index.entries.map((entry) => [entry.id, entry.title]));
  } catch {
    return new Map();
  }
}

/**
 * Sitemap slugs drop punctuation ("Magura MT5 MT7"). The product page og:title
 * holds the name the store shows ("Magura MT5 / MT7"). The site shows these
 * names to visitors and crawlers, so a failed fetch keeps the committed title.
 */
async function nameStoreProducts(entries, options) {
  const { storeOrigin, fetchImpl, timeoutMs, committedTitles, warn } = options;

  return Promise.all(
    entries.map(async (entry) => {
      if (entry.kind !== 'product') return entry;
      const slug = entry.id.slice('product:'.length);
      const url = new URL(`/produtos/${slug}/`, storeOrigin).toString();

      try {
        const html = await fetchText(url, fetchImpl, timeoutMs, 'text/html');
        const name = readStoreProductName(html);
        if (!name) throw new Error('page has no og:title');
        return withTitle(entry, name);
      } catch (error) {
        const committedTitle = committedTitles.get(entry.id);
        const reason = error instanceof Error ? error.message : 'unknown error';
        warn(
          `Store product name not fetched for ${slug}; ${committedTitle ? 'committed' : 'slug'} title kept: ${reason}`,
        );
        return committedTitle ? withTitle(entry, committedTitle) : entry;
      }
    }),
  );
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

  const sitemapEntries = parseStoreSitemap(xml, commerceMap);
  if (sitemapEntries.length === 0) {
    throw new Error('Nuvemshop sitemap produced an empty search index');
  }
  const namedEntries = await nameStoreProducts(sitemapEntries, {
    storeOrigin: commerceMap.storeOrigin,
    fetchImpl,
    timeoutMs,
    committedTitles: await readCommittedTitles(outputPath),
    warn,
  });
  const entries = namedEntries.sort(compareEntries);

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
