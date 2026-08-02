import { Link } from '@remix-run/react';

import { ProductFamilyCard } from '@/components/landing/section-cards';
import {
  COMPONENT_FAMILIES,
  type ComponentFamily,
} from '@/components/landing/component-families-data';
import { Button } from '@/components/ui/button';

export function ComponentFamiliesIntro() {
  return (
    <div className="flex flex-col gap-5 lg:pt-3">
      <h2
        className="max-w-2xl text-balance font-heading text-[50px] leading-none tracking-[-0.04em]"
        id="familias-heading"
      >
        Peças para a sua bike.
      </h2>
      <p className="max-w-xl text-justify font-body text-[14px] leading-5 text-secondary">
        Pastilhas, cubos, aros e discos GHENO rotors. Você escolhe pelo que a
        bike precisa, não pelo hype.
      </p>
      <Button asChild className="w-fit self-start" variant="ghost">
        <Link to="/componentes">Ver todos os componentes</Link>
      </Button>
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
  return <ProductFamilyCard {...family} href="/componentes" />;
}
