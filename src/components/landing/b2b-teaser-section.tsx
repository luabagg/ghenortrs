import { B2BMediaCard } from '@/components/landing/section-cards';
import { Button } from '@/components/ui/button';
import { SectionBand } from '@/components/ui/section-band';

const B2B_VALUE_PROPS = [
  {
    label: 'Institucional e branding',
    desc: 'Materiais, identidade e presença de marca',
  },
  {
    label: 'Preços e condições',
    desc: 'Tabelas, margens e volumes para revendas',
  },
  {
    label: 'Logística e suporte',
    desc: 'Entrega, estoque e suporte pós-venda',
  },
  {
    label: 'Garantia e troca',
    desc: 'Políticas claras para o canal de revenda',
  },
] as const;

const B2B_MEDIA_ITEMS = [
  {
    imageAlt: 'Rider em prova de MTB diante do público',
    imageSrc: '/reference-images/b2b-race-context.jpg',
    title: 'Prova real',
  },
  {
    imageAlt: 'Rider em curva de trilha com terreno solto',
    imageSrc: '/reference-images/b2b-trail-validation.jpg',
    title: 'Demanda técnica',
  },
  {
    imageAlt: 'Detalhe de freio e rotor em bicicleta de MTB',
    imageSrc: '/reference-images/b2b-brake-detail.jpg',
    title: 'Mix consultivo',
  },
  {
    imageAlt:
      'Rotor GHENO instalado em bike de DH com freio Hayes Dominion, vista frontal',
    imageSrc: '/reference-images/rotor-installed-front.jpg',
    title: 'Rotor instalado',
  },
  {
    imageAlt:
      'Rotor GHENO instalado em bike de DH com freio Hayes Dominion, vista traseira',
    imageSrc: '/reference-images/rotor-installed-rear.jpg',
    title: 'Em campo',
  },
] as const;

function B2BTeaserIntro() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-on-primary/70">
        B2B
      </p>
      <h2 className="max-w-2xl font-heading text-4xl leading-none tracking-[-0.04em] sm:text-5xl">
        Para lojistas, oficinas e revendas que buscam performance real.
      </h2>
      <p className="mt-2 max-w-xl text-base leading-7 text-on-primary/80 sm:text-lg">
        Conversa direta sobre mix, disponibilidade e contexto técnico. Sem
        formulário automatizado, sem espera de sistema.
      </p>
    </div>
  );
}

function B2BValueGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {B2B_VALUE_PROPS.map(({ label, desc }) => (
        <div key={label} className="flex flex-col gap-1">
          <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-on-primary/90">
            {label}
          </p>
          <p className="text-xs leading-5 text-on-primary/60">{desc}</p>
        </div>
      ))}
    </div>
  );
}

function B2BTeaserActions() {
  return (
    <div className="flex flex-col items-start gap-3">
      <Button asChild className="w-fit min-w-0 px-6 shadow-[0_16px_34px_rgba(232,20,20,0.28)]">
        <a href="/b2b">Acessar produtos B2B →</a>
      </Button>
      <p className="max-w-md text-xs leading-5 text-on-primary/62">
        O acesso é exclusivo para revendedores cadastrados. Quem ainda não tem
        cadastro poderá solicitar aprovação na tela de login.
      </p>
    </div>
  );
}

function B2BMediaStrip() {
  return (
    <div
      aria-label="Contexto visual para atendimento B2B GHENO"
      className="-mx-6 flex max-w-[100vw] snap-x gap-4 overflow-x-auto px-6 pb-2 sm:mx-0 sm:grid sm:max-w-none sm:grid-cols-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:gap-3"
    >
      {B2B_MEDIA_ITEMS.map((item) => (
        <B2BMediaCard key={item.title} {...item} />
      ))}
    </div>
  );
}

export function B2BTeaserSection() {
  return (
    <SectionBand
      className="overflow-hidden px-0"
      data-section="b2b-teaser"
    >
      <div className="mx-auto grid w-full max-w-[90rem] gap-8 px-6 sm:px-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end lg:px-16">
        <div className="flex min-w-0 flex-col gap-6">
          <B2BTeaserIntro />
          <B2BValueGrid />
          <B2BTeaserActions />
        </div>
        <B2BMediaStrip />
      </div>
    </SectionBand>
  );
}
