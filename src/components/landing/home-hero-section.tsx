import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

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

export function HomeHeroSection() {
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
  );
}
