import { readFile } from 'node:fs/promises';

import { SEO_ROUTES } from '../src/seo/seo-config';
import {
  getGeneratedRoutePaths,
  renderNotFoundHtml,
  renderRouteHtml,
} from './route-pages';

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
      expect(output).toContain('data-static-route-content');
      expect(output).toContain(`<h1>${route.staticContent.heading}</h1>`);
      expect(output).toContain(`<p>${route.description}</p>`);
      for (const link of route.staticContent.links) {
        expect(output).toContain(`<a href="${link.href}">${link.label}</a>`);
      }
      expect(output).not.toContain('<div id="root"></div>');
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

  it('renders crawlable commerce destinations on the components route', async () => {
    const template = await readFile('index.html', 'utf8');
    const route = SEO_ROUTES.find(({ path }) => path === '/componentes');
    if (!route) throw new Error('Components SEO route is missing');
    const output = renderRouteHtml(template, route);

    expect(output).toContain('https://store.ghenortrs.com.br/cubos/');
    expect(output).toContain('https://store.ghenortrs.com.br/aros/');
    expect(output).toContain('href="/contato"');
    expect(output).toContain('name="twitter:image:alt"');
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

  it('renders a crawlable noindex not-found document', async () => {
    const template = await readFile('index.html', 'utf8');
    const output = renderNotFoundHtml(template);

    expect(output).toContain('data-static-route-content');
    expect(output).toContain('<h1>Página não encontrada</h1>');
    expect(output).toContain('content="noindex, nofollow"');
    expect(output).not.toContain('<div id="root"></div>');
  });
});
