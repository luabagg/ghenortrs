import { describe, expect, it } from 'vitest';

import { normalizeSearchText, searchCatalog } from './search-engine';
import type { SearchEntry } from './search-types';

const entries: SearchEntry[] = [
  {
    id: 'product:disk-brake-pads-ultra-hayes-dominion-a4',
    kind: 'product',
    title: 'Disk Brake Pads Ultra Hayes Dominion A4',
    href: 'https://store.ghenortrs.com.br/produtos/disk-brake-pads-ultra-hayes-dominion-a4/',
    image: 'https://cdn.example.com/hayes.webp',
    family: 'pastilhas',
    commerce: 'store',
    terms: ['pastilha', 'freio', 'hayes', 'dominion', 'a4'],
    featured: false,
  },
  {
    id: 'product:cubo-traseiro-gheno-go-12x148-boost-xd',
    kind: 'product',
    title: 'Cubo Traseiro GHENO GO 12x148 Boost XD',
    href: 'https://store.ghenortrs.com.br/produtos/cubo-traseiro-gheno-go-12x148-boost-xd/',
    image: null,
    family: 'cubos',
    commerce: 'store',
    terms: ['cubo', 'hub', 'boost', 'traseiro'],
    featured: false,
  },
  {
    id: 'product:aro-gheno-heavyduty-29',
    kind: 'product',
    title: 'Aro GHENO HEAVYDUTY 29',
    href: 'https://store.ghenortrs.com.br/produtos/aro-gheno-heavyduty-29/',
    image: null,
    family: 'aros',
    commerce: 'store',
    terms: ['aro', 'rim', '29'],
    featured: false,
  },
  {
    id: 'product:disco-elite-3-223mm',
    kind: 'product',
    title: 'Disco Elite 3 223mm',
    href: '/contato',
    image: null,
    family: 'discos',
    commerce: 'contact',
    terms: ['rotor', 'disco', '223mm'],
    featured: false,
  },
  {
    id: 'category:cubos',
    kind: 'category',
    title: 'Cubos',
    href: 'https://store.ghenortrs.com.br/cubos/',
    image: null,
    family: 'cubos',
    commerce: 'store',
    terms: ['cubo', 'hub', 'boost'],
    featured: true,
  },
];

describe('normalizeSearchText', () => {
  it('normalizes Portuguese accents and punctuation', () => {
    expect(normalizeSearchText('  Compatibilidade: FREIO / São! ')).toBe(
      'compatibilidade freio sao',
    );
  });
});

describe('searchCatalog', () => {
  it('matches compatibility models and English storefront names', () => {
    expect(searchCatalog('pastilha ultra hayes a4', entries)[0]?.id).toBe(
      'product:disk-brake-pads-ultra-hayes-dominion-a4',
    );
    expect(searchCatalog('cubo boost xd', entries)[0]?.family).toBe('cubos');
    expect(searchCatalog('aro 29', entries)[0]?.family).toBe('aros');
  });

  it('returns contact destinations for unavailable families', () => {
    expect(searchCatalog('rotor 223', entries)[0]).toMatchObject({
      family: 'discos',
      commerce: 'contact',
      href: '/contato',
    });
  });

  it('uses featured categories for an empty query', () => {
    expect(searchCatalog('', entries)).toEqual([
      expect.objectContaining({ id: 'category:cubos' }),
    ]);
  });

  it('returns no result unless every query token is present', () => {
    expect(searchCatalog('cubo hayes', entries)).toEqual([]);
  });
});
