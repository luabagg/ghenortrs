import { redirect } from '@remix-run/node';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getAdminProductDetail } from '~/server/db/queries';
import {
  setProductMinQuantity,
  setProductsVisibility,
} from '~/server/product-admin';
import { requireAdmin } from '~/server/require-admin.server';
import { action, loader } from './admin.produtos.$id';

vi.mock('~/server/db/queries', () => ({ getAdminProductDetail: vi.fn() }));
vi.mock('~/server/product-admin', () => ({
  setProductMinQuantity: vi.fn(),
  setProductsVisibility: vi.fn(),
}));
vi.mock('~/server/require-admin.server', () => ({ requireAdmin: vi.fn() }));

const getAdminProductDetailMock = vi.mocked(getAdminProductDetail);
const setProductMinQuantityMock = vi.mocked(setProductMinQuantity);
const setProductsVisibilityMock = vi.mocked(setProductsVisibility);
const requireAdminMock = vi.mocked(requireAdmin);

const admin = { id: 'admin-1', email: 'admin@example.com' };

function post(id: string, fields: Record<string, string>): ActionFunctionArgs {
  return {
    request: new Request(`https://example.com/admin/produtos/${id}`, {
      body: new URLSearchParams(fields),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
    }),
    context: {},
    params: { id },
  };
}

function get(id: string): LoaderFunctionArgs {
  return {
    request: new Request(`https://example.com/admin/produtos/${id}`),
    context: {},
    params: { id },
  };
}

beforeEach(() => {
  vi.resetAllMocks();
  requireAdminMock.mockResolvedValue({
    user: admin,
    headers: new Headers(),
  } as never);
});

describe('/admin/produtos/:id', () => {
  it('loads the product the URL names', async () => {
    getAdminProductDetailMock.mockResolvedValue({
      id: 16624954933,
      costCents: 3843,
    } as never);

    const response = await loader(get('16624954933'));

    expect(getAdminProductDetailMock).toHaveBeenCalledWith(16624954933);
    await expect(response.json()).resolves.toMatchObject({
      product: { costCents: 3843 },
    });
  });

  it('answers 404 for a missing product and for a bad id', async () => {
    getAdminProductDetailMock.mockResolvedValue(null);
    await expect(loader(get('123'))).rejects.toMatchObject({ status: 404 });

    await expect(loader(get('abc'))).rejects.toMatchObject({ status: 404 });
    expect(getAdminProductDetailMock).toHaveBeenCalledTimes(1);
  });

  it('saves a new minimum quantity', async () => {
    setProductMinQuantityMock.mockResolvedValue({ ok: true });

    const response = await action(
      post('7', { intent: 'set-min-quantity', minQuantity: '12' }),
    );

    expect(setProductMinQuantityMock).toHaveBeenCalledWith({
      actor: { id: admin.id, email: admin.email },
      productId: 7,
      minQuantity: 12,
    });
    expect(response.status).toBe(302);
  });

  it('reports an invalid minimum without redirecting', async () => {
    setProductMinQuantityMock.mockResolvedValue({
      ok: false,
      error: 'invalid_min_quantity',
    });

    const response = await action(
      post('7', { intent: 'set-min-quantity', minQuantity: '0' }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: 'invalid_min_quantity',
    });
  });

  it('hides the product from its own page', async () => {
    setProductsVisibilityMock.mockResolvedValue({ updated: 1 });

    await action(post('7', { intent: 'hide-product' }));

    expect(setProductsVisibilityMock).toHaveBeenCalledWith({
      actor: { id: admin.id, email: admin.email },
      ids: [7],
      query: '',
      visibleB2b: false,
    });
  });

  it('never edits without an admin session', async () => {
    requireAdminMock.mockRejectedValue(redirect('/admin/login'));

    await expect(
      action(post('7', { intent: 'set-min-quantity', minQuantity: '12' })),
    ).rejects.toEqual(expect.objectContaining({ status: 302 }));
    expect(setProductMinQuantityMock).not.toHaveBeenCalled();
  });
});
