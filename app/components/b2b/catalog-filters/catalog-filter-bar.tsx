import type { CatalogSort } from '@/components/b2b/catalog-filters/use-catalog-filters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const COMPACT_FIELD_CLASS = 'h-9 px-3 text-sm';
const COMPACT_SELECT_CLASS =
  'h-9 w-full rounded-button border border-strong bg-background-soft px-3 text-sm text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background';

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-3.5 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/** Compact search + category + sort row. Category opens the {@link CategoryFilterDrawer}. */
export function CatalogFilterBar({
  query,
  onQueryChange,
  category,
  onCategoryOpen,
  sort,
  onSortChange,
  controlsActive,
  onClear,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  category: string;
  onCategoryOpen: () => void;
  sort: CatalogSort;
  onSortChange: (value: CatalogSort) => void;
  controlsActive: boolean;
  onClear: () => void;
}) {
  const categoryLabel = category === 'all' ? 'Categoria' : category;
  const categoryAriaLabel =
    category === 'all'
      ? 'Categoria. Abrir seleção de categoria'
      : `Categoria: ${category}. Abrir seleção de categoria`;

  return (
    <div
      aria-label="Filtros do catálogo"
      className="grid gap-2 sm:grid-cols-[minmax(12rem,1fr)_auto_auto_auto] sm:items-center"
      role="group"
    >
      <div className="grid gap-1.5">
        <label className="sr-only" htmlFor="b2b-catalog-search">
          Buscar produtos
        </label>
        <Input
          className={COMPACT_FIELD_CLASS}
          id="b2b-catalog-search"
          placeholder="Nome, SKU ou categoria"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </div>

      <Button
        aria-haspopup="dialog"
        aria-label={categoryAriaLabel}
        className="min-h-9 justify-between gap-2 px-3 normal-case tracking-normal"
        size="default"
        type="button"
        variant="secondary"
        onClick={onCategoryOpen}
      >
        <span aria-hidden="true" className="max-w-[10rem] truncate">
          {categoryLabel}
        </span>
        <ChevronIcon />
      </Button>

      <select
        aria-label="Ordenar"
        className={COMPACT_SELECT_CLASS}
        value={sort}
        onChange={(event) => onSortChange(event.target.value as CatalogSort)}
      >
        <option value="name-asc">Nome (A-Z)</option>
        <option value="price-asc">Menor preço</option>
        <option value="price-desc">Maior preço</option>
      </select>

      <Button
        className="min-h-9 h-9 px-3 text-xs normal-case tracking-normal"
        disabled={!controlsActive}
        type="button"
        variant="ghost"
        onClick={onClear}
      >
        Limpar filtros
      </Button>
    </div>
  );
}
