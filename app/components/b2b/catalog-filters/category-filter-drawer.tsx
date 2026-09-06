import { Drawer } from '@/components/ui/drawer';

/** Right-side single-select list of catalog categories, opened from the filter bar. */
export function CategoryFilterDrawer({
  categories,
  activeCategory,
  open,
  onSelect,
  onClose,
}: {
  categories: string[];
  activeCategory: string;
  open: boolean;
  onSelect: (category: string) => void;
  onClose: () => void;
}) {
  const options = ['all', ...categories];

  return (
    <Drawer open={open} title="Categoria" onClose={onClose}>
      <ul aria-label="Categorias" className="grid gap-1">
        {options.map((option) => {
          const active = option === activeCategory;
          const label = option === 'all' ? 'Todas' : option;
          return (
            <li key={option}>
              <button
                aria-pressed={active}
                className={`flex w-full items-center justify-between rounded-sm px-3 py-2.5 text-left font-body text-[14px] transition-colors ${
                  active
                    ? 'bg-surface-elevated text-accent'
                    : 'text-primary hover:bg-surface-elevated'
                }`}
                type="button"
                onClick={() => {
                  onSelect(option);
                  onClose();
                }}
              >
                <span>{label}</span>
                {active ? (
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
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </Drawer>
  );
}
