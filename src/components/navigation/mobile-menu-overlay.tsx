import { type RefObject, useEffect, useRef } from 'react';

import { MobileMenuActions } from '@/components/navigation/mobile-menu-actions';
import { GlassPanel } from '@/components/ui/glass-panel';

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

      <div className="absolute inset-0 flex flex-col overflow-hidden border border-border-strong bg-surface/94 pt-32 shadow-[0_24px_70px_rgba(0,0,0,0.42)]">
        <MobileMenuSearchPrompt />

        <div className="overflow-y-auto px-5 pb-5 min-[420px]:px-7">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.14em] text-secondary">
            Ações rápidas
          </p>
          <MobileMenuActions onClose={onClose} />
          <MobileMenuBrandNote />
        </div>
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
    <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-10 pt-16">
      <img
        alt="GHENO"
        className="h-12 w-auto"
        height={250}
        src="/brand/logo-wide.png"
        width={500}
      />
      <button
        ref={closeRef}
        aria-label="Fechar menu"
        className="flex h-16 w-16 items-center justify-center rounded-lg border border-border-strong bg-surface-elevated text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] hover:bg-surface"
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
    <div className="px-5 pb-4 pt-3 min-[420px]:px-7">
      <GlassPanel
        className="flex min-h-14 items-center gap-3 rounded-lg px-4"
        density="strong"
      >
        <svg
          className="h-6 w-6 shrink-0 text-primary"
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
        <span className="min-w-0 flex-1 truncate text-sm text-secondary min-[420px]:text-base">
          Buscar componentes, compatibilidade, páginas...
        </span>
      </GlassPanel>
    </div>
  );
}

function MobileMenuBrandNote() {
  return (
    <div className="mt-8 flex items-center justify-between gap-4 rounded-xl border border-border-strong bg-background/32 p-4">
      <div className="flex items-center gap-3">
        <img
          alt="GHENO"
          className="h-16 w-24 rounded-lg object-cover min-[420px]:h-20 min-[420px]:w-32"
          height={250}
          loading="lazy"
          src="/reference-images/pastilhas-gheno.jpg"
          width={500}
        />
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-accent">
            CATÁLOGO GHENO
          </p>
          <p className="mt-2 text-base font-bold leading-tight text-primary min-[420px]:text-xl">
            Pastilhas disponíveis para compra online.
          </p>
        </div>
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
