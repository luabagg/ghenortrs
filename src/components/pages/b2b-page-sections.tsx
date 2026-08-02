import { Link } from 'react-router-dom';

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
  description = 'Lojistas, oficinas e revendas podem solicitar cadastro, entrar com e-mail aprovado e acessar o catálogo B2B.',
}: {
  title?: string;
  description?: string;
} = {}) {
  return (
    <section className="grid min-h-[52dvh] items-center border-b border-border py-12 sm:py-16">
      <div className="grid max-w-2xl gap-5">
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-accent">
          B2B
        </p>
        <h1 className="font-heading text-5xl leading-[0.95] tracking-[-0.05em] sm:text-6xl">
          {title}
        </h1>
        <p className="max-w-xl text-lg leading-8 text-secondary">{description}</p>
      </div>
    </section>
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

export function B2BLeadIntroSection() {
  return (
    <PageIntro
      description="Preencha os dados da empresa para solicitar atendimento comercial."
      eyebrow="CADASTRO"
      headingLevel={2}
      title="Dados da empresa."
    />
  );
}

export function B2BSuccessCard() {
  return (
    <Card className="bg-surface px-0 py-0">
      <CardHeader>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
          <CheckIcon className="h-5 w-5" />
        </div>
        <CardTitle>Pré-cadastro recebido.</CardTitle>
        <CardDescription>
          Recebemos seus dados. Aguarde o retorno da equipe GHENO rotors pelo e-mail
          informado.
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
        eyebrow="B2B"
        title="Atendimento para lojistas e oficinas"
      />
      <B2BSuccessCard />
    </section>
  );
}
