import { describe, expect, it } from 'vitest';

import { buildSeoMetaForPath } from '~/lib/seo';
import { SEO_ROUTES } from '~/seo/seo-config';

describe('buildSeoMetaForPath', () => {
  it.each(SEO_ROUTES.map((route) => [route.path, route.title] as const))(
    'builds complete metadata for %s',
    (path, title) => {
      const meta = buildSeoMetaForPath(path);
      const asRecord = Object.fromEntries(
        meta.flatMap((entry) => {
          if ('title' in entry && entry.title) return [['title', entry.title]];
          if ('name' in entry && entry.name)
            return [[`name:${entry.name}`, entry.content]];
          if ('property' in entry && entry.property)
            return [[`property:${entry.property}`, entry.content]];
          if ('tagName' in entry && entry.tagName === 'link')
            return [[`link:${entry.rel}`, entry.href]];
          return [];
        }),
      );

      expect(asRecord.title).toBe(title);
      expect(asRecord['name:description']).toEqual(
        expect.stringMatching(/GHENO rotors|MTB|lojistas|revendas/i),
      );
      expect(asRecord['name:robots']).toBe(
        'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      );
      expect(asRecord['link:canonical']).toBe(
        `https://www.ghenortrs.com.br${path === '/' ? '/' : path}`,
      );
      expect(asRecord['property:og:url']).toBe(
        `https://www.ghenortrs.com.br${path === '/' ? '/' : path}`,
      );
      expect(asRecord['property:og:image']).toEqual(
        expect.stringContaining('https://www.ghenortrs.com.br/'),
      );
      expect(meta.some((entry) => 'script:ld+json' in entry)).toBe(true);
    },
  );

  it('returns noindex metadata for unknown paths', () => {
    const meta = buildSeoMetaForPath('/nao-existe');
    const robots = meta.find(
      (entry) => 'name' in entry && entry.name === 'robots',
    );
    expect(robots).toMatchObject({ content: 'noindex, nofollow' });
  });
});
