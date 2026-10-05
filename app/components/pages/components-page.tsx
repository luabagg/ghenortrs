import { PRODUCT_FAMILIES } from './components-page-data';
import {
  ComponentFamilyCard,
  ComponentsB2BCTA,
  ComponentsCategoryNavigation,
  ComponentsPageIntro,
} from './components-page-sections';

export function ComponentsPage() {
  return (
    <div
      className="flex flex-col gap-14 sm:gap-16"
      data-section="componentes-page"
    >
      <ComponentsPageIntro />

      <div className="xl:grid xl:grid-cols-[11rem_minmax(0,1fr)] xl:gap-10">
        <ComponentsCategoryNavigation families={PRODUCT_FAMILIES} />
        <div className="flex min-w-0 flex-col">
          {PRODUCT_FAMILIES.map((family, index) => (
            <ComponentFamilyCard
              family={family}
              key={family.id}
              reverse={index % 2 === 1}
            />
          ))}
        </div>
      </div>

      <ComponentsB2BCTA />
    </div>
  );
}
