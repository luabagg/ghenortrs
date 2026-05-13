import { ProductFamilyCard } from '@/components/landing/section-cards';
import { MetaLabel } from '@/components/ui/meta-label';

export function ComponentFamiliesSection() {
  return (
    <section
      aria-labelledby="familias-heading"
      className="grid gap-8"
      data-section="component-families"
    >
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
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <ProductFamilyCard
          ctaHref="https://store.ghenortrs.com.br/produtos/"
          ctaLabel="Ver catálogo GHENO"
          description="Composição calibrada para resposta direta e modulação previsível. Catálogo ativo ao vivo."
          eyebrow="ATIVO NO CATÁLOGO"
          imageAlt="Pastilha de freio GHENO"
          imageSrc="/reference-images/pastilhas-gheno.jpg"
          isLive={true}
          title="Pastilhas"
        />
        <ProductFamilyCard
          ctaHref="https://store.ghenortrs.com.br/contato/"
          ctaLabel="Consultar cubos"
          description="Rolamento de alta performance para trilha técnica e competição. Disponível via consulta comercial."
          eyebrow="CONSULTA COMERCIAL"
          imageAlt="Cubo GHENO"
          imageSrc="/reference-images/cubo-gheno.jpg"
          isLive={false}
          title="Cubos"
        />
        <ProductFamilyCard
          ctaHref="https://store.ghenortrs.com.br/contato/"
          ctaLabel="Consultar aros"
          description="Rigidez e leveza para rider exigente. Disponível via consulta comercial."
          eyebrow="CONSULTA COMERCIAL"
          imageAlt="Aro GHENO"
          imageSrc="/reference-images/aro-gheno.jpg"
          isLive={false}
          title="Aros"
        />
        <ProductFamilyCard
          ctaHref="https://store.ghenortrs.com.br/contato/"
          ctaLabel="Consultar rotores"
          description="Dissipação de calor e modulação em descidas longas. Disponível via consulta comercial."
          eyebrow="CONSULTA COMERCIAL"
          imageAlt="Rotor GHENO"
          imageSrc="/reference-images/rotor-gheno.jpg"
          isLive={false}
          title="Rotores"
        />
      </div>
    </section>
  );
}
