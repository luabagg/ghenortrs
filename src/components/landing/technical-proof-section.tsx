import { Link } from 'react-router-dom';

import { TechnicalMediaCard } from '@/components/landing/section-cards';
import { Button } from '@/components/ui/button';
import { MetaLabel } from '@/components/ui/meta-label';

const TECH_FEATURES = [
  'Liga de aço de alta resistência',
  'Compatível com Shimano, SRAM e TRP',
  'Validado em competição e uso intenso',
  'Modulação sem fade em calor extremo',
] as const;

const TECH_STATS = [
  {
    value: '+300°C',
    label: 'Resistência',
    description: 'Operação estável em descidas longas e frenagens repetidas.',
  },
  {
    value: '4×',
    label: 'Compostos',
    description: 'Opções para cada uso — DH, XC, enduro e trilha livre.',
  },
] as const;

export function TechnicalProofSection() {
  return (
    <section
      aria-labelledby="tecnica-heading"
      className="grid gap-8"
      id="tecnologia"
    >
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <MetaLabel>TECNOLOGIA APLICADA</MetaLabel>
            <h2
              className="max-w-2xl font-heading text-4xl leading-none tracking-[-0.04em] sm:text-5xl"
              id="tecnica-heading"
            >
              Tecnologia que você sente na trilha.
            </h2>
          </div>
          <TechnicalStatsGrid />
          <TechnicalFeatureList />
          <div>
            <Button asChild variant="secondary">
              <Link to="/componentes">Explorar componentes</Link>
            </Button>
          </div>
        </div>
        <TechnicalMediaGrid />
      </div>
    </section>
  );
}

function TechnicalStatsGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {TECH_STATS.map((stat) => (
        <div
          className="flex flex-col gap-1.5 rounded-panel border border-border bg-surface px-4 py-4"
          key={stat.label}
        >
          <p className="font-heading text-3xl font-black leading-none tracking-[-0.04em] text-accent">
            {stat.value}
          </p>
          <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-primary">
            {stat.label}
          </p>
          <p className="text-xs leading-5 text-secondary">{stat.description}</p>
        </div>
      ))}
    </div>
  );
}

function TechnicalFeatureList() {
  return (
    <div className="flex flex-col gap-2.5">
      {TECH_FEATURES.map((feat) => (
        <div key={feat} className="flex items-center gap-3">
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
          <p className="text-sm leading-5 text-primary">{feat}</p>
        </div>
      ))}
    </div>
  );
}

function TechnicalMediaGrid() {
  return (
    <div
      aria-label="Imagens de tecnologia GHENO"
      className="-mx-6 flex snap-x gap-4 overflow-x-auto px-6 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0"
    >
      <figure className="group relative min-h-72 min-w-[17rem] snap-start overflow-hidden rounded-panel border border-border bg-surface sm:min-w-0">
        <img
          alt="Rotor de freio GHENO — disco de alta performance para MTB"
          className="absolute inset-0 h-full w-full object-cover opacity-90 saturate-75 transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
          src="/reference-images/rotor-gheno.jpg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <figcaption className="absolute inset-x-0 bottom-0 p-5">
          <MetaLabel className="mb-2 w-fit">ROTOR GHENO</MetaLabel>
          <h3 className="font-heading text-2xl leading-tight tracking-[-0.03em] text-primary">
            Dissipação precisa.
          </h3>
        </figcaption>
      </figure>
      <TechnicalMediaCard
        caption="Validação em terreno solto, com frenagens repetidas e mudança rápida de apoio."
        imageAlt="Rider GHENO freando em trecho técnico de downhill"
        imageSrc="/reference-images/trilha-frenagem-gheno.jpg"
        title="Testado onde importa."
      />
      <figure className="group relative min-h-72 min-w-[17rem] snap-start overflow-hidden rounded-panel border border-border bg-surface sm:col-span-2 sm:min-h-56 sm:min-w-0">
        <img
          alt="Pinça de freio Hayes Dominion A4 — produto compatível com pastilhas GHENO"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-90 saturate-75 transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
          src="/reference-images/hayes-a4-caliper.jpg"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/30 to-transparent" />
        <figcaption className="absolute inset-y-0 left-0 flex flex-col justify-end p-5 sm:justify-center">
          <MetaLabel className="mb-2 w-fit">COMPATIBILIDADE</MetaLabel>
          <h3 className="font-heading text-2xl leading-tight tracking-[-0.03em] text-primary">
            Hayes Dominion A4.
          </h3>
          <p className="mt-1 text-sm text-primary/76">
            Pastilhas GHENO com encaixe direto.
          </p>
        </figcaption>
      </figure>
    </div>
  );
}
