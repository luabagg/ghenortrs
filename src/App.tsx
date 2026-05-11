import { Link, NavLink, Outlet, Route, Routes } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button-variants';
import {
  Card,
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

const navigationLinkClassName = ({ isActive }: { isActive: boolean }) =>
  buttonVariants({
    size: 'nav',
    variant: isActive ? 'nav-active' : 'nav',
  });

function AppShell() {
  return (
    <div
      data-testid="app-shell"
      className="min-h-screen bg-background text-primary font-body"
    >
      <header className="border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-4 px-6 py-5 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-16">
          <div>
            <MetaLabel className="bg-transparent px-0 py-0 text-accent">
              GHENO
            </MetaLabel>
            <p className="text-sm text-secondary">
              Componentes de alto desempenho para MTB
            </p>
          </div>
          <GlassPanel className="p-2">
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

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{body}</CardDescription>
      </CardHeader>
    </Card>
  );
}

function HomePage() {
  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.85fr)] lg:items-start">
      <div className="rounded-panel border border-border bg-surface px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.34)] sm:px-8 sm:py-10">
        <MetaLabel>Performance-first MTB components</MetaLabel>
        <h1 className="mt-6 max-w-4xl font-heading text-5xl leading-[0.94] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
          GHENO components
        </h1>
        <h2 className="mt-4 max-w-3xl font-heading text-3xl leading-tight tracking-[-0.04em] text-primary sm:text-4xl">
          Performance-first MTB components
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-7 text-secondary sm:text-xl sm:leading-8">
          Base Vite + React + TypeScript scaffold wired to the GHENO visual
          system, ready for landing-page implementation without default-theme
          churn.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link to="/componentes">Explorar componentes</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/b2b">Falar com GHENO B2B</Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-4">
        <InfoCard
          title="Shell técnico"
          body="Tokens de cor, tipografia e superfícies já estão ativos para sustentar as próximas seções sem retrabalho visual."
        />
        <InfoCard
          title="Rotas prontas"
          body="Início, componentes, B2B e not-found seguem o mesmo contorno estrutural para acelerar a implementação do M2."
        />
      </div>
    </section>
  );
}

function ComponentsPage() {
  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
      <PageIntro
        eyebrow="COMPONENTES"
        title="Componentes GHENO"
        description="Estrutura inicial para a vitrine de pastilhas, cubos, aros e rotores com o mesmo ritmo visual e tokens do shell principal."
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
          eyebrow="B2B"
          title="Atendimento para lojistas e oficinas"
          description="Base para a futura jornada comercial voltada a distribuidores, oficinas e revendas com superfícies e CTAs coerentes com a marca."
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
      eyebrow="404"
      title="Página não encontrada"
      description="Use a navegação principal para voltar às rotas existentes enquanto a arquitetura do MVP continua sendo construída."
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
