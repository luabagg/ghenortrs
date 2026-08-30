import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, Link, useActionData, useLoaderData } from '@remix-run/react';

import { PageIntro } from '~/components/landing/section-cards';
import { Button } from '~/components/ui/button';
import { buildNoIndexMeta } from '~/lib/seo';
import {
  confirmEmailSellerApproval,
  type ApplySellerStatusResult,
} from '~/server/admin-approve-seller';
import { getSellerByEmail } from '~/server/db/queries';
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
      token: string;
      email: string;
      companyName: string;
      status: string;
    }
  | { ok: false; error: string };

const ERROR_COPY: Record<string, string> = {
  unauthorized: 'Este link é inválido ou expirou.',
  token_used: 'Este link já foi usado.',
  server_not_configured: 'Servidor ainda não configurado.',
  approval_link_secret_not_configured: 'Segredo de aprovação não configurado.',
  seller_not_found: 'Cadastro não encontrado para este e-mail.',
  update_failed: 'Não foi possível atualizar o status.',
  invalid_request: 'Não foi possível confirmar a aprovação.',
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let env;
  try {
    env = getServerEnv();
  } catch {
    return json<LoaderData>({ ok: false, error: 'server_not_configured' });
  }
  if (!env.approvalLinkSecret) {
    return json<LoaderData>({
      ok: false,
      error: 'approval_link_secret_not_configured',
    });
  }

  const token = new URL(request.url).searchParams.get('token');
  const payload = verifyToken(token, env.approvalLinkSecret, 'approve-seller');
  if (!token || !payload || payload.status !== 'approved' || !payload.jti) {
    return json<LoaderData>({ ok: false, error: 'unauthorized' });
  }

  const seller = await getSellerByEmail(payload.email);
  if (!seller) {
    return json<LoaderData>({ ok: false, error: 'seller_not_found' });
  }

  return json<LoaderData>({
    ok: true,
    token,
    email: seller.email,
    companyName: seller.companyName,
    status: seller.status,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  if (formData.get('intent') !== 'confirm-approval') {
    return json<ApplySellerStatusResult>(
      { ok: false, error: 'invalid_request', httpStatus: 400 },
      { status: 400 },
    );
  }

  const token = formData.get('token');
  return json<ApplySellerStatusResult>(
    await confirmEmailSellerApproval(typeof token === 'string' ? token : null),
  );
};

export default function AdminApprovePage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  if (!data.ok) {
    return <ApprovalError error={data.error} />;
  }

  if (actionData && !actionData.ok) {
    return <ApprovalError error={actionData.error} />;
  }

  if (actionData?.ok) {
    return (
      <div className="mx-auto grid w-full max-w-2xl gap-8 py-10">
        <PageIntro
          description={`${actionData.companyName} (${actionData.email}) está aprovado. O lojista pode entrar em /b2b.`}
          eyebrow="Admin"
          title="Aprovação concluída."
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

  return (
    <div className="mx-auto grid w-full max-w-2xl gap-8 py-10">
      <PageIntro
        description={`Confirme a aprovação de ${data.companyName} (${data.email}). O cadastro permanece ${data.status} até a confirmação.`}
        eyebrow="Admin"
        title="Confirmar aprovação"
      />
      <Form method="post" className="flex flex-wrap gap-3">
        <input name="intent" type="hidden" value="confirm-approval" />
        <input name="token" type="hidden" value={data.token} />
        <Button type="submit">Confirmar aprovação</Button>
        <Button asChild variant="outline">
          <Link to="/">Cancelar</Link>
        </Button>
      </Form>
    </div>
  );
}

function ApprovalError({ error }: { error: string }) {
  return (
    <div className="mx-auto grid w-full max-w-2xl gap-8 py-10">
      <PageIntro
        description={
          ERROR_COPY[error] ?? 'Não foi possível concluir a aprovação.'
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
