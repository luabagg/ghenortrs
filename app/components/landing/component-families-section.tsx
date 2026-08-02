import {
  ComponentFamiliesGrid,
  ComponentFamiliesIntro,
} from '@/components/landing/component-families-section-parts';

export function ComponentFamiliesSection() {
  return (
    <section
      aria-labelledby="familias-heading"
      className="grid gap-8 lg:grid-cols-[0.9fr_2.9fr] lg:items-start"
      data-section="component-families"
    >
      <ComponentFamiliesIntro />
      <ComponentFamiliesGrid />
    </section>
  );
}
