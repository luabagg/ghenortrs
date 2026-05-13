import { Link, NavLink } from 'react-router-dom';

import { buttonVariants } from '@/components/ui/button-variants';
import { GlassPanel } from '@/components/ui/glass-panel';
import { cn } from '@/lib/utils';

const navigationLinkClassName = ({ isActive }: { isActive: boolean }) =>
  buttonVariants({
    size: 'nav',
    variant: isActive ? 'nav-active' : 'nav',
  });

export function AppHeader({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header className="border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-4 px-6 py-5 sm:px-10 lg:px-16">
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
        <GlassPanel className="hidden p-2 sm:block">
          <nav aria-label="Principal" className="flex flex-wrap gap-3">
            <div className="group relative">
              <NavLink
                className={({ isActive }) =>
                  cn(
                    navigationLinkClassName({ isActive }),
                    'flex items-center gap-1',
                  )
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
                <Link
                  className="flex w-full rounded-sm px-3 py-2 text-sm text-secondary transition-colors hover:bg-surface hover:text-primary"
                  to="/componentes"
                >
                  Ver todos os componentes
                </Link>
                <div className="my-1 border-t border-border" />
                <a
                  className="flex w-full rounded-sm px-3 py-2 text-sm text-secondary transition-colors hover:bg-surface hover:text-primary"
                  href="https://store.ghenortrs.com.br/produtos/"
                >
                  Pastilhas
                </a>
                <a
                  className="flex w-full rounded-sm px-3 py-2 text-sm text-secondary transition-colors hover:bg-surface hover:text-primary"
                  href="https://store.ghenortrs.com.br/contato/"
                >
                  Cubos
                </a>
                <a
                  className="flex w-full rounded-sm px-3 py-2 text-sm text-secondary transition-colors hover:bg-surface hover:text-primary"
                  href="https://store.ghenortrs.com.br/contato/"
                >
                  Aros
                </a>
                <a
                  className="flex w-full rounded-sm px-3 py-2 text-sm text-secondary transition-colors hover:bg-surface hover:text-primary"
                  href="https://store.ghenortrs.com.br/contato/"
                >
                  Rotores
                </a>
              </div>
            </div>
            <NavLink className={navigationLinkClassName} to="/#tecnologia">
              Tecnologia
            </NavLink>
            <NavLink className={navigationLinkClassName} to="/b2b">
              B2B
            </NavLink>
            <a
              className={buttonVariants({ size: 'nav', variant: 'nav' })}
              href="https://store.ghenortrs.com.br/"
            >
              Sobre a GHENO
            </a>
            <a
              className={buttonVariants({ size: 'nav', variant: 'nav' })}
              href="https://store.ghenortrs.com.br/contato/"
            >
              Contato
            </a>
          </nav>
        </GlassPanel>
      </div>
    </header>
  );
}
