import { redirect } from '@remix-run/node';
import type { ActionFunctionArgs } from '@remix-run/node';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  serializeBlingSyncResult,
  syncBlingCatalog,
} from '~/server/bling-admin';
import {
  PriceListError,
  buildPriceImportPreview,
  commitPriceImport,
} from '~/server/price-list-import';
import { setProductsVisibility } from '~/server/product-visibility';
import { requireAdmin } from '~/server/require-admin.server';
import { action } from './admin.produtos';

vi.mock('~/server/bling-admin', () => ({
  getBlingConnectionStatus: vi.fn(),
  readBlingSyncResult: vi.fn(),
  serializeBlingSyncResult: vi.fn(),
  syncBlingCatalog: vi.fn(),
}));
vi.mock('~/server/bling-oauth-state', () => ({
  readBlingConnectResult: vi.fn(),
  serializeBlingConnectResult: vi.fn(),
  startBlingOAuth: vi.fn(),
}));
vi.mock('~/server/db/queries', () => ({
  ADMIN_PRODUCT_LIST_LIMIT: 200,
  listAdminProducts: vi.fn(),
}));
vi.mock('~/server/product-visibility', () => ({
  setProductsVisibility: vi.fn(),
}));
vi.mock('~/server/price-list-import', async (importOriginal) => ({
  ...(await importOriginal<typeof import('~/server/price-list-import')>()),
  buildPriceImportPreview: vi.fn(),
  commitPriceImport: vi.fn(),
}));
vi.mock('~/server/require-admin.server', () => ({ requireAdmin: vi.fn() }));

const buildPriceImportPreviewMock = vi.mocked(buildPriceImportPreview);
const commitPriceImportMock = vi.mocked(commitPriceImport);
const requireAdminMock = vi.mocked(requireAdmin);
const setProductsVisibilityMock = vi.mocked(setProductsVisibility);
const syncBlingCatalogMock = vi.mocked(syncBlingCatalog);

const admin = { id: 'admin-1', email: 'admin@example.com' };

function postIntent(fields: Record<string, string>): ActionFunctionArgs {
  const body = new URLSearchParams(fields);
  return {
    request: new Request('https://example.com/admin/produtos', {
      body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
    }),
    context: {},
    params: {},
  };
}

beforeEach(() => {
  vi.resetAllMocks();
  requireAdminMock.mockResolvedValue({
    user: admin,
    headers: new Headers(),
  } as never);
  vi.mocked(serializeBlingSyncResult).mockResolvedValue('bling_sync_result=x');
});

describe('/admin/produtos action', () => {
  it('runs the catalog sync for the signed-in admin', async () => {
    syncBlingCatalogMock.mockResolvedValue({
      ok: true,
      upserted: 12,
      syncedAt: '2026-08-30T10:00:00.000Z',
    });

    const response = await action(postIntent({ intent: 'sync-bling' }));

    expect(syncBlingCatalogMock).toHaveBeenCalledOnce();
    expect(syncBlingCatalogMock).toHaveBeenCalledWith({
      actor: { id: admin.id, email: admin.email },
    });
    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('/admin/produtos');
  });

  it('refuses an unknown intent without touching Bling or products', async () => {
    const response = await action(postIntent({ intent: 'whatever' }));

    expect(response.status).toBe(400);
    expect(syncBlingCatalogMock).not.toHaveBeenCalled();
    expect(setProductsVisibilityMock).not.toHaveBeenCalled();
  });

  it('hides every checked product in one explicit request', async () => {
    setProductsVisibilityMock.mockResolvedValue({ updated: 2 });
    const body = new URLSearchParams({ intent: 'bulk-hide', q: 'pad' });
    body.append('productIds', '4');
    body.append('productIds', '9');

    const response = await action({
      request: new Request('https://example.com/admin/produtos', {
        body,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST',
      }),
      context: {},
      params: {},
    });

    expect(setProductsVisibilityMock).toHaveBeenCalledWith({
      actor: { id: admin.id, email: admin.email },
      ids: [4, 9],
      query: 'pad',
      visibleB2b: false,
    });
    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('/admin/produtos?q=pad');
  });

  it('shows one product from its row button', async () => {
    setProductsVisibilityMock.mockResolvedValue({ updated: 1 });

    await action(postIntent({ showProduct: '7' }));

    expect(setProductsVisibilityMock).toHaveBeenCalledWith({
      actor: { id: admin.id, email: admin.email },
      ids: [7],
      query: '',
      visibleB2b: true,
    });
  });

  it('refuses a bulk request with no selection', async () => {
    const response = await action(postIntent({ intent: 'bulk-show' }));

    expect(response.status).toBe(400);
    expect(setProductsVisibilityMock).not.toHaveBeenCalled();
  });

  it('never syncs when the request is not an admin session', async () => {
    requireAdminMock.mockRejectedValue(redirect('/admin/login'));

    await expect(action(postIntent({ intent: 'sync-bling' }))).rejects.toEqual(
      expect.objectContaining({ status: 302 }),
    );
    expect(syncBlingCatalogMock).not.toHaveBeenCalled();
  });

  it('previews a pasted price list without writing', async () => {
    const preview = { tier: 'pro', digest: 'abc', updates: [] };
    buildPriceImportPreviewMock.mockResolvedValue(preview as never);

    const response = await action(
      postIntent({
        intent: 'preview-price-list',
        priceList: 'Sku\tR$ Preço da lista',
        tier: 'pro',
      }),
    );

    expect(buildPriceImportPreviewMock).toHaveBeenCalledWith(
      'pro',
      'Sku\tR$ Preço da lista',
    );
    expect(commitPriceImportMock).not.toHaveBeenCalled();
    await expect(response.json()).resolves.toMatchObject({
      kind: 'price-list',
      ok: true,
      tier: 'pro',
    });
  });

  it('reports an unreadable paste as a 400 with its code', async () => {
    buildPriceImportPreviewMock.mockRejectedValue(
      new PriceListError('not_tab_separated'),
    );

    const response = await action(
      postIntent({ intent: 'preview-price-list', priceList: 'a b c' }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: 'not_tab_separated',
      ok: false,
    });
  });

  it('commits the confirmed preview for the signed-in admin', async () => {
    commitPriceImportMock.mockResolvedValue({ ok: true, updated: 3 });

    const response = await action(
      postIntent({
        digest: 'abc',
        intent: 'commit-price-list',
        priceList: 'text',
        tier: 'max',
      }),
    );

    expect(commitPriceImportMock).toHaveBeenCalledWith({
      actor: { id: admin.id, email: admin.email },
      digest: 'abc',
      text: 'text',
      tier: 'max',
    });
    expect(response.status).toBe(302);
    expect(response.headers.get('Set-Cookie')).toContain('price_import_result');
  });
});
