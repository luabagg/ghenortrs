import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import {
  INDEX_ROBOTS,
  NOT_FOUND_SEO,
  SEO_ROUTES,
  SITE_ORIGIN,
  type SeoRoute,
} from '../src/seo/seo-config';

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function replaceMeta(html: string, marker: string, value: string) {
  const pattern = new RegExp(
    `<meta(?=[^>]*data-seo="${marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}")[^>]*>`,
    's',
  );
  const attribute = marker.startsWith('og:') ? 'property' : 'name';
  return html.replace(
    pattern,
    `<meta ${attribute}="${marker}" content="${escapeHtml(value)}" data-seo="${marker}" />`,
  );
}

function removeMeta(html: string, marker: string) {
  const escapedMarker = marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return html.replace(
    new RegExp(`\\s*<meta(?=[^>]*data-seo="${escapedMarker}")[^>]*>`, 's'),
    '',
  );
}

function serializeJsonLd(value: Record<string, unknown>) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function renderRouteHtml(html: string, seo: SeoRoute) {
  const canonical = new URL(seo.path, SITE_ORIGIN).toString();
  let output = html.replace(
    /<title[^>]*data-seo="title"[^>]*>.*?<\/title>/s,
    `<title data-seo="title">${escapeHtml(seo.title)}</title>`,
  );

  const metadata = {
    description: seo.description,
    robots: INDEX_ROBOTS,
    'og:title': seo.title,
    'og:description': seo.description,
    'og:url': canonical,
    'og:image': seo.image,
    'twitter:title': seo.title,
    'twitter:description': seo.description,
    'twitter:image': seo.image,
  };

  for (const [marker, value] of Object.entries(metadata)) {
    output = replaceMeta(output, marker, value);
  }

  output = output.replace(
    /<link(?=[^>]*data-seo="canonical")[^>]*>/s,
    `<link rel="canonical" href="${canonical}" data-seo="canonical" />`,
  );
  output = output.replace(
    /<script[^>]*id="route-seo-jsonld"[^>]*>.*?<\/script>/s,
    `<script id="route-seo-jsonld" type="application/ld+json">${serializeJsonLd(seo.jsonLd)}</script>`,
  );

  return output;
}

export function renderNotFoundHtml(html: string) {
  let output = html.replace(
    /<title[^>]*data-seo="title"[^>]*>.*?<\/title>/s,
    `<title data-seo="title">${NOT_FOUND_SEO.title}</title>`,
  );
  output = replaceMeta(output, 'description', NOT_FOUND_SEO.description);
  output = replaceMeta(output, 'robots', NOT_FOUND_SEO.robots);
  for (const marker of [
    'og:title',
    'og:description',
    'og:url',
    'og:image',
    'twitter:title',
    'twitter:description',
    'twitter:image',
  ]) {
    output = removeMeta(output, marker);
  }
  output = output.replace(/\s*<link(?=[^>]*data-seo="canonical")[^>]*>/s, '');
  output = output.replace(
    /\s*<script[^>]*id="route-seo-jsonld"[^>]*>.*?<\/script>/s,
    '',
  );
  return output;
}

export function getGeneratedRoutePaths() {
  return SEO_ROUTES.map(({ path }) => path);
}

export async function generateRoutePages(outputDirectory = 'dist') {
  const rootIndexPath = resolve(outputDirectory, 'index.html');
  const template = await readFile(rootIndexPath, 'utf8');

  await Promise.all(
    SEO_ROUTES.map(async (seo) => {
      const outputName =
        seo.path === '/' ? 'index.html' : `${seo.path.slice(1)}.html`;
      await writeFile(
        resolve(outputDirectory, outputName),
        renderRouteHtml(template, seo),
      );
    }),
  );

  await writeFile(
    resolve(outputDirectory, '404.html'),
    renderNotFoundHtml(template),
  );
}
