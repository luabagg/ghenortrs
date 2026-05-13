import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { MetaLabel } from '@/components/ui/meta-label';
import { SectionBand } from '@/components/ui/section-band';
import { cn } from '@/lib/utils';

const PRODUCT_FAMILIES = [
  {
    id: 'pastilhas',
    eyebrow: 'ATIVO NO CATÁLOGO',
    title: 'Pastilhas de freio',
    description:
      'Composição calibrada para resposta direta e modulação previsível em qualquer condição de terreno. Disponíveis em quatro compostos para DH, enduro, XC e trilha livre.',
    highlights: [
      'Quatro compostos para cada tipo de uso',
      'Compatível com Shimano, SRAM e TRP',
      'Resistência a +300°C em descidas encadeadas',
      'Modulação sem fade em calor extremo',
    ],
    ctaLabel: 'Ver catálogo de pastilhas',
    ctaHref: 'https://store.ghenortrs.com.br/produtos/',
    isLive: true,
    imageAlt: 'Pastilha de freio GHENO — compostos para MTB',
    imageSrc: '/reference-images/pastilhas-gheno.jpg',
  },
  {
    id: 'cubos',
    eyebrow: 'CONSULTA COMERCIAL',
    title: 'Cubos de alta rolagem',
    description:
      'Rolamento de alta performance desenvolvido para trilha técnica e competição. Disponível via consulta comercial direta com a equipe GHENO.',
    highlights: [
      'Projeto para performance em trilha técnica',
      'Construção para carga e uso intenso',
      'Compatibilidade com principais padrões de cubo',
      'Disponível via consulta para lojistas e revendas',
    ],
    ctaLabel: 'Consultar cubos',
    ctaHref: 'https://store.ghenortrs.com.br/contato/',
    isLive: false,
    imageAlt: 'Cubo GHENO — alta rolagem para MTB',
    imageSrc: '/reference-images/cubo-gheno.jpg',
  },
  {
    id: 'aros',
    eyebrow: 'CONSULTA COMERCIAL',
    title: 'Aros de carbono e alumínio',
    description:
      'Rigidez e leveza projetadas para rider exigente. Construídos para aguentar a demanda de trilhas técnicas e competição sem abrir mão da performance de rolagem.',
    highlights: [
      'Opções em carbono e alumínio de alta rigidez',
      'Perfil interno calibrado para pneus MTB',
      'Testado em trilhas técnicas e competição',
      'Disponível via consulta para lojistas e revendas',
    ],
    ctaLabel: 'Consultar aros',
    ctaHref: 'https://store.ghenortrs.com.br/contato/',
    isLive: false,
    imageAlt: 'Aro GHENO — rigidez e leveza para MTB',
    imageSrc: '/reference-images/aro-gheno.jpg',
  },
  {
    id: 'rotores',
    eyebrow: 'CONSULTA COMERCIAL',
    title: 'Rotores de dissipação',
    description:
      'Dissipação de calor e modulação em descidas longas. Liga de aço de alta resistência com geometria projetada para refrigeração eficiente durante frenagens repetidas.',
    highlights: [
      'Liga de aço de alta resistência térmica',
      'Geometria para dissipação eficiente de calor',
      'Compatível com pinças Hayes Dominion A4',
      'Validado em competição downhill e enduro',
    ],
    ctaLabel: 'Consultar rotores',
    ctaHref: 'https://store.ghenortrs.com.br/contato/',
    isLive: false,
    imageAlt: 'Rotor GHENO — disco de alta performance para MTB',
    imageSrc: '/reference-images/rotor-gheno.jpg',
  },
] as const;

export function ComponentsPage() {
  return (
    <div className="flex flex-col gap-12" data-section="componentes-page">
      <div className="flex flex-col gap-3">
        <MetaLabel>COMPONENTES</MetaLabel>
        <h1 className="max-w-3xl font-heading text-4xl leading-none tracking-[-0.05em] sm:text-5xl">
          Um sistema.{' '}
          <span className="text-secondary">Quatro pilares de performance.</span>
        </h1>
        <p className="max-w-2xl text-base leading-7 text-secondary sm:text-lg">
          Pastilhas, cubos, aros e rotores desenvolvidos para controle,
          resistência e confiança em uso intenso.
        </p>
      </div>

      <div className="flex flex-col gap-10">
        {PRODUCT_FAMILIES.map((family) => (
          <article
            key={family.id}
            aria-labelledby={`${family.id}-heading`}
            className="grid gap-6 overflow-hidden rounded-panel border border-border bg-surface lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
          >
            <div className="relative min-h-64 bg-background-soft lg:min-h-80">
              <img
                alt={family.imageAlt}
                className="absolute inset-0 h-full w-full object-cover opacity-82 saturate-75"
                loading="lazy"
                src={family.imageSrc}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface/20 lg:bg-gradient-to-r" />
            </div>
            <div className="flex flex-col gap-5 px-6 py-6 lg:px-8 lg:py-8">
              <div className="flex flex-col gap-2">
                <MetaLabel
                  className={cn(
                    !family.isLive &&
                      'border border-border bg-surface-elevated text-secondary',
                  )}
                >
                  {family.eyebrow}
                </MetaLabel>
                <h2
                  className="font-heading text-3xl leading-none tracking-[-0.04em] sm:text-4xl"
                  id={`${family.id}-heading`}
                >
                  {family.title}
                </h2>
                <p className="text-sm leading-7 text-secondary sm:text-base">
                  {family.description}
                </p>
              </div>
              <div className="flex flex-col gap-2.5">
                {family.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 12 12"
                      >
                        <path
                          d="M2 6l2.5 2.5L9.5 3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                        />
                      </svg>
                    </div>
                    <p className="text-sm leading-5 text-primary">{h}</p>
                  </div>
                ))}
              </div>
              <div>
                <Button
                  asChild
                  variant={family.isLive ? 'primary' : 'secondary'}
                >
                  <a href={family.ctaHref}>{family.ctaLabel}</a>
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <SectionBand className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-on-primary/70">
            B2B
          </p>
          <p className="max-w-xl font-heading text-2xl leading-tight tracking-[-0.03em] sm:text-3xl">
            Lojistas e revendas com acesso direto ao time GHENO.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Button asChild>
            <a href="https://store.ghenortrs.com.br/produtos/">
              Entrar na Loja B2B →
            </a>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/b2b">Pré-cadastro comercial</Link>
          </Button>
        </div>
      </SectionBand>
    </div>
  );
}
