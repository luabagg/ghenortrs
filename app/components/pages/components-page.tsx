import { PRODUCT_FAMILIES } from './components-page-data';
import {
  ComponentFamilyCard,
  ComponentsB2BCTA,
  ComponentsPageIntro,
} from './components-page-sections';

export function ComponentsPage() {
  return (
    <div className="flex flex-col gap-14 sm:gap-16" data-section="componentes-page">
      <ComponentsPageIntro />

      <div className="flex flex-col">
        {PRODUCT_FAMILIES.map((family, index) => (
          <ComponentFamilyCard
            family={family}
            key={family.id}
            reverse={index % 2 === 1}
          />
        ))}
      </div>

      <ComponentsB2BCTA />
    </div>
  );
}
