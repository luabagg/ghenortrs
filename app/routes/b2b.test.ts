// @vitest-environment node

import type { ActionFunctionArgs } from '@remix-run/node';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { requestSellerCatalogAccessLink } from '~/server/seller-access-link';
import { action } from './b2b';

vi.mock('~/server/b2b-register', () => ({ default: vi.fn() }));
vi.mock('~/server/seller-access-link', () => ({
  requestSellerCatalogAccessLink: vi.fn(),
}));

const requestSellerCatalogAccessLinkMock = vi.mocked(
  requestSellerCatalogAccessLink,
);

function loginRequest(email: string): ActionFunctionArgs {
  return {
    request: new Request('https://example.com/b2b', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ intent: 'login', email }),
    }),
    context: {},
    params: {},
  };
}

beforeEach(() => {
  vi.resetAllMocks();
  requestSellerCatalogAccessLinkMock.mockResolvedValue({ ok: true });
});

describe('/b2b login action', () => {
  it('normalizes and requests the seller access email on the server', async () => {
    const response = await action(loginRequest(' Seller@Example.COM '));

    expect(requestSellerCatalogAccessLinkMock).toHaveBeenCalledWith(
      'seller@example.com',
    );
    expect(await response.json()).toEqual({
      intent: 'login',
      status: 'success',
      message: 'Se o e-mail estiver liberado, enviaremos um link de acesso.',
    });
  });

  it('rejects an invalid email before requesting access', async () => {
    const response = await action(loginRequest('not-an-email'));

    expect(response.status).toBe(400);
    expect(requestSellerCatalogAccessLinkMock).not.toHaveBeenCalled();
    expect(await response.json()).toEqual({
      intent: 'login',
      status: 'error',
      message: 'Informe um e-mail válido.',
    });
  });

  it('reports an infrastructure failure without exposing account state', async () => {
    requestSellerCatalogAccessLinkMock.mockResolvedValue({
      ok: false,
      error: 'request_failed',
    });

    const response = await action(loginRequest('seller@example.com'));

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      intent: 'login',
      status: 'error',
      message: 'Não foi possível enviar o link. Tente novamente.',
    });
  });
});
