import { useState } from 'react';

import { Outlet } from 'react-router-dom';

import { AppFooter } from './app-footer';
import { AppHeader } from './app-header';
import { MobileMenuOverlay } from './mobile-menu-overlay';

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      data-testid="app-shell"
      className="flex min-h-screen flex-col bg-background font-body text-primary"
    >
      <MobileMenuOverlay onClose={() => setMenuOpen(false)} open={menuOpen} />
      <AppHeader onOpenMenu={() => setMenuOpen(true)} />
      <main className="mx-auto flex w-full max-w-[90rem] flex-1 px-6 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-18">
        <div className="w-full">
          <Outlet />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
