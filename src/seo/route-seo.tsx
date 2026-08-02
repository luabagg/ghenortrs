import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import {
  getSeoForPath,
  INDEX_ROBOTS,
  NOT_FOUND_SEO,
  SITE_ORIGIN,
} from './seo-config';

type MetaSelector =
  | { name: string; property?: never }
  | { name?: never; property: string };

function setMeta(selector: MetaSelector, content: string) {
  const [attribute, value] =
    selector.name !== undefined
      ? (['name', selector.name] as const)
      : (['property', selector.property] as const);
  let element = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${value}"]`,
  );

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, value);
    document.head.append(element);
  }

  element.content = content;
  element.dataset.seo = 'route';
}

function removeMeta(selector: MetaSelector) {
  const [attribute, value] =
    selector.name !== undefined
      ? (['name', selector.name] as const)
      : (['property', selector.property] as const);
  document.head.querySelector(`meta[${attribute}="${value}"]`)?.remove();
}

function setCanonical(href?: string) {
  const existing = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );

  if (!href) {
    existing?.remove();
    return;
  }

  const element = existing ?? document.createElement('link');
  element.rel = 'canonical';
  element.href = href;
  element.dataset.seo = 'route';
  if (!existing) document.head.append(element);
}

function setJsonLd(value?: Record<string, unknown>) {
  const existing =
    document.head.querySelector<HTMLScriptElement>('#route-seo-jsonld');

  if (!value) {
    existing?.remove();
    return;
  }

  const element = existing ?? document.createElement('script');
  element.id = 'route-seo-jsonld';
  element.type = 'application/ld+json';
  element.textContent = JSON.stringify(value).replace(/</g, '\\u003c');
  if (!existing) document.head.append(element);
}

export function RouteSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = getSeoForPath(pathname);

    if (!seo) {
      document.title = NOT_FOUND_SEO.title;
      setMeta({ name: 'description' }, NOT_FOUND_SEO.description);
      setMeta({ name: 'robots' }, NOT_FOUND_SEO.robots);
      removeMeta({ property: 'og:url' });
      removeMeta({ property: 'og:title' });
      removeMeta({ property: 'og:description' });
      removeMeta({ property: 'og:image' });
      removeMeta({ property: 'og:image:alt' });
      removeMeta({ name: 'twitter:title' });
      removeMeta({ name: 'twitter:description' });
      removeMeta({ name: 'twitter:image' });
      removeMeta({ name: 'twitter:image:alt' });
      setCanonical();
      setJsonLd();
      return;
    }

    const canonical = new URL(seo.path, SITE_ORIGIN).toString();
    document.title = seo.title;
    setMeta({ name: 'description' }, seo.description);
    setMeta({ name: 'robots' }, INDEX_ROBOTS);
    setMeta({ property: 'og:type' }, 'website');
    setMeta({ property: 'og:site_name' }, 'GHENO rotors');
    setMeta({ property: 'og:locale' }, 'pt_BR');
    setMeta({ property: 'og:title' }, seo.title);
    setMeta({ property: 'og:description' }, seo.description);
    setMeta({ property: 'og:url' }, canonical);
    setMeta({ property: 'og:image' }, seo.image);
    setMeta({ property: 'og:image:alt' }, seo.imageAlt);
    setMeta({ name: 'twitter:card' }, 'summary_large_image');
    setMeta({ name: 'twitter:title' }, seo.title);
    setMeta({ name: 'twitter:description' }, seo.description);
    setMeta({ name: 'twitter:image' }, seo.image);
    setMeta({ name: 'twitter:image:alt' }, seo.imageAlt);
    setCanonical(canonical);
    setJsonLd(seo.jsonLd);
  }, [pathname]);

  return null;
}
