import { Link } from 'react-router-dom';

import { B2BTeaserSection } from '@/components/landing/b2b-teaser-section';
import { ComponentFamiliesSection } from '@/components/landing/component-families-section';
import { CompetitionProofSection } from '@/components/landing/competition-proof-section';
import { HomeHeroSection } from '@/components/landing/home-hero-section';
import { TechnicalProofSection } from '@/components/landing/technical-proof-section';
import { Button } from '@/components/ui/button';
import { MetaLabel } from '@/components/ui/meta-label';

function ClosingCTASection() {
  return (
    <section
      aria-labelledby="fechamento-heading"
      className="rounded-lg border border-border-strong bg-surface px-6 py-10 sm:px-8 sm:py-14 lg:px-12"
      data-section="closing-cta"
    >
      <div className="flex flex-col gap-6">
        <MetaLabel>LOJA GHENO</MetaLabel>
        <h2
          className="max-w-3xl font-heading text-4xl leading-none tracking-[-0.04em] sm:text-5xl"
          id="fechamento-heading"
        >
          Compre pastilhas, cubos e aros online.{' '}
          <span className="text-secondary">Para rotores, fale conosco.</span>
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <a href="https://store.ghenortrs.com.br/produtos/">
              Ver loja online
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
  return (
    <div className="flex flex-col bg-background">
      <HomeHeroSection />

      <div className="mx-auto w-full max-w-[90rem] px-6 py-18 sm:px-10 sm:py-24 lg:px-16">
        <ComponentFamiliesSection />
      </div>

      <div className="border-t border-border bg-background-soft">
        <div className="mx-auto w-full max-w-[90rem] px-6 py-18 sm:px-10 sm:py-24 lg:px-16">
          <TechnicalProofSection />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[90rem] px-6 py-18 sm:px-10 sm:py-24 lg:px-16">
        <CompetitionProofSection />
      </div>

      <B2BTeaserSection />

      <div className="mx-auto w-full max-w-[90rem] px-6 py-14 sm:px-10 lg:px-16">
        <ClosingCTASection />
      </div>
    </div>
  );
}
