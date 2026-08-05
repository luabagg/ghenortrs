import { Link } from '@remix-run/react';

import { PageIntro } from '@/components/landing/section-cards';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const CONTACT_PATHS = [
  {
    label: 'Compra no varejo',
    description: 'Acesse o catálogo público de produtos disponíveis.',
    action: 'Ver loja online',
    href: 'https://store.ghenortrs.com.br/produtos/',
    variant: 'outline' as const,
  },
  {
    label: 'Revenda e oficina',
    description: 'Preencha o cadastro B2B para atendimento comercial.',
    action: 'Solicitar cadastro B2B',
    to: '/b2b',
    variant: 'outline' as const,
  },
  {
    label: 'Instagram',
    description:
      'Acompanhe a GHENO rotors e envie uma mensagem pelo perfil oficial.',
    action: 'Abrir Instagram',
    href: 'https://www.instagram.com/gheno_rtrs/',
    variant: 'secondary' as const,
  },
] as const;

export function ContactPage() {
  return (
    <div className="grid gap-12" data-section="contact-page">
      <PageIntro
        description="Compre no catálogo online, solicite atendimento B2B ou fale com a GHENO rotors pelo Instagram."
        title="Compra, revenda e atendimento."
      />

      <div className="grid gap-5 md:grid-cols-3">
        {CONTACT_PATHS.map((path) => (
          <Card
            className="flex h-full flex-col rounded-md border-border bg-surface px-0 py-0"
            key={path.label}
          >
            <CardHeader className="flex flex-1 flex-col gap-4 px-5 py-6 sm:px-6 sm:py-7">
              <div className="grid gap-2">
                <CardTitle className="text-lg sm:text-xl">{path.label}</CardTitle>
                <CardDescription>
                  {path.description}
                </CardDescription>
              </div>
              <div className="mt-auto pt-2">
                <Button asChild className="w-fit" variant={path.variant}>
                  {'to' in path ? (
                    <Link to={path.to}>{path.action}</Link>
                  ) : (
                    <a href={path.href}>{path.action}</a>
                  )}
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
