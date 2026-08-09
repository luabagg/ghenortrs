import { describe, expect, it } from 'vitest';

import { normalizeBlingProduct } from '~/server/bling-normalize';

describe('normalizeBlingProduct', () => {
  it('converts BRL price to cents and applies default min quantity', () => {
    const row = normalizeBlingProduct(
      {
        id: 10,
        nome: 'Pastilha Elite',
        codigo: 'PE-01',
        preco: 49.9,
        situacao: 'A',
        estoque: { saldoVirtualTotal: 12 },
      },
      6,
    );
    expect(row.price_cents).toBe(4990);
    expect(row.min_quantity).toBe(6);
    expect(row.active).toBe(true);
    expect(row.stock).toBe(12);
    expect(row.sku).toBe('PE-01');
    expect(row.name).toBe('Pastilha Elite');
  });

  it('marks inactive products', () => {
    const row = normalizeBlingProduct({ id: 2, nome: 'X', situacao: 'I' }, 6);
    expect(row.active).toBe(false);
  });

  it('treats missing situacao and ativo as active', () => {
    expect(
      normalizeBlingProduct({ id: 1, nome: 'Sem status' }, 6).active,
    ).toBe(true);
    expect(
      normalizeBlingProduct({ id: 2, nome: 'Ativo', situacao: 'Ativo' }, 6)
        .active,
    ).toBe(true);
  });

  it('maps description, image, unit, category, and search terms', () => {
    const row = normalizeBlingProduct(
      {
        id: 3,
        nome: 'Disco Elite',
        codigo: 'DE-03',
        imagemURL: 'https://cdn.example.com/disco.webp',
        unidade: 'UN',
        descricaoCurta: 'Rotor 223mm',
        categoria: { descricao: 'Freios' },
        preco: null,
        estoque: null,
      },
      4,
    );

    expect(row.description).toBe('Rotor 223mm');
    expect(row.image_url).toBe('https://cdn.example.com/disco.webp');
    expect(row.unit).toBe('UN');
    expect(row.category).toBe('Freios');
    expect(row.price_cents).toBeNull();
    expect(row.stock).toBeNull();
    expect(row.min_quantity).toBe(4);
    expect(row.search_terms).toBe('Disco Elite DE-03 Freios Rotor 223mm');
    expect(row.raw).toMatchObject({ id: 3, nome: 'Disco Elite' });
  });
});
