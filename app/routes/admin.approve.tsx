import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

import { PageIntro } from '~/components/landing/section-cards';
import { Button } from '~/components/ui/button';
import { buildNoIndexMeta } from '~/lib/seo';
import { applySellerStatus } from '~/server/admin-approve-seller';
import { getServerEnv } from '~/server/env';
import { verifyToken } from '~/server/signed-token';

export const meta: MetaFunction = () =>
  buildNoIndexMeta(
    'Aprovação B2B | GHENO rotors',
    'Confirmação de aprovação de lojista B2B.',
  );

type LoaderData =
  | {
      ok: true;
      email: string;
      companyName: string;
      status: string;
    }
  | { ok: false; error: string };

const ERROR_COPY: Record<string, string> = {
  unauthorized: 'Este link é inválido ou expirou.',
  server_not_configured: 'Servidor ainda não configurado.',
  admin_secret_not_configured: 'Segredo de aprovação não configurado.',
  seller_not_found: 'Cadastro não encontrado para este e-mail.',
  update_failed: 'Não foi possível atualizar o status.',
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let env;
  try {
    env = getServerEnv();
  } catch {
    return json<LoaderData>({ ok: false, error: 'server_not_configured' });
  }
  if (!env.adminApproveSecret) {
    return json<LoaderData>({
      ok: false,
      error: 'admin_secret_not_configured',
    });
  }

  const token = new URL(request.url).searchParams.get('token');
  const payload = verifyToken(
    token,
    env.adminApproveSecret,
    'approve-seller',
  );
  if (!payload) {
    return json<LoaderData>({ ok: false, error: 'unauthorized' });
  }

  const result = await applySellerStatus({
    email: payload.email,
    status: payload.status,
  });
  if (!result.ok) {
    return json<LoaderData>({ ok: false, error: result.error });
  }

  return json<LoaderData>({
    ok: true,
    email: result.email,
    companyName: result.companyName,
    status: result.status,
  });
};

export default function AdminApprovePage() {
  const data = useLoaderData<typeof loader>();

  if (!data.ok) {
    return (
      <div className="mx-auto grid w-full max-w-2xl gap-8 py-10">
        <PageIntro
          description={
            ERROR_COPY[data.error] ??
            'Não foi possível concluir a aprovação.'
          }
          eyebrow="Admin"
          title="Link inválido."
        />
        <Button asChild variant="outline">
          <Link to="/">Voltar ao início</Link>
        </Button>
      </div>
    );
  }

  const statusLabel =
    data.status === 'approved'
      ? 'aprovado'
      : data.status === 'rejected'
        ? 'rejeitado'
        : data.status;

  return (
    <div className="mx-auto grid w-full max-w-2xl gap-8 py-10">
      <PageIntro
        description={`${data.companyName} (${data.email}) está ${statusLabel}. O lojista pode entrar em /b2b.`}
        eyebrow="Admin"
        title="Ok."
      />
      <nav aria-label="Próximos passos" className="flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <Link to="/admin">Painel de lojistas</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="/">Início</Link>
        </Button>
      </nav>
    </div>
  );
}
