import { type FormEvent, useEffect, useState } from 'react';
import { useSubmit } from '@remix-run/react';

import type { SubmitStatus } from '@/components/pages/b2b-form-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type B2BLoginCardProps = {
  initialEmail?: string;
  isSubmitting?: boolean;
  message?: string;
  status?: SubmitStatus;
  onSwitchToRegister?: () => void;
};

// The countdown prevents duplicate requests while the first email arrives.
const RESEND_COOLDOWN_SECONDS = 60;

export function B2BLoginCard({
  initialEmail = '',
  isSubmitting = false,
  message,
  status = 'idle',
  onSwitchToRegister,
}: B2BLoginCardProps) {
  const submit = useSubmit();
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (secondsLeft <= 0) return undefined;
    const timeout = window.setTimeout(
      () => setSecondsLeft((previous) => previous - 1),
      1000,
    );
    return () => window.clearTimeout(timeout);
  }, [secondsLeft]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting || secondsLeft > 0) return;
    setSecondsLeft(RESEND_COOLDOWN_SECONDS);
    submit(event.currentTarget, { method: 'post' });
  }

  const isDisabled = isSubmitting || secondsLeft > 0;

  return (
    <form
      aria-label="Login comercial"
      className="grid gap-5 border border-border bg-surface p-5 sm:gap-6 sm:p-7"
      method="post"
      noValidate
      onSubmit={onSubmit}
    >
      <input name="intent" type="hidden" value="login" />
      <div className="grid gap-2">
        <Label htmlFor="b2b-login-email">E-mail comercial</Label>
        <Input
          autoComplete="email"
          defaultValue={initialEmail}
          disabled={isDisabled}
          id="b2b-login-email"
          name="email"
          placeholder="contato@empresa.com.br"
          required
          type="email"
        />
      </div>
      {message ? (
        <p
          className={
            status === 'error'
              ? 'text-sm text-accent'
              : 'text-sm text-secondary'
          }
          role={status === 'error' ? 'alert' : 'status'}
        >
          {message}
        </p>
      ) : null}
      <Button className="w-full sm:w-auto" disabled={isDisabled} type="submit">
        {isSubmitting
          ? 'Enviando…'
          : secondsLeft > 0
            ? `Solicitar novamente em ${secondsLeft}s`
            : 'Receber link de acesso'}
      </Button>
      {onSwitchToRegister ? (
        <button
          className="text-left text-sm font-bold text-primary underline"
          type="button"
          onClick={onSwitchToRegister}
        >
          Ainda não tenho cadastro
        </button>
      ) : null}
    </form>
  );
}
