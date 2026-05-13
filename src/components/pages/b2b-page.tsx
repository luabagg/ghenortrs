import { type ChangeEvent, type FormEvent, useState } from 'react';

import { PageIntro } from '@/components/landing/section-cards';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SectionBand } from '@/components/ui/section-band';
import { Textarea } from '@/components/ui/textarea';
import { trackFormEvent } from '@/lib/tracking';

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

export function B2BPage() {
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
    return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
