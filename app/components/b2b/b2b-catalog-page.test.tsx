import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useB2BCatalogQuery, useSubmitB2BQuoteMutation } from '@/b2b/queries';
import type { B2BCatalogProduct } from '@/b2b/types';
import { useB2BSession } from '@/b2b/use-b2b-session';
import { B2BCatalogPage } from '@/components/b2b/b2b-catalog-page';

vi.mock('@/b2b/queries', () => ({
  useB2BCatalogQuery: vi.fn(),
  useSubmitB2BQuoteMutation: vi.fn(),
}));
vi.mock('@/b2b/use-b2b-session', () => ({ useB2BSession: vi.fn() }));

const useB2BCatalogQueryMock = vi.mocked(useB2BCatalogQuery);
const useSubmitB2BQuoteMutationMock = vi.mocked(useSubmitB2BQuoteMutation);
const useB2BSessionMock = vi.mocked(useB2BSession);

/** R$ 200,00 / R$ 180,00 / R$ 150,00 — one unit crosses no threshold alone. */
const aro: B2BCatalogProduct = {
  id: 1,
  sku: 'ARO-29',
  name: 'Aro 29',
  description: 'Alumínio 6061',
  imageUrl: null,
  prices: { startCents: 20_000, proCents: 18_000, maxCents: 15_000 },
  stock: 40,
  unit: 'UN',
  category: 'Aros',
};

const disco: B2BCatalogProduct = {
  id: 2,
  sku: 'DISCO-180',
  name: 'Disco 180',
  description: '',
  imageUrl: null,
  prices: { startCents: 30_000, proCents: 27_000, maxCents: 24_000 },
  stock: null,
  unit: null,
  category: null,
};

const mutate = vi.fn();

function renderPage() {
  return render(
    <MemoryRouter>
      <B2BCatalogPage />
    </MemoryRouter>,
  );
}

function setQuantity(productName: string, quantity: number) {
  fireEvent.change(screen.getByLabelText(`Quantidade de ${productName}`), {
    target: { value: String(quantity) },
  });
}

function summary() {
  return screen.getByText('Tabela aplicada').closest('dl') as HTMLElement;
}

beforeEach(() => {
  vi.resetAllMocks();
  mutate.mockResolvedValue({ success: true });
  useB2BSessionMock.mockReturnValue({
    configured: true,
    error: null,
    gate: 'approved',
    refresh: vi.fn(async () => undefined),
    session: {
      authenticated: true,
      email: 'compras@norte.test',
      gate: 'approved',
      seller: {
        id: 'seller-1',
        email: 'compras@norte.test',
        companyName: 'Oficina Norte',
        status: 'approved',
        cnpj: '12345678000195',
        phone: '11999999999',
      },
    },
    signOut: vi.fn(async () => undefined),
  });
  useB2BCatalogQueryMock.mockReturnValue({
    data: { products: [aro, disco], minimumOrderQuantity: 6 },
    isLoading: false,
    error: null,
  } as never);
  useSubmitB2BQuoteMutationMock.mockReturnValue({
    mutateAsync: mutate,
    status: 'idle',
    data: undefined,
    isPending: false,
  } as never);
});

describe('B2BCatalogPage', () => {
  it('never lets the seller pick a price table by hand', () => {
    renderPage();

    expect(screen.queryByRole('radiogroup')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Usar mínimo' })).toBeNull();
  });

  it('starts on Start and shows the Max price the order can reach', () => {
    renderPage();

    const row = screen.getByLabelText('Quantidade de Aro 29').closest('li');
    expect(within(row as HTMLElement).getByText(/R\$ 200,00/)).toBeVisible();
    expect(within(row as HTMLElement).getByText('Max R$ 150,00')).toBeVisible();
    expect(within(summary()).getByText('Start')).toBeVisible();
  });

  it('states the global minimum and blocks the submit below it', () => {
    renderPage();
    setQuantity('Aro 29', 5);

    expect(within(summary()).getByText('5 de 6 (faltam 1)')).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Enviar solicitação à GHENO rotors' }),
    ).toBeDisabled();

    setQuantity('Aro 29', 6);

    expect(
      screen.getByRole('button', { name: 'Enviar solicitação à GHENO rotors' }),
    ).toBeEnabled();
  });

  it('moves every row to Pro once the Start base reaches R$ 1.000', () => {
    renderPage();
    setQuantity('Aro 29', 5);

    expect(within(summary()).getByText('Pro')).toBeVisible();
    expect(within(summary()).getByText('R$ 1.000,00')).toBeVisible();
    expect(screen.getByText(/R\$ 180,00/)).toBeVisible();
    expect(screen.getByText(/R\$ 270,00/)).toBeVisible();
  });

  it('reports how much the order still needs for the next table', () => {
    renderPage();
    setQuantity('Aro 29', 6);

    expect(
      screen.getByText(
        'Some R$ 3.800,00 à base da tabela para chegar na tabela Max.',
      ),
    ).toBeVisible();
  });

  it('drops the Max comparison once the order qualifies for Max', () => {
    renderPage();
    setQuantity('Aro 29', 25);

    expect(within(summary()).getByText('Max')).toBeVisible();
    expect(screen.queryByText('Max R$ 150,00')).toBeNull();
    expect(
      screen.getByText('Você está na melhor tabela, a Max.'),
    ).toBeVisible();
  });

  it('sends only the products and the notes, never a tier', async () => {
    renderPage();
    setQuantity('Aro 29', 4);
    setQuantity('Disco 180', 2);
    fireEvent.change(
      screen.getByPlaceholderText('Observações, prazos ou mix desejado'),
      { target: { value: 'Entrega em duas semanas' } },
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'Enviar solicitação à GHENO rotors' }),
    );

    await waitFor(() => {
      expect(mutate).toHaveBeenCalledWith({
        notes: 'Entrega em duas semanas',
        items: [
          { product: aro, quantity: 4 },
          { product: disco, quantity: 2 },
        ],
      });
    });
  });
});
