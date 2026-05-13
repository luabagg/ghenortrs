import { type ComponentProps } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import {
  type B2BFieldChangeHandler,
  type B2BFields,
  type SubmitStatus,
} from './b2b-form-types';

type B2BInputFieldProps = {
  error?: string;
  field: keyof Omit<B2BFields, 'mensagem'>;
  id: string;
  label: string;
  onFieldChange: B2BFieldChangeHandler;
  placeholder: string;
  type?: ComponentProps<typeof Input>['type'];
  value: string;
};

export function B2BInputField({
  error,
  field,
  id,
  label,
  onFieldChange,
  placeholder,
  type,
  value,
}: B2BInputFieldProps) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        aria-describedby={errorId}
        aria-invalid={!!error}
        id={id}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onFieldChange(field)}
      />
      {error && (
        <p className="text-xs text-accent" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

type B2BTextareaFieldProps = {
  id: string;
  label: string;
  onFieldChange: B2BFieldChangeHandler;
  placeholder: string;
  value: string;
};

export function B2BTextareaField({
  id,
  label,
  onFieldChange,
  placeholder,
  value,
}: B2BTextareaFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        placeholder={placeholder}
        rows={4}
        value={value}
        onChange={onFieldChange('mensagem')}
      />
    </div>
  );
}

export function B2BFormStatusAlert({ status }: { status: SubmitStatus }) {
  if (status !== 'no-config' && status !== 'error') return null;

  return (
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
  );
}
