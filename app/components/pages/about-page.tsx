import { Link } from '@remix-run/react';

import { PageIntro } from '@/components/landing/section-cards';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const ABOUT_POINTS = [
  'Linha de pastilhas, cubos, aros e discos para mountain bike.',
  'Conteúdo técnico para riders e profissionais de oficina.',
  'Atendimento comercial para lojistas e revendas.',
] as const;

export function AboutPage() {
  return (
    <div className="grid gap-12" data-section="about-page">
      <PageIntro
        description="A GHENO rotors atua com componentes para mountain bike, com foco em frenagem, controle e uso técnico."
        title="Componentes GHENO rotors para MTB."
      />

      <Card className="rounded-md border-border bg-surface px-0 py-0">
        <CardHeader className="gap-5 px-6 py-6 sm:px-8 sm:py-8">
          <CardTitle className="text-xl sm:text-2xl">O que entregamos</CardTitle>
          <CardDescription className="sr-only">
            Linha de atuação da GHENO rotors
          </CardDescription>
          <ul className="grid gap-3">
            {ABOUT_POINTS.map((point) => (
              <li
                className="flex items-start gap-3 border-b border-border pb-3 font-body text-[14px] leading-5 text-primary/88 last:border-b-0 last:pb-0"
                key={point}
              >
                <span
                  aria-hidden="true"
                  className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-secondary"
                />
                {point}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 pt-1 sm:flex-row">
            <Button asChild variant="outline">
              <Link to="/componentes">Ver componentes</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/contato">Falar com a GHENO rotors</Link>
            </Button>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
