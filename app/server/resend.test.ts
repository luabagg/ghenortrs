import { describe, expect, it } from 'vitest';

import { buildQuoteRequestHtml } from './resend';

describe('buildQuoteRequestHtml', () => {
  it('reports the tier, the qualifying base and the line totals', () => {
    const html = buildQuoteRequestHtml({
      companyName: 'Oficina Norte',
      email: 'compras@norte.test',
      phone: '11999999999',
      tier: 'pro',
      totalQuantity: 20,
      qualifyingSubtotalCents: 140_000,
      totalCents: 122_980,
      notes: '',
      items: [
        {
          name: 'Disco Elite',
          sku: 'ELITE-1',
          quantity: 20,
          unit: 'UN',
          unitPriceCents: 6149,
          lineTotalCents: 122_980,
        },
      ],
    });

    expect(html).toContain('PRO');
    expect(html).toContain('Base da tabela');
    expect(html).toContain('R$ 1.400,00');
    expect(html).toContain('R$ 1.229,80');
    expect(html).toContain('R$ 61,49');
    expect(html).toContain('Disco Elite');
  });

  it('drops the per-item minimum column', () => {
    const html = buildQuoteRequestHtml({
      companyName: 'Oficina Norte',
      email: 'compras@norte.test',
      phone: '11999999999',
      tier: 'start',
      totalQuantity: 6,
      qualifyingSubtotalCents: 60_000,
      totalCents: 60_000,
      notes: '',
      items: [
        {
          name: 'Disco Elite',
          sku: null,
          quantity: 6,
          unit: null,
          unitPriceCents: 10_000,
          lineTotalCents: 60_000,
        },
      ],
    });

    expect(html).not.toContain('Mín.');
  });
});
