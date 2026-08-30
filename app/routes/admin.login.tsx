import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useActionData, useSearchParams } from '@remix-run/react';
import { useEffect, useState } from 'react';

import { isAdminEmail } from '~/server/admin-emails';
import { getServerEnv } from '~/server/env';
import { createSupabaseRequestClient } from '~/server/supabase-ssr.server';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { buildNoIndexMeta } from '~/lib/seo';

export const meta: MetaFunction = () =>
  buildNoIndexMeta(
    'Acesso administrativo | GHENO rotors',
    'Login interno da GHENO rotors.',
  );

type ActionResponse = {
  success: boolean;
  error?: string;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase, headers } = createSupabaseRequestClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user && isAdminEmail(user.email, getServerEnv().adminEmails)) {
    return redirect('/admin', { headers });
  }
  return new Response(null, { headers });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { supabase, headers } = createSupabaseRequestClient(request);
  const origin = new URL(request.url).origin;
  const formData = await request.formData();
  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase();

  if (!isAdminEmail(email, getServerEnv().adminEmails)) {
    return json<ActionResponse>(
      { success: false, error: 'Este e-mail não tem acesso administrativo.' },
      { headers },
    );
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/admin/login/callback`,
      shouldCreateUser: false,
    },
  });

  if (error) {
    return json<ActionResponse>(
      {
        success: false,
        error: 'Não foi possível enviar o link. Tente novamente.',
      },
      { headers },
    );
  }

  return json<ActionResponse>({ success: true }, { headers });
};

export default function AdminLoginPage() {
  const actionResponse = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  const forbidden = searchParams.get('error') === 'forbidden';
  const [isDisabled, setIsDisabled] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (!isDisabled) return undefined;
    setTimer(30);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isDisabled]);

  return (
    <div className="mx-auto grid w-full max-w-md gap-6 py-10">
      <div className="grid gap-2">
        <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-secondary">
          Admin
        </p>
        <h1 className="font-heading text-[30px] font-semibold tracking-[-0.03em]">
          Acesso interno
        </h1>
        <p className="text-sm text-secondary">
          Enviamos um link de acesso para o e-mail cadastrado em{' '}
          <code className="text-primary">ADMIN_EMAILS</code>. Crie esse usuário
          no Supabase Auth antes do primeiro login.
        </p>
      </div>

      {forbidden ? (
        <p className="text-sm text-accent" role="alert">
          Esta conta não é administrativa.
        </p>
      ) : null}

      {!actionResponse?.success ? (
        <Form
          method="post"
          className="grid gap-5 border border-border bg-surface p-5 sm:p-7"
          onSubmit={() => setIsDisabled(true)}
        >
          <div className="grid gap-2">
            <Label htmlFor="admin-email">E-mail</Label>
            <Input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="voce@ghenortrs.com.br"
              required
              disabled={isDisabled}
            />
          </div>
          <Button className="w-full" disabled={isDisabled} type="submit">
            {isDisabled ? `Aguarde (${timer}s)` : 'Receber link de acesso'}
          </Button>
          {actionResponse?.error ? (
            <p className="text-sm text-accent" role="alert">
              {actionResponse.error}
            </p>
          ) : null}
        </Form>
      ) : (
        <p className="text-sm text-secondary" role="status">
          Verifique o e-mail e abra o link neste dispositivo.
        </p>
      )}
    </div>
  );
}
