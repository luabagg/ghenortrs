import { Link } from 'react-router-dom';

import { PageIntro } from '@/components/landing/section-cards';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SectionBand } from '@/components/ui/section-band';

const B2B_BENEFITS = [
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
];

export function B2BAccessHeroSection() {
  return (
    <section className="grid min-h-[calc(100dvh-9rem)] items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.78fr)]">
      <div className="grid max-w-2xl gap-5">
        <p className="w-fit rounded-full bg-accent px-3 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-on-accent">
          Acesso B2B
        </p>
        <h1 className="font-heading text-5xl leading-[0.95] tracking-[-0.05em] sm:text-6xl">
          Produtos B2B GHENO para revendedores aprovados.
        </h1>
        <p className="max-w-xl text-lg leading-8 text-secondary">
          Entre com seu e-mail comercial para acessar a área de produtos,
          condições e materiais do canal B2B.
        </p>
      </div>

      <Card className="bg-surface px-0 py-0 shadow-[0_28px_90px_rgba(0,0,0,0.38)]">
        <CardHeader>
          <CardTitle>Acessar produtos B2B</CardTitle>
          <CardDescription>
            O acesso é liberado apenas para revendedores cadastrados.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 px-6 pb-6">
          <label className="grid gap-2 text-sm font-bold text-primary">
            E-mail comercial
            <input
              className="min-h-13 rounded-button border border-border-strong bg-background-soft px-4 text-base font-medium text-primary outline-none transition-colors placeholder:text-secondary/70 focus:border-accent"
              placeholder="voce@sualoja.com.br"
              type="email"
            />
          </label>
          <Button type="button">Continuar</Button>
          <p className="text-sm leading-6 text-secondary">
            Não possui cadastro?{' '}
            <a className="font-bold text-primary underline" href="#cadastro">
              Solicite aprovação comercial
            </a>
            .
          </p>
        </CardContent>
      </Card>
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

export function B2BBenefitsSection() {
  return (
    <SectionBand className="grid gap-4">
      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-on-primary/70">
        O que você recebe
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {B2B_BENEFITS.map(({ label, desc }) => (
          <div key={label} className="flex items-start gap-3">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
              <CheckIcon className="h-3 w-3" />
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
  );
}

export function B2BLeadIntroSection() {
  return (
    <div className="grid gap-6">
      <PageIntro
        description="Preencha os dados da sua loja para solicitar aprovação. Após a análise, enviaremos o acesso por e-mail."
        eyebrow="B2B"
        title="Não possui cadastro?"
      />
      <B2BBenefitsSection />
    </div>
  );
}

export function B2BSuccessCard() {
  return (
    <Card className="bg-surface px-0 py-0">
      <CardHeader>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
          <CheckIcon className="h-5 w-5" />
        </div>
        <CardTitle>Pré-cadastro recebido!</CardTitle>
        <CardDescription>
          Recebemos seus dados. Nossa equipe vai entrar em contato em até 2 dias
          úteis.
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
        description="Entraremos em contato em breve para alinhar mix, condições e atendimento."
        eyebrow="B2B"
        title="Atendimento para lojistas e oficinas"
      />
      <B2BSuccessCard />
    </section>
  );
}
