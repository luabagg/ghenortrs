import { type FormEvent, useEffect, useState } from 'react';

import { Link, NavLink, Outlet, Route, Routes } from 'react-router-dom';

import { B2BTeaserSection } from '@/components/landing/b2b-teaser-section';
import { ComponentFamiliesSection } from '@/components/landing/component-families-section';
import { TechnicalProofSection } from '@/components/landing/technical-proof-section';
import { PageIntro } from '@/components/landing/section-cards';
import { MobileMenuOverlay } from '@/components/navigation/mobile-menu-overlay';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button-variants';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MetaLabel } from '@/components/ui/meta-label';
import { SectionBand } from '@/components/ui/section-band';
import { Textarea } from '@/components/ui/textarea';
import { trackFormEvent } from '@/lib/tracking';
import { cn } from '@/lib/utils';

const navigationLinkClassName = ({ isActive }: { isActive: boolean }) =>
  buttonVariants({
    size: 'nav',
    variant: isActive ? 'nav-active' : 'nav',
  });

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
      <main className="mx-auto flex w-full max-w-[90rem] flex-1 px-6 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-18">
        <div className="w-full">
          <Outlet />
        </div>
      </main>
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
                Institucional
              </p>
              <nav
                aria-label="Links institucionais"
                className="flex flex-col gap-2.5"
              >
                <Link
                  className="text-sm text-secondary transition-colors hover:text-primary"
                  to="/"
                >
                  Sobre a GHENO
                </Link>
                <Link
                  className="text-sm text-secondary transition-colors hover:text-primary"
                  to="/"
                >
                  Tecnologia
                </Link>
                <a
                  className="text-sm text-secondary transition-colors hover:text-primary"
                  href="https://store.ghenortrs.com.br/contato/"
                >
                  Contato
                </a>
                <a
                  className="text-sm text-secondary transition-colors hover:text-primary"
                  href="https://store.ghenortrs.com.br/politica-de-privacidade/"
                >
                  Privacidade
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
                  href="https://www.youtube.com/@ghenortrs"
                >
                  YouTube
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
    {
      src: '/reference-images/comp-dh-technical.jpg',
      alt: 'Rider em trecho técnico de downhill durante competição',
      caption: 'Trecho técnico',
    },
    {
      src: '/reference-images/comp-dh-speed.jpg',
      alt: 'Rider em alta velocidade em descida de competição de MTB',
      caption: 'Descida em DH',
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
        className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0"
      >
        {shots.map((shot) => (
          <figure
            key={shot.src}
            className="group relative min-h-64 min-w-[70vw] flex-shrink-0 snap-start overflow-hidden rounded-panel border border-border bg-surface sm:min-w-0"
          >
            <img
              alt={shot.alt}
              className="absolute inset-0 h-full w-full object-cover opacity-80 saturate-75 transition-transform duration-500 group-hover:scale-[1.04]"
              loading="lazy"
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

function ClosingCTASection() {
  return (
    <section
      aria-labelledby="fechamento-heading"
      className="rounded-panel border border-border bg-surface px-6 py-10 shadow-[0_24px_80px_rgba(0,0,0,0.34)] sm:px-8 sm:py-14 lg:px-12"
      data-section="closing-cta"
    >
      <div className="flex flex-col gap-6">
        <MetaLabel>PRONTO PARA RODAR</MetaLabel>
        <h2
          className="max-w-3xl font-heading text-4xl leading-none tracking-[-0.04em] sm:text-5xl"
          id="fechamento-heading"
        >
          Pronto para elevar a performance das suas bikes?
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <a href="https://store.ghenortrs.com.br/produtos/">
              Acessar Loja B2B
            </a>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/componentes">Ver componentes</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

const HERO_SLIDES = [
  {
    src: '/reference-images/mtb-action-hero.jpg',
    alt: 'Rider GHENO em trilha com controle total',
  },
  {
    src: '/reference-images/hero-gheno-jump.jpg',
    alt: 'Rider com componentes GHENO em salto de competição',
  },
  {
    src: '/reference-images/hero-red-trail.jpg',
    alt: 'Rider em trilha de terra vermelha com velocidade',
  },
] as const;

function HomePage() {
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(
      () => setHeroIdx((i) => (i + 1) % HERO_SLIDES.length),
      6000,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col gap-16 sm:gap-24">
      <section data-section="hero">
        <div className="relative overflow-hidden rounded-panel border border-border bg-surface shadow-[0_24px_80px_rgba(0,0,0,0.34)]">
          {HERO_SLIDES.map((slide, i) => (
            <img
              key={slide.src}
              alt={slide.alt}
              className={cn(
                'absolute inset-0 h-full w-full object-cover transition-opacity duration-1000',
                i === heroIdx ? 'opacity-62' : 'opacity-0',
              )}
              fetchPriority={i === 0 ? 'high' : undefined}
              loading={i === 0 ? undefined : 'lazy'}
              src={slide.src}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/88 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/65" />
          <div className="relative min-h-[34rem] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-14">
            <img
              alt="GHENO"
              className="h-12 w-auto rounded-sm"
              fetchPriority="high"
              height={250}
              src="/brand/logo-wide.png"
              width={500}
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
                    Entrar na Loja B2B →
                  </a>
                </Button>
                <Button asChild variant="secondary">
                  <Link to="/componentes">Ver componentes</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-label="Destaques operacionais"
        className="grid grid-cols-2 gap-4 rounded-panel border border-border bg-surface-elevated px-6 py-6 sm:gap-5 sm:px-8 lg:grid-cols-4"
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
          <div className="min-w-0">
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
          <div className="min-w-0">
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
          <div className="min-w-0">
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
          <div className="min-w-0">
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

const PRODUCT_FAMILIES = [
  {
    id: 'pastilhas',
    eyebrow: 'ATIVO NO CATÁLOGO',
    title: 'Pastilhas de freio',
    description:
      'Composição calibrada para resposta direta e modulação previsível em qualquer condição de terreno. Disponíveis em quatro compostos para DH, enduro, XC e trilha livre.',
    highlights: [
      'Quatro compostos para cada tipo de uso',
      'Compatível com Shimano, SRAM e TRP',
      'Resistência a +300°C em descidas encadeadas',
      'Modulação sem fade em calor extremo',
    ],
    ctaLabel: 'Ver catálogo de pastilhas',
    ctaHref: 'https://store.ghenortrs.com.br/produtos/',
    isLive: true,
    imageAlt: 'Pastilha de freio GHENO — compostos para MTB',
    imageSrc: '/reference-images/pastilhas-gheno.jpg',
  },
  {
    id: 'cubos',
    eyebrow: 'CONSULTA COMERCIAL',
    title: 'Cubos de alta rolagem',
    description:
      'Rolamento de alta performance desenvolvido para trilha técnica e competição. Disponível via consulta comercial direta com a equipe GHENO.',
    highlights: [
      'Projeto para performance em trilha técnica',
      'Construção para carga e uso intenso',
      'Compatibilidade com principais padrões de cubo',
      'Disponível via consulta para lojistas e revendas',
    ],
    ctaLabel: 'Consultar cubos',
    ctaHref: 'https://store.ghenortrs.com.br/contato/',
    isLive: false,
    imageAlt: 'Cubo GHENO — alta rolagem para MTB',
    imageSrc: '/reference-images/cubo-gheno.jpg',
  },
  {
    id: 'aros',
    eyebrow: 'CONSULTA COMERCIAL',
    title: 'Aros de carbono e alumínio',
    description:
      'Rigidez e leveza projetadas para rider exigente. Construídos para aguentar a demanda de trilhas técnicas e competição sem abrir mão da performance de rolagem.',
    highlights: [
      'Opções em carbono e alumínio de alta rigidez',
      'Perfil interno calibrado para pneus MTB',
      'Testado em trilhas técnicas e competição',
      'Disponível via consulta para lojistas e revendas',
    ],
    ctaLabel: 'Consultar aros',
    ctaHref: 'https://store.ghenortrs.com.br/contato/',
    isLive: false,
    imageAlt: 'Aro GHENO — rigidez e leveza para MTB',
    imageSrc: '/reference-images/aro-gheno.jpg',
  },
  {
    id: 'rotores',
    eyebrow: 'CONSULTA COMERCIAL',
    title: 'Rotores de dissipação',
    description:
      'Dissipação de calor e modulação em descidas longas. Liga de aço de alta resistência com geometria projetada para refrigeração eficiente durante frenagens repetidas.',
    highlights: [
      'Liga de aço de alta resistência térmica',
      'Geometria para dissipação eficiente de calor',
      'Compatível com pinças Hayes Dominion A4',
      'Validado em competição downhill e enduro',
    ],
    ctaLabel: 'Consultar rotores',
    ctaHref: 'https://store.ghenortrs.com.br/contato/',
    isLive: false,
    imageAlt: 'Rotor GHENO — disco de alta performance para MTB',
    imageSrc: '/reference-images/rotor-gheno.jpg',
  },
] as const;

function ComponentsPage() {
  return (
    <div className="flex flex-col gap-12" data-section="componentes-page">
      <div className="flex flex-col gap-3">
        <MetaLabel>COMPONENTES</MetaLabel>
        <h1 className="max-w-3xl font-heading text-4xl leading-none tracking-[-0.05em] sm:text-5xl">
          Um sistema.{' '}
          <span className="text-secondary">Quatro pilares de performance.</span>
        </h1>
        <p className="max-w-2xl text-base leading-7 text-secondary sm:text-lg">
          Pastilhas, cubos, aros e rotores desenvolvidos para controle,
          resistência e confiança em uso intenso.
        </p>
      </div>

      <div className="flex flex-col gap-10">
        {PRODUCT_FAMILIES.map((family) => (
          <article
            key={family.id}
            aria-labelledby={`${family.id}-heading`}
            className="grid gap-6 overflow-hidden rounded-panel border border-border bg-surface lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
          >
            <div className="relative min-h-64 bg-background-soft lg:min-h-80">
              <img
                alt={family.imageAlt}
                className="absolute inset-0 h-full w-full object-cover opacity-82 saturate-75"
                loading="lazy"
                src={family.imageSrc}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface/20 lg:bg-gradient-to-r" />
            </div>
            <div className="flex flex-col gap-5 px-6 py-6 lg:px-8 lg:py-8">
              <div className="flex flex-col gap-2">
                <MetaLabel
                  className={cn(
                    !family.isLive &&
                      'border border-border bg-surface-elevated text-secondary',
                  )}
                >
                  {family.eyebrow}
                </MetaLabel>
                <h2
                  className="font-heading text-3xl leading-none tracking-[-0.04em] sm:text-4xl"
                  id={`${family.id}-heading`}
                >
                  {family.title}
                </h2>
                <p className="text-sm leading-7 text-secondary sm:text-base">
                  {family.description}
                </p>
              </div>
              <div className="flex flex-col gap-2.5">
                {family.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 12 12"
                      >
                        <path
                          d="M2 6l2.5 2.5L9.5 3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                        />
                      </svg>
                    </div>
                    <p className="text-sm leading-5 text-primary">{h}</p>
                  </div>
                ))}
              </div>
              <div>
                <Button
                  asChild
                  variant={family.isLive ? 'primary' : 'secondary'}
                >
                  <a href={family.ctaHref}>{family.ctaLabel}</a>
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <SectionBand className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-on-primary/70">
            B2B
          </p>
          <p className="max-w-xl font-heading text-2xl leading-tight tracking-[-0.03em] sm:text-3xl">
            Lojistas e revendas com acesso direto ao time GHENO.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Button asChild>
            <a href="https://store.ghenortrs.com.br/produtos/">
              Entrar na Loja B2B →
            </a>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/b2b">Pré-cadastro comercial</Link>
          </Button>
        </div>
      </SectionBand>
    </div>
  );
}

type B2BFields = {
  empresa: string;
  cnpj: string;
  telefone: string;
  email: string;
  mensagem: string;
};

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error' | 'no-config';

function validateB2BFields(f: B2BFields): Partial<B2BFields> {
  const e: Partial<B2BFields> = {};
  if (!f.empresa.trim()) e.empresa = 'Nome da empresa é obrigatório.';
  const cnpjDig = f.cnpj.replace(/\D/g, '');
  if (!cnpjDig) e.cnpj = 'CNPJ é obrigatório.';
  else if (cnpjDig.length !== 14) e.cnpj = 'CNPJ deve ter 14 dígitos.';
  const telDig = f.telefone.replace(/\D/g, '');
  if (!telDig) e.telefone = 'Telefone/WhatsApp é obrigatório.';
  else if (telDig.length < 10 || telDig.length > 11)
    e.telefone = 'Informe um número com DDD (10 ou 11 dígitos).';
  if (!f.email.trim()) e.email = 'E-mail é obrigatório.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
    e.email = 'Informe um e-mail válido.';
  return e;
}

function B2BPage() {
  const [fields, setFields] = useState<B2BFields>({
    empresa: '',
    cnpj: '',
    telefone: '',
    email: '',
    mensagem: '',
  });
  const [errors, setErrors] = useState<Partial<B2BFields>>({});
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [honeypot, setHoneypot] = useState('');

  function set(key: keyof B2BFields) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields((prev) => ({ ...prev, [key]: e.target.value }));
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    };
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (honeypot) {
      setStatus('success');
      return;
    }
    trackFormEvent('b2b_form_submit_attempt', { form: 'b2b_lead' });
    const errs = validateB2BFields(fields);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      trackFormEvent('b2b_form_validation_error', {
        form: 'b2b_lead',
        error_count: Object.keys(errs).length,
      });
      return;
    }
    setErrors({});
    const submitUrl = import.meta.env.VITE_B2B_SUBMIT_URL as string | undefined;
    if (!submitUrl) {
      setStatus('no-config');
      return;
    }
    setStatus('loading');
    try {
      const res = await fetch(submitUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      if (!res.ok) throw new Error('submit_failed');
      setStatus('success');
      trackFormEvent('b2b_form_submit_success', { form: 'b2b_lead' });
    } catch {
      setStatus('error');
      trackFormEvent('b2b_form_submit_error', { form: 'b2b_lead' });
    }
  }

  if (status === 'success') {
    return (
      <section
        aria-live="polite"
        className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]"
      >
        <PageIntro
          description="Entraremos em contato em breve para alinhar mix, condições e atendimento."
          eyebrow="B2B"
          title="Atendimento para lojistas e oficinas"
        />
        <Card className="bg-surface px-0 py-0">
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M5 13l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <CardTitle>Pré-cadastro recebido!</CardTitle>
            <CardDescription>
              Recebemos seus dados. Nossa equipe vai entrar em contato em até 2
              dias úteis.
            </CardDescription>
          </CardHeader>
          <div className="px-6 pb-6">
            <Button asChild variant="secondary">
              <a href="https://store.ghenortrs.com.br/contato/">
                Falar via WhatsApp agora
              </a>
            </Button>
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
      <div className="grid gap-6">
        <PageIntro
          description="Converse com nossa equipe sobre mix, condições e disponibilidade. Sem formulário automatizado — atendimento direto."
          eyebrow="B2B"
          title="Atendimento para lojistas e oficinas"
        />
        <SectionBand className="grid gap-4">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-on-primary/70">
            O que você recebe
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                label: 'Mix consultivo',
                desc: 'Seleção técnica do produto certo para cada necessidade',
              },
              {
                label: 'Tabela de preços',
                desc: 'Condições e margens para canal de revenda',
              },
              {
                label: 'Suporte técnico',
                desc: 'Atendimento direto para dúvidas de compatibilidade',
              },
              {
                label: 'Política comercial',
                desc: 'Termos claros de garantia, troca e reposição',
              },
            ].map(({ label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 12 12"
                  >
                    <path
                      d="M2 6l2.5 2.5L9.5 3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-primary/90">
                    {label}
                  </p>
                  <p className="text-xs leading-5 text-on-primary/60">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionBand>
      </div>
      <Card className="bg-surface px-0 py-0">
        <CardHeader>
          <CardTitle>Pré-cadastro comercial</CardTitle>
          <CardDescription>
            Preencha os dados da sua empresa para iniciar o atendimento.
          </CardDescription>
        </CardHeader>
        <form
          className="grid gap-4 px-6 pb-6"
          noValidate
          onSubmit={handleSubmit}
        >
          {/* honeypot — bots fill this; humans don't see it */}
          <input
            aria-hidden="true"
            autoComplete="off"
            className="pointer-events-none absolute -left-[9999px] opacity-0"
            name="website"
            tabIndex={-1}
            type="text"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
          <div className="grid gap-2">
            <Label htmlFor="b2b-company">Empresa</Label>
            <Input
              aria-describedby={
                errors.empresa ? 'b2b-company-error' : undefined
              }
              aria-invalid={!!errors.empresa}
              id="b2b-company"
              placeholder="Nome da empresa"
              value={fields.empresa}
              onChange={set('empresa')}
            />
            {errors.empresa && (
              <p
                className="text-xs text-accent"
                id="b2b-company-error"
                role="alert"
              >
                {errors.empresa}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="b2b-cnpj">CNPJ</Label>
            <Input
              aria-describedby={errors.cnpj ? 'b2b-cnpj-error' : undefined}
              aria-invalid={!!errors.cnpj}
              id="b2b-cnpj"
              placeholder="00.000.000/0000-00"
              value={fields.cnpj}
              onChange={set('cnpj')}
            />
            {errors.cnpj && (
              <p
                className="text-xs text-accent"
                id="b2b-cnpj-error"
                role="alert"
              >
                {errors.cnpj}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="b2b-phone">Telefone / WhatsApp</Label>
            <Input
              aria-describedby={errors.telefone ? 'b2b-phone-error' : undefined}
              aria-invalid={!!errors.telefone}
              id="b2b-phone"
              placeholder="(11) 99999-9999"
              type="tel"
              value={fields.telefone}
              onChange={set('telefone')}
            />
            {errors.telefone && (
              <p
                className="text-xs text-accent"
                id="b2b-phone-error"
                role="alert"
              >
                {errors.telefone}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="b2b-email">E-mail</Label>
            <Input
              aria-describedby={errors.email ? 'b2b-email-error' : undefined}
              aria-invalid={!!errors.email}
              id="b2b-email"
              placeholder="contato@empresa.com.br"
              type="email"
              value={fields.email}
              onChange={set('email')}
            />
            {errors.email && (
              <p
                className="text-xs text-accent"
                id="b2b-email-error"
                role="alert"
              >
                {errors.email}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="b2b-needs">Necessidades comerciais</Label>
            <Textarea
              id="b2b-needs"
              placeholder="Conte o mix, volume e tipo de atendimento."
              rows={4}
              value={fields.mensagem}
              onChange={set('mensagem')}
            />
          </div>
          {(status === 'no-config' || status === 'error') && (
            <div
              className="rounded-panel border border-border bg-surface-elevated px-4 py-3"
              role="alert"
            >
              {status === 'no-config' ? (
                <p className="text-sm text-secondary">
                  Formulário ainda não configurado.{' '}
                  <a
                    className="font-semibold text-primary underline"
                    href="https://store.ghenortrs.com.br/contato/"
                  >
                    Fale via WhatsApp
                  </a>{' '}
                  para atendimento imediato.
                </p>
              ) : (
                <p className="text-sm text-secondary">
                  Erro ao enviar. Tente novamente ou{' '}
                  <a
                    className="font-semibold text-primary underline"
                    href="https://store.ghenortrs.com.br/contato/"
                  >
                    contate pelo WhatsApp
                  </a>
                  .
                </p>
              )}
            </div>
          )}
          <Button disabled={status === 'loading'} type="submit">
            {status === 'loading' ? 'Enviando...' : 'Enviar pré-cadastro'}
          </Button>
        </form>
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
