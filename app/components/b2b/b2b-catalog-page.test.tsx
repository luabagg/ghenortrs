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
  sku: 'RIMS-HEAV-27.5',
  name: 'Aro 29',
  description: 'Alumínio 6061\nAro tubeless',
  imageUrl: 'https://bling.example/aro-29.jpg',
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

function catalog() {
  return screen.getByRole('list', { name: 'Produtos do catálogo' });
}

function row(productName: string) {
  const found = within(catalog())
    .getAllByRole('listitem')
    .find((item) => item.textContent?.includes(productName));
  if (!found) throw new Error(`no row for ${productName}`);
  return found;
}

function addToOrder(productName: string) {
  fireEvent.click(
    screen.getByRole('button', { name: `Adicionar ${productName} ao pedido` }),
  );
}

function setQuantity(productName: string, quantity: number) {
  const label = `Quantidade de ${productName}`;
  if (!screen.queryByLabelText(label)) addToOrder(productName);
  fireEvent.change(screen.getByLabelText(label), {
    target: { value: String(quantity) },
  });
}

function openDetail(productName: string) {
  fireEvent.click(within(row(productName)).getByText(productName));
  return screen.getByRole('dialog', { name: productName });
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

describe('B2BCatalogPage rows', () => {
  it('shows the Bling photo, and a placeholder when there is none', () => {
    renderPage();

    expect(row('Aro 29').querySelector('img')).toHaveAttribute(
      'src',
      'https://bling.example/aro-29.jpg',
    );
    expect(row('Disco 180').querySelector('img')).toBeNull();
    expect(within(row('Disco 180')).getByText('sem foto')).toBeVisible();
  });

  it('keeps the SKU and the description out of the row', () => {
    renderPage();

    expect(row('Aro 29').textContent).not.toContain('RIMS-HEAV-27.5');
    expect(row('Aro 29').textContent).not.toContain('Alumínio 6061');
    expect(within(row('Aro 29')).getByText('Aros · estoque 40')).toBeVisible();
  });

  it('never lets the seller pick a price table by hand', () => {
    renderPage();

    expect(screen.queryByRole('radiogroup')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Usar mínimo' })).toBeNull();
  });
});

describe('B2BCatalogPage prices', () => {
  it('starts on Start and marks the Max price in accent', () => {
    renderPage();

    expect(within(row('Aro 29')).getByText('R$ 200,00')).toBeVisible();
    const max = within(row('Aro 29')).getByText('Max R$ 150,00');
    expect(max).toBeVisible();
    expect(max).toHaveClass('text-accent');
    expect(within(summary()).getByText('Start')).toBeVisible();
  });

  it('moves every row to Pro once the Start base reaches R$ 1.000', () => {
    renderPage();
    setQuantity('Aro 29', 5);

    expect(within(summary()).getByText('Pro')).toBeVisible();
    expect(within(row('Aro 29')).getByText('R$ 180,00')).toBeVisible();
    expect(within(row('Disco 180')).getByText('R$ 270,00')).toBeVisible();
  });

  it('drops the Max line once the order qualifies for Max', () => {
    renderPage();
    setQuantity('Aro 29', 25);

    expect(within(summary()).getByText('Max')).toBeVisible();
    expect(screen.queryByText('Max R$ 150,00')).toBeNull();
    expect(
      screen.getByText('Você está na melhor tabela, a Max.'),
    ).toBeVisible();
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
});

describe('B2BCatalogPage quantity stepper', () => {
  it('opens as a single Adicionar button', () => {
    renderPage();

    expect(
      within(row('Aro 29')).getByRole('button', { name: /^Adicionar Aro 29/ }),
    ).toBeVisible();
    expect(screen.queryByLabelText('Quantidade de Aro 29')).toBeNull();
  });

  it('becomes a stepper that adds, removes and accepts typing', () => {
    renderPage();
    addToOrder('Aro 29');

    expect(screen.getByLabelText('Quantidade de Aro 29')).toHaveValue(1);

    fireEvent.click(
      screen.getByRole('button', { name: 'Adicionar uma unidade de Aro 29' }),
    );
    expect(screen.getByLabelText('Quantidade de Aro 29')).toHaveValue(2);

    fireEvent.change(screen.getByLabelText('Quantidade de Aro 29'), {
      target: { value: '60' },
    });
    expect(screen.getByLabelText('Quantidade de Aro 29')).toHaveValue(60);

    fireEvent.click(
      screen.getByRole('button', { name: 'Remover uma unidade de Aro 29' }),
    );
    expect(screen.getByLabelText('Quantidade de Aro 29')).toHaveValue(59);
  });

  it('returns to Adicionar when the last unit comes off', () => {
    renderPage();
    addToOrder('Aro 29');
    fireEvent.click(
      screen.getByRole('button', { name: 'Remover uma unidade de Aro 29' }),
    );

    expect(
      within(row('Aro 29')).getByRole('button', { name: /^Adicionar Aro 29/ }),
    ).toBeVisible();
  });
});

describe('B2BCatalogPage detail drawer', () => {
  it('carries the SKU, the description and every table price', () => {
    renderPage();
    const drawer = openDetail('Aro 29');

    expect(
      within(drawer).getByText(
        'SKU RIMS-HEAV-27.5 · Aros · Unidade UN · Estoque 40',
      ),
    ).toBeVisible();
    expect(within(drawer).getByText(/Alumínio 6061/)).toBeVisible();
    expect(within(drawer).getByText('Start · aplicada agora')).toBeVisible();
    expect(within(drawer).getByText('R$ 200,00')).toBeVisible();
    expect(within(drawer).getByText('R$ 180,00')).toBeVisible();
    expect(within(drawer).getByText('R$ 150,00')).toBeVisible();
  });

  it('adds to the same order the row edits', () => {
    renderPage();
    const drawer = openDetail('Aro 29');
    fireEvent.click(
      within(drawer).getByRole('button', {
        name: 'Adicionar Aro 29 ao pedido',
      }),
    );
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.getByLabelText('Quantidade de Aro 29')).toHaveValue(1);
  });

  it('closes on Escape', () => {
    renderPage();
    openDetail('Aro 29');

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

describe('B2BCatalogPage submit', () => {
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
