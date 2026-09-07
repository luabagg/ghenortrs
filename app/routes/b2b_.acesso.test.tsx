import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  inspectSellerCatalogAccessToken,
  redeemSellerCatalogAccessToken,
} from '~/server/seller-access-link';
import { action, loader } from './b2b_.acesso';

vi.mock('~/server/seller-access-link', () => ({
  inspectSellerCatalogAccessToken: vi.fn(),
  redeemSellerCatalogAccessToken: vi.fn(),
}));

const inspectMock = vi.mocked(inspectSellerCatalogAccessToken);
const redeemMock = vi.mocked(redeemSellerCatalogAccessToken);

beforeEach(() => {
  vi.resetAllMocks();
  inspectMock.mockResolvedValue({ ok: true, companyName: 'Seller Co' });
});

describe('/b2b/acesso', () => {
  it('validates GET without redeeming the one-time token', async () => {
    const response = await loader({
      request: new Request('https://example.com/b2b/acesso?token=signed'),
    } as LoaderFunctionArgs);

    expect(await response.json()).toEqual({
      ok: true,
      companyName: 'Seller Co',
      token: 'signed',
    });
    expect(inspectMock).toHaveBeenCalledWith('signed');
    expect(redeemMock).not.toHaveBeenCalled();
  });

  it('redeems only on POST and redirects to Supabase', async () => {
    redeemMock.mockResolvedValue({
      ok: true,
      actionLink: 'https://supabase.example/verify',
    });
    const response = await action({
      request: new Request('https://example.com/b2b/acesso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          intent: 'confirm-access',
          token: 'signed',
        }),
      }),
    } as ActionFunctionArgs);

    expect(redeemMock).toHaveBeenCalledWith('signed');
    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe(
      'https://supabase.example/verify',
    );
  });

  it('shows a recoverable error for an invalid or used token', async () => {
    inspectMock.mockResolvedValue({ ok: false, error: 'invalid_or_expired' });
    const response = await loader({
      request: new Request('https://example.com/b2b/acesso?token=invalid'),
    } as LoaderFunctionArgs);

    expect(await response.json()).toEqual({
      ok: false,
      error: 'invalid_or_expired',
    });
  });
});
