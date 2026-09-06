import { useRef, useState } from 'react';

import { useDismissOnOutside } from '@/components/b2b/catalog-filters/use-dismiss-on-outside';
import type { CatalogSort } from '@/components/b2b/catalog-filters/use-catalog-filters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SORT_OPTIONS: Array<{ value: CatalogSort; label: string }> = [
  { value: 'name-asc', label: 'Nome (A-Z)' },
  { value: 'price-asc', label: 'Menor preço' },
  { value: 'price-desc', label: 'Maior preço' },
];

/** Left column of the panel. Each one drives the option list on the right. */
type Facet = 'category' | 'sort';

function FilterIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M4 6h16M7 12h10m-7 6h4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m5 13 4 4L19 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function FacetButton({
  active,
  label,
  value,
  onSelect,
}: {
  active: boolean;
  label: string;
  value: string;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        aria-pressed={active}
        className={`grid w-full gap-0.5 px-3 py-2 text-left transition-colors ${
          active ? 'bg-surface-elevated' : 'hover:bg-surface-elevated'
        }`}
        type="button"
        onClick={onSelect}
      >
        <span
          className={`font-body text-[13px] font-bold ${
            active ? 'text-primary' : 'text-secondary'
          }`}
        >
          {label}
        </span>
        <span className="truncate font-body text-[12px] leading-4 text-secondary">
          {value}
        </span>
      </button>
    </li>
  );
}

function OptionButton({
  active,
  label,
  onSelect,
}: {
  active: boolean;
  label: string;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        aria-pressed={active}
        className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left font-body text-[14px] transition-colors hover:bg-surface-elevated ${
          active ? 'text-accent' : 'text-primary'
        }`}
        type="button"
        onClick={onSelect}
      >
        <span className="truncate">{label}</span>
        {active ? <CheckIcon /> : null}
      </button>
    </li>
  );
}

/**
 * Catalog filters as a popover anchored to its own trigger. It floats over
 * the product list instead of pushing it down, and keeps the option lists in
 * a second column so picking a category never takes over the screen.
 */
export function CatalogFilterPopover({
  open,
  onToggle,
  onClose,
  query,
  onQueryChange,
  category,
  categories,
  onCategoryChange,
  sort,
  onSortChange,
  controlsActive,
  onClear,
}: {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  query: string;
  onQueryChange: (value: string) => void;
  category: string;
  categories: string[];
  onCategoryChange: (value: string) => void;
  sort: CatalogSort;
  onSortChange: (value: CatalogSort) => void;
  controlsActive: boolean;
  onClear: () => void;
}) {
  const [facet, setFacet] = useState<Facet>('category');
  const containerRef = useRef<HTMLDivElement>(null);
  useDismissOnOutside(open, onClose, containerRef);

  const sortLabel =
    SORT_OPTIONS.find((option) => option.value === sort)?.label ?? '';

  return (
    <div ref={containerRef} className="relative min-w-0">
      <Button
        aria-controls="b2b-catalog-filters"
        aria-expanded={open}
        aria-label={open ? 'Ocultar filtros' : 'Mostrar filtros'}
        className="w-full justify-between px-3 sm:px-5"
        type="button"
        variant="secondary"
        onClick={onToggle}
      >
        <span>Filtros</span>
        <FilterIcon />
      </Button>

      {open ? (
        <div
          aria-label="Filtros do catálogo"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-20 w-[min(30rem,calc(100vw-3rem))] border border-border bg-surface"
          id="b2b-catalog-filters"
          role="group"
        >
          <div className="border-b border-border p-2">
            <label className="sr-only" htmlFor="b2b-catalog-search">
              Buscar produtos
            </label>
            <Input
              className="h-9 px-3 text-sm"
              id="b2b-catalog-search"
              placeholder="Nome, SKU ou categoria"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
            />
          </div>

          <div className="grid grid-cols-[9rem_1fr] divide-x divide-border">
            <ul aria-label="Tipos de filtro" className="grid content-start">
              <FacetButton
                active={facet === 'category'}
                label="Categoria"
                value={category === 'all' ? 'Todas' : category}
                onSelect={() => setFacet('category')}
              />
              <FacetButton
                active={facet === 'sort'}
                label="Ordenar"
                value={sortLabel}
                onSelect={() => setFacet('sort')}
              />
            </ul>

            {facet === 'category' ? (
              <ul
                aria-label="Categorias"
                className="max-h-64 overflow-y-auto py-1"
              >
                <OptionButton
                  active={category === 'all'}
                  label="Todas"
                  onSelect={() => onCategoryChange('all')}
                />
                {categories.map((item) => (
                  <OptionButton
                    key={item}
                    active={category === item}
                    label={item}
                    onSelect={() => onCategoryChange(item)}
                  />
                ))}
                {categories.length === 0 ? (
                  <li className="px-3 py-2 font-body text-[12px] leading-4 text-secondary">
                    Nenhum produto do catálogo tem categoria definida.
                  </li>
                ) : null}
              </ul>
            ) : (
              <ul
                aria-label="Ordenação"
                className="max-h-64 overflow-y-auto py-1"
              >
                {SORT_OPTIONS.map((option) => (
                  <OptionButton
                    key={option.value}
                    active={sort === option.value}
                    label={option.label}
                    onSelect={() => onSortChange(option.value)}
                  />
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-border p-2">
            <Button
              className="h-8 min-h-8 px-2 text-xs normal-case tracking-normal"
              disabled={!controlsActive}
              type="button"
              variant="ghost"
              onClick={onClear}
            >
              Limpar filtros
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
