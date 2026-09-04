import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useB2BSession } from '~/b2b/use-b2b-session';
import { B2BPage } from '~/components/pages/b2b-page';

const navigate = vi.fn();

vi.mock('@remix-run/react', async () => {
  const actual =
    await vi.importActual<typeof import('@remix-run/react')>(
      '@remix-run/react',
    );
  return { ...actual, useNavigate: () => navigate, useSubmit: () => vi.fn() };
});
vi.mock('~/b2b/use-b2b-session', () => ({ useB2BSession: vi.fn() }));

function mockGate(gate: string) {
  vi.mocked(useB2BSession).mockReturnValue({
    configured: true,
    error: null,
    gate,
    refresh: vi.fn(async () => undefined),
    session: { authenticated: true, gate, seller: null },
    signOut: vi.fn(async () => undefined),
  } as never);
}

beforeEach(() => {
  navigate.mockClear();
});

describe('B2BPage', () => {
  it('sends an approved seller straight to the catalog', () => {
    mockGate('approved');

    render(
      <MemoryRouter>
        <B2BPage />
      </MemoryRouter>,
    );

    expect(navigate).toHaveBeenCalledWith('/b2b/catalogo', { replace: true });
  });

  it('keeps a seller who is not approved on the access page', () => {
    mockGate('pending');

    render(
      <MemoryRouter>
        <B2BPage />
      </MemoryRouter>,
    );

    expect(navigate).not.toHaveBeenCalled();
  });
});
