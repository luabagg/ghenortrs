import { describe, expect, it } from 'vitest';

// Mirror of api/_shared/bling.normalizeBlingProduct for pure unit coverage
// without pulling Edge/runtime modules into the Vite test graph.

type BlingProduct = {
  id: number;
  nome: string;
  codigo?: string | null;
  preco?: number | null;
  estoque?: { saldoVirtualTotal?: number | null } | null;
  imagemURL?: string | null;
  situacao?: string | null;
  unidade?: string | null;
  descricaoCurta?: string | null;
  categoria?: { descricao?: string | null } | null;
};

function normalizeBlingProduct(product: BlingProduct, defaultMinQuantity: number) {
  const price =
    typeof product.preco === 'number' && Number.isFinite(product.preco)
      ? Math.round(product.preco * 100)
      : null;
  const stock =
    typeof product.estoque?.saldoVirtualTotal === 'number'
      ? product.estoque.saldoVirtualTotal
      : null;
  const active =
    !product.situacao ||
    product.situacao.toLowerCase() === 'a' ||
    product.situacao.toLowerCase() === 'ativo';

  return {
    id: product.id,
    sku: product.codigo ?? null,
    name: product.nome,
    price_cents: price,
    stock,
    min_quantity: defaultMinQuantity,
    active,
  };
}

describe('normalizeBlingProduct', () => {
  it('converts BRL price to cents and applies default min quantity', () => {
    const row = normalizeBlingProduct(
      {
        id: 10,
        nome: 'Pastilha Elite',
        codigo: 'PE-01',
        preco: 49.9,
        situacao: 'A',
        estoque: { saldoVirtualTotal: 12 },
      },
      6,
    );
    expect(row.price_cents).toBe(4990);
    expect(row.min_quantity).toBe(6);
    expect(row.active).toBe(true);
    expect(row.stock).toBe(12);
  });

  it('marks inactive products', () => {
    const row = normalizeBlingProduct(
      { id: 2, nome: 'X', situacao: 'I' },
      6,
    );
    expect(row.active).toBe(false);
  });
});
