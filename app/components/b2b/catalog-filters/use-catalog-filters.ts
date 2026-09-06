import { useMemo, useState } from 'react';

import type { B2BCatalogProduct } from '@/b2b/types';

export type CatalogSort = 'name-asc' | 'price-asc' | 'price-desc';

const DIACRITIC_PATTERN = new RegExp('[\\u0300-\\u036f]', 'g');

function normalizeCatalogText(value: string | null | undefined) {
  return (value ?? '')
    .normalize('NFD')
    .replace(DIACRITIC_PATTERN, '')
    .toLowerCase();
}

function matchesSearch(product: B2BCatalogProduct, query: string) {
  const needle = normalizeCatalogText(query.trim());
  if (!needle) return true;
  return normalizeCatalogText(
    [product.name, product.sku, product.category, product.description].join(
      ' ',
    ),
  ).includes(needle);
}

function sortCatalogProducts(
  products: B2BCatalogProduct[],
  sort: CatalogSort,
): B2BCatalogProduct[] {
  return [...products].sort((a, b) => {
    if (sort === 'price-asc') {
      return (
        a.prices.startCents - b.prices.startCents ||
        a.name.localeCompare(b.name, 'pt-BR')
      );
    }
    if (sort === 'price-desc') {
      return (
        b.prices.startCents - a.prices.startCents ||
        a.name.localeCompare(b.name, 'pt-BR')
      );
    }
    return a.name.localeCompare(b.name, 'pt-BR');
  });
}

/**
 * Owns the catalog's search/category/sort state and derives the visible,
 * sorted product list from it. Split out of the page component because the
 * filter UI (bar, category drawer, selected-filter chips) is complex enough
 * to need its own folder.
 */
export function useCatalogFilters(products: B2BCatalogProduct[]) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState<CatalogSort>('name-asc');

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .map((product) => product.category?.trim())
            .filter((item): item is string => Boolean(item)),
        ),
      ).sort((a, b) => a.localeCompare(b, 'pt-BR')),
    [products],
  );

  const visibleProducts = useMemo(() => {
    const filtered = products.filter(
      (product) =>
        matchesSearch(product, query) &&
        (category === 'all' || product.category?.trim() === category),
    );
    return sortCatalogProducts(filtered, sort);
  }, [category, products, query, sort]);

  const filtersActive = query.trim() !== '' || category !== 'all';
  const controlsActive = filtersActive || sort !== 'name-asc';

  function clear() {
    setQuery('');
    setCategory('all');
    setSort('name-asc');
  }

  return {
    query,
    setQuery,
    category,
    setCategory,
    sort,
    setSort,
    categories,
    visibleProducts,
    filtersActive,
    controlsActive,
    clear,
  };
}
