import { ScrollImage } from '@/components/motion/scroll-image';

const PROOF_POINTS = [
  'Encaixe e acabamento feitos para o conjunto real da bike',
  'Resposta consistente em descidas longas e terreno irregular',
  'Testados em competição e no uso técnico de MTB',
] as const;

const PROOF_IMAGES = [
  {
    src: '/reference-images/b2b-race-context.jpg',
    alt: 'Rider em prova de MTB diante do público',
  },
  {
    src: '/reference-images/cubo-gheno.jpg',
    alt: 'Cubo GHENO rotors',
  },
  {
    src: '/reference-images/b2b-trail-validation.jpg',
    alt: 'Rider em curva de trilha com terreno solto',
  },
] as const;

export function ProductProofSection() {
  return (
    <section
      aria-labelledby="prova-heading"
      className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14"
      id="tecnologia"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">
            Em uso real
          </p>
          <h2
            className="max-w-2xl text-balance font-heading text-4xl leading-none tracking-[-0.04em] sm:text-5xl"
            id="prova-heading"
          >
            Tecnologia que aguenta prova e trilha.
          </h2>
          <p className="max-w-xl text-justify text-base leading-7 text-secondary sm:text-lg">
            Projetamos as peças para manter o controle sob uso severo, em prova
            e na trilha.
          </p>
        </div>
        <ul className="flex flex-col gap-2.5">
          {PROOF_POINTS.map((point) => (
            <li
              key={point}
              className="flex items-start gap-3 text-justify text-sm leading-6 text-primary/88"
            >
              <span
                aria-hidden="true"
                className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-secondary"
              />
              {point}
            </li>
          ))}
        </ul>
      </div>
      <div
        aria-label="Imagens de produto e uso GHENO rotors"
        className="-mx-6 flex max-w-[100vw] snap-x gap-3 overflow-x-auto px-6 pb-2 sm:mx-0 sm:grid sm:max-w-none sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0"
      >
        {PROOF_IMAGES.map((image) => (
          <figure
            key={image.src}
            className="relative min-h-56 min-w-[70vw] shrink-0 snap-start overflow-hidden rounded-md border border-border bg-surface sm:min-h-64 sm:min-w-0"
          >
            <ScrollImage
              alt={image.alt}
              className="absolute inset-0 h-full w-full object-cover opacity-88 saturate-[0.8] will-change-transform"
              effect="zoom"
              loading="lazy"
              src={image.src}
            />
          </figure>
        ))}
      </div>
    </section>
  );
}
