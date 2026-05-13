import { MetaLabel } from '@/components/ui/meta-label';

const COMPETITION_SHOTS = [
  {
    src: '/reference-images/comp-panned-action.jpg',
    alt: 'Rider em alta velocidade durante prova de DH com público ao fundo',
    caption: 'Velocidade máxima',
  },
  {
    src: '/reference-images/comp-dh-rocky.jpg',
    alt: 'Rider descendo trecho rochoso em prova de downhill',
    caption: 'Terreno rochoso',
  },
  {
    src: '/reference-images/comp-dh-crowd.jpg',
    alt: 'Rider em prova de DH com espectadores acompanhando',
    caption: 'Pressão de prova',
  },
  {
    src: '/reference-images/comp-dh-forest.jpg',
    alt: 'Rider em trilha florestal de competição',
    caption: 'Controle em floresta',
  },
  {
    src: '/reference-images/comp-dh-technical.jpg',
    alt: 'Rider em trecho técnico de downhill durante competição',
    caption: 'Trecho técnico',
  },
  {
    src: '/reference-images/comp-dh-speed.jpg',
    alt: 'Rider em alta velocidade em descida de competição de MTB',
    caption: 'Descida em DH',
  },
] as const;

export function CompetitionProofSection() {
  return (
    <section aria-labelledby="competicao-heading" className="grid gap-8">
      <div className="flex flex-col gap-3">
        <MetaLabel>PROVA EM CAMPO</MetaLabel>
        <h2
          className="max-w-2xl font-heading text-4xl leading-none tracking-[-0.04em] sm:text-5xl"
          id="competicao-heading"
        >
          Componentes desenvolvidos para aguentar o que a prova cobra.
        </h2>
        <p className="max-w-2xl text-base leading-7 text-secondary sm:text-lg">
          Descidas técnicas, terrenos soltos, frenagens encadeadas. As condições
          que definem se o componente funciona de verdade.
        </p>
      </div>
      <div
        aria-label="Imagens de competição MTB"
        className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0"
      >
        {COMPETITION_SHOTS.map((shot) => (
          <figure
            key={shot.src}
            className="group relative min-h-64 min-w-[70vw] flex-shrink-0 snap-start overflow-hidden rounded-panel border border-border bg-surface sm:min-w-0"
          >
            <img
              alt={shot.alt}
              className="absolute inset-0 h-full w-full object-cover opacity-80 saturate-75 transition-transform duration-500 group-hover:scale-[1.04]"
              loading="lazy"
              src={shot.src}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/88 via-transparent to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-4">
              <p className="font-heading text-base leading-tight tracking-[-0.02em] text-primary">
                {shot.caption}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
