import { describe, expect, it } from 'vitest';

import { htmlToPlainText, normalizeBlingProduct } from '~/server/bling';

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

describe('htmlToPlainText', () => {
  it('flattens the HTML Bling stores in descricaoCurta', () => {
    expect(
      htmlToPlainText(
        '<p style="text-align: left;">Pastilhas de freio.</p>\r\n<p> </p>\r\n<p><em><strong>Ultra</strong></em></p>\r\n<p>\u2713 Composto met\u00e1lico</p>',
      ),
    ).toBe('Pastilhas de freio.\n\nUltra\n\n\u2713 Composto metálico');
  });

  it('decodes the entities that survive a Bling paste', () => {
    expect(
      htmlToPlainText('Disco&nbsp;180mm &amp; parafusos &lt;novo&gt;'),
    ).toBe('Disco 180mm & parafusos <novo>');
  });

  it('returns an empty string for empty markup', () => {
    expect(htmlToPlainText('')).toBe('');
    expect(htmlToPlainText('<p> </p>')).toBe('');
  });
});

describe('normalizeBlingProduct cost and description', () => {
  it('stores precoCusto as cents and a flattened description', () => {
    const row = normalizeBlingProduct(
      {
        id: 11,
        nome: 'Pastilha Ultra',
        codigo: 'PU-01',
        preco: 91.8,
        precoCusto: 38.43,
        descricaoCurta: '<p>Composto met\u00e1lico</p>',
      },
      6,
    );

    expect(row.cost_cents).toBe(3843);
    expect(row.description).toBe('Composto metálico');
    expect(row.search_terms).toContain('Composto metálico');
  });

  it('leaves the cost null when Bling omits it', () => {
    const row = normalizeBlingProduct(
      { id: 12, nome: 'Aro', codigo: 'AR-01', preco: 10 },
      6,
    );
    expect(row.cost_cents).toBeNull();
  });
});
