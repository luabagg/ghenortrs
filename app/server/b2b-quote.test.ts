import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MINIMUM_ORDER_SUBTOTAL_CENTS } from '@/b2b/order-pricing';
import handler from './b2b-quote';
import { insertQuoteRequest, listActiveProductsByIds } from './db/queries';
import { getServerEnv } from './env';
import { deliverEmail } from './email-delivery';
import { requireApprovedSeller } from './supabase';

vi.mock('./db/queries', () => ({
  insertQuoteRequest: vi.fn(),
  listActiveProductsByIds: vi.fn(),
}));
vi.mock('./env', () => ({ getServerEnv: vi.fn() }));
vi.mock('./resend', () => ({
  buildQuoteRequestHtml: vi.fn(() => '<html>team</html>'),
  buildSellerQuoteReceiptHtml: vi.fn(() => '<html>receipt</html>'),
}));
vi.mock('./email-delivery', () => ({ deliverEmail: vi.fn() }));
vi.mock('./supabase', () => ({ requireApprovedSeller: vi.fn() }));

const seller = {
  id: 'seller-1',
  companyName: 'Oficina Norte',
  email: 'compras@norte.test',
  phone: '11999999999',
};

const products = [
  {
    id: 1,
    sku: 'A',
    name: 'Produto A',
    description: '',
    imageUrl: null,
    stock: 10,
    unit: 'UN',
    category: null,
    priceStartCents: 10_000,
    priceProCents: 9_000,
    priceMaxCents: 8_000,
  },
  {
    id: 2,
    sku: 'B',
    name: 'Produto B',
    description: '',
    imageUrl: null,
    stock: 10,
    unit: 'UN',
    category: null,
    priceStartCents: 30_000,
    priceProCents: 27_000,
    priceMaxCents: 24_000,
  },
  {
    id: 3,
    sku: 'C',
    name: 'Produto C',
    description: '',
    imageUrl: null,
    stock: 10,
    unit: 'UN',
    category: null,
    priceStartCents: 50_000,
    priceProCents: 45_000,
    priceMaxCents: 40_000,
  },
];

function quoteRequest(
  items: Array<{ productId: number; quantity: number }>,
  extra: Record<string, unknown> = {},
) {
  return new Request('https://gheno.test/api/b2b-quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tier: 'max', items, notes: 'Mix mensal', ...extra }),
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(requireApprovedSeller).mockResolvedValue({ seller } as never);
  vi.mocked(getServerEnv).mockReturnValue({
    resendApiKey: 'test-key',
    resendToEmails: ['admin@ghenortrs.com.br', 'contato@ghenortrs.com.br'],
  } as ReturnType<typeof getServerEnv>);
  vi.mocked(listActiveProductsByIds).mockResolvedValue(products);
  vi.mocked(insertQuoteRequest).mockResolvedValue({
    id: 'quote-1',
    createdAt: '2026-09-04T00:00:00.000Z',
  });
  vi.mocked(deliverEmail).mockResolvedValue('sent');
});

describe('B2B quote handler', () => {
  it('derives Pro from the Start subtotal before discounts and ignores the client-supplied tier', async () => {
    const response = await handler(
      quoteRequest([
        { productId: 1, quantity: 3 },
        { productId: 2, quantity: 4 },
      ]),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      tier: 'pro',
      totalQuantity: 7,
      qualifyingSubtotalCents: 150_000,
      totalCents: 135_000,
    });
    expect(listActiveProductsByIds).toHaveBeenCalledWith([1, 2]);
    expect(insertQuoteRequest).toHaveBeenCalledWith({
      sellerId: seller.id,
      notes: 'Mix mensal',
      items: {
        tier: 'pro',
        totalQuantity: 7,
        qualifyingSubtotalCents: 150_000,
        totalCents: 135_000,
        lines: [
          expect.objectContaining({ productId: 1, unitPriceCents: 9_000 }),
          expect.objectContaining({ productId: 2, unitPriceCents: 27_000 }),
        ],
      },
    });
  });

  it('accepts a qualifying one-item order at the R$500 merchandise subtotal minimum', async () => {
    const response = await handler(
      quoteRequest([{ productId: 3, quantity: 1 }]),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      tier: 'start',
      totalQuantity: 1,
      qualifyingSubtotalCents: MINIMUM_ORDER_SUBTOTAL_CENTS,
      totalCents: 50_000,
    });
    expect(insertQuoteRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        items: expect.objectContaining({
          tier: 'start',
          lines: [
            expect.objectContaining({ productId: 3, unitPriceCents: 50_000 }),
          ],
        }),
      }),
    );
  });

  it('rejects orders below R$500 in merchandise even when the request includes a shipping-like extra value', async () => {
    const response = await handler(
      quoteRequest([{ productId: 1, quantity: 4 }], { shippingCents: 20_000 }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'minimum_order_subtotal_not_met',
      message: 'Pedido mínimo de R$ 500,00 em mercadorias antes dos descontos.',
      minimumOrderSubtotalCents: MINIMUM_ORDER_SUBTOTAL_CENTS,
      qualifyingSubtotalCents: 40_000,
      amountToMinimumSubtotalCents: 10_000,
      totalQuantity: 4,
    });
    expect(insertQuoteRequest).not.toHaveBeenCalled();
  });

  it('emails the team and the seller, and reports both outcomes', async () => {
    const response = await handler(
      quoteRequest([{ productId: 1, quantity: 6 }]),
    );

    await expect(response.json()).resolves.toMatchObject({
      success: true,
      teamEmail: 'sent',
      sellerEmail: 'sent',
    });

    const labels = vi
      .mocked(deliverEmail)
      .mock.calls.map((call) => call[0].label);
    expect(labels).toEqual([
      'b2b-quote team alert',
      'b2b-quote seller receipt',
    ]);
    expect(vi.mocked(deliverEmail).mock.calls[0][0].to).toEqual([
      'admin@ghenortrs.com.br',
      'contato@ghenortrs.com.br',
    ]);
    expect(vi.mocked(deliverEmail).mock.calls[1][0].to).toBe(
      'compras@norte.test',
    );
  });

  it('still saves the quote when an email fails', async () => {
    vi.mocked(deliverEmail).mockResolvedValue('failed');

    const response = await handler(
      quoteRequest([{ productId: 1, quantity: 6 }]),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      id: 'quote-1',
      teamEmail: 'failed',
    });
    expect(insertQuoteRequest).toHaveBeenCalled();
  });
});
