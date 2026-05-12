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
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        tabIndex={-1}
      />
      <div className="absolute inset-y-0 right-0 flex w-72 flex-col gap-6 border-l border-border bg-surface-glass/90 px-6 py-8 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <img
            alt="GHENO"
            className="h-8 w-auto rounded-sm"
            src="/brand/logo-wide.png"
          />
          <button
            aria-label="Fechar menu"
            className="flex h-9 w-9 items-center justify-center rounded-md text-secondary hover:text-primary"
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
        <nav
          aria-label="Menu principal"
          className="flex flex-col gap-1"
          onClick={onClose}
        >
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-secondary/60">
            Navegação
          </p>
          <NavLink
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold transition-colors',
                isActive
                  ? 'bg-accent/12 text-accent'
                  : 'text-primary hover:bg-surface-elevated',
              )
            }
            to="/"
          >
            <svg
              className="h-4 w-4 opacity-60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
              />
            </svg>
            Início
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold transition-colors',
                isActive
                  ? 'bg-accent/12 text-accent'
                  : 'text-primary hover:bg-surface-elevated',
              )
            }
            to="/componentes"
          >
            <svg
              className="h-4 w-4 opacity-60"
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
            Componentes
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold transition-colors',
                isActive
                  ? 'bg-accent/12 text-accent'
                  : 'text-primary hover:bg-surface-elevated',
              )
            }
            to="/b2b"
          >
            <svg
              className="h-4 w-4 opacity-60"
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
            B2B
          </NavLink>
        </nav>
        <div className="mt-auto flex flex-col gap-3 border-t border-border pt-6">
          <Button asChild>
            <a href="https://store.ghenortrs.com.br/produtos/">
              Entrar na Loja B2B
            </a>
          </Button>
          <Button asChild variant="secondary">
            <a href="https://store.ghenortrs.com.br/contato/">
              Falar com GHENO
            </a>
          </Button>
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
        <div className="mx-auto max-w-[90rem] px-6 py-10 sm:px-10 lg:px-16">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-2">
              <MetaLabel className="bg-transparent px-0 py-0 text-accent">
                GHENO
              </MetaLabel>
              <p className="text-sm text-secondary">
                Componentes de alto desempenho para MTB
              </p>
            </div>
            <nav aria-label="Links do rodapé" className="flex flex-wrap gap-4">
              <a
                className="text-sm text-secondary transition-colors hover:text-primary"
                href="https://store.ghenortrs.com.br/produtos/"
              >
                Produtos
              </a>
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
                Política de Privacidade
              </a>
              <a
                className="text-sm text-secondary transition-colors hover:text-primary"
                href="https://www.instagram.com/ghenortrs/"
              >
                Instagram
              </a>
            </nav>
          </div>
          <p className="mt-8 text-xs text-secondary/60">
            © 2025 GHENO. Todos os direitos reservados.
          </p>
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
      <div className="relative h-44 overflow-hidden border-b border-border bg-background-soft">
        <img
          alt={imageAlt}
          className="h-full w-full object-cover opacity-82 saturate-75"
          src={imageSrc}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/10 to-transparent" />
      </div>
      <CardHeader>
        <MetaLabel
          className={cn(
            !isLive &&
              'border border-border bg-surface-elevated text-secondary',
          )}
        >
          {eyebrow}
        </MetaLabel>
        <h3 className="font-heading text-2xl leading-tight tracking-[-0.04em] text-primary">
          {title}
        </h3>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
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
        <MetaLabel>FAMÍLIAS DE COMPONENTES</MetaLabel>
        <h2
          className="max-w-2xl font-heading text-4xl leading-none tracking-[-0.04em] sm:text-5xl"
          id="familias-heading"
        >
          Uma linha pensada para frenagem, rolagem e montagem com critério
          técnico.
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                Pastilhas e componentes GHENO para quem exige frenagem, controle
                e consistência na trilha.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-primary/82 sm:text-xl sm:leading-8">
                GHENO é marca para rider, oficina e lojista que precisa de
                componente com resposta previsível, acabamento firme e presença
                real no pedal.
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
        className="grid gap-3 rounded-panel border border-border bg-surface-elevated px-6 py-5 sm:grid-cols-3 sm:gap-4 sm:px-8"
      >
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary">
          Catálogo ativo no ar
        </p>
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary">
          Checkout delegado à Nuvemshop
        </p>
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary">
          Atendimento comercial para linhas sem catálogo publicado
        </p>
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
