import { PRODUCT_FAMILIES } from './components-page-data';
import {
  ComponentFamilyCard,
  ComponentsB2BCTA,
  ComponentsPageIntro,
} from './components-page-sections';

export function ComponentsPage() {
  return (
    <div className="flex flex-col gap-12" data-section="componentes-page">
      <ComponentsPageIntro />

      <div className="flex flex-col gap-10">
        {PRODUCT_FAMILIES.map((family) => (
          <ComponentFamilyCard family={family} key={family.id} />
        ))}
      </div>

      <ComponentsB2BCTA />
    </div>
  );
}
