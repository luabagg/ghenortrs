import { type RefObject, useEffect, useRef } from 'react';

import { MobileMenuActions } from '@/components/navigation/mobile-menu-actions';

export function MobileMenuOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  if (!open) return null;
  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex sm:hidden"
      role="dialog"
    >
      <button
        aria-label="Fechar menu"
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
        onClick={onClose}
        tabIndex={-1}
      />
      <div className="absolute inset-x-0 top-0 flex max-h-[92dvh] flex-col overflow-hidden rounded-b-2xl border-b border-border bg-surface-glass/95 shadow-2xl backdrop-blur-2xl">
        <MobileMenuHeader closeRef={closeRef} onClose={onClose} />

        <MobileMenuSearchPrompt />

        <div className="overflow-y-auto px-5 pb-5">
          <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-secondary/50">
            Ações rápidas
          </p>
          <MobileMenuActions onClose={onClose} />
        </div>

        <MobileMenuBrandNote />
      </div>
    </div>
  );
}

function MobileMenuHeader({
  closeRef,
  onClose,
}: {
  closeRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-5">
      <span className="font-heading text-xl font-black tracking-[-0.04em] text-accent">
        gheno
      </span>
      <button
        ref={closeRef}
        aria-label="Fechar menu"
        className="flex h-9 w-9 items-center justify-center rounded-md text-secondary hover:bg-surface-elevated hover:text-primary"
        onClick={onClose}
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M6 18L18 6M6 6l12 12"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      </button>
    </div>
  );
}

function MobileMenuSearchPrompt() {
  return (
    <div className="px-5 pb-4">
      <div className="flex items-center gap-3 rounded-lg border border-border bg-background/60 px-4 py-3">
        <svg
          className="h-4 w-4 shrink-0 text-secondary"
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
        <span className="flex-1 text-sm text-secondary/60">
          Buscar componentes, compatibilidade, páginas...
        </span>
        <kbd className="hidden rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-secondary/50 sm:inline">
          ⌘K
        </kbd>
      </div>
    </div>
  );
}

function MobileMenuBrandNote() {
  return (
    <div className="mx-5 mb-5 flex items-center justify-between gap-4 rounded-xl border border-border bg-accent/8 px-5 py-4">
      <div className="flex items-center gap-3">
        <img
          alt="GHENO"
          className="h-7 w-auto rounded-sm"
          height={250}
          loading="lazy"
          src="/brand/logo-wide.png"
          width={500}
        />
        <p className="text-sm font-semibold leading-tight text-primary">
          Componentes desenvolvidos para uso intenso e real.
        </p>
      </div>
      <svg
        className="h-4 w-4 shrink-0 text-accent"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M9 5l7 7-7 7"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
      </svg>
    </div>
  );
}
