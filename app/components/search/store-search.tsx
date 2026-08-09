import {
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Link } from '@remix-run/react';

import { STORE_SEARCH_URL, type CommerceFamilyId } from '@/catalog/commerce';
import { PRODUCT_FAMILIES } from '@/components/pages/components-page-data';
import { cn } from '@/lib/utils';
import { SEARCH_ENTRIES } from '@/search/search-data';
import { searchCatalog } from '@/search/search-engine';
import type { SearchResult } from '@/search/search-types';

const FAMILY_THUMBNAILS: Partial<Record<CommerceFamilyId, string>> =
  Object.fromEntries(
    PRODUCT_FAMILIES.map((family) => [family.id, family.imageSrc]),
  );

type StoreSearchProps = {
  autoFocus?: boolean;
  mode: 'desktop' | 'mobile';
  onNavigate?: () => void;
};

export function StoreSearch({
  autoFocus = false,
  mode,
  onNavigate,
}: StoreSearchProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const resultListId = `store-search-results-${useId().replace(/:/g, '')}`;
  const results = useMemo(() => searchCatalog(query, SEARCH_ENTRIES), [query]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (results.length === 0) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((current) =>
        current === null ? 0 : (current + 1) % results.length,
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((current) =>
        current === null
          ? results.length - 1
          : (current - 1 + results.length) % results.length,
      );
    } else if (event.key === 'Enter') {
      if (activeIndex === null) return;
      event.preventDefault();
      resultRefs.current[activeIndex]?.click();
    }
  }

  const normalizedQuery = query.trim();
  const activeResult =
    activeIndex === null ? undefined : results[activeIndex];

  return (
    <div className="grid gap-3" data-search-mode={mode}>
      <label className="sr-only" htmlFor={`${resultListId}-input`}>
        Buscar na GHENO rotors
      </label>
      <div className="relative">
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
          />
        </svg>
        <input
          ref={inputRef}
          aria-activedescendant={
            activeResult ? `${resultListId}-${activeResult.id}` : undefined
          }
          aria-controls={resultListId}
          aria-expanded={results.length > 0}
          aria-label="Buscar na GHENO rotors"
          autoComplete="off"
          className={cn(
            'h-11 w-full rounded-lg border border-border-strong bg-background/72 py-2 pl-10 pr-4 text-sm text-primary outline-none transition-[border-color,background-color,box-shadow] placeholder:text-secondary/72 focus:border-primary/45 focus:bg-background focus:shadow-[0_0_0_3px_rgba(245,245,245,0.08)]',
          )}
          id={`${resultListId}-input`}
          placeholder="Produto, medida ou compatibilidade"
          role="searchbox"
          type="search"
          value={query}
          onChange={(event) => {
            const nextQuery = event.target.value;
            setQuery(nextQuery);
            // Keep Enter-to-open; leave suggestions unselected.
            setActiveIndex(nextQuery.trim() ? 0 : null);
          }}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="flex items-center justify-between gap-3 px-1">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-secondary/72">
          {normalizedQuery ? 'Resultados' : 'Sugestões'}
        </p>
        {normalizedQuery && results.length > 0 ? (
          <p className="text-xs text-secondary">
            {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
          </p>
        ) : null}
      </div>

      {results.length > 0 ? (
        <div
          className={cn(
            'grid gap-1 overflow-y-auto pr-1',
            mode === 'mobile'
              ? 'max-h-[42dvh] overscroll-contain'
              : 'max-h-[21rem] overscroll-contain',
          )}
          data-scroll-lock-scrollable={mode === 'mobile' ? true : undefined}
          id={resultListId}
          role="list"
        >
          {results.map((result, index) => (
            <SearchResultLink
              active={index === activeIndex}
              id={`${resultListId}-${result.id}`}
              key={result.id}
              result={result}
              setRef={(element) => {
                resultRefs.current[index] = element;
              }}
              onFocus={() => setActiveIndex(index)}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      ) : (
        <NoResults query={normalizedQuery} />
      )}
    </div>
  );
}

function SearchResultLink({
  active,
  id,
  result,
  setRef,
  onFocus,
  onNavigate,
}: {
  active: boolean;
  id: string;
  result: SearchResult;
  setRef: (element: HTMLAnchorElement | null) => void;
  onFocus: () => void;
  onNavigate?: () => void;
}) {
  const className = cn(
    'group flex min-h-14 items-center gap-3 rounded-lg border px-2.5 py-2 text-left transition-[background-color,border-color,transform]',
    active
      ? 'border-border-strong bg-primary/10'
      : 'border-transparent hover:border-border hover:bg-primary/6',
  );
  const content = <SearchResultContent result={result} />;
  const commonProps = {
    className,
    id,
    ref: setRef,
    onClick: onNavigate,
    onFocus,
    onMouseEnter: onFocus,
  };

  return result.href.startsWith('/') ? (
    <Link {...commonProps} to={result.href}>
      {content}
    </Link>
  ) : (
    <a {...commonProps} href={result.href}>
      {content}
    </a>
  );
}

function SearchResultContent({ result }: { result: SearchResult }): ReactNode {
  const destination =
    result.commerce === 'store'
      ? 'Loja online'
      : result.commerce === 'contact'
        ? 'Falar com a equipe'
        : 'Neste site';

  const thumbnailSrc =
    result.image ?? (result.family ? FAMILY_THUMBNAILS[result.family] : undefined);

  return (
    <>
      {thumbnailSrc ? (
        <img
          alt=""
          className="h-11 w-11 shrink-0 rounded-md border border-border object-cover"
          loading="lazy"
          src={thumbnailSrc}
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-sm font-bold text-accent"
        >
          {result.kind === 'product' ? 'P' : result.kind === 'category' ? 'C' : 'G'}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold leading-tight text-primary">
          {result.title}
        </span>
        <span className="mt-1 block text-xs text-secondary">{destination}</span>
      </span>
    </>
  );
}

function NoResults({ query }: { query: string }) {
  const storeHref = `${STORE_SEARCH_URL}?q=${encodeURIComponent(query)}`;

  return (
    <div className="rounded-lg border border-border bg-background/48 p-4">
      <p className="text-sm font-bold text-primary">Nenhum item no índice.</p>
      <p className="mt-1 text-xs leading-5 text-secondary">
        Tente um modelo, medida ou sistema de freio diferente.
      </p>
      <a
        className="mt-3 inline-flex text-xs font-bold text-primary underline decoration-border-strong underline-offset-4 transition-colors hover:text-accent"
        href={storeHref}
      >
        Buscar “{query}” na loja GHENO rotors
      </a>
    </div>
  );
}
