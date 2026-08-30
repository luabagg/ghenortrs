import { type FormEvent, useState } from 'react';

import { requestMagicLink } from '@/b2b/supabase-browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type B2BLoginCardProps = {
  initialEmail?: string;
  onSwitchToRegister?: () => void;
};

export function B2BLoginCard({
  initialEmail = '',
  onSwitchToRegister,
}: B2BLoginCardProps) {
  const [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>(
    'idle',
  );
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus('loading');
    setMessage(null);
    const result = await requestMagicLink(email);
    if (!result.ok) {
      setStatus('error');
      setMessage(
        result.error === 'auth_unconfigured'
          ? 'Login B2B indisponível no momento. Use o cadastro ou fale com a GHENO rotors.'
          : 'Não foi possível enviar o link. Tente novamente.',
      );
      return;
    }
    setStatus('sent');
    setMessage(
      'Enviamos um link de acesso para o e-mail informado. Abra o e-mail neste dispositivo.',
    );
  }

  return (
    <form
      aria-label="Login comercial"
      className="grid gap-5 border border-border bg-surface p-5 sm:gap-6 sm:p-7"
      noValidate
      onSubmit={onSubmit}
    >
      <div className="grid gap-2">
        <Label htmlFor="b2b-login-email">E-mail comercial</Label>
        <Input
          autoComplete="email"
          id="b2b-login-email"
          placeholder="contato@empresa.com.br"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      {message ? (
        <p
          className={
            status === 'error'
              ? 'text-sm text-accent'
              : 'text-sm text-secondary'
          }
          role="status"
        >
          {message}
        </p>
      ) : null}
      <Button
        className="w-full sm:w-auto"
        disabled={status === 'loading'}
        type="submit"
      >
        {status === 'loading' ? 'Enviando…' : 'Receber link de acesso'}
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
