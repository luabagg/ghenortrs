import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, Link, useActionData, useLoaderData } from '@remix-run/react';

import { PageIntro } from '~/components/landing/section-cards';
import { Button } from '~/components/ui/button';
import { buildNoIndexMeta } from '~/lib/seo';
import {
  inspectSellerCatalogAccessToken,
  redeemSellerCatalogAccessToken,
} from '~/server/seller-access-link';

export const meta: MetaFunction = () =>
  buildNoIndexMeta(
    'Confirmar acesso B2B | GHENO rotors',
    'Confirmação segura para entrar no catálogo comercial GHENO rotors.',
  );

type LoaderData =
  | { ok: true; token: string; companyName: string }
  | { ok: false; error: string };

type ActionData = { ok: false; error: string };

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const token = new URL(request.url).searchParams.get('token');
  try {
    const result = await inspectSellerCatalogAccessToken(token);
    if (!result.ok) return json<LoaderData>(result, { status: 400 });
    return json<LoaderData>({ ...result, token: token! });
  } catch (error) {
    console.error('catalog access-link inspection failed', error);
    return json<LoaderData>(
      { ok: false, error: 'request_failed' },
      { status: 500 },
    );
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  if (formData.get('intent') !== 'confirm-access') {
    return json<ActionData>(
      { ok: false, error: 'invalid_request' },
      { status: 400 },
    );
  }

  const token = formData.get('token');
  try {
    const result = await redeemSellerCatalogAccessToken(
      typeof token === 'string' ? token : null,
    );
    if (!result.ok) {
      return json<ActionData>(result, { status: 400 });
    }
    return redirect(result.actionLink);
  } catch (error) {
    console.error('catalog access-link redemption failed', error);
    return json<ActionData>(
      { ok: false, error: 'request_failed' },
      { status: 500 },
    );
  }
};

export default function B2BAccessPage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  if (!data.ok || actionData?.ok === false) {
    return <AccessError />;
  }

  return (
    <div className="mx-auto grid w-full max-w-2xl gap-8 py-10">
      <PageIntro
        description={`Confirme para entrar como ${data.companyName}. Esta etapa protege seu link de acesso.`}
        eyebrow="B2B"
        title="Confirmar acesso"
      />
      <Form method="post">
        <input name="intent" type="hidden" value="confirm-access" />
        <input name="token" type="hidden" value={data.token} />
        <Button type="submit">Entrar no catálogo</Button>
      </Form>
    </div>
  );
}

function AccessError() {
  return (
    <div className="mx-auto grid w-full max-w-2xl gap-8 py-10">
      <PageIntro
        description="Este link é inválido, expirou ou já foi usado. Solicite um novo link de acesso."
        eyebrow="B2B"
        title="Link indisponível"
      />
      <Button asChild variant="outline">
        <Link to="/b2b">Solicitar novo link</Link>
      </Button>
    </div>
  );
}
