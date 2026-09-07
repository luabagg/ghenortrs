import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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

  it('keeps registration first and login as a visible secondary action', () => {
    mockGate('needs_registration');

    const { container } = render(
      <MemoryRouter>
        <B2BPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('form', { name: 'Cadastro comercial' }),
    ).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Já tenho cadastro' }),
    ).toBeVisible();

    const text = container.textContent ?? '';
    expect(text.indexOf('Empresa')).toBeLessThan(
      text.indexOf('Já tenho cadastro'),
    );

    fireEvent.click(screen.getByRole('button', { name: 'Já tenho cadastro' }));

    expect(screen.getByRole('form', { name: 'Login comercial' })).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Solicitar cadastro' }),
    ).toBeVisible();
  });

  it('shows the login result and starts a visible resend countdown', () => {
    mockGate('needs_registration');

    render(
      <MemoryRouter>
        <B2BPage
          actionData={{
            intent: 'login',
            status: 'success',
            message:
              'Se o e-mail estiver liberado, enviaremos um link de acesso.',
          }}
        />
      </MemoryRouter>,
    );

    expect(
      screen.getByText(
        'Se o e-mail estiver liberado, enviaremos um link de acesso.',
      ),
    ).toBeVisible();
    fireEvent.click(
      screen.getByRole('button', { name: 'Receber link de acesso' }),
    );
    expect(
      screen.getByRole('button', { name: 'Solicitar novamente em 60s' }),
    ).toBeDisabled();
  });

  it('moves focus to the first field when the seller switches forms', async () => {
    mockGate('needs_registration');

    render(
      <MemoryRouter>
        <B2BPage />
      </MemoryRouter>,
    );

    const loginButton = screen.getByRole('button', {
      name: 'Já tenho cadastro',
    });
    loginButton.focus();
    expect(loginButton).toHaveFocus();

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByLabelText('E-mail comercial')).toHaveFocus();
    });

    fireEvent.click(
      screen.getByRole('button', { name: 'Ainda não tenho cadastro' }),
    );

    await waitFor(() => {
      expect(screen.getByLabelText('Empresa')).toHaveFocus();
    });
  });
});
