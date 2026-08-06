import { B2BTeaserSection } from '@/components/landing/b2b-teaser-section';
import { ComponentFamiliesSection } from '@/components/landing/component-families-section';
import { HomeHeroSection } from '@/components/landing/home-hero-section';
import { OperationalHighlightsSection } from '@/components/landing/operational-highlights-section';
import { ProductProofSection } from '@/components/landing/product-proof-section';
import { Button } from '@/components/ui/button';

function ClosingCTASection() {
  return (
    <section
      aria-labelledby="fechamento-heading"
      className="flex flex-col gap-5 border-t border-border py-10 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:py-12"
      data-section="closing-cta"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
        <h2
          className="shrink-0 text-balance font-heading text-[50px] leading-none tracking-[-0.04em]"
          id="fechamento-heading"
        >
          Acesse nossa loja online.
        </h2>
        <p className="max-w-md font-body text-[12px] leading-5 text-secondary sm:max-w-xs">
          Confira pastilhas, cubos, aros e discos no nosso catálogo.
        </p>
      </div>
      <Button asChild className="w-fit shrink-0" variant="outline">
        <a href="https://store.ghenortrs.com.br/">Ver loja online</a>
      </Button>
    </section>
  );
}

export function HomePage() {
  return (
    <div className="flex flex-col bg-background">
      <HomeHeroSection />
      <OperationalHighlightsSection />

      <div className="mx-auto w-full max-w-[90rem] px-6 py-18 sm:px-10 sm:py-24 lg:px-16">
        <ComponentFamiliesSection />
      </div>

      <div className="border-t border-border bg-background-soft">
        <div className="mx-auto w-full max-w-[90rem] px-6 py-18 sm:px-10 sm:py-24 lg:px-16">
          <ProductProofSection />
        </div>
      </div>

      <B2BTeaserSection />

      <div className="mx-auto w-full max-w-[90rem] px-6 pb-10 sm:px-10 lg:px-16">
        <ClosingCTASection />
      </div>
    </div>
  );
}
