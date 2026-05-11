import { Link, NavLink, Outlet, Route, Routes } from 'react-router-dom';

const navigationLinkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-pill border px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] transition-colors',
    isActive
      ? 'border-accent bg-accent text-on-accent'
      : 'border-transparent text-secondary hover:border-border hover:text-primary',
  ].join(' ');

function AppShell() {
  return (
    <div
      data-testid="app-shell"
      className="min-h-screen bg-background text-primary font-body"
    >
      <header className="border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-4 px-6 py-5 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-16">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
              GHENO
            </p>
            <p className="text-sm text-secondary">
              Componentes de alto desempenho para MTB
            </p>
          </div>
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
    <section className="rounded-panel border border-border bg-surface px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:px-8 sm:py-10">
      <p className="mb-4 inline-flex rounded-pill bg-accent-dark px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-on-accent">
        {eyebrow}
      </p>
      <h1 className="max-w-3xl font-heading text-4xl leading-none tracking-[-0.05em] sm:text-5xl">
        {title}
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-secondary sm:text-lg">
        {description}
      </p>
    </section>
  );
}

function ActionLink({
  children,
  to,
  tone,
}: {
  children: string;
  to: string;
  tone: 'primary' | 'secondary';
}) {
  const toneClassName =
    tone === 'primary'
      ? 'bg-accent text-on-accent hover:bg-accent-dark'
      : 'border border-strong bg-background-soft text-primary hover:border-accent hover:text-accent';

  return (
    <Link
      className={`inline-flex min-h-13 items-center justify-center rounded-button px-5 text-sm font-bold uppercase tracking-[0.08em] transition-colors ${toneClassName}`}
      to={to}
    >
      {children}
    </Link>
  );
}

function InfoCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <article className="rounded-panel border border-border bg-surface-elevated p-6">
      <h2 className="font-heading text-2xl leading-tight tracking-[-0.04em] text-primary">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-secondary">{body}</p>
    </article>
  );
}

function HomePage() {
  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.85fr)] lg:items-start">
      <div className="rounded-panel border border-border bg-surface px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.34)] sm:px-8 sm:py-10">
        <p className="inline-flex rounded-pill bg-accent-dark px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-on-accent">
          Performance-first MTB components
        </p>
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
          <ActionLink to="/componentes" tone="primary">
            Explorar componentes
          </ActionLink>
          <ActionLink to="/b2b" tone="secondary">
            Falar com GHENO B2B
          </ActionLink>
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
    <PageIntro
      eyebrow="COMPONENTES"
      title="Componentes GHENO"
      description="Estrutura inicial para a vitrine de pastilhas, cubos, aros e rotores com o mesmo ritmo visual e tokens do shell principal."
    />
  );
}

function B2BPage() {
  return (
    <PageIntro
      eyebrow="B2B"
      title="Atendimento para lojistas e oficinas"
      description="Base para a futura jornada comercial voltada a distribuidores, oficinas e revendas com superfícies e CTAs coerentes com a marca."
    />
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
