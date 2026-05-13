import { Button } from '@/components/ui/button';
import {
  Card,
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
          <a href="https://store.ghenortrs.com.br/contato/">
            Falar via WhatsApp agora
          </a>
        </Button>
      </div>
    </Card>
  );
}
