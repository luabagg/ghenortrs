import { Link } from '@remix-run/react';

import { PageIntro } from '@/components/landing/section-cards';
import { WebpSource } from '@/components/media/webp-source';
import { Button } from '@/components/ui/button';
import { HEADING_SECTION } from '@/lib/typography';

import { ComponentsB2BCTA } from './components-page-sections';

const ORIGIN_FACTS = [
  { label: '2023', text: 'Primeiros discos de freio para downhill.' },
  { label: '4 famílias', text: 'Pastilhas de freio, cubos, aros e discos.' },
  { label: 'B2B', text: 'Atendimento para lojistas, oficinas e revendas.' },
] as const;

type Founder = {
  id: string;
  name: string;
  summary: string;
  profile: { href: string; label: string };
  results?: readonly { year: string; result: string }[];
};

// Each id matches a founder @id fragment in seo-config.ts.
const FOUNDERS: readonly Founder[] = [
  {
    id: 'andrei-gheno',
    name: 'Andrei Gheno',
    summary: 'Atleta profissional de downhill.',
    profile: {
      href: 'https://www.instagram.com/andrei_gheno_/',
      label: 'Instagram de Andrei Gheno',
    },
    results: [
      { year: '2023', result: 'Campeão Brasileiro sub30' },
      { year: '2023', result: 'Campeão Gaúcho sub23' },
      { year: '2021', result: '2º lugar no Pan-Americano sub23' },
    ],
  },
  {
    id: 'luan-baggio',
    name: 'Luan Baggio',
    summary: 'Responsável por projetos, tecnologia e operação.',
    profile: {
      href: 'https://www.linkedin.com/in/luabagg/',
      label: 'LinkedIn de Luan Baggio',
    },
  },
];

function OriginSection() {
  return (
    <section
      aria-labelledby="origem-heading"
      className="grid gap-8 lg:grid-cols-12 lg:gap-12"
      data-section="about-origin"
    >
      <div className="relative min-h-[20rem] overflow-hidden rounded-md border border-border bg-background-soft sm:min-h-[26rem] lg:col-span-7 lg:min-h-[30rem]">
        <picture className="contents">
          <WebpSource
            sizes="(min-width: 1024px) 58vw, 100vw"
            src="/reference-images/disco-gheno.jpg"
          />
          <img
            alt="Disco de freio GHENO rotors para MTB"
            className="absolute inset-0 h-full w-full object-cover opacity-90 saturate-[0.82]"
            loading="lazy"
            src="/reference-images/disco-gheno.jpg"
          />
        </picture>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-background/10" />
      </div>

      <div className="flex flex-col justify-center gap-6 lg:col-span-5">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">
            Origem
          </p>
          <h2 className={`text-balance ${HEADING_SECTION}`} id="origem-heading">
            Começou pelos discos.
          </h2>
          <p className="max-w-xl font-body text-[14px] leading-5 text-secondary">
            A GHENO rotors começou em 2023 com discos de freio para downhill.
            Hoje a linha inclui pastilhas de freio, cubos, aros e discos.
          </p>
        </div>

        <dl className="grid border-y border-border sm:grid-cols-3">
          {ORIGIN_FACTS.map((fact) => (
            <div
              className="grid content-start gap-1 border-border py-4 max-sm:border-b max-sm:last:border-b-0 sm:border-r sm:px-4 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0"
              key={fact.label}
            >
              <dt className="font-heading text-xl leading-tight tracking-[-0.03em] text-primary">
                {fact.label}
              </dt>
              <dd className="font-body text-[12px] leading-5 text-secondary">
                {fact.text}
              </dd>
            </div>
          ))}
        </dl>

        <div>
          <Button asChild variant="outline">
            <Link to="/componentes">Ver componentes</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function FounderProfile({ founder }: { founder: Founder }) {
  return (
    <article
      aria-labelledby={`${founder.id}-heading`}
      className="flex flex-col gap-5 border-border max-lg:border-t max-lg:pt-8 max-lg:first:border-t-0 max-lg:first:pt-0 lg:border-l lg:pl-10 lg:first:border-l-0 lg:first:pl-0"
      id={founder.id}
    >
      <div className="grid gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">
          Cofundador e sócio
        </p>
        <h3
          className="font-heading text-[1.875rem] leading-[1.05] tracking-[-0.03em] text-primary"
          id={`${founder.id}-heading`}
        >
          {founder.name}
        </h3>
        <p className="font-body text-[14px] leading-5 text-secondary">
          {founder.summary}
        </p>
      </div>

      {founder.results ? (
        <ul className="grid border-t border-border">
          {founder.results.map((entry) => (
            <li
              className="grid grid-cols-[3.25rem_minmax(0,1fr)] items-baseline border-b border-border py-3"
              key={`${entry.year}-${entry.result}`}
            >
              <span className="font-mono text-[12px] tabular-nums text-secondary">
                {entry.year}
              </span>
              <span className="font-body text-[14px] leading-5 text-primary/88">
                {entry.result}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <div>
        <Button asChild variant="ghost">
          <a href={founder.profile.href}>{founder.profile.label}</a>
        </Button>
      </div>
    </article>
  );
}

function FoundersSection() {
  return (
    <section
      aria-labelledby="fundadores-heading"
      className="grid gap-10 border-t border-border pt-12 sm:pt-16"
      data-section="about-founders"
    >
      <div className="grid max-w-2xl gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">
          Fundadores
        </p>
        <h2
          className={`text-balance ${HEADING_SECTION}`}
          id="fundadores-heading"
        >
          Quem está por trás da marca.
        </h2>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        {FOUNDERS.map((founder) => (
          <FounderProfile founder={founder} key={founder.id} />
        ))}
      </div>
    </section>
  );
}

export function AboutPage() {
  return (
    <div className="flex flex-col gap-14 sm:gap-16" data-section="about-page">
      <PageIntro
        description="Marca brasileira de componentes para mountain bike. Conheça a origem da GHENO rotors e quem está por trás dela."
        title="Componentes MTB criados por quem corre downhill."
      />
      <OriginSection />
      <FoundersSection />
      <ComponentsB2BCTA />
    </div>
  );
}
