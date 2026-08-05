import type { MetaDescriptor } from '@remix-run/node';

import {
  getSeoForPath,
  INDEX_ROBOTS,
  NOT_FOUND_SEO,
  SITE_ORIGIN,
  type SeoRoute,
} from '~/seo/seo-config';

export function absoluteUrl(path: string): string {
  return new URL(path, `${SITE_ORIGIN}/`).toString();
}

export function buildSeoMeta(seo: SeoRoute): MetaDescriptor[] {
  const canonicalUrl = absoluteUrl(seo.path);

  return [
    { title: seo.title },
    { name: 'description', content: seo.description },
    { name: 'theme-color', content: '#050505' },
    { name: 'robots', content: INDEX_ROBOTS },
    {
      name: 'googlebot',
      content: INDEX_ROBOTS,
    },
    { tagName: 'link', rel: 'canonical', href: canonicalUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'pt_BR' },
    { property: 'og:site_name', content: 'GHENO rotors' },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:title', content: seo.title },
    { property: 'og:description', content: seo.description },
    { property: 'og:image', content: seo.image },
    { property: 'og:image:alt', content: seo.imageAlt },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: seo.title },
    { name: 'twitter:description', content: seo.description },
    { name: 'twitter:image', content: seo.image },
    { name: 'twitter:image:alt', content: seo.imageAlt },
    { 'script:ld+json': seo.jsonLd },
  ];
}

export function buildSeoMetaForPath(pathname: string): MetaDescriptor[] {
  const seo = getSeoForPath(pathname);
  if (!seo) {
    return [
      { title: NOT_FOUND_SEO.title },
      { name: 'description', content: NOT_FOUND_SEO.description },
      { name: 'robots', content: NOT_FOUND_SEO.robots },
      { name: 'googlebot', content: NOT_FOUND_SEO.robots },
    ];
  }
  return buildSeoMeta(seo);
}

export function buildNoIndexMeta(
  title: string,
  description = 'Esta página não deve aparecer em resultados de busca.',
): MetaDescriptor[] {
  return [
    { title },
    { name: 'description', content: description },
    { name: 'robots', content: 'noindex, nofollow, noarchive' },
    { name: 'googlebot', content: 'noindex, nofollow, noarchive' },
  ];
}
