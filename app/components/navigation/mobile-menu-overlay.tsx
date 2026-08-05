import { type RefObject, useEffect, useRef } from 'react';

import { MobileMenuActions } from '@/components/navigation/mobile-menu-actions';
import { StoreSearch } from '@/components/search/store-search';

export function MobileMenuOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null!);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  if (!open) return null;
  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex overflow-hidden bg-background sm:hidden"
      role="dialog"
    >
      <button
        aria-label="Fechar menu"
        className="absolute inset-0"
        onClick={onClose}
        tabIndex={-1}
      />
      <img
        alt=""
        className="absolute inset-0 h-[47dvh] w-full object-cover opacity-50"
        src="/reference-images/mtb-action-hero.jpg"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/35 via-background/72 to-background" />
      <MobileMenuHeader closeRef={closeRef} onClose={onClose} />

      <div className="absolute inset-0 flex flex-col overflow-hidden border border-border-strong bg-surface/94 pt-20 shadow-[0_24px_70px_rgba(0,0,0,0.42)]">
        <div className="overflow-y-auto px-5 pb-5 pt-3 min-[420px]:px-7">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.14em] text-secondary">
            Buscar
          </p>
          <StoreSearch mode="mobile" onNavigate={onClose} />
          <p className="mb-3 mt-8 text-xs font-extrabold uppercase tracking-[0.14em] text-secondary">
            Ações rápidas
          </p>
          <MobileMenuActions onClose={onClose} />
        </div>
      </div>
    </div>
  );
}

function MobileMenuHeader({
  closeRef,
  onClose,
}: {
  closeRef: RefObject<HTMLButtonElement>;
  onClose: () => void;
}) {
  return (
    <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-end px-5 pt-6 min-[420px]:px-7">
      <button
        ref={closeRef}
        aria-label="Fechar menu"
        className="flex h-10 w-10 items-center justify-center rounded-sm text-primary transition-colors hover:text-secondary"
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
