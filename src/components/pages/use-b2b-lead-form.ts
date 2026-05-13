import {
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
  useState,
} from 'react';

import {
  type B2BFieldChangeHandler,
  type B2BFields,
  type SubmitStatus,
} from '@/components/pages/b2b-form-types';
import { trackFormEvent } from '@/lib/tracking';

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

async function submitB2BLead(
  fields: B2BFields,
  setErrors: Dispatch<SetStateAction<Partial<B2BFields>>>,
  setStatus: Dispatch<SetStateAction<SubmitStatus>>,
) {
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

export function useB2BLeadForm() {
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

  const handleFieldChange: B2BFieldChangeHandler =
    (key: keyof B2BFields) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields((prev) => ({ ...prev, [key]: e.target.value }));
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (honeypot) {
      setStatus('success');
      return;
    }
    await submitB2BLead(fields, setErrors, setStatus);
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
