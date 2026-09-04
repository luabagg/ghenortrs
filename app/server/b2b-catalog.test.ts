import { beforeEach, describe, expect, it, vi } from 'vitest';

import handler from './b2b-catalog';
import { listActiveCatalogProducts } from './db/queries';
import { getServerEnv } from './env';
import { requireApprovedSeller } from './supabase';

vi.mock('./db/queries', () => ({ listActiveCatalogProducts: vi.fn() }));
vi.mock('./env', () => ({ getServerEnv: vi.fn() }));
vi.mock('./supabase', () => ({ requireApprovedSeller: vi.fn() }));

const seller = {
  id: 'seller-1',
  companyName: 'Oficina Norte',
  email: 'compras@norte.test',
};

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(requireApprovedSeller).mockResolvedValue({ seller } as never);
  vi.mocked(getServerEnv).mockReturnValue({
    minimumOrderQuantity: 6,
  } as ReturnType<typeof getServerEnv>);
});

describe('B2B catalog handler', () => {
  it('returns every tier price and sanitizes cached HTML descriptions', async () => {
    vi.mocked(listActiveCatalogProducts).mockResolvedValue([
      {
        id: 7,
        sku: 'ARO-29',
        name: 'Aro 29',
        description: '<p>Alumínio <strong>6061</strong></p>',
        imageUrl: null,
        stock: 12,
        unit: 'UN',
        category: 'Aros',
        priceStartCents: 12_000,
        priceProCents: 11_000,
        priceMaxCents: 10_000,
      },
    ]);

    const response = await handler(
      new Request('https://gheno.test/api/b2b-catalog?tier=max'),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      minimumOrderQuantity: 6,
      count: 1,
      products: [
        {
          id: 7,
          description: 'Alumínio 6061',
          prices: {
            startCents: 12_000,
            proCents: 11_000,
            maxCents: 10_000,
          },
        },
      ],
    });
    expect(listActiveCatalogProducts).toHaveBeenCalledWith('', 48);
  });
});
