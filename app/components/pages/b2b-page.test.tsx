import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useB2BSession } from '~/b2b/use-b2b-session';
import { B2BPage } from '~/components/pages/b2b-page';
import { SEARCH_ENTRIES } from '~/search/search-data';

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

  // The server never resolves the session, so this is what crawlers read.
  it('renders the public page while the session is still loading', () => {
    mockGate('loading');

    render(
      <MemoryRouter>
        <B2BPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Cadastro comercial GHENO rotors.',
      }),
    ).toBeVisible();
    expect(
      screen.getByRole('form', { name: 'Cadastro comercial' }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Produtos para a sua loja.' }),
    ).toBeVisible();
  });

  it('lists every product with its link and no price', () => {
    mockGate('anonymous');

    const { container } = render(
      <MemoryRouter>
        <B2BPage />
      </MemoryRouter>,
    );
    const linkedHrefs = within(
      container.querySelector<HTMLElement>(
        '[data-section="b2b-product-lines"]',
      )!,
    )
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'));
    const products = SEARCH_ENTRIES.filter((entry) => entry.kind === 'product');

    expect(products.length).toBeGreaterThan(0);
    for (const product of products) {
      expect(linkedHrefs).toContain(product.href);
    }
    expect(container.textContent).not.toMatch(/R\$/);
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
