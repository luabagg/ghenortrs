import { Link } from 'react-router-dom';

import { PageIntro } from '@/components/landing/section-cards';
import { Button } from '@/components/ui/button';
import { SectionBand } from '@/components/ui/section-band';

const ABOUT_POINTS = [
  'Componentes para MTB com foco em frenagem, controle e uso intenso.',
  'Desenvolvimento orientado por trilha, oficina e competição.',
  'Catálogo público separado do atendimento comercial para revendas.',
] as const;

export function AboutPage() {
  return (
    <div className="mx-auto grid w-full max-w-[90rem] gap-8 px-6 py-16 sm:px-10 sm:py-20 lg:px-16">
      <PageIntro
        description="A GHENO desenvolve componentes de performance para riders, oficinas e lojistas que precisam de consistência real em trilha."
        eyebrow="SOBRE"
        title="Performance técnica para MTB de verdade."
      />
      <SectionBand className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="grid gap-3">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-on-primary/70">
            GHENO
          </p>
          <h2 className="font-heading text-3xl leading-none tracking-[-0.04em] text-on-primary sm:text-4xl">
            Um sistema de componentes para quem exige controle.
          </h2>
        </div>
        <div className="grid gap-5">
          <ul className="grid gap-3">
            {ABOUT_POINTS.map((point) => (
              <li
                className="border-b border-on-primary/12 pb-3 text-sm leading-6 text-on-primary/76 last:border-b-0 last:pb-0"
                key={point}
              >
                {point}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link to="/componentes">Ver componentes</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/contato">Falar com a GHENO</Link>
            </Button>
          </div>
        </div>
      </SectionBand>
    </div>
  );
}
