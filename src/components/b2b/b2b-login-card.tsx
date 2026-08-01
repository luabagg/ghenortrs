import { type FormEvent, useState } from 'react';

import { requestMagicLink } from '@/b2b/supabase-browser';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'sent' | 'error'
  >('idle');
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
          ? 'Login B2B ainda não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.'
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
    <Card className="bg-surface px-0 py-0">
      <CardHeader>
        <CardTitle>Já tenho cadastro</CardTitle>
        <CardDescription>
          Entre com o e-mail aprovado pela GHENO. Sem senha — enviamos um link
          mágico.
        </CardDescription>
      </CardHeader>
      <form className="grid gap-4 px-6 pb-6" noValidate onSubmit={onSubmit}>
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
        <Button disabled={status === 'loading'} type="submit">
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
    </Card>
  );
}
