import type { Json } from './database.types';

export type BlingProduct = {
  id: number;
  nome: string;
  codigo?: string | null;
  preco?: number | null;
  estoque?: { saldoVirtualTotal?: number | null } | null;
  imagemURL?: string | null;
  situacao?: string | null;
  formato?: string | null;
  tipo?: string | null;
  unidade?: string | null;
  descricaoCurta?: string | null;
  categoria?: { descricao?: string | null } | null;
};

export type NormalizedBlingProduct = {
  id: number;
  sku: string | null;
  name: string;
  description: string;
  image_url: string | null;
  price_cents: number | null;
  stock: number | null;
  unit: string | null;
  min_quantity: number;
  active: boolean;
  category: string | null;
  search_terms: string;
  raw: Json;
};

/** Map a Bling product payload to the cached product row shape. */
export function normalizeBlingProduct(
  product: BlingProduct,
  defaultMinQuantity: number,
): NormalizedBlingProduct {
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

  const terms = [
    product.nome,
    product.codigo ?? '',
    product.categoria?.descricao ?? '',
    product.descricaoCurta ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return {
    id: product.id,
    sku: product.codigo ?? null,
    name: product.nome,
    description: product.descricaoCurta ?? '',
    image_url: product.imagemURL ?? null,
    price_cents: price,
    stock,
    unit: product.unidade ?? null,
    min_quantity: defaultMinQuantity,
    active,
    category: product.categoria?.descricao ?? null,
    search_terms: terms,
    raw: product,
  };
}
