import {
  ComponentFamiliesGrid,
  ComponentFamiliesIntro,
} from '@/components/landing/component-families-section-parts';

export function ComponentFamiliesSection() {
  return (
    <section
      aria-labelledby="familias-heading"
      className="grid gap-8"
      data-section="component-families"
    >
      <ComponentFamiliesIntro />
      <ComponentFamiliesGrid />
    </section>
  );
}
