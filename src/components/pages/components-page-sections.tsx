import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { SectionBand } from '@/components/ui/section-band';

import type { ComponentProductFamily } from './components-page-data';

export function ComponentsPageIntro() {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="max-w-3xl font-heading text-4xl leading-none tracking-[-0.05em] sm:text-5xl">
        Componentes GHENO rotors para frenagem e controle.
      </h1>
      <p className="max-w-2xl text-base leading-7 text-secondary sm:text-lg">
        Confira pastilhas, cubos, aros e discos no catálogo GHENO rotors.
        Compra online para as linhas disponíveis na loja.
      </p>
    </div>
  );
}

export function ComponentFamilyCard({
  family,
}: {
  family: ComponentProductFamily;
}) {
  return (
    <article
      aria-labelledby={`${family.id}-heading`}
      className="grid gap-6 overflow-hidden rounded-panel border border-border bg-surface lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
      id={family.id}
    >
      <div className="relative min-h-64 bg-background-soft lg:min-h-80">
        <img
          alt={family.imageAlt}
          className="absolute inset-0 h-full w-full object-cover opacity-82 saturate-75"
          loading="lazy"
          src={family.imageSrc}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface/20 lg:bg-gradient-to-r" />
      </div>
      <div className="flex flex-col gap-5 px-6 py-6 lg:px-8 lg:py-8">
        <div className="flex flex-col gap-2">
          <h2
            className="font-heading text-3xl leading-none tracking-[-0.04em] sm:text-4xl"
            id={`${family.id}-heading`}
          >
            {family.title}
          </h2>
          <p className="text-sm leading-7 text-secondary sm:text-base">
            {family.description}
          </p>
        </div>
        <ComponentHighlights highlights={family.highlights} />
        <div>
          <Button
            asChild
            variant={family.commerce === 'store' ? 'primary' : 'secondary'}
          >
            {family.ctaHref.startsWith('/') ? (
              <Link to={family.ctaHref}>{family.ctaLabel}</Link>
            ) : (
              <a href={family.ctaHref}>{family.ctaLabel}</a>
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}

function ComponentHighlights({ highlights }: { highlights: string[] }) {
  return (
    <div className="flex flex-col gap-2.5">
      {highlights.map((highlight) => (
        <div key={highlight} className="flex items-center gap-3">
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
          <p className="text-sm leading-5 text-primary">{highlight}</p>
        </div>
      ))}
    </div>
  );
}

export function ComponentsB2BCTA() {
  return (
    <SectionBand className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-on-primary/70">
          B2B
        </p>
        <p className="max-w-xl font-heading text-2xl leading-tight tracking-[-0.03em] sm:text-3xl">
          Condições comerciais para oficinas e revendas cadastradas.
        </p>
      </div>
      <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link to="/b2b">Pré-cadastro comercial</Link>
        </Button>
      </div>
    </SectionBand>
  );
}
