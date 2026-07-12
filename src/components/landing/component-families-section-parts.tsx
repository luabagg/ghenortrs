import { ProductFamilyCard } from '@/components/landing/section-cards';
import {
  COMPONENT_FAMILIES,
  type ComponentFamily,
} from '@/components/landing/component-families-data';

export function ComponentFamiliesIntro() {
  return (
    <div className="flex flex-col gap-5 lg:pt-3">
      <div className="flex items-center justify-end gap-4">
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
        Encontre o componente certo para sua bike.
      </h2>
      <p className="max-w-2xl text-base leading-7 text-secondary sm:text-lg">
        Pastilhas, cubos e aros estão disponíveis na loja GHENO. Para rotores,
        nossa equipe confirma compatibilidade e disponibilidade.
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
