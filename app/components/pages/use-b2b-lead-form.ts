import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useState,
} from 'react';
import { useSubmit } from '@remix-run/react';

import {
  type B2BActionData,
  type B2BFieldChangeHandler,
  type B2BFields,
  type SubmitStatus,
} from '~/components/pages/b2b-form-types';
import { trackFormEvent } from '~/lib/tracking';

const emptyFields: B2BFields = {
  empresa: '',
  cnpj: '',
  telefone: '',
  email: '',
  mensagem: '',
};

export function validateB2BFields(f: B2BFields): Partial<B2BFields> {
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

/**
 * Client state for the B2B lead form.
 * Client validates first; Remix route action handles server submit.
 */
export function useB2BLeadForm(options?: {
  actionData?: B2BActionData;
  isSubmitting?: boolean;
  onRegistered?: () => void;
}) {
  const submit = useSubmit();
  const [fields, setFields] = useState<B2BFields>(emptyFields);
  const [errors, setErrors] = useState<Partial<B2BFields>>({});
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [honeypot, setHoneypot] = useState('');

  useEffect(() => {
    if (options?.isSubmitting) {
      setStatus('loading');
      return;
    }

    if (!options?.actionData) return;

    if (options.actionData.errors) {
      setErrors(options.actionData.errors);
      setStatus('idle');
      trackFormEvent('b2b_form_validation_error', {
        form: 'b2b_lead',
        error_count: Object.keys(options.actionData.errors).length,
      });
      return;
    }

    setErrors({});
    setStatus(options.actionData.status);

    if (options.actionData.status === 'success') {
      trackFormEvent('b2b_form_submit_success', {
        form: 'b2b_seller_register',
      });
      options.onRegistered?.();
    } else if (options.actionData.status === 'error') {
      trackFormEvent('b2b_form_submit_error', { form: 'b2b_seller_register' });
    } else if (options.actionData.status === 'no-config') {
      setStatus('no-config');
    }
  }, [options?.actionData, options?.isSubmitting, options?.onRegistered]);

  const handleFieldChange: B2BFieldChangeHandler =
    (key: keyof B2BFields) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields((prev) => ({ ...prev, [key]: e.target.value }));
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (honeypot.trim()) {
      setStatus('success');
      return;
    }

    trackFormEvent('b2b_form_submit_attempt', { form: 'b2b_lead' });
    const nextErrors = validateB2BFields(fields);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      trackFormEvent('b2b_form_validation_error', {
        form: 'b2b_lead',
        error_count: Object.keys(nextErrors).length,
      });
      return;
    }

    setErrors({});
    const formData = new FormData(event.currentTarget);
    formData.set('intent', 'register');
    submit(formData, { method: 'post' });
  }

  return {
    errors,
    fields,
    handleFieldChange,
    handleSubmit,
    honeypot,
    setHoneypot,
    status,
  };
}
