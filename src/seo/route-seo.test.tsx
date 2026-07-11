import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { RouteSeo } from './route-seo';

const publicRoutes = [
  ['/', 'GHENO | Componentes MTB de alto desempenho'],
  ['/componentes', 'Componentes MTB | Pastilhas, cubos, aros e rotores GHENO'],
  ['/b2b', 'GHENO B2B | Atendimento para lojistas e oficinas'],
  ['/sobre', 'Sobre a GHENO | Componentes de performance para MTB'],
  ['/contato', 'Contato GHENO | Varejo, revendas e oficinas'],
] as const;

describe('RouteSeo', () => {
  it.each(publicRoutes)('sets complete metadata for %s', (path, title) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <RouteSeo />
      </MemoryRouter>,
    );

    expect(document.title).toBe(title);
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      expect.stringMatching(/GHENO|MTB|lojistas|revendas/i),
    );
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      'content',
      'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    );
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://ghenortrs.vercel.app${path}`,
    );
    expect(document.querySelector('meta[property="og:url"]')).toHaveAttribute(
      'content',
      `https://ghenortrs.vercel.app${path}`,
    );
    expect(document.querySelector('meta[property="og:image"]')).toHaveAttribute(
      'content',
      expect.stringMatching(/^https:\/\/ghenortrs\.vercel\.app\//),
    );
    expect(document.querySelector('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image',
    );

    const jsonLd = document.querySelector('#route-seo-jsonld');
    expect(jsonLd).toHaveAttribute('type', 'application/ld+json');
    expect(() => JSON.parse(jsonLd?.textContent ?? '')).not.toThrow();
  });

  it('marks unknown routes as noindex and removes structured data', () => {
    render(
      <MemoryRouter initialEntries={['/nao-existe']}>
        <RouteSeo />
      </MemoryRouter>,
    );

    expect(document.title).toBe('Página não encontrada | GHENO');
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, nofollow',
    );
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
    expect(document.querySelector('meta[property="og:url"]')).toBeNull();
    expect(document.querySelector('#route-seo-jsonld')).toBeNull();
  });
});
