import { describe, expect, it } from 'vitest';

import {
  buildSellerQuoteReceiptHtml,
  buildSellerRegistrationReceiptHtml,
} from './resend';

describe('buildSellerRegistrationReceiptHtml', () => {
  it('tells the seller the wait is expected', () => {
    const html = buildSellerRegistrationReceiptHtml({
      companyName: 'Oficina Norte',
    });

    expect(html).toContain('Oficina Norte');
    expect(html).toContain('em análise');
    expect(html).toContain('Não é preciso enviar o cadastro novamente');
  });

  it('escapes the company name', () => {
    const html = buildSellerRegistrationReceiptHtml({
      companyName: '<script>x</script>',
    });

    expect(html).not.toContain('<script>');
  });
});

describe('buildSellerQuoteReceiptHtml', () => {
  const input = {
    companyName: 'Oficina Norte',
    tier: 'pro' as const,
    totalQuantity: 20,
    totalCents: 122_980,
    notes: 'Entrega em duas semanas',
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
  };

  it('lists what the seller asked for, with their notes', () => {
    const html = buildSellerQuoteReceiptHtml(input);

    expect(html).toContain('Disco Elite');
    expect(html).toContain('R$ 61,49');
    expect(html).toContain('R$ 1.229,80');
    expect(html).toContain('Entrega em duas semanas');
    expect(html).toContain('PRO');
  });

  /** The seller copy must not leak internal identifiers. */
  it('omits the SKU column', () => {
    const html = buildSellerQuoteReceiptHtml(input);

    expect(html).not.toContain('ELITE-1');
    expect(html).not.toContain('>SKU<');
  });

  it('drops the notes block when there are none', () => {
    const html = buildSellerQuoteReceiptHtml({ ...input, notes: '' });

    expect(html).not.toContain('Suas observações');
  });
});
