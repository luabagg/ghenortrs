import { readFile } from 'node:fs/promises';

import { SEO_ROUTES } from '../src/seo/seo-config';
import { getGeneratedRoutePaths, renderRouteHtml } from './route-pages';

describe('route page generation', () => {
  it.each(SEO_ROUTES)(
    'replaces every route-specific head value for $path',
    async (route) => {
      const template = await readFile('index.html', 'utf8');
      const output = renderRouteHtml(template, route);
      const canonical = new URL(route.path, 'https://ghenortrs.vercel.app');

      expect(output).toContain(
        `<title data-seo="title">${route.title}</title>`,
      );
      expect(output).toContain(`content="${route.description}"`);
      expect(output).toContain(`href="${canonical.toString()}"`);
      expect(output).toContain(`content="${canonical.toString()}"`);
      expect(output).toContain(`content="${route.image}"`);
      expect(output).toContain(JSON.stringify(route.jsonLd).slice(0, 40));
      expect(output.match(/rel="canonical"/g)).toHaveLength(1);
      expect(output.match(/id="route-seo-jsonld"/g)).toHaveLength(1);
    },
  );

  it('enumerates every public route once', () => {
    expect(getGeneratedRoutePaths()).toEqual([
      '/',
      '/componentes',
      '/b2b',
      '/sobre',
      '/contato',
    ]);
  });

  it('keeps discovery files aligned with every canonical route', async () => {
    const [robots, sitemap, llms] = await Promise.all([
      readFile('public/robots.txt', 'utf8'),
      readFile('public/sitemap.xml', 'utf8'),
      readFile('public/llms.txt', 'utf8'),
    ]);

    expect(robots).toContain(
      'Sitemap: https://ghenortrs.vercel.app/sitemap.xml',
    );
    for (const route of SEO_ROUTES) {
      const canonical = new URL(
        route.path,
        'https://ghenortrs.vercel.app',
      ).toString();
      expect(
        sitemap.match(new RegExp(`<loc>${canonical}</loc>`, 'g')),
      ).toHaveLength(1);
      expect(llms).toContain(canonical);
    }
    expect(sitemap).not.toContain('nao-existe');
  });
});
