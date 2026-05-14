import { Link } from 'react-router-dom';

import { PageIntro } from '@/components/landing/section-cards';
import { Button } from '@/components/ui/button';
import { SectionBand } from '@/components/ui/section-band';

const CONTACT_PATHS = [
  {
    label: 'Compra no varejo',
    description: 'Acesse o catálogo público de produtos disponíveis.',
    action: 'Ver loja online',
    href: 'https://store.ghenortrs.com.br/produtos/',
  },
  {
    label: 'Revenda e oficina',
    description: 'Preencha o cadastro B2B para atendimento comercial.',
    action: 'Solicitar cadastro B2B',
    to: '/b2b',
  },
  {
    label: 'Instagram',
    description: 'Acompanhe novidades e contato social oficial.',
    action: 'Abrir Instagram',
    href: 'https://www.instagram.com/gheno_rtrs/',
  },
] as const;

export function ContactPage() {
  return (
    <div className="mx-auto grid w-full max-w-[90rem] gap-8 px-6 py-16 sm:px-10 sm:py-20 lg:px-16">
      <PageIntro
        description="Escolha o caminho mais direto para compra, revenda ou contato social. O contato não depende mais da página da Nuvemshop."
        eyebrow="CONTATO"
        title="Canais oficiais GHENO."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {CONTACT_PATHS.map((path) => (
          <SectionBand className="flex flex-col gap-5" key={path.label}>
            <div className="grid gap-2">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-on-primary/70">
                {path.label}
              </p>
              <p className="text-sm leading-6 text-on-primary/72">
                {path.description}
              </p>
            </div>
            <Button asChild variant={'to' in path ? 'primary' : 'secondary'}>
              {'to' in path ? (
                <Link to={path.to}>{path.action}</Link>
              ) : (
                <a href={path.href}>{path.action}</a>
              )}
            </Button>
          </SectionBand>
        ))}
      </div>
    </div>
  );
}
