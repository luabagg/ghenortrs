import { Link } from '@remix-run/react';

import { PageIntro } from '@/components/landing/section-cards';
import { WebpSource } from '@/components/media/webp-source';
import { Button } from '@/components/ui/button';
import { SectionBand } from '@/components/ui/section-band';
import { cn } from '@/lib/utils';

import type { ComponentProductFamily } from './components-page-data';
import { HEADING_SECTION } from '@/lib/typography';

export function ComponentsPageIntro() {
  return (
    <PageIntro
      description="Pastilhas de freio, cubos e aros disponíveis na loja online. Discos sob consulta com a equipe GHENO rotors."
      title="Componentes GHENO rotors para frenagem e controle."
    />
  );
}

export function ComponentsCategoryNavigation({
  families,
}: {
  families: ComponentProductFamily[];
}) {
  return (
    <aside className="sticky top-[4.5rem] z-30 -mx-6 mb-8 border-y border-border bg-background px-6 sm:-mx-10 sm:top-20 sm:px-10 xl:static xl:mx-0 xl:mb-0 xl:border-0 xl:px-0">
      <div className="xl:sticky xl:top-24">
        <p className="mb-4 hidden font-heading text-lg font-semibold tracking-tight xl:block">
          Componentes
        </p>
        <nav
          aria-label="Categorias de componentes"
          className="flex overflow-x-auto xl:flex-col xl:overflow-visible xl:border-l xl:border-border"
        >
          {families.map((family, index) => (
            <a
              className="group flex shrink-0 items-center gap-2.5 border-b-2 border-transparent py-3 pr-5 font-body text-xs font-semibold text-secondary transition-colors hover:border-accent hover:text-primary focus-visible:border-accent focus-visible:text-primary focus-visible:outline-none xl:border-b-0 xl:border-l-2 xl:py-2 xl:pl-3 xl:pr-0"
              href={`#${family.id}`}
              key={family.id}
            >
              <span className="font-mono text-[11px] tabular-nums text-secondary/70">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="leading-snug">{family.title}</span>
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export function ComponentFamilyCard({
  family,
  reverse = false,
}: {
  family: ComponentProductFamily;
  reverse?: boolean;
}) {
  return (
    <article
      aria-labelledby={`${family.id}-heading`}
      className="grid scroll-mt-24 gap-8 border-t border-border pt-12 first:border-t-0 first:pt-0 lg:grid-cols-12 lg:gap-12 lg:pt-16"
      data-product-stage={family.id}
      id={family.id}
    >
      <div
        className={cn(
          'relative min-h-[22rem] overflow-hidden rounded-md border border-border bg-background-soft sm:min-h-[26rem] lg:col-span-7 lg:min-h-[32rem]',
          reverse && 'lg:order-2',
        )}
        data-threejs-slot={family.id}
      >
        {/* Image stage today; mount Three.js into [data-threejs-slot] later. */}
        <picture className="contents">
          <WebpSource
            sizes="(min-width: 1024px) 58vw, 100vw"
            src={family.imageSrc}
          />
          <img
            alt={family.imageAlt}
            className="absolute inset-0 h-full w-full object-cover opacity-90 saturate-[0.82]"
            loading="lazy"
            src={family.imageSrc}
          />
        </picture>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-background/10" />
      </div>

      <div
        className={cn(
          'flex flex-col justify-center gap-6 lg:col-span-5',
          reverse && 'lg:order-1',
        )}
      >
        <div className="flex flex-col gap-3">
          <h2
            className={`text-balance ${HEADING_SECTION}`}
            id={`${family.id}-heading`}
          >
            {family.title}
          </h2>
          <p className="max-w-xl font-body text-[14px] leading-5 text-secondary">
            {family.description}
          </p>
        </div>

        <ComponentHighlights highlights={family.highlights} />

        <div>
          <Button
            asChild
            variant={family.commerce === 'store' ? 'outline' : 'secondary'}
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
    <ul className="flex flex-col gap-3">
      {highlights.map((highlight) => (
        <li
          className="flex items-start gap-3 font-body text-[14px] leading-5 text-primary/90"
          key={highlight}
        >
          <span
            aria-hidden="true"
            className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-secondary"
          />
          {highlight}
        </li>
      ))}
    </ul>
  );
}

export function ComponentsB2BCTA() {
  return (
    <SectionBand
      className="-mx-6 overflow-hidden px-0 sm:-mx-10 lg:-mx-16"
      data-section="componentes-b2b"
    >
      <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-6 px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-on-primary/55">
            B2B
          </p>
          <h2 className={`max-w-2xl text-balance ${HEADING_SECTION}`}>
            Atendimento comercial para oficinas e revendas.
          </h2>
          <p className="max-w-xl font-body text-[14px] leading-5 text-on-primary/72">
            Peças que o rider pede de novo. Cadastre sua loja e compre direto
            com a GHENO rotors.
          </p>
        </div>
        <Button
          asChild
          className="w-fit min-w-0 border-accent bg-transparent px-6 text-on-primary hover:bg-accent hover:text-on-accent"
          variant="outline"
        >
          <Link to="/b2b">Solicitar cadastro B2B</Link>
        </Button>
      </div>
    </SectionBand>
  );
}
