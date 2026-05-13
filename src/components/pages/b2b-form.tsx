import { type ChangeEvent, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export type B2BFields = {
  empresa: string;
  cnpj: string;
  telefone: string;
  email: string;
  mensagem: string;
};

export type SubmitStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error'
  | 'no-config';

type B2BFormProps = {
  errors: Partial<B2BFields>;
  fields: B2BFields;
  honeypot: string;
  status: SubmitStatus;
  onFieldChange: (
    key: keyof B2BFields,
  ) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onHoneypotChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
};

export function B2BForm({
  errors,
  fields,
  honeypot,
  status,
  onFieldChange,
  onHoneypotChange,
  onSubmit,
}: B2BFormProps) {
  return (
    <Card className="bg-surface px-0 py-0">
      <CardHeader>
        <CardTitle>Pré-cadastro comercial</CardTitle>
        <CardDescription>
          Preencha os dados da sua empresa para iniciar o atendimento.
        </CardDescription>
      </CardHeader>
      <form className="grid gap-4 px-6 pb-6" noValidate onSubmit={onSubmit}>
        {/* honeypot — bots fill this; humans don't see it */}
        <input
          aria-hidden="true"
          autoComplete="off"
          className="pointer-events-none absolute -left-[9999px] opacity-0"
          name="website"
          tabIndex={-1}
          type="text"
          value={honeypot}
          onChange={(e) => onHoneypotChange(e.target.value)}
        />
        <div className="grid gap-2">
          <Label htmlFor="b2b-company">Empresa</Label>
          <Input
            aria-describedby={errors.empresa ? 'b2b-company-error' : undefined}
            aria-invalid={!!errors.empresa}
            id="b2b-company"
            placeholder="Nome da empresa"
            value={fields.empresa}
            onChange={onFieldChange('empresa')}
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
            onChange={onFieldChange('cnpj')}
          />
          {errors.cnpj && (
            <p className="text-xs text-accent" id="b2b-cnpj-error" role="alert">
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
            onChange={onFieldChange('telefone')}
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
            onChange={onFieldChange('email')}
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
            onChange={onFieldChange('mensagem')}
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
  );
}
