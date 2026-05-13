import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import { B2BTeaserSection } from '@/components/landing/b2b-teaser-section';
import { ComponentFamiliesSection } from '@/components/landing/component-families-section';
import { CompetitionProofSection } from '@/components/landing/competition-proof-section';
import { TechnicalProofSection } from '@/components/landing/technical-proof-section';
import { Button } from '@/components/ui/button';
import { MetaLabel } from '@/components/ui/meta-label';
import { cn } from '@/lib/utils';

const HERO_SLIDES = [
  {
    src: '/reference-images/mtb-action-hero.jpg',
    alt: 'Rider GHENO em trilha com controle total',
  },
  {
    src: '/reference-images/hero-gheno-jump.jpg',
    alt: 'Rider com componentes GHENO em salto de competição',
  },
  {
    src: '/reference-images/hero-red-trail.jpg',
    alt: 'Rider em trilha de terra vermelha com velocidade',
  },
] as const;

function ClosingCTASection() {
  return (
    <section
      aria-labelledby="fechamento-heading"
      className="rounded-panel border border-border bg-surface px-6 py-10 shadow-[0_24px_80px_rgba(0,0,0,0.34)] sm:px-8 sm:py-14 lg:px-12"
      data-section="closing-cta"
    >
      <div className="flex flex-col gap-6">
        <MetaLabel>PRONTO PARA RODAR</MetaLabel>
        <h2
          className="max-w-3xl font-heading text-4xl leading-none tracking-[-0.04em] sm:text-5xl"
          id="fechamento-heading"
        >
          Pronto para elevar a performance das suas bikes?
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <a href="https://store.ghenortrs.com.br/produtos/">
              Acessar Loja B2B
            </a>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/componentes">Ver componentes</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(
      () => setHeroIdx((i) => (i + 1) % HERO_SLIDES.length),
      6000,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col gap-16 sm:gap-24">
      <section data-section="hero">
        <div className="relative overflow-hidden rounded-panel border border-border bg-surface shadow-[0_24px_80px_rgba(0,0,0,0.34)]">
          {HERO_SLIDES.map((slide, i) => (
            <img
              key={slide.src}
              alt={slide.alt}
              className={cn(
                'absolute inset-0 h-full w-full object-cover transition-opacity duration-1000',
                i === heroIdx ? 'opacity-62' : 'opacity-0',
              )}
              fetchPriority={i === 0 ? 'high' : undefined}
              loading={i === 0 ? undefined : 'lazy'}
              src={slide.src}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/88 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/65" />
          <div className="relative min-h-[34rem] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-14">
            <img
              alt="GHENO"
              className="h-12 w-auto rounded-sm"
              fetchPriority="high"
              height={250}
              src="/brand/logo-wide.png"
              width={500}
            />
            <div className="mt-20 max-w-4xl sm:mt-28">
              <MetaLabel>COMPONENTES MTB DE ALTO DESEMPENHO</MetaLabel>
              <h1 className="mt-6 max-w-4xl font-heading text-4xl leading-[0.94] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                Componentes de performance para MTB{' '}
                <span className="text-accent">de verdade.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-primary/82 sm:text-xl sm:leading-8">
                Pastilhas, cubos, aros e rotores desenvolvidos para controle,
                resistência e confiança em uso intenso.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild>
                  <a href="https://store.ghenortrs.com.br/produtos/">
                    Entrar na Loja B2B →
                  </a>
                </Button>
                <Button asChild variant="secondary">
                  <Link to="/componentes">Ver componentes</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-label="Destaques operacionais"
        className="grid grid-cols-2 gap-4 rounded-panel border border-border bg-surface-elevated px-6 py-6 sm:gap-5 sm:px-8 lg:grid-cols-4"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
              />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary">
              Controle extremo
            </p>
            <p className="mt-0.5 text-xs leading-5 text-secondary">
              Freios afinados para qualquer trilha
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
              />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary">
              Materiais premium
            </p>
            <p className="mt-0.5 text-xs leading-5 text-secondary">
              Qualidade e consistência que você vai notar
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
              />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary">
              Testado em condições reais
            </p>
            <p className="mt-0.5 text-xs leading-5 text-secondary">
              Nas pistas mais exigentes do Brasil
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M13 10V3L4 14h7v7l9-11h-7z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
              />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary">
              Performance que dá confiança
            </p>
            <p className="mt-0.5 text-xs leading-5 text-secondary">
              Para você e para o seu negócio
            </p>
          </div>
        </div>
      </section>

      <ComponentFamiliesSection />

      <TechnicalProofSection />

      <CompetitionProofSection />

      <B2BTeaserSection />

      <ClosingCTASection />
    </div>
  );
}
