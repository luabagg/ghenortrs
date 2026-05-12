import { useState } from 'react';

import { Link, NavLink, Outlet, Route, Routes } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button-variants';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DotMatrixLoader } from '@/components/ui/dot-matrix-loader';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MetaLabel } from '@/components/ui/meta-label';
import { SectionBand } from '@/components/ui/section-band';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const navigationLinkClassName = ({ isActive }: { isActive: boolean }) =>
  buttonVariants({
    size: 'nav',
    variant: isActive ? 'nav-active' : 'nav',
  });

const QUICK_ACTIONS = [
  {
    icon: (
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M4 6h16M4 10h16M4 14h16M4 18h16"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
        />
      </svg>
    ),
    title: 'Ver componentes',
    description: 'Pastilhas, cubos, aros e rotores',
    to: '/componentes',
    badge: null as string | null,
  },
  {
    icon: (
      <svg
        className="h-4 w-4"
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
    ),
    title: 'Buscar compatibilidade',
    description: 'Encontre a peça certa para sua bike',
    href: 'https://store.ghenortrs.com.br/produtos/',
    badge: null as string | null,
  },
  {
    icon: (
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M13 10V3L4 14h7v7l9-11h-7z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
        />
      </svg>
    ),
    title: 'Tecnologia',
    description: 'Engenharia aplicada à performance',
    to: '/',
    badge: null as string | null,
  },
  {
    icon: (
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
        />
      </svg>
    ),
    title: 'Loja B2B',
    description: 'Acesse nossa loja para revendas',
    href: 'https://store.ghenortrs.com.br/produtos/',
    badge: 'Novo',
  },
  {
    icon: (
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
        />
      </svg>
    ),
    title: 'Falar com a GHENO',
    description: 'Atendimento rápido via WhatsApp',
    href: 'https://store.ghenortrs.com.br/contato/',
    badge: null as string | null,
  },
  {
    icon: (
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
        />
      </svg>
    ),
    title: 'Sobre a GHENO',
    description: 'Nossa história e propósito',
    to: '/',
    badge: null as string | null,
  },
] as const;

function MobileMenuOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex sm:hidden"
      role="dialog"
    >
      <button
        aria-label="Fechar menu"
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
        onClick={onClose}
        tabIndex={-1}
      />
      <div className="absolute inset-x-0 top-0 flex max-h-[92dvh] flex-col overflow-hidden rounded-b-2xl border-b border-border bg-surface-glass/95 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center justify-between px-5 py-5">
          <span className="font-heading text-xl font-black tracking-[-0.04em] text-accent">
            gheno
          </span>
          <button
            aria-label="Fechar menu"
            className="flex h-9 w-9 items-center justify-center rounded-md text-secondary hover:bg-surface-elevated hover:text-primary"
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

        <div className="px-5 pb-4">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-background/60 px-4 py-3">
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
            <span className="text-sm text-secondary/60">
              Buscar componentes, compatibilidade, páginas...
            </span>
          </div>
        </div>

        <div className="overflow-y-auto px-5 pb-5">
          <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-secondary/50">
            Ações rápidas
          </p>
          <nav aria-label="Ações rápidas" className="flex flex-col">
            {QUICK_ACTIONS.map((action) => {
              const content = (
                <>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-elevated text-secondary">
                    {action.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-primary">
                        {action.title}
                      </span>
                      {'badge' in action && action.badge && (
                        <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-background">
                          {action.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-secondary">
                      {action.description}
                    </p>
                  </div>
                  <svg
                    className="h-4 w-4 shrink-0 text-secondary/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M9 5l7 7-7 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                    />
                  </svg>
                </>
              );
              const className =
                'flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-surface-elevated active:bg-surface-elevated';
              if ('to' in action && action.to) {
                return (
                  <Link
                    key={action.title}
                    className={className}
                    onClick={onClose}
                    to={action.to}
                  >
                    {content}
                  </Link>
                );
              }
              return (
                <a
                  key={action.title}
                  className={className}
                  href={'href' in action ? action.href : '#'}
                  onClick={onClose}
                >
                  {content}
                </a>
              );
            })}
          </nav>
        </div>

        <div className="mx-5 mb-5 flex items-center justify-between gap-4 rounded-xl border border-border bg-accent/8 px-5 py-4">
          <div className="flex items-center gap-3">
            <img
              alt="GHENO"
              className="h-7 w-auto rounded-sm"
              src="/brand/logo-wide.png"
            />
            <p className="text-sm font-semibold leading-tight text-primary">
              Componentes desenvolvidos para uso intenso e real.
            </p>
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
      </div>
    </div>
  );
}

function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      data-testid="app-shell"
      className="flex min-h-screen flex-col bg-background font-body text-primary"
    >
      <MobileMenuOverlay onClose={() => setMenuOpen(false)} open={menuOpen} />
      <header className="border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-4 px-6 py-5 sm:px-10 lg:px-16">
          <div>
            <img
              alt="GHENO"
              className="h-10 w-auto rounded-sm"
              src="/brand/logo-wide.png"
            />
            <p className="text-sm text-secondary">
              Componentes de alto desempenho para MTB
            </p>
          </div>
          <button
            aria-label="Abrir menu"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface-elevated text-primary sm:hidden"
            onClick={() => setMenuOpen(true)}
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
              <NavLink className={navigationLinkClassName} to="/">
                Início
              </NavLink>
              <NavLink className={navigationLinkClassName} to="/componentes">
                Componentes
              </NavLink>
              <NavLink className={navigationLinkClassName} to="/b2b">
                B2B
              </NavLink>
            </nav>
          </GlassPanel>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-[90rem] flex-1 px-6 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-18">
        <div className="w-full">
          <Outlet />
        </div>
      </main>
      <footer
        aria-label="Rodapé"
        className="border-t border-border bg-background-soft"
      >
        <div className="mx-auto max-w-[90rem] px-6 py-12 sm:px-10 lg:px-16">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
            <div className="flex flex-col gap-4">
              <img
                alt="GHENO"
                className="h-8 w-auto rounded-sm"
                src="/brand/logo-wide.png"
              />
              <p className="max-w-xs text-sm leading-6 text-secondary">
                Componentes de alto desempenho para MTB. Pastilhas, cubos, aros
                e rotores desenvolvidos para uso intenso e real.
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

            <div className="flex flex-col gap-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                Loja B2B
              </p>
              <nav
                aria-label="Links loja B2B"
                className="flex flex-col gap-2.5"
              >
                <a
                  className="text-sm text-secondary transition-colors hover:text-primary"
                  href="https://store.ghenortrs.com.br/produtos/"
                >
                  Entrar na Loja
                </a>
                <a
                  className="text-sm text-secondary transition-colors hover:text-primary"
                  href="https://store.ghenortrs.com.br/contato/"
                >
                  Falar com comercial
                </a>
                <a
                  className="text-sm text-secondary transition-colors hover:text-primary"
                  href="https://store.ghenortrs.com.br/contato/"
                >
                  Pré-cadastro de revenda
                </a>
              </nav>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                Categorias
              </p>
              <nav
                aria-label="Links de categorias"
                className="flex flex-col gap-2.5"
              >
                <a
                  className="text-sm text-secondary transition-colors hover:text-primary"
                  href="https://store.ghenortrs.com.br/produtos/"
                >
                  Pastilhas
                </a>
                <a
                  className="text-sm text-secondary transition-colors hover:text-primary"
                  href="https://store.ghenortrs.com.br/contato/"
                >
                  Cubos
                </a>
                <a
                  className="text-sm text-secondary transition-colors hover:text-primary"
                  href="https://store.ghenortrs.com.br/contato/"
                >
                  Rotores
                </a>
                <a
                  className="text-sm text-secondary transition-colors hover:text-primary"
                  href="https://store.ghenortrs.com.br/contato/"
                >
                  Aros
                </a>
              </nav>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                Contato
              </p>
              <nav
                aria-label="Links de contato"
                className="flex flex-col gap-2.5"
              >
                <a
                  className="text-sm text-secondary transition-colors hover:text-primary"
                  href="https://store.ghenortrs.com.br/contato/"
                >
                  WhatsApp
                </a>
                <a
                  className="text-sm text-secondary transition-colors hover:text-primary"
                  href="https://www.instagram.com/ghenortrs/"
                >
                  Instagram
                </a>
                <a
                  className="text-sm text-secondary transition-colors hover:text-primary"
                  href="https://store.ghenortrs.com.br/politica-de-privacidade/"
                >
                  Política de Privacidade
                </a>
              </nav>
            </div>
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
    </div>
  );
}

function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Card className="bg-surface px-0 py-0 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
      <CardHeader className="px-6 py-8 sm:px-8 sm:py-10">
        <MetaLabel className="mb-1">{eyebrow}</MetaLabel>
        <h1 className="max-w-3xl font-heading text-4xl leading-none tracking-[-0.05em] sm:text-5xl">
          {title}
        </h1>
        <CardDescription className="max-w-2xl text-base leading-7 sm:text-lg">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

function ProductFamilyCard({
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
  isLive,
  imageAlt,
  imageSrc,
}: {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  isLive: boolean;
  imageAlt: string;
  imageSrc: string;
}) {
  return (
    <Card className="flex flex-col justify-between gap-0 overflow-hidden bg-surface">
      <div className="relative h-32 overflow-hidden border-b border-border bg-background-soft sm:h-44">
        <img
          alt={imageAlt}
          className="h-full w-full object-cover opacity-82 saturate-75"
          src={imageSrc}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/10 to-transparent" />
      </div>
      <CardHeader className="px-3 py-3 sm:px-6 sm:py-6">
        <MetaLabel
          className={cn(
            !isLive &&
              'border border-border bg-surface-elevated text-secondary',
          )}
        >
          {eyebrow}
        </MetaLabel>
        <h3 className="font-heading text-lg leading-tight tracking-[-0.04em] text-primary sm:text-2xl">
          {title}
        </h3>
        <CardDescription className="hidden sm:block">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
        <Button
          asChild
          className="w-full"
          variant={isLive ? 'primary' : 'secondary'}
        >
          <a href={ctaHref}>{ctaLabel}</a>
        </Button>
      </CardContent>
    </Card>
  );
}

function TechProofBlock({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-panel border border-border bg-surface px-5 py-5 sm:px-6">
      <div className="h-px w-8 bg-accent" />
      <h3 className="font-heading text-xl leading-tight tracking-[-0.03em] text-primary">
        {title}
      </h3>
      <p className="text-sm leading-6 text-secondary">{description}</p>
    </div>
  );
}

function TechnicalMediaCard({
  title,
  caption,
  imageAlt,
  imageSrc,
}: {
  title: string;
  caption: string;
  imageAlt: string;
  imageSrc: string;
}) {
  return (
    <figure className="group relative min-h-72 min-w-[17rem] snap-start overflow-hidden rounded-panel border border-border bg-surface sm:min-w-0">
      <img
        alt={imageAlt}
        className="absolute inset-0 h-full w-full object-cover opacity-75 saturate-75 transition-transform duration-500 group-hover:scale-[1.03]"
        src={imageSrc}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/54 to-transparent" />
      <figcaption className="absolute inset-x-0 bottom-0 grid gap-2 p-5 sm:p-6">
        <MetaLabel className="w-fit">TESTADO EM USO REAL</MetaLabel>
        <h3 className="font-heading text-2xl leading-tight tracking-[-0.03em] text-primary">
          {title}
        </h3>
        <p className="text-sm leading-6 text-primary/76">{caption}</p>
      </figcaption>
    </figure>
  );
}

function B2BMediaCard({
  title,
  imageAlt,
  imageSrc,
}: {
  title: string;
  imageAlt: string;
  imageSrc: string;
}) {
  return (
    <figure className="relative min-h-60 min-w-[15rem] snap-start overflow-hidden rounded-panel border border-on-primary/14 bg-on-primary/8 sm:min-w-0">
      <img
        alt={imageAlt}
        className="absolute inset-0 h-full w-full object-cover opacity-88 saturate-75"
        src={imageSrc}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-on-primary/82 via-on-primary/8 to-transparent" />
      <figcaption className="absolute inset-x-0 bottom-0 p-4">
        <p className="font-heading text-xl leading-tight tracking-[-0.03em] text-background">
          {title}
        </p>
      </figcaption>
    </figure>
  );
}

function ComponentFamiliesSection() {
  return (
    <section aria-labelledby="familias-heading" className="grid gap-8">
      <div className="flex flex-col gap-3">
        <MetaLabel>COMPONENTES</MetaLabel>
        <h2
          className="max-w-2xl font-heading text-4xl leading-none tracking-[-0.04em] sm:text-5xl"
          id="familias-heading"
        >
          Um sistema.{' '}
          <span className="text-secondary">Quatro pilares de performance.</span>
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <ProductFamilyCard
          ctaHref="https://store.ghenortrs.com.br/produtos/"
          ctaLabel="Ver catálogo GHENO"
          description="Composição calibrada para resposta direta e modulação previsível. Catálogo ativo ao vivo."
          eyebrow="ATIVO NO CATÁLOGO"
          imageAlt="Pastilha de freio GHENO"
          imageSrc="/reference-images/pastilhas-gheno.jpg"
          isLive={true}
          title="Pastilhas"
        />
        <ProductFamilyCard
          ctaHref="https://store.ghenortrs.com.br/contato/"
          ctaLabel="Consultar cubos"
          description="Rolamento de alta performance para trilha técnica e competição. Disponível via consulta comercial."
          eyebrow="CONSULTA COMERCIAL"
          imageAlt="Cubo GHENO"
          imageSrc="/reference-images/cubo-gheno.jpg"
          isLive={false}
          title="Cubos"
        />
        <ProductFamilyCard
          ctaHref="https://store.ghenortrs.com.br/contato/"
          ctaLabel="Consultar aros"
          description="Rigidez e leveza para rider exigente. Disponível via consulta comercial."
          eyebrow="CONSULTA COMERCIAL"
          imageAlt="Aro GHENO"
          imageSrc="/reference-images/aro-gheno.jpg"
          isLive={false}
          title="Aros"
        />
        <ProductFamilyCard
          ctaHref="https://store.ghenortrs.com.br/contato/"
          ctaLabel="Consultar rotores"
          description="Dissipação de calor e modulação em descidas longas. Disponível via consulta comercial."
          eyebrow="CONSULTA COMERCIAL"
          imageAlt="Rotor GHENO"
          imageSrc="/reference-images/rotor-gheno.jpg"
          isLive={false}
          title="Rotores"
        />
      </div>
    </section>
  );
}

function TechnicalProofSection() {
  return (
    <section aria-labelledby="tecnica-heading" className="grid gap-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-start">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <MetaLabel>PROVA TÉCNICA</MetaLabel>
            <h2
              className="max-w-2xl font-heading text-4xl leading-none tracking-[-0.04em] sm:text-5xl"
              id="tecnica-heading"
            >
              Engenharia que aparece no pedal, não só no catálogo.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <TechProofBlock
              description="Composição que entrega resposta igual na primeira descida e na centésima. Sem variação de modulação por temperatura ou ciclos repetidos."
              title="Frenagem previsível"
            />
            <TechProofBlock
              description="Modulação que não some quando a trilha esquenta. Confiança na freada mais longa, sem fade e sem perda de controle."
              title="Controle sob pressão"
            />
            <TechProofBlock
              description="Superfície limpa, espessura coerente, acomodação rápida. Sem irregularidades que comprometem o primeiro uso."
              title="Acabamento técnico"
            />
            <TechProofBlock
              description="Fabricado para montar certo. Tolerância adequada para encaixe direto, sem ajuste em campo."
              title="Montagem direta"
            />
          </div>
        </div>
        <div
          aria-label="Imagens de teste em trilha"
          className="-mx-6 flex snap-x gap-4 overflow-x-auto px-6 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0"
        >
          <TechnicalMediaCard
            caption="Validação em terreno solto, com frenagens repetidas e mudança rápida de apoio."
            imageAlt="Rider GHENO freando em trecho técnico de downhill"
            imageSrc="/reference-images/trilha-frenagem-gheno.jpg"
            title="Freio sob pressão"
          />
          <TechnicalMediaCard
            caption="Controle em curva e leitura de aderência para componente que precisa responder sem surpresa."
            imageAlt="Rider GHENO mantendo controle em curva de trilha"
            imageSrc="/reference-images/trilha-controle-gheno.jpg"
            title="Controle em curva"
          />
        </div>
      </div>
      <div>
        <Button asChild variant="secondary">
          <Link to="/componentes">Explorar componentes</Link>
        </Button>
      </div>
    </section>
  );
}

function CompetitionProofSection() {
  const shots = [
    {
      src: '/reference-images/comp-panned-action.jpg',
      alt: 'Rider em alta velocidade durante prova de DH com público ao fundo',
      caption: 'Velocidade máxima',
    },
    {
      src: '/reference-images/comp-dh-rocky.jpg',
      alt: 'Rider descendo trecho rochoso em prova de downhill',
      caption: 'Terreno rochoso',
    },
    {
      src: '/reference-images/comp-dh-crowd.jpg',
      alt: 'Rider em prova de DH com espectadores acompanhando',
      caption: 'Pressão de prova',
    },
    {
      src: '/reference-images/comp-dh-forest.jpg',
      alt: 'Rider em trilha florestal de competição',
      caption: 'Controle em floresta',
    },
  ] as const;

  return (
    <section aria-labelledby="competicao-heading" className="grid gap-8">
      <div className="flex flex-col gap-3">
        <MetaLabel>PROVA EM CAMPO</MetaLabel>
        <h2
          className="max-w-2xl font-heading text-4xl leading-none tracking-[-0.04em] sm:text-5xl"
          id="competicao-heading"
        >
          Componentes desenvolvidos para aguentar o que a prova cobra.
        </h2>
        <p className="max-w-2xl text-base leading-7 text-secondary sm:text-lg">
          Descidas técnicas, terrenos soltos, frenagens encadeadas. As condições
          que definem se o componente funciona de verdade.
        </p>
      </div>
      <div
        aria-label="Imagens de competição MTB"
        className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 sm:pb-0"
      >
        {shots.map((shot) => (
          <figure
            key={shot.src}
            className="group relative min-h-64 min-w-[70vw] flex-shrink-0 snap-start overflow-hidden rounded-panel border border-border bg-surface sm:min-w-0"
          >
            <img
              alt={shot.alt}
              className="absolute inset-0 h-full w-full object-cover opacity-80 saturate-75 transition-transform duration-500 group-hover:scale-[1.04]"
              src={shot.src}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/88 via-transparent to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-4">
              <p className="font-heading text-base leading-tight tracking-[-0.02em] text-primary">
                {shot.caption}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function B2BTeaserSection() {
  return (
    <SectionBand className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-end">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-on-primary/70">
            B2B
          </p>
          <h2 className="max-w-2xl font-heading text-4xl leading-none tracking-[-0.04em] sm:text-5xl">
            Atendimento comercial para oficinas, revendas e distribuidores.
          </h2>
          <p className="mt-2 max-w-xl text-base leading-7 text-on-primary/80 sm:text-lg">
            Conversa direta sobre mix, disponibilidade e contexto técnico. Sem
            formulário automatizado, sem espera de sistema.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link to="/b2b">Abrir frente B2B</Link>
          </Button>
          <Button asChild variant="secondary">
            <a href="https://store.ghenortrs.com.br/contato/">
              Contato comercial
            </a>
          </Button>
        </div>
      </div>
      <div
        aria-label="Contexto visual para atendimento B2B GHENO"
        className="-mx-6 flex snap-x gap-4 overflow-x-auto px-6 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 lg:gap-3"
      >
        <B2BMediaCard
          imageAlt="Rider em prova de MTB diante do público"
          imageSrc="/reference-images/b2b-race-context.jpg"
          title="Prova real"
        />
        <B2BMediaCard
          imageAlt="Rider em curva de trilha com terreno solto"
          imageSrc="/reference-images/b2b-trail-validation.jpg"
          title="Demanda técnica"
        />
        <B2BMediaCard
          imageAlt="Detalhe de freio e rotor em bicicleta de MTB"
          imageSrc="/reference-images/b2b-brake-detail.jpg"
          title="Mix consultivo"
        />
      </div>
    </SectionBand>
  );
}

function ClosingCTASection() {
  return (
    <section
      aria-labelledby="fechamento-heading"
      className="rounded-panel border border-border bg-surface px-6 py-10 shadow-[0_24px_80px_rgba(0,0,0,0.34)] sm:px-8 sm:py-14 lg:px-12"
    >
      <div className="flex flex-col gap-6">
        <MetaLabel>PRONTO PARA RODAR</MetaLabel>
        <h2
          className="max-w-3xl font-heading text-4xl leading-none tracking-[-0.04em] sm:text-5xl"
          id="fechamento-heading"
        >
          Compre o que já está pronto para rodar. Consulte o que ainda depende
          de atendimento.
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <a href="https://store.ghenortrs.com.br/produtos/">
              Ver catálogo GHENO
            </a>
          </Button>
          <Button asChild variant="secondary">
            <a href="https://store.ghenortrs.com.br/contato/">
              Consultar componentes
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <div className="flex flex-col gap-16 sm:gap-24">
      <section>
        <div className="relative overflow-hidden rounded-panel border border-border bg-surface shadow-[0_24px_80px_rgba(0,0,0,0.34)]">
          <img
            alt="Rider GHENO em trilha"
            className="absolute inset-0 h-full w-full object-cover opacity-62"
            src="/reference-images/mtb-action-hero.jpg"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/88 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/65" />
          <div className="relative min-h-[34rem] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-14">
            <img
              alt="GHENO"
              className="h-12 w-auto rounded-sm"
              src="/brand/logo-wide.png"
            />
            <div className="mt-20 max-w-4xl sm:mt-28">
              <MetaLabel>COMPONENTES MTB DE ALTO DESEMPENHO</MetaLabel>
              <h1 className="mt-6 max-w-4xl font-heading text-4xl leading-[0.94] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                Componentes de performance para MTB{' '}
                <span className="text-accent">de verdade.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-primary/82 sm:text-xl sm:leading-8">
                Pastilhas, cubos, aros e rotores desenvolvidos para controle,
                resistência e confiança em uso intenso.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild>
                  <a href="https://store.ghenortrs.com.br/produtos/">
                    Ver catálogo GHENO
                  </a>
                </Button>
                <Button asChild variant="secondary">
                  <Link to="/b2b">Falar com GHENO B2B</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-label="Destaques operacionais"
        className="grid gap-4 rounded-panel border border-border bg-surface-elevated px-6 py-6 sm:grid-cols-2 sm:gap-5 sm:px-8 lg:grid-cols-4"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
              />
            </svg>
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary">
              Controle extremo
            </p>
            <p className="mt-0.5 text-xs leading-5 text-secondary">
              Freios afinados para qualquer trilha
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
              />
            </svg>
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary">
              Materiais premium
            </p>
            <p className="mt-0.5 text-xs leading-5 text-secondary">
              Qualidade e consistência que você vai notar
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
              />
            </svg>
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary">
              Testado em condições reais
            </p>
            <p className="mt-0.5 text-xs leading-5 text-secondary">
              Nas pistas mais exigentes do Brasil
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M13 10V3L4 14h7v7l9-11h-7z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
              />
            </svg>
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary">
              Performance que dá confiança
            </p>
            <p className="mt-0.5 text-xs leading-5 text-secondary">
              Para você e para o seu negócio
            </p>
          </div>
        </div>
      </section>

      <ComponentFamiliesSection />

      <TechnicalProofSection />

      <CompetitionProofSection />

      <B2BTeaserSection />

      <ClosingCTASection />
    </div>
  );
}

function ComponentsPage() {
  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
      <PageIntro
        description="Estrutura inicial para a vitrine de pastilhas, cubos, aros e rotores com o mesmo ritmo visual e tokens do shell principal."
        eyebrow="COMPONENTES"
        title="Componentes GHENO"
      />
      <DotMatrixLoader
        aria-label="Carregando vitrine de componentes GHENO"
        caption="Sincronizando famílias, acabamentos e provas técnicas."
      />
    </section>
  );
}

function B2BPage() {
  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
      <div className="grid gap-6">
        <PageIntro
          description="Base para a futura jornada comercial voltada a distribuidores, oficinas e revendas com superfícies e CTAs coerentes com a marca."
          eyebrow="B2B"
          title="Atendimento para lojistas e oficinas"
        />
        <SectionBand className="grid gap-3">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-on-primary/70">
            Comercial
          </p>
          <h2 className="max-w-xl font-heading text-3xl leading-none tracking-[-0.04em] sm:text-4xl">
            Atendimento comercial direto
          </h2>
          <p className="max-w-xl text-sm leading-6 text-on-primary/78 sm:text-base">
            Leitura rápida para operações que precisam comprar com contexto
            técnico antes do M3.
          </p>
        </SectionBand>
      </div>
      <Card className="bg-surface px-0 py-0">
        <CardHeader>
          <CardTitle>Pré-cadastro comercial</CardTitle>
          <CardDescription>
            Placeholder do formulário do M3 usando o mesmo contorno técnico dos
            futuros campos reais.
          </CardDescription>
        </CardHeader>
        <div className="grid gap-4 px-6 pb-6">
          <div className="grid gap-2">
            <Label htmlFor="b2b-company">Empresa</Label>
            <Input id="b2b-company" placeholder="Nome da empresa" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="b2b-cnpj">CNPJ</Label>
            <Input id="b2b-cnpj" placeholder="00.000.000/0000-00" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="b2b-needs">Necessidades comerciais</Label>
            <Textarea
              id="b2b-needs"
              placeholder="Conte o mix, volume e tipo de atendimento."
            />
          </div>
          <Button type="button" variant="secondary">
            Estruturar fluxo B2B
          </Button>
        </div>
      </Card>
    </section>
  );
}

function NotFoundPage() {
  return (
    <PageIntro
      description="Use a navegação principal para voltar às rotas existentes enquanto a arquitetura do MVP continua sendo construída."
      eyebrow="404"
      title="Página não encontrada"
    />
  );
}

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="componentes" element={<ComponentsPage />} />
        <Route path="b2b" element={<B2BPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
