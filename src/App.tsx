import { type FormEvent, useState } from 'react';

import { Link, NavLink, Outlet, Route, Routes } from 'react-router-dom';

import { PageIntro } from '@/components/landing/section-cards';
import { MobileMenuOverlay } from '@/components/navigation/mobile-menu-overlay';
import { ComponentsPage } from '@/components/pages/components-page';
import { HomePage } from '@/components/pages/home-page';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button-variants';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SectionBand } from '@/components/ui/section-band';
import { Textarea } from '@/components/ui/textarea';
import { trackFormEvent } from '@/lib/tracking';
import { cn } from '@/lib/utils';

const navigationLinkClassName = ({ isActive }: { isActive: boolean }) =>
  buttonVariants({
    size: 'nav',
    variant: isActive ? 'nav-active' : 'nav',
  });

function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      data-testid="app-shell"
      className="flex min-h-screen flex-col bg-background font-body text-primary"
    >
      <MobileMenuOverlay onClose={() => setMenuOpen(false)} open={menuOpen} />
      <header className="border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-4 px-6 py-5 sm:px-10 lg:px-16">
          <div>
            <img
              alt="GHENO"
              className="h-10 w-auto rounded-sm"
              height={250}
              src="/brand/logo-wide.png"
              width={500}
            />
            <p className="text-sm text-secondary">
              Componentes de alto desempenho para MTB
            </p>
          </div>
          <button
            aria-label="Abrir menu"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface-elevated text-primary sm:hidden"
            onClick={() => setMenuOpen(true)}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M4 6h16M4 12h16M4 18h16"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </button>
          <GlassPanel className="hidden p-2 sm:block">
            <nav aria-label="Principal" className="flex flex-wrap gap-3">
              <div className="group relative">
                <NavLink
                  className={({ isActive }) =>
                    cn(
                      navigationLinkClassName({ isActive }),
                      'flex items-center gap-1',
                    )
                  }
                  to="/componentes"
                >
                  Componentes
                  <svg
                    className="h-3 w-3 transition-transform duration-150 group-hover:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M19 9l-7 7-7-7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </NavLink>
                <div className="invisible absolute left-0 top-full z-50 mt-1 min-w-[11rem] rounded-panel border border-border bg-background/95 p-1 opacity-0 shadow-lg backdrop-blur-xl transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <Link
                    className="flex w-full rounded-sm px-3 py-2 text-sm text-secondary transition-colors hover:bg-surface hover:text-primary"
                    to="/componentes"
                  >
                    Ver todos os componentes
                  </Link>
                  <div className="my-1 border-t border-border" />
                  <a
                    className="flex w-full rounded-sm px-3 py-2 text-sm text-secondary transition-colors hover:bg-surface hover:text-primary"
                    href="https://store.ghenortrs.com.br/produtos/"
                  >
                    Pastilhas
                  </a>
                  <a
                    className="flex w-full rounded-sm px-3 py-2 text-sm text-secondary transition-colors hover:bg-surface hover:text-primary"
                    href="https://store.ghenortrs.com.br/contato/"
                  >
                    Cubos
                  </a>
                  <a
                    className="flex w-full rounded-sm px-3 py-2 text-sm text-secondary transition-colors hover:bg-surface hover:text-primary"
                    href="https://store.ghenortrs.com.br/contato/"
                  >
                    Aros
                  </a>
                  <a
                    className="flex w-full rounded-sm px-3 py-2 text-sm text-secondary transition-colors hover:bg-surface hover:text-primary"
                    href="https://store.ghenortrs.com.br/contato/"
                  >
                    Rotores
                  </a>
                </div>
              </div>
              <NavLink className={navigationLinkClassName} to="/#tecnologia">
                Tecnologia
              </NavLink>
              <NavLink className={navigationLinkClassName} to="/b2b">
                B2B
              </NavLink>
              <a
                className={buttonVariants({ size: 'nav', variant: 'nav' })}
                href="https://store.ghenortrs.com.br/"
              >
                Sobre a GHENO
              </a>
              <a
                className={buttonVariants({ size: 'nav', variant: 'nav' })}
                href="https://store.ghenortrs.com.br/contato/"
              >
                Contato
              </a>
            </nav>
          </GlassPanel>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-[90rem] flex-1 px-6 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-18">
        <div className="w-full">
          <Outlet />
        </div>
      </main>
      <footer
        aria-label="Rodapé"
        className="border-t border-border bg-background-soft"
        data-section="footer"
      >
        <div className="mx-auto max-w-[90rem] px-6 py-12 sm:px-10 lg:px-16">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
            <div className="flex flex-col gap-4">
              <img
                alt="GHENO"
                className="h-8 w-auto rounded-sm"
                height={250}
                loading="lazy"
                src="/brand/logo-wide.png"
                width={500}
              />
              <p className="max-w-xs text-sm leading-6 text-secondary">
                Componentes de alto desempenho para MTB. Pastilhas, cubos, aros
                e rotores desenvolvidos para uso intenso e real.
              </p>
              <div className="flex gap-3">
                <a
                  aria-label="Instagram GHENO"
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-secondary transition-colors hover:border-primary/40 hover:text-primary"
                  href="https://www.instagram.com/ghenortrs/"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  aria-label="YouTube GHENO"
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-secondary transition-colors hover:border-primary/40 hover:text-primary"
                  href="https://www.youtube.com/@ghenortrs"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                Loja B2B
              </p>
              <nav
                aria-label="Links loja B2B"
                className="flex flex-col gap-2.5"
              >
                <a
                  className="text-sm text-secondary transition-colors hover:text-primary"
                  href="https://store.ghenortrs.com.br/produtos/"
                >
                  Entrar na Loja
                </a>
                <a
                  className="text-sm text-secondary transition-colors hover:text-primary"
                  href="https://store.ghenortrs.com.br/contato/"
                >
                  Falar com comercial
                </a>
                <a
                  className="text-sm text-secondary transition-colors hover:text-primary"
                  href="https://store.ghenortrs.com.br/contato/"
                >
                  Pré-cadastro de revenda
                </a>
              </nav>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                Categorias
              </p>
              <nav
                aria-label="Links de categorias"
                className="flex flex-col gap-2.5"
              >
                <a
                  className="text-sm text-secondary transition-colors hover:text-primary"
                  href="https://store.ghenortrs.com.br/produtos/"
                >
                  Pastilhas
                </a>
                <a
                  className="text-sm text-secondary transition-colors hover:text-primary"
                  href="https://store.ghenortrs.com.br/contato/"
                >
                  Cubos
                </a>
                <a
                  className="text-sm text-secondary transition-colors hover:text-primary"
                  href="https://store.ghenortrs.com.br/contato/"
                >
                  Rotores
                </a>
                <a
                  className="text-sm text-secondary transition-colors hover:text-primary"
                  href="https://store.ghenortrs.com.br/contato/"
                >
                  Aros
                </a>
              </nav>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                Institucional
              </p>
              <nav
                aria-label="Links institucionais"
                className="flex flex-col gap-2.5"
              >
                <Link
                  className="text-sm text-secondary transition-colors hover:text-primary"
                  to="/"
                >
                  Sobre a GHENO
                </Link>
                <Link
                  className="text-sm text-secondary transition-colors hover:text-primary"
                  to="/"
                >
                  Tecnologia
                </Link>
                <a
                  className="text-sm text-secondary transition-colors hover:text-primary"
                  href="https://store.ghenortrs.com.br/contato/"
                >
                  Contato
                </a>
                <a
                  className="text-sm text-secondary transition-colors hover:text-primary"
                  href="https://store.ghenortrs.com.br/politica-de-privacidade/"
                >
                  Privacidade
                </a>
              </nav>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                Contato
              </p>
              <nav
                aria-label="Links de contato"
                className="flex flex-col gap-2.5"
              >
                <a
                  className="text-sm text-secondary transition-colors hover:text-primary"
                  href="https://store.ghenortrs.com.br/contato/"
                >
                  WhatsApp
                </a>
                <a
                  className="text-sm text-secondary transition-colors hover:text-primary"
                  href="https://www.instagram.com/ghenortrs/"
                >
                  Instagram
                </a>
                <a
                  className="text-sm text-secondary transition-colors hover:text-primary"
                  href="https://www.youtube.com/@ghenortrs"
                >
                  YouTube
                </a>
              </nav>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-2 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-secondary/60">
              © 2025 GHENO. Todos os direitos reservados.
            </p>
            <p className="text-xs text-secondary/40">
              Componentes de performance para MTB de verdade.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

type B2BFields = {
  empresa: string;
  cnpj: string;
  telefone: string;
  email: string;
  mensagem: string;
};

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error' | 'no-config';

function validateB2BFields(f: B2BFields): Partial<B2BFields> {
  const e: Partial<B2BFields> = {};
  if (!f.empresa.trim()) e.empresa = 'Nome da empresa é obrigatório.';
  const cnpjDig = f.cnpj.replace(/\D/g, '');
  if (!cnpjDig) e.cnpj = 'CNPJ é obrigatório.';
  else if (cnpjDig.length !== 14) e.cnpj = 'CNPJ deve ter 14 dígitos.';
  const telDig = f.telefone.replace(/\D/g, '');
  if (!telDig) e.telefone = 'Telefone/WhatsApp é obrigatório.';
  else if (telDig.length < 10 || telDig.length > 11)
    e.telefone = 'Informe um número com DDD (10 ou 11 dígitos).';
  if (!f.email.trim()) e.email = 'E-mail é obrigatório.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
    e.email = 'Informe um e-mail válido.';
  return e;
}

function B2BPage() {
  const [fields, setFields] = useState<B2BFields>({
    empresa: '',
    cnpj: '',
    telefone: '',
    email: '',
    mensagem: '',
  });
  const [errors, setErrors] = useState<Partial<B2BFields>>({});
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [honeypot, setHoneypot] = useState('');

  function set(key: keyof B2BFields) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields((prev) => ({ ...prev, [key]: e.target.value }));
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    };
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (honeypot) {
      setStatus('success');
      return;
    }
    trackFormEvent('b2b_form_submit_attempt', { form: 'b2b_lead' });
    const errs = validateB2BFields(fields);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      trackFormEvent('b2b_form_validation_error', {
        form: 'b2b_lead',
        error_count: Object.keys(errs).length,
      });
      return;
    }
    setErrors({});
    const submitUrl = import.meta.env.VITE_B2B_SUBMIT_URL as string | undefined;
    if (!submitUrl) {
      setStatus('no-config');
      return;
    }
    setStatus('loading');
    try {
      const res = await fetch(submitUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      if (!res.ok) throw new Error('submit_failed');
      setStatus('success');
      trackFormEvent('b2b_form_submit_success', { form: 'b2b_lead' });
    } catch {
      setStatus('error');
      trackFormEvent('b2b_form_submit_error', { form: 'b2b_lead' });
    }
  }

  if (status === 'success') {
    return (
      <section
        aria-live="polite"
        className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]"
      >
        <PageIntro
          description="Entraremos em contato em breve para alinhar mix, condições e atendimento."
          eyebrow="B2B"
          title="Atendimento para lojistas e oficinas"
        />
        <Card className="bg-surface px-0 py-0">
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M5 13l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <CardTitle>Pré-cadastro recebido!</CardTitle>
            <CardDescription>
              Recebemos seus dados. Nossa equipe vai entrar em contato em até 2
              dias úteis.
            </CardDescription>
          </CardHeader>
          <div className="px-6 pb-6">
            <Button asChild variant="secondary">
              <a href="https://store.ghenortrs.com.br/contato/">
                Falar via WhatsApp agora
              </a>
            </Button>
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
      <div className="grid gap-6">
        <PageIntro
          description="Converse com nossa equipe sobre mix, condições e disponibilidade. Sem formulário automatizado — atendimento direto."
          eyebrow="B2B"
          title="Atendimento para lojistas e oficinas"
        />
        <SectionBand className="grid gap-4">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-on-primary/70">
            O que você recebe
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                label: 'Mix consultivo',
                desc: 'Seleção técnica do produto certo para cada necessidade',
              },
              {
                label: 'Tabela de preços',
                desc: 'Condições e margens para canal de revenda',
              },
              {
                label: 'Suporte técnico',
                desc: 'Atendimento direto para dúvidas de compatibilidade',
              },
              {
                label: 'Política comercial',
                desc: 'Termos claros de garantia, troca e reposição',
              },
            ].map(({ label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
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
                <div>
                  <p className="text-sm font-semibold text-on-primary/90">
                    {label}
                  </p>
                  <p className="text-xs leading-5 text-on-primary/60">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionBand>
      </div>
      <Card className="bg-surface px-0 py-0">
        <CardHeader>
          <CardTitle>Pré-cadastro comercial</CardTitle>
          <CardDescription>
            Preencha os dados da sua empresa para iniciar o atendimento.
          </CardDescription>
        </CardHeader>
        <form
          className="grid gap-4 px-6 pb-6"
          noValidate
          onSubmit={handleSubmit}
        >
          {/* honeypot — bots fill this; humans don't see it */}
          <input
            aria-hidden="true"
            autoComplete="off"
            className="pointer-events-none absolute -left-[9999px] opacity-0"
            name="website"
            tabIndex={-1}
            type="text"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
          <div className="grid gap-2">
            <Label htmlFor="b2b-company">Empresa</Label>
            <Input
              aria-describedby={
                errors.empresa ? 'b2b-company-error' : undefined
              }
              aria-invalid={!!errors.empresa}
              id="b2b-company"
              placeholder="Nome da empresa"
              value={fields.empresa}
              onChange={set('empresa')}
            />
            {errors.empresa && (
              <p
                className="text-xs text-accent"
                id="b2b-company-error"
                role="alert"
              >
                {errors.empresa}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="b2b-cnpj">CNPJ</Label>
            <Input
              aria-describedby={errors.cnpj ? 'b2b-cnpj-error' : undefined}
              aria-invalid={!!errors.cnpj}
              id="b2b-cnpj"
              placeholder="00.000.000/0000-00"
              value={fields.cnpj}
              onChange={set('cnpj')}
            />
            {errors.cnpj && (
              <p
                className="text-xs text-accent"
                id="b2b-cnpj-error"
                role="alert"
              >
                {errors.cnpj}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="b2b-phone">Telefone / WhatsApp</Label>
            <Input
              aria-describedby={errors.telefone ? 'b2b-phone-error' : undefined}
              aria-invalid={!!errors.telefone}
              id="b2b-phone"
              placeholder="(11) 99999-9999"
              type="tel"
              value={fields.telefone}
              onChange={set('telefone')}
            />
            {errors.telefone && (
              <p
                className="text-xs text-accent"
                id="b2b-phone-error"
                role="alert"
              >
                {errors.telefone}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="b2b-email">E-mail</Label>
            <Input
              aria-describedby={errors.email ? 'b2b-email-error' : undefined}
              aria-invalid={!!errors.email}
              id="b2b-email"
              placeholder="contato@empresa.com.br"
              type="email"
              value={fields.email}
              onChange={set('email')}
            />
            {errors.email && (
              <p
                className="text-xs text-accent"
                id="b2b-email-error"
                role="alert"
              >
                {errors.email}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="b2b-needs">Necessidades comerciais</Label>
            <Textarea
              id="b2b-needs"
              placeholder="Conte o mix, volume e tipo de atendimento."
              rows={4}
              value={fields.mensagem}
              onChange={set('mensagem')}
            />
          </div>
          {(status === 'no-config' || status === 'error') && (
            <div
              className="rounded-panel border border-border bg-surface-elevated px-4 py-3"
              role="alert"
            >
              {status === 'no-config' ? (
                <p className="text-sm text-secondary">
                  Formulário ainda não configurado.{' '}
                  <a
                    className="font-semibold text-primary underline"
                    href="https://store.ghenortrs.com.br/contato/"
                  >
                    Fale via WhatsApp
                  </a>{' '}
                  para atendimento imediato.
                </p>
              ) : (
                <p className="text-sm text-secondary">
                  Erro ao enviar. Tente novamente ou{' '}
                  <a
                    className="font-semibold text-primary underline"
                    href="https://store.ghenortrs.com.br/contato/"
                  >
                    contate pelo WhatsApp
                  </a>
                  .
                </p>
              )}
            </div>
          )}
          <Button disabled={status === 'loading'} type="submit">
            {status === 'loading' ? 'Enviando...' : 'Enviar pré-cadastro'}
          </Button>
        </form>
      </Card>
    </section>
  );
}

function NotFoundPage() {
  return (
    <PageIntro
      description="Use a navegação principal para voltar às rotas existentes enquanto a arquitetura do MVP continua sendo construída."
      eyebrow="404"
      title="Página não encontrada"
    />
  );
}

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="componentes" element={<ComponentsPage />} />
        <Route path="b2b" element={<B2BPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
