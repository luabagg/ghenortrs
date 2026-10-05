import { describe, expect, it } from 'vitest';

import type { SearchEntry } from '@/search/search-types';

import { groupPadsBySystem, shortProductName } from './product-lines';

function pad(title: string): SearchEntry {
  return {
    id: `product:${title}`,
    kind: 'product',
    title,
    href: `https://store.example/${encodeURIComponent(title)}`,
    image: null,
    family: 'pastilhas',
    commerce: 'store',
    terms: [],
    featured: false,
  };
}

describe('groupPadsBySystem', () => {
  it('puts every line for one brake system in one row', () => {
    const elite = pad('SRAM Maven - Pastilha de Freio GHENO Elite');
    const ultra = pad('SRAM Maven - Pastilha de Freio GHENO Ultra');
    const hope = pad('Hope Tech 3 V4 - Pastilha de Freio GHENO Ultra');

    const { systems, other } = groupPadsBySystem([elite, ultra, hope]);

    expect(systems).toEqual([
      { system: 'SRAM Maven', products: { Elite: elite, Ultra: ultra } },
      { system: 'Hope Tech 3 V4', products: { Ultra: hope } },
    ]);
    expect(other).toEqual([]);
  });

  it('keeps a pad with an unexpected store name instead of dropping it', () => {
    const renamed = pad('Pastilha GHENO Race para Shimano 4 pistões');

    expect(groupPadsBySystem([renamed])).toEqual({
      systems: [],
      other: [renamed],
    });
  });
});

describe('shortProductName', () => {
  it('drops the brand and sport suffixes the page already states', () => {
    expect(
      shortProductName(
        'Cubo Traseiro GO 12x148 Boost HG para MTB - GHENO rotors',
      ),
    ).toBe('Cubo Traseiro GO 12x148 Boost HG');
  });
});
