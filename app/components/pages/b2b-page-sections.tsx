import { Link } from '@remix-run/react';

import { PageIntro } from '@/components/landing/section-cards';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function B2BAccessHeroSection({
  title = 'Cadastro comercial GHENO rotors.',
  description = 'Lojistas, oficinas e revendas podem solicitar atendimento comercial e acesso ao catálogo B2B.',
}: {
  title?: string;
  description?: string;
} = {}) {
  return (
    <section
      className="grid items-end border-b border-border pb-10 pt-2 sm:pb-12"
      data-section="b2b-access-hero"
    >
      <div className="grid max-w-2xl gap-4">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">
          B2B
        </p>
        <h1 className="text-balance font-heading text-[50px] leading-[0.95] tracking-[-0.05em]">
          {title}
        </h1>
        <p className="max-w-xl font-body text-[14px] leading-5 text-secondary">
          {description}
        </p>
      </div>
    </section>
  );
}

export function B2BRegisterAside({
  configured,
  mode,
  onModeChange,
}: {
  configured: boolean;
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
}) {
  return (
    <aside className="grid content-start gap-6">
      {configured ? (
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant={mode === 'register' ? 'outline' : 'secondary'}
            onClick={() => onModeChange('register')}
          >
            Solicitar cadastro
          </Button>
          <Button
            type="button"
            variant={mode === 'login' ? 'outline' : 'secondary'}
            onClick={() => onModeChange('login')}
          >
            Já tenho cadastro
          </Button>
        </div>
      ) : null}

      <div className={`grid gap-2 ${configured ? 'border-t border-border pt-6' : ''}`}>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">
          Contato
        </p>
        <a
          className="w-fit text-base font-semibold text-primary underline-offset-4 hover:underline"
          href="mailto:contato@ghenortrs.com.br"
        >
          contato@ghenortrs.com.br
        </a>
      </div>
    </aside>
  );
}

function CheckIcon({ className }: { className: string }) {
  return (
    <svg
      className={className}
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
  );
}

export function B2BSuccessCard() {
  return (
    <Card className="rounded-md border-border bg-surface px-0 py-0">
      <CardHeader>
        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background-soft text-secondary">
          <CheckIcon className="h-5 w-5" />
        </div>
        <CardTitle>Cadastro recebido.</CardTitle>
        <CardDescription>
          Recebemos seus dados. Aguarde o retorno da equipe GHENO rotors pelo
          e-mail informado.
        </CardDescription>
      </CardHeader>
      <div className="px-6 pb-6">
        <Button asChild variant="secondary">
          <Link to="/contato">Ver canais de contato</Link>
        </Button>
      </div>
    </Card>
  );
}

export function B2BSuccessSection() {
  return (
    <section
      aria-live="polite"
      className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]"
    >
      <PageIntro
        description="Os dados da empresa foram enviados para a equipe GHENO rotors."
        title="Atendimento para lojistas e oficinas"
      />
      <B2BSuccessCard />
    </section>
  );
}
