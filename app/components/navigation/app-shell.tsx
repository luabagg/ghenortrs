import { type ReactNode, useState } from 'react';

import { useLocation } from '@remix-run/react';

import { AppFooter } from './app-footer';
import { AppHeader } from './app-header';
import { MobileMenuOverlay } from './mobile-menu-overlay';

export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isAdmin = pathname.startsWith('/admin');

  return (
    <div
      data-testid="app-shell"
      className="flex min-h-screen flex-col overflow-x-hidden bg-background font-body text-primary"
    >
      <a
        className="sr-only z-50 rounded-button bg-primary px-4 py-3 text-on-primary focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        href="#main-content"
      >
        Pular para o conteúdo
      </a>
      {isAdmin ? null : (
        <MobileMenuOverlay onClose={() => setMenuOpen(false)} open={menuOpen} />
      )}
      {isAdmin ? null : (
        <AppHeader isHome={isHome} onOpenMenu={() => setMenuOpen(true)} />
      )}
      <main
        id="main-content"
        className={
          isHome
            ? 'flex w-full flex-1'
            : isAdmin
              ? 'mx-auto flex w-full max-w-[90rem] flex-1 px-6 py-10 sm:px-10 lg:px-16'
              : 'mx-auto flex w-full max-w-[90rem] flex-1 px-6 pb-10 pt-32 sm:px-10 sm:pb-14 sm:pt-36 lg:px-16 lg:pb-18'
        }
      >
        <div className="w-full">{children}</div>
      </main>
      {isAdmin ? null : <AppFooter />}
    </div>
  );
}
