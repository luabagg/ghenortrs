import { useEffect, useState } from 'react';

import { Link } from '@remix-run/react';

import { Button } from '@/components/ui/button';

const HERO_IMAGE = {
  src: '/reference-images/mtb-action-hero.jpg',
  alt: 'Rider GHENO rotors em trilha com controle total',
} as const;

const DISCIPLINES = ['Downhill', 'Enduro', 'E-bike'] as const;

function prefersReducedMotion() {
  return Boolean(
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  );
}

function useDisciplineTypewriter(words: readonly string[]) {
  const [wordIndex, setWordIndex] = useState(0);
  const [charCount, setCharCount] = useState(words[0].length);
  const [phase, setPhase] = useState<'typing' | 'holding' | 'deleting'>(
    'holding',
  );

  useEffect(() => {
    if (prefersReducedMotion()) {
      const t = setInterval(() => {
        setWordIndex((i) => {
          const next = (i + 1) % words.length;
          setCharCount(words[next].length);
          return next;
        });
      }, 2800);
      return () => clearInterval(t);
    }

    const word = words[wordIndex];

    if (phase === 'holding') {
      const t = setTimeout(() => setPhase('deleting'), 1600);
      return () => clearTimeout(t);
    }

    if (phase === 'deleting') {
      if (charCount === 0) {
        const t = setTimeout(() => {
          setWordIndex((i) => (i + 1) % words.length);
          setPhase('typing');
        }, 180);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setCharCount((c) => c - 1), 36);
      return () => clearTimeout(t);
    }

    if (charCount >= word.length) {
      const t = setTimeout(() => setPhase('holding'), 80);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCharCount((c) => c + 1), 70);
    return () => clearTimeout(t);
  }, [charCount, phase, wordIndex, words]);

  return words[wordIndex].slice(0, charCount);
}

export function HomeHeroSection() {
  const discipline = useDisciplineTypewriter(DISCIPLINES);

  return (
    <section className="relative z-0 bg-background" data-section="hero">
      <div className="relative isolate min-h-[100dvh] overflow-hidden bg-background">
        <img
          alt={HERO_IMAGE.alt}
          className="absolute inset-0 size-full origin-[69%_center] object-cover object-[69%_center] opacity-80 motion-safe:animate-[gheno-hero-settle_1.4s_cubic-bezier(0.16,1,0.3,1)_both] sm:origin-center sm:object-center"
          src={HERO_IMAGE.src}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/78 via-background/45 to-background/10 sm:from-background sm:via-background/70 sm:to-background/15" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--color-background)_0%,var(--color-background)_8%,transparent_45%)]" />

        <div className="relative mx-auto flex min-h-[100dvh] max-w-[90rem] flex-col justify-end px-6 pb-14 pt-28 sm:px-10 sm:pb-20 lg:px-16 lg:pb-24">
          <div className="max-w-[18rem] sm:max-w-[36rem] lg:max-w-[42rem]">
            <h1 className="font-heading text-[clamp(2.05rem,7.2vw,4.75rem)] leading-[0.92] tracking-[-0.05em] sm:text-[clamp(2.75rem,8.5vw,4.75rem)]">
              <span className="block text-balance">
                Frenagem e controle para
              </span>
              <span
                aria-live="polite"
                className="mt-1 block min-h-[0.92em] text-accent"
              >
                <span className="inline-block min-w-[8ch] whitespace-nowrap">
                  {discipline}
                  <span className="ml-0.5 inline-block w-[0.08em] animate-pulse bg-accent align-baseline motion-reduce:hidden">
                    &nbsp;
                  </span>
                </span>
              </span>
            </h1>
            <p className="mt-5 max-w-[18rem] font-body text-[14px] leading-5 text-primary/78 sm:mt-6 sm:max-w-[30rem]">
              Não prometemos o impossível. Entregamos força de sobra, resposta
              limpa e honestidade no uso real.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
              <Button asChild className="min-w-44" variant="outline">
                <a href="https://store.ghenortrs.com.br/">
                  Confira a loja online
                </a>
              </Button>
              <Button asChild className="min-w-44" variant="secondary">
                <Link to="/componentes">Ver componentes</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
