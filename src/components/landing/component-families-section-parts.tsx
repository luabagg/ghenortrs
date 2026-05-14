import { ProductFamilyCard } from '@/components/landing/section-cards';
import {
  COMPONENT_FAMILIES,
  type ComponentFamily,
} from '@/components/landing/component-families-data';
import { MetaLabel } from '@/components/ui/meta-label';

export function ComponentFamiliesIntro() {
  return (
    <div className="flex flex-col gap-5 lg:pt-3">
      <div className="flex items-center justify-between gap-4">
        <MetaLabel>COMPONENTES</MetaLabel>
        <a
          className="text-xs font-extrabold uppercase tracking-[0.14em] text-secondary transition-colors hover:text-primary lg:hidden"
          href="https://store.ghenortrs.com.br/produtos/"
        >
          Ver todos os componentes →
        </a>
      </div>
      <h2
        className="max-w-2xl font-heading text-4xl leading-none tracking-[-0.04em] sm:text-5xl"
        id="familias-heading"
      >
        Um sistema.{' '}
        <span className="text-secondary">Quatro pilares de performance.</span>
      </h2>
      <p className="max-w-2xl text-base leading-7 text-secondary sm:text-lg">
        Cada componente trabalha junto para entregar controle, precisão e
        confiança total. Construído para quem vive o MTB de verdade.
      </p>
      <a
        className="hidden border-t border-border pt-7 text-xs font-extrabold uppercase tracking-[0.14em] text-primary transition-colors hover:text-accent lg:block"
        href="https://store.ghenortrs.com.br/produtos/"
      >
        Ver todos os componentes →
      </a>
    </div>
  );
}

export function ComponentFamiliesGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-3">
      {COMPONENT_FAMILIES.map((family) => (
        <ComponentFamilyItem key={family.title} family={family} />
      ))}
    </div>
  );
}

function ComponentFamilyItem({ family }: { family: ComponentFamily }) {
  return <ProductFamilyCard {...family} />;
}
