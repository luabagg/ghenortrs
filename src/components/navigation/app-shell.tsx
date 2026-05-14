import { useState } from 'react';

import { Outlet, useLocation } from 'react-router-dom';

import { AppFooter } from './app-footer';
import { AppHeader } from './app-header';
import { MobileMenuOverlay } from './mobile-menu-overlay';

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <div
      data-testid="app-shell"
      className="flex min-h-screen flex-col overflow-x-hidden bg-background font-body text-primary"
    >
      <MobileMenuOverlay onClose={() => setMenuOpen(false)} open={menuOpen} />
      <AppHeader isHome={isHome} onOpenMenu={() => setMenuOpen(true)} />
      <main
        className={
          isHome
            ? 'flex w-full flex-1'
            : 'mx-auto flex w-full max-w-[90rem] flex-1 px-6 pb-10 pt-32 sm:px-10 sm:pb-14 sm:pt-36 lg:px-16 lg:pb-18'
        }
      >
        <div className="w-full">
          <Outlet />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
