import { ProductFamilyCard } from '@/components/landing/section-cards';
import {
  COMPONENT_FAMILIES,
  type ComponentFamily,
} from '@/components/landing/component-families-data';
import { MetaLabel } from '@/components/ui/meta-label';

export function ComponentFamiliesIntro() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <MetaLabel>COMPONENTES</MetaLabel>
        <a
          className="text-xs font-extrabold uppercase tracking-[0.14em] text-secondary transition-colors hover:text-primary"
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
        Pastilhas com diferentes compostos, cubos de alta rolagem, aros
        resistentes e rotores de dissipação eficiente.
      </p>
    </div>
  );
}

export function ComponentFamiliesGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {COMPONENT_FAMILIES.map((family) => (
        <ComponentFamilyItem key={family.title} family={family} />
      ))}
    </div>
  );
}

function ComponentFamilyItem({ family }: { family: ComponentFamily }) {
  return <ProductFamilyCard {...family} />;
}
