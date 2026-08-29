import { describe, expect, it } from 'vitest';

import { normalizeBlingProduct } from '~/server/bling';

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
    expect(row.search_terms).toContain('Pastilha Elite');
  });

  it('marks inactive products', () => {
    const row = normalizeBlingProduct({ id: 2, nome: 'X', situacao: 'I' }, 6);
    expect(row.active).toBe(false);
  });
});
