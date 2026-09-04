import { useEffect, useRef, type ReactNode } from 'react';

import { useBodyScrollLock } from '@/lib/use-body-scroll-lock';

/**
 * Side sheet with the four things every modal needs: a scrim that closes it,
 * Escape, a scroll lock, and focus moved to the close control. Built once so
 * the next sheet does not hand-roll them again.
 */
export function Drawer({
  open,
  title,
  onClose,
  children,
  footer,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useBodyScrollLock(open);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      aria-label={title}
      aria-modal="true"
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
    >
      <button
        aria-label="Fechar"
        className="absolute inset-0 bg-overlay/70"
        tabIndex={-1}
        type="button"
        onClick={onClose}
      />

      <div className="relative flex h-full w-full flex-col border-l border-border-strong bg-surface sm:max-w-md">
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <h2 className="font-heading text-[20px] leading-tight tracking-[-0.03em] text-primary">
            {title}
          </h2>
          <button
            ref={closeRef}
            aria-label="Fechar"
            className="-mr-1 -mt-1 grid size-9 shrink-0 place-items-center rounded-sm text-secondary transition-colors hover:bg-surface-elevated hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
            type="button"
            onClick={onClose}
          >
            <svg
              aria-hidden="true"
              className="size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M6 6l12 12M18 6L6 18"
                strokeLinecap="round"
                strokeWidth={1.6}
              />
            </svg>
          </button>
        </div>

        <div
          className="flex-1 overflow-y-auto overscroll-contain px-5 py-5"
          data-scroll-lock-scrollable
        >
          {children}
        </div>

        {footer ? (
          <div className="border-t border-border px-5 py-4">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}
