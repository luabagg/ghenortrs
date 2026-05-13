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

export function AppHeader({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header className="border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-4 px-6 py-5 sm:px-10 lg:px-16">
        <HeaderBrand />
        <MobileMenuButton onOpenMenu={onOpenMenu} />
        <GlassPanel className="hidden p-2 sm:block">
          <HeaderNavigation />
        </GlassPanel>
      </div>
    </header>
  );
}

function HeaderBrand() {
  return (
    <div>
      <img
        alt="GHENO"
        className="h-10 w-auto rounded-sm"
        height={250}
        src="/brand/logo-wide.png"
        width={500}
      />
      <p className="text-sm text-secondary">
        Componentes de alto desempenho para MTB
      </p>
    </div>
  );
}

function MobileMenuButton({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <button
      aria-label="Abrir menu"
      className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface-elevated text-primary sm:hidden"
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
    <nav aria-label="Principal" className="flex flex-wrap gap-3">
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
      <div className="invisible absolute left-0 top-full z-50 mt-1 min-w-[11rem] rounded-panel border border-border bg-background/95 p-1 opacity-0 shadow-lg backdrop-blur-xl transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
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
