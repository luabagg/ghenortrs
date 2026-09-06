import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type {
  AdminProductDetailRow,
  AdminProductRow,
} from '~/server/db/queries';

const product: AdminProductRow = {
  id: 7,
  sku: 'GH-7',
  name: 'Rotor Gheno',
  active: true,
  visibleB2b: true,
  category: 'Rotores',
};

const detail: AdminProductDetailRow = {
  ...product,
  description: 'Descrição técnica',
  imageUrl: 'https://bling.example/rotor.jpg',
  unit: 'UN',
  stock: 4,
  priceCents: 50_000,
  costCents: 30_000,
  priceStartCents: 50_000,
  priceProCents: 45_000,
  priceMaxCents: 40_000,
  syncedAt: '2026-09-06T10:00:00.000Z',
};

const loadMock = vi.fn();
let fetcherState: 'idle' | 'loading' | 'submitting' = 'idle';
let fetcherData:
  | { product: AdminProductDetailRow }
  | { ok: true }
  | { ok: false; error: string }
  | undefined;

vi.mock('@remix-run/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@remix-run/react')>();
  return {
    ...actual,
    useFetcher: () => ({
      data: fetcherData,
      load: loadMock,
      state: fetcherState,
      Form: ({ children, ...props }: React.ComponentProps<'form'>) => (
        <form {...props}>{children}</form>
      ),
    }),
  };
});

import { AdminProductDrawer } from './admin-product-drawer';

describe('AdminProductDrawer', () => {
  beforeEach(() => {
    loadMock.mockReset();
    fetcherState = 'idle';
    fetcherData = undefined;
  });

  it('loads the selected product and exposes a pending state', () => {
    render(<AdminProductDrawer product={product} onClose={vi.fn()} />);

    expect(loadMock).toHaveBeenCalledWith('/admin/produtos/7');
    expect(screen.getByRole('status')).toHaveTextContent(
      'Carregando detalhes do produto…',
    );
  });

  it('renders admin-only details and edit controls', () => {
    fetcherData = { product: detail };

    render(<AdminProductDrawer product={product} onClose={vi.fn()} />);

    expect(screen.getByText('Rotores')).toBeInTheDocument();
    expect(screen.getByText('Descrição técnica')).toBeInTheDocument();
    expect(screen.getByLabelText('Tabela Start (centavos)')).toHaveValue(
      50_000,
    );
    expect(screen.getByLabelText('Tabela Pro (centavos)')).toHaveValue(45_000);
    expect(screen.getByLabelText('Tabela Max (centavos)')).toHaveValue(40_000);
    expect(
      screen.getByRole('button', { name: 'Ocultar do catálogo B2B' }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Editar preços e visibilidade')).toBeNull();
  });

  it('closes through the shared drawer control', () => {
    const onClose = vi.fn();
    fetcherData = { product: detail };
    render(<AdminProductDrawer product={product} onClose={onClose} />);

    fireEvent.click(screen.getAllByRole('button', { name: 'Fechar' })[1]);

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('reloads product details after a successful edit', () => {
    const { rerender } = render(
      <AdminProductDrawer product={product} onClose={vi.fn()} />,
    );
    loadMock.mockClear();
    fetcherData = { ok: true };

    rerender(<AdminProductDrawer product={product} onClose={vi.fn()} />);

    expect(loadMock).toHaveBeenCalledWith('/admin/produtos/7');
  });
});
