import { beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchBlingProductCategories } from './bling';
import {
  blingProductSyncConflictSet,
  readStoredBlingTokens,
} from './db/queries';
import { getServerEnv } from './env';

vi.mock('./db/queries', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./db/queries')>()),
  readStoredBlingTokens: vi.fn(),
  saveBlingTokens: vi.fn(),
  updateProductCategories: vi.fn(),
  upsertBlingProducts: vi.fn(),
  upsertProductImage: vi.fn(),
  listStoredImageKeys: vi.fn(),
}));
vi.mock('./env', () => ({ getServerEnv: vi.fn() }));

/** The product detail answer. The list endpoint carries no categoria. */
function detail(categoria: { id?: number; descricao?: string | null } | null) {
  return new Response(JSON.stringify({ data: { id: 1, categoria } }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}

function categoryDetail(id: number, descricao: string | null) {
  return new Response(JSON.stringify({ data: { id, descricao } }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(getServerEnv).mockReturnValue({
    blingApiBase: 'https://api.bling.test/Api/v3',
  } as ReturnType<typeof getServerEnv>);
  vi.mocked(readStoredBlingTokens).mockResolvedValue({
    accessToken: 'token',
    refreshToken: 'refresh',
    expiresAt: new Date(Date.now() + 3_600_000).toISOString(),
  } as never);
});

describe('fetchBlingProductCategories', () => {
  it('resolves the category id returned by the product detail endpoint', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) =>
        url.endsWith('/categorias/produtos/42')
          ? categoryDetail(42, 'Aros')
          : detail({ id: 42 }),
      ),
    );

    await expect(fetchBlingProductCategories([7])).resolves.toEqual(
      new Map([[7, 'Aros']]),
    );
  });

  it('asks once per product and once per distinct category', async () => {
    const fetchMock = vi.fn(async (url: string) =>
      url.includes('/categorias/produtos/')
        ? categoryDetail(42, 'Cubos')
        : detail({ id: 42 }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await fetchBlingProductCategories([7, 8]);

    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      'https://api.bling.test/Api/v3/produtos/7',
      'https://api.bling.test/Api/v3/categorias/produtos/42',
      'https://api.bling.test/Api/v3/produtos/8',
    ]);
  });

  it('maps a product with no category in Bling to null', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => detail(null)),
    );

    await expect(fetchBlingProductCategories([7])).resolves.toEqual(
      new Map([[7, null]]),
    );
  });

  it('treats a blank category name as no category', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => detail({ descricao: '   ' })),
    );

    await expect(fetchBlingProductCategories([7])).resolves.toEqual(
      new Map([[7, null]]),
    );
  });

  /** Left out of the map, so the caller keeps the category already stored. */
  it('omits a product whose detail call fails, rather than nulling it', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) =>
        url.endsWith('/8')
          ? new Response('boom', { status: 500 })
          : detail({ descricao: 'Aros' }),
      ),
    );
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const categories = await fetchBlingProductCategories([7, 8]);

    expect(categories).toEqual(new Map([[7, 'Aros']]));
    expect(categories.has(8)).toBe(false);
  });
});

describe('blingProductSyncConflictSet', () => {
  /** The list-derived upsert must never write category back over the
   * value the detail pass just stored. */
  it('leaves category out of the sync upsert', () => {
    expect(blingProductSyncConflictSet).not.toHaveProperty('category');
  });
});
