import { useEffect, useRef, useState } from 'react';

import { Link, NavLink } from 'react-router-dom';

import { buttonVariants } from '@/components/ui/button-variants';
import { GlassPanel } from '@/components/ui/glass-panel';
import { cn } from '@/lib/utils';

import {
  componentMenuLinks,
  primaryNavLinks,
  type HeaderMenuLink,
  type HeaderNavLink,
} from './app-header-data';

const navigationLinkClassName = ({ isActive }: { isActive: boolean }) =>
  buttonVariants({
    size: 'nav',
    variant: isActive ? 'nav-active' : 'nav',
  });

const componentMenuLinkClassName =
  'flex w-full rounded-sm px-3 py-2 text-sm text-secondary transition-colors hover:bg-surface hover:text-primary';

/** Single-line shortcut hint for chips and the shortcuts dialog. */
function getShortcutLabel(): string {
  if (typeof navigator === 'undefined') return 'Ctrl+K';

  const ua = navigator.userAgent ?? '';
  const nav = navigator as Navigator & {
    userAgentData?: { platform?: string };
  };
  const platform = nav.userAgentData?.platform ?? navigator.platform ?? '';

  const isApple =
    /Mac|iPhone|iPad|iPod/i.test(platform) ||
    /Mac OS X|Macintosh|\biPhone\b|\biPad\b|\biPod\b/.test(ua) ||
    // iPadOS “desktop” Safari reports MacIntel with touch points.
    (platform === 'MacIntel' &&
      typeof navigator.maxTouchPoints === 'number' &&
      navigator.maxTouchPoints > 1);

  return isApple ? '⌘K' : 'Ctrl+K';
}

export function AppHeader({
  isHome,
  onOpenMenu,
}: {
  isHome?: boolean;
  onOpenMenu: () => void;
}) {
  const [quickOpen, setQuickOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 24);

    updateScrolled();
    window.addEventListener('scroll', updateScrolled, { passive: true });
    return () => window.removeEventListener('scroll', updateScrolled);
  }, []);

  const compact = scrolled || !isHome;

  return (
    <header
      className={cn(
        'fixed left-0 top-0 z-40 w-full border-b transition-[background-color,border-color,box-shadow] duration-200',
        compact
          ? 'border-border bg-background/94 shadow-[0_18px_40px_rgba(0,0,0,0.34)]'
          : 'border-transparent bg-transparent shadow-none',
      )}
    >
      <div
        className={cn(
          'mx-auto flex max-w-[90rem] items-center justify-between gap-4 px-6 transition-[padding] duration-200 sm:px-10 lg:px-16',
          compact ? 'py-3 sm:py-4' : 'py-6',
        )}
      >
        <HeaderBrand compact={compact} />
        <MobileMenuButton compact={compact} onOpenMenu={onOpenMenu} />
        <div className="hidden sm:block">
          <HeaderNavigation />
        </div>
        <DesktopUtilityCluster
          compact={compact}
          open={quickOpen}
          onOpenChange={setQuickOpen}
        />
      </div>
    </header>
  );
}

function HeaderBrand({ compact }: { compact: boolean }) {
  return (
    <Link aria-label="Início GHENO" className="shrink-0" to="/">
      <img
        alt="GHENO"
        className={cn(
          'w-auto rounded-sm transition-[height] duration-200',
          compact ? 'h-8 sm:h-9' : 'h-9 sm:h-10',
        )}
        height={250}
        src="/brand/logo-wide.png"
        width={500}
      />
    </Link>
  );
}

function MobileMenuButton({
  compact,
  onOpenMenu,
}: {
  compact: boolean;
  onOpenMenu: () => void;
}) {
  return (
    <button
      aria-label="Abrir menu"
      className={cn(
        'flex items-center justify-center rounded-lg border border-border-strong bg-surface-elevated text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-[height,width] duration-200 sm:hidden',
        compact ? 'h-12 w-12' : 'h-14 w-14',
      )}
      onClick={onOpenMenu}
    >
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M4 6h16M4 12h16M4 18h16"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
      </svg>
    </button>
  );
}

function HeaderNavigation() {
  return (
    <nav
      aria-label="Principal"
      className="flex items-center gap-9 text-[11px] font-extrabold uppercase tracking-[0.1em]"
    >
      <ComponentsMenu />
      {primaryNavLinks.map((link) => (
        <HeaderNavItem key={link.label} link={link} />
      ))}
    </nav>
  );
}

function ComponentsMenu() {
  return (
    <div className="group relative">
      <NavLink
        className={({ isActive }) =>
          cn(navigationLinkClassName({ isActive }), 'flex items-center gap-1')
        }
        to="/componentes"
      >
        Componentes
        <svg
          className="h-3 w-3 transition-transform duration-150 group-hover:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M19 9l-7 7-7-7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      </NavLink>
      <div className="invisible absolute left-0 top-full z-50 mt-4 min-w-[12rem] rounded-lg border border-border bg-surface-elevated p-2 opacity-0 shadow-2xl transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        {componentMenuLinks.map((link, index) => (
          <ComponentMenuItem
            includeDivider={index === 1}
            key={link.label}
            link={link}
          />
        ))}
      </div>
    </div>
  );
}

function DesktopUtilityCluster({
  compact,
  open,
  onOpenChange,
}: {
  compact: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [shortcutLabel] = useState(() => getShortcutLabel());

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        onOpenChange(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        onOpenChange(true);
      }
      if (event.key === 'Escape') onOpenChange(false);
    }

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onOpenChange]);

  return (
    <div
      className="relative hidden min-h-11 shrink-0 items-center justify-end sm:flex"
      ref={containerRef}
    >
      {open ? (
        <QuickCommandPanel
          compact={compact}
          shortcutLabel={shortcutLabel}
          onOpenShortcuts={() => {
            onOpenChange(false);
            setShortcutsOpen(true);
          }}
          onClose={() => onOpenChange(false)}
        />
      ) : (
        <QuickSearchTrigger
          compact={compact}
          open={open}
          shortcutLabel={shortcutLabel}
          onClick={() => onOpenChange(true)}
        />
      )}
      {shortcutsOpen ? (
        <KeyboardShortcutsDialog
          shortcutLabel={shortcutLabel}
          onClose={() => setShortcutsOpen(false)}
        />
      ) : null}
    </div>
  );
}

function QuickSearchTrigger({
  compact,
  label,
  open,
  shortcutLabel,
  onClick,
}: {
  compact: boolean;
  label?: string;
  open: boolean;
  shortcutLabel: string;
  onClick: () => void;
}) {
  const showShortcutChip = Boolean(label);

  return (
    <button
      aria-label="Buscar"
      aria-expanded={open}
      aria-haspopup="dialog"
      aria-keyshortcuts="Meta+K Control+K"
      className={cn(
        'flex items-center rounded-lg border border-border-strong bg-background/35 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-[height,width,background-color,border-color,box-shadow] duration-200 hover:border-primary/35 hover:bg-surface-elevated active:translate-y-px',
        showShortcutChip
          ? cn(
              'w-full justify-between gap-3 bg-background/72 px-4',
              compact ? 'h-10' : 'h-11',
            )
          : cn(
              'justify-center bg-background/45',
              compact ? 'h-10 w-10' : 'h-11 w-11',
            ),
      )}
      type="button"
      onClick={onClick}
    >
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
      {label ? (
        <span className="min-w-0 flex-1 truncate text-left text-xs text-secondary">
          {label}
        </span>
      ) : null}
      {showShortcutChip ? (
        <kbd className="shrink-0 whitespace-nowrap rounded-md border border-border bg-surface px-2 py-1 font-mono text-xs text-primary">
          {shortcutLabel}
        </kbd>
      ) : null}
    </button>
  );
}

function QuickCommandPanel({
  compact,
  shortcutLabel,
  onOpenShortcuts,
  onClose,
}: {
  compact: boolean;
  shortcutLabel: string;
  onOpenShortcuts: () => void;
  onClose: () => void;
}) {
  const links = [
    { href: '/componentes', label: 'Ver todos os componentes' },
    { href: 'https://store.ghenortrs.com.br/produtos/', label: 'Pastilhas' },
    { href: '/contato', label: 'Cubos' },
    { href: '/contato', label: 'Aros' },
    { href: '/contato', label: 'Rotores' },
    { href: '/#tecnologia', label: 'Tecnologia' },
    { href: '/sobre', label: 'Sobre a Gheno' },
    { href: '/contato', label: 'Contato' },
  ];

  return (
    <GlassPanel
      aria-label="Comando rápido"
      className="!absolute right-0 top-0 z-50 w-[15rem] origin-top-right rounded-lg p-4 text-primary motion-safe:animate-[gheno-command-open_220ms_cubic-bezier(0.16,1,0.3,1)]"
      density="strong"
      role="dialog"
    >
      <div className="mb-4">
        <QuickSearchTrigger
          compact={compact}
          label="Buscar..."
          open
          shortcutLabel={shortcutLabel}
          onClick={onClose}
        />
      </div>
      <p className="mb-3 text-[9px] font-extrabold uppercase tracking-[0.18em] text-secondary/70">
        Navegar
      </p>
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <a
            className="-mx-2 rounded-sm px-2 py-1 text-xs font-semibold text-primary/82 transition-colors hover:bg-primary/10 hover:text-primary focus-visible:bg-primary/10 focus-visible:text-primary"
            href={link.href}
            key={link.label}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <div className="mt-5 border-t border-border pt-4">
        <p className="mb-2 text-xs text-secondary">Atalhos</p>
        <button
          className="-mx-2 flex h-6 w-[calc(100%+1rem)] items-center rounded-sm px-2 text-left text-primary/82 transition-colors hover:bg-primary/10 hover:text-primary focus-visible:bg-primary/10 focus-visible:text-primary"
          type="button"
          onClick={onOpenShortcuts}
        >
          <span className="min-w-0 truncate text-xs font-semibold">
            Ver todos atalhos do teclado
          </span>
        </button>
      </div>
    </GlassPanel>
  );
}

function KeyboardShortcutsDialog({
  shortcutLabel,
  onClose,
}: {
  shortcutLabel: string;
  onClose: () => void;
}) {
  return (
    <div
      aria-label="Atalhos do teclado"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-overlay/58 px-6"
      role="dialog"
    >
      <button
        aria-label="Fechar atalhos"
        className="absolute inset-0"
        type="button"
        onClick={onClose}
      />
      <GlassPanel
        className="relative grid w-full max-w-sm gap-4 rounded-lg p-5"
        density="strong"
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-bold">Atalhos do teclado</p>
          <button
            aria-label="Fechar atalhos"
            className="rounded-md border border-border bg-surface px-2 py-1 text-xs text-secondary transition-colors hover:text-primary"
            type="button"
            onClick={onClose}
          >
            Esc
          </button>
        </div>
        <dl className="grid gap-3 text-xs">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-secondary">Abrir busca</dt>
            <dd className="rounded bg-primary/10 px-2 py-1 font-mono text-primary">
              {shortcutLabel}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-secondary">Fechar painel</dt>
            <dd className="rounded bg-primary/10 px-2 py-1 font-mono text-primary">
              Esc
            </dd>
          </div>
        </dl>
      </GlassPanel>
    </div>
  );
}

function ComponentMenuItem({
  includeDivider,
  link,
}: {
  includeDivider: boolean;
  link: HeaderMenuLink;
}) {
  return (
    <>
      {includeDivider ? <div className="my-1 border-t border-border" /> : null}
      {link.to ? (
        <Link className={componentMenuLinkClassName} to={link.to}>
          {link.label}
        </Link>
      ) : (
        <a className={componentMenuLinkClassName} href={link.href}>
          {link.label}
        </a>
      )}
    </>
  );
}

function HeaderNavItem({ link }: { link: HeaderNavLink }) {
  if (link.to) {
    return (
      <NavLink className={navigationLinkClassName} to={link.to}>
        {link.label}
      </NavLink>
    );
  }

  return (
    <a
      className={buttonVariants({ size: 'nav', variant: 'nav' })}
      href={link.href}
    >
      {link.label}
    </a>
  );
}
