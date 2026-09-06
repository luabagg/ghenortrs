function RemoveIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-3 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <button
      className="inline-flex items-center gap-1.5 rounded-button border border-strong bg-background-soft px-2.5 py-1 font-body text-[12px] text-primary transition-colors hover:border-primary"
      type="button"
      onClick={onRemove}
    >
      <span>{label}</span>
      <RemoveIcon />
    </button>
  );
}

/** Removable chips for each active filter, shown under the filter bar. */
export function SelectedFilters({
  query,
  category,
  onClearQuery,
  onClearCategory,
}: {
  query: string;
  category: string;
  onClearQuery: () => void;
  onClearCategory: () => void;
}) {
  const hasQuery = query.trim() !== '';
  const hasCategory = category !== 'all';
  if (!hasQuery && !hasCategory) return null;

  return (
    <div
      aria-label="Filtros ativos"
      className="flex flex-wrap gap-2"
      role="group"
    >
      {hasQuery ? (
        <FilterChip
          label={`Busca: "${query.trim()}"`}
          onRemove={onClearQuery}
        />
      ) : null}
      {hasCategory ? (
        <FilterChip
          label={`Categoria: ${category}`}
          onRemove={onClearCategory}
        />
      ) : null}
    </div>
  );
}
