import { Link } from 'react-router-dom';

import { B2BTeaserSection } from '@/components/landing/b2b-teaser-section';
import { ComponentFamiliesSection } from '@/components/landing/component-families-section';
import { CompetitionProofSection } from '@/components/landing/competition-proof-section';
import { HomeHeroSection } from '@/components/landing/home-hero-section';
import { OperationalHighlightsSection } from '@/components/landing/operational-highlights-section';
import { TechnicalProofSection } from '@/components/landing/technical-proof-section';
import { Button } from '@/components/ui/button';
import { MetaLabel } from '@/components/ui/meta-label';

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
  return (
    <div className="flex flex-col gap-16 sm:gap-24">
      <HomeHeroSection />

      <OperationalHighlightsSection />

      <ComponentFamiliesSection />

      <TechnicalProofSection />

      <CompetitionProofSection />

      <B2BTeaserSection />

      <ClosingCTASection />
    </div>
  );
}
