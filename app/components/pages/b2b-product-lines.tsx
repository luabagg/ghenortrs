import { Link } from '@remix-run/react';

import { COMMERCE_FAMILIES, type CommerceFamily } from '@/catalog/commerce';
import { groupPadsBySystem, shortProductName } from '@/catalog/product-lines';
import { WebpSource } from '@/components/media/webp-source';
import { HEADING_SECTION } from '@/lib/typography';
import { SEARCH_ENTRIES } from '@/search/search-data';
import type { SearchEntry } from '@/search/search-types';

import { PRODUCT_FAMILIES } from './components-page-data';

// Names and links only. B2B prices stay behind the approved-seller login.
function familyProducts(familyId: string): SearchEntry[] {
  return SEARCH_ENTRIES.filter(
    (entry) => entry.kind === 'product' && entry.family === familyId,
  );
}

const PADS = groupPadsBySystem(familyProducts('pastilhas'));

const OTHER_LINES = COMMERCE_FAMILIES.filter(
  (family) => family.id !== 'pastilhas',
)
  .map((family) => ({ family, products: familyProducts(family.id) }))
  .filter((line) => line.products.length > 0);

// Photos and copy come from the /componentes family stages.
function componentFamily(familyId: string) {
  return PRODUCT_FAMILIES.find((family) => family.id === familyId);
}

function ProductLink({
  className,
  label,
  product,
  children,
}: {
  className: string;
  label?: string;
  product: SearchEntry;
  children: string;
}) {
  return product.href.startsWith('/') ? (
    <Link aria-label={label} className={className} to={product.href}>
      {children}
    </Link>
  ) : (
    <a aria-label={label} className={className} href={product.href}>
      {children}
    </a>
  );
}

function FamilyImage({ familyId }: { familyId: string }) {
  const image = componentFamily(familyId);
  if (!image) return null;

  return (
    <div className="relative h-36 shrink-0 overflow-hidden bg-background-soft sm:h-44">
      <picture className="contents">
        <WebpSource
          sizes="(min-width: 1024px) 40vw, 100vw"
          src={image.imageSrc}
        />
        <img
          alt={image.imageAlt}
          className="h-full w-full object-cover opacity-90 saturate-[0.82]"
          loading="lazy"
          src={image.imageSrc}
        />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/15 to-transparent" />
    </div>
  );
}

function PadCompatibilityPanel() {
  return (
    <article
      aria-labelledby="b2b-pastilhas-heading"
      className="flex flex-col overflow-hidden rounded-md border border-border bg-surface lg:col-span-8"
    >
      <FamilyImage familyId="pastilhas" />
      <div className="grid gap-5 px-5 pb-6 sm:px-6">
        <div className="grid gap-1">
          <h3
            className="font-heading text-2xl leading-tight tracking-[-0.03em] text-primary"
            id="b2b-pastilhas-heading"
          >
            Pastilhas de freio
          </h3>
          <p className="font-body text-[12px] leading-5 text-secondary">
            Linhas Elite e Ultra por sistema de freio.
          </p>
        </div>

        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            Pastilhas de freio GHENO rotors por sistema de freio
          </caption>
          <thead>
            <tr className="border-b border-border">
              <th
                className="pb-3 pr-4 text-xs font-bold uppercase tracking-[0.14em] text-secondary"
                scope="col"
              >
                Sistema de freio
              </th>
              <th
                className="pb-3 text-right text-xs font-bold uppercase tracking-[0.14em] text-secondary"
                scope="col"
              >
                Linhas
              </th>
            </tr>
          </thead>
          <tbody>
            {PADS.systems.map(({ system, products }) => (
              <tr
                className="border-b border-border last:border-b-0"
                key={system}
              >
                <th
                  className="py-3 pr-4 font-body text-[14px] font-semibold leading-5 text-primary"
                  scope="row"
                >
                  {system}
                </th>
                <td className="py-3">
                  <div className="flex justify-end gap-2">
                    {(['Elite', 'Ultra'] as const).map((line) => {
                      const product = products[line];
                      return product ? (
                        <ProductLink
                          className="inline-flex h-7 w-16 items-center justify-center rounded-sm border border-border-strong text-[11px] font-bold uppercase tracking-[0.08em] text-primary transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                          key={line}
                          label={product.title}
                          product={product}
                        >
                          {line}
                        </ProductLink>
                      ) : (
                        <span aria-hidden="true" className="w-16" key={line} />
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {PADS.other.length > 0 ? (
          <ul className="grid gap-2">
            {PADS.other.map((product) => (
              <li key={product.id}>
                <ProductLink
                  className="font-body text-[14px] leading-5 text-primary/88 hover:text-primary"
                  product={product}
                >
                  {product.title}
                </ProductLink>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}

function FamilyCard({
  family,
  products,
}: {
  family: CommerceFamily;
  products: SearchEntry[];
}) {
  const headingId = `b2b-${family.id}-heading`;
  const description = componentFamily(family.id)?.description;

  return (
    <article
      aria-labelledby={headingId}
      className="flex flex-col overflow-hidden rounded-md border border-border bg-surface"
    >
      <FamilyImage familyId={family.id} />
      <div className="grid gap-3 px-5 pb-6 sm:px-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3
            className="font-heading text-xl leading-tight tracking-[-0.03em] text-primary"
            id={headingId}
          >
            {family.label}
          </h3>
          {family.commerce === 'contact' ? (
            <p className="font-body text-[12px] leading-5 text-secondary">
              Sob consulta
            </p>
          ) : null}
        </div>
        {description ? (
          <p className="font-body text-[12px] leading-5 text-secondary">
            {description}
          </p>
        ) : null}
        <ul className="grid border-t border-border pt-1">
          {products.map((product) => (
            <li
              className="border-b border-border py-2.5 last:border-b-0"
              key={product.id}
            >
              <ProductLink
                className="font-body text-[14px] leading-5 text-primary/88 transition-colors hover:text-primary"
                product={product}
              >
                {shortProductName(product.title)}
              </ProductLink>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function B2BProductLines() {
  return (
    <section
      aria-labelledby="b2b-produtos-heading"
      className="grid gap-5 border-t border-border pt-12 sm:pt-16"
      data-section="b2b-product-lines"
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <header className="grid content-start gap-3 lg:sticky lg:top-24 lg:col-span-4 lg:self-start lg:pt-2">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">
            Linha para revenda
          </p>
          <h2
            className={`text-balance ${HEADING_SECTION}`}
            id="b2b-produtos-heading"
          >
            Produtos para a sua loja.
          </h2>
          <p className="max-w-sm font-body text-[14px] leading-5 text-secondary">
            Modelos atuais da linha GHENO rotors, com link para cada produto na
            loja online. Discos sob consulta.
          </p>
        </header>
        <PadCompatibilityPanel />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {OTHER_LINES.map(({ family, products }) => (
          <FamilyCard family={family} key={family.id} products={products} />
        ))}
      </div>
    </section>
  );
}
