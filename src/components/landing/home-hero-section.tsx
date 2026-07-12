import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import { OperationalHighlightsSection } from '@/components/landing/operational-highlights-section';
import { Button } from '@/components/ui/button';
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
    <section
      className="relative overflow-hidden bg-background"
      data-section="hero"
    >
      <div className="relative min-h-[100dvh] overflow-hidden bg-surface">
        {HERO_SLIDES.map((slide, i) => (
          <img
            key={slide.src}
            alt={slide.alt}
            className={cn(
              'absolute inset-0 h-full w-full object-cover object-[58%_center] transition-opacity duration-1000 sm:object-center',
              i === heroIdx ? 'opacity-72' : 'opacity-0',
            )}
            fetchPriority={i === 0 ? 'high' : undefined}
            loading={i === 0 ? undefined : 'lazy'}
            src={slide.src}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-background/88 via-background/56 to-background/8" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/86 via-background/8 to-background/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_42%,rgba(232,20,20,0.1),transparent_28%)]" />

        <div className="relative mx-auto flex min-h-[100dvh] max-w-[90rem] flex-col justify-center px-6 pb-64 pt-28 sm:px-10 sm:pb-60 lg:px-16">
          <div className="max-w-[38rem] lg:max-w-[42rem]">
            <h1 className="max-w-[42rem] text-balance font-heading text-[clamp(3rem,10vw,4.5rem)] leading-[0.94] tracking-[-0.05em]">
              Frenagem e controle para <span className="text-accent">MTB.</span>
            </h1>
            <p className="mt-7 max-w-[31rem] text-lg leading-8 text-primary/82 sm:text-xl">
              Pastilhas, cubos e aros disponíveis para compra online. Para
              rotores, fale diretamente com a equipe GHENO.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Button asChild className="h-13 min-w-44 justify-between">
                <a href="https://store.ghenortrs.com.br/produtos/">
                  Ver catálogo GHENO →
                </a>
              </Button>
              <Button
                asChild
                className="h-13 min-w-44 justify-between bg-background/35"
                variant="secondary"
              >
                <Link to="/componentes">Ver componentes →</Link>
              </Button>
            </div>
          </div>
        </div>
        <OperationalHighlightsSection />
      </div>
    </section>
  );
}
