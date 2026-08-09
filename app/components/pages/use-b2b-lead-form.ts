import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useSubmit } from '@remix-run/react';

import { validateB2BFields } from '~/b2b/schemas';
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

/** B2B lead form client state. Validate client-side, then Remix action. */
export function useB2BLeadForm(options?: {
  actionData?: B2BActionData;
  isSubmitting?: boolean;
  onRegistered?: () => void;
}) {
  const submit = useSubmit();
  const [fields, setFields] = useState<B2BFields>(emptyFields);
  const [clientErrors, setClientErrors] = useState<Partial<B2BFields>>({});
  const [clientStatus, setClientStatus] = useState<SubmitStatus>('idle');
  const [honeypot, setHoneypot] = useState('');
  const trackedActionRef = useRef<B2BActionData | undefined>(undefined);

  const actionData = options?.actionData;
  const isSubmitting = options?.isSubmitting ?? false;
  const onRegistered = options?.onRegistered;

  const errors = actionData?.errors ?? clientErrors;
  const status: SubmitStatus = isSubmitting
    ? 'loading'
    : actionData?.errors
      ? 'idle'
      : (actionData?.status ?? clientStatus);

  useEffect(() => {
    if (!actionData || isSubmitting) return;
    if (trackedActionRef.current === actionData) return;
    trackedActionRef.current = actionData;

    if (actionData.errors) {
      trackFormEvent('b2b_form_validation_error', {
        form: 'b2b_lead',
        error_count: Object.keys(actionData.errors).length,
      });
      return;
    }

    if (actionData.status === 'success') {
      trackFormEvent('b2b_form_submit_success', {
        form: 'b2b_seller_register',
      });
      // Both success and partial-success persist a pending seller.
      onRegistered?.();
    } else if (actionData.status === 'partial-success') {
      trackFormEvent('b2b_form_submit_partial_success', {
        form: 'b2b_seller_register',
      });
      onRegistered?.();
    } else if (actionData.status === 'error') {
      trackFormEvent('b2b_form_submit_error', { form: 'b2b_seller_register' });
    }
  }, [actionData, isSubmitting, onRegistered]);

  const handleFieldChange: B2BFieldChangeHandler =
    (key: keyof B2BFields) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields((prev) => ({ ...prev, [key]: e.target.value }));
      if (clientErrors[key]) {
        setClientErrors((prev) => ({ ...prev, [key]: undefined }));
      }
    };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (honeypot.trim()) {
      setClientStatus('success');
      return;
    }

    trackFormEvent('b2b_form_submit_attempt', { form: 'b2b_lead' });
    const nextErrors = validateB2BFields(fields);
    if (Object.keys(nextErrors).length > 0) {
      setClientErrors(nextErrors);
      trackFormEvent('b2b_form_validation_error', {
        form: 'b2b_lead',
        error_count: Object.keys(nextErrors).length,
      });
      return;
    }

    setClientErrors({});
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
    message: actionData?.message,
    setHoneypot,
    status,
  };
}
