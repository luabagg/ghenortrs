import { beforeEach, describe, expect, it, vi } from 'vitest';

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
];

function quoteRequest(items: Array<{ productId: number; quantity: number }>) {
  return new Request('https://gheno.test/api/b2b-quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tier: 'max', items, notes: 'Mix mensal' }),
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(requireApprovedSeller).mockResolvedValue({ seller } as never);
  vi.mocked(getServerEnv).mockReturnValue({
    minimumOrderQuantity: 6,
    resendApiKey: 'test-key',
    resendToEmail: 'contato@ghenortrs.com.br',
  } as ReturnType<typeof getServerEnv>);
  vi.mocked(listActiveProductsByIds).mockResolvedValue(products);
  vi.mocked(insertQuoteRequest).mockResolvedValue({
    id: 'quote-1',
    createdAt: '2026-09-04T00:00:00.000Z',
  });
  vi.mocked(deliverEmail).mockResolvedValue('sent');
});

describe('B2B quote handler', () => {
  it('accepts six units across SKUs and derives Pro from the Start subtotal', async () => {
    const response = await handler(
      quoteRequest([
        { productId: 1, quantity: 4 },
        { productId: 2, quantity: 2 },
      ]),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      tier: 'pro',
      totalQuantity: 6,
      qualifyingSubtotalCents: 100_000,
      totalCents: 90_000,
    });
    expect(listActiveProductsByIds).toHaveBeenCalledWith([1, 2]);
    expect(insertQuoteRequest).toHaveBeenCalledWith({
      sellerId: seller.id,
      notes: 'Mix mensal',
      items: {
        tier: 'pro',
        totalQuantity: 6,
        qualifyingSubtotalCents: 100_000,
        totalCents: 90_000,
        lines: [
          expect.objectContaining({ productId: 1, unitPriceCents: 9_000 }),
          expect.objectContaining({ productId: 2, unitPriceCents: 27_000 }),
        ],
      },
    });
  });

  it('rejects fewer than six total units without applying per-item minimums', async () => {
    const response = await handler(
      quoteRequest([
        { productId: 1, quantity: 4 },
        { productId: 2, quantity: 1 },
      ]),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'minimum_order_quantity_not_met',
      message: 'Selecione pelo menos 6 unidades no total.',
      minimumOrderQuantity: 6,
      totalQuantity: 5,
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
    expect(vi.mocked(deliverEmail).mock.calls[0][0].to).toBe(
      'contato@ghenortrs.com.br',
    );
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
