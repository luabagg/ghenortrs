import { type ReactNode } from 'react';

import { Link } from 'react-router-dom';

const footerLinkClassName =
  'text-sm text-secondary transition-colors hover:text-primary';

export function AppFooter() {
  return (
    <footer
      aria-label="Rodapé"
      className="border-t border-border bg-background-soft"
      data-section="footer"
    >
      <div className="mx-auto max-w-[90rem] px-6 py-12 sm:px-10 lg:px-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <img
              alt="GHENO"
              className="h-8 w-auto rounded-sm"
              height={250}
              loading="lazy"
              src="/brand/logo-wide.png"
              width={500}
            />
            <p className="max-w-xs text-sm leading-6 text-secondary">
              Componentes de alto desempenho para MTB. Pastilhas, cubos, aros e
              rotores desenvolvidos para uso intenso e real.
            </p>
            <div className="flex gap-3">
              <a
                aria-label="Instagram GHENO"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-secondary transition-colors hover:border-primary/40 hover:text-primary"
                href="https://www.instagram.com/ghenortrs/"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                aria-label="YouTube GHENO"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-secondary transition-colors hover:border-primary/40 hover:text-primary"
                href="https://www.youtube.com/@ghenortrs"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          <FooterLinkGroup title="Loja B2B" ariaLabel="Links loja B2B">
            <a
              className={footerLinkClassName}
              href="https://store.ghenortrs.com.br/produtos/"
            >
              Entrar na Loja
            </a>
            <a
              className={footerLinkClassName}
              href="https://store.ghenortrs.com.br/contato/"
            >
              Falar com comercial
            </a>
            <a
              className={footerLinkClassName}
              href="https://store.ghenortrs.com.br/contato/"
            >
              Pré-cadastro de revenda
            </a>
          </FooterLinkGroup>

          <FooterLinkGroup title="Categorias" ariaLabel="Links de categorias">
            <a
              className={footerLinkClassName}
              href="https://store.ghenortrs.com.br/produtos/"
            >
              Pastilhas
            </a>
            <a
              className={footerLinkClassName}
              href="https://store.ghenortrs.com.br/contato/"
            >
              Cubos
            </a>
            <a
              className={footerLinkClassName}
              href="https://store.ghenortrs.com.br/contato/"
            >
              Rotores
            </a>
            <a
              className={footerLinkClassName}
              href="https://store.ghenortrs.com.br/contato/"
            >
              Aros
            </a>
          </FooterLinkGroup>

          <FooterLinkGroup
            title="Institucional"
            ariaLabel="Links institucionais"
          >
            <Link className={footerLinkClassName} to="/">
              Sobre a GHENO
            </Link>
            <Link className={footerLinkClassName} to="/">
              Tecnologia
            </Link>
            <a
              className={footerLinkClassName}
              href="https://store.ghenortrs.com.br/contato/"
            >
              Contato
            </a>
            <a
              className={footerLinkClassName}
              href="https://store.ghenortrs.com.br/politica-de-privacidade/"
            >
              Privacidade
            </a>
          </FooterLinkGroup>

          <FooterLinkGroup title="Contato" ariaLabel="Links de contato">
            <a
              className={footerLinkClassName}
              href="https://store.ghenortrs.com.br/contato/"
            >
              WhatsApp
            </a>
            <a
              className={footerLinkClassName}
              href="https://www.instagram.com/ghenortrs/"
            >
              Instagram
            </a>
            <a
              className={footerLinkClassName}
              href="https://www.youtube.com/@ghenortrs"
            >
              YouTube
            </a>
          </FooterLinkGroup>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-secondary/60">
            © 2025 GHENO. Todos os direitos reservados.
          </p>
          <p className="text-xs text-secondary/40">
            Componentes de performance para MTB de verdade.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkGroup({
  ariaLabel,
  children,
  title,
}: {
  ariaLabel: string;
  children: ReactNode;
  title: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
        {title}
      </p>
      <nav aria-label={ariaLabel} className="flex flex-col gap-2.5">
        {children}
      </nav>
    </div>
  );
}
