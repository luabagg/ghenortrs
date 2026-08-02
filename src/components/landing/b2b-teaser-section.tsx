import { Button } from '@/components/ui/button';
import { SectionBand } from '@/components/ui/section-band';

function B2BTeaserIntro() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-on-primary/55">
        B2B
      </p>
      <h2 className="max-w-2xl text-balance font-heading text-4xl leading-none tracking-[-0.04em] sm:text-5xl">
        Atendimento comercial para oficinas e revendas.
      </h2>
      <p className="max-w-xl text-justify text-base leading-7 text-on-primary/72 sm:text-lg">
        Peças que o rider pede de novo. Cadastre sua loja e compre direto com a
        GHENO rotors.
      </p>
    </div>
  );
}

function B2BTeaserActions() {
  return (
    <Button
      asChild
      className="w-fit min-w-0 border-accent bg-transparent px-6 text-on-primary hover:bg-accent hover:text-on-accent"
      variant="outline"
    >
      <a href="/b2b">Solicitar cadastro B2B</a>
    </Button>
  );
}

export function B2BTeaserSection() {
  return (
    <SectionBand className="overflow-hidden px-0" data-section="b2b-teaser">
      <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-6 px-6 sm:px-10 lg:px-16">
        <B2BTeaserIntro />
        <B2BTeaserActions />
      </div>
    </SectionBand>
  );
}
