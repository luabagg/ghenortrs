import { describe, expect, it } from 'vitest';

import { buildQuoteRequestHtml } from './resend';

describe('buildQuoteRequestHtml', () => {
  it('includes the formatted tier unit price column', () => {
    const html = buildQuoteRequestHtml({
      companyName: 'Oficina Norte',
      email: 'compras@norte.test',
      phone: '11999999999',
      notes: '',
      items: [
        {
          name: 'Disco Elite',
          sku: 'ELITE-1',
          quantity: 6,
          minQuantity: 4,
          unitPriceCents: 6149,
        },
      ],
    });

    expect(html).toContain('Preço un.');
    expect(html).toContain('R$ 61,49');
    expect(html).toContain('Disco Elite');
  });
});
