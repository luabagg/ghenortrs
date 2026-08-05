import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useActionData, useNavigation } from '@remix-run/react';

import { validateB2BFields } from '~/b2b/schemas';
import { B2BPage } from '~/components/pages/b2b-page';
import type {
  B2BActionData,
  B2BFields,
} from '~/components/pages/b2b-form-types';
import { buildSeoMetaForPath } from '~/lib/seo';
import registerHandler from '~/server/b2b-register';
import submitHandler from '~/server/b2b-submit';

export const meta: MetaFunction = () => buildSeoMetaForPath('/b2b');

export type { B2BActionData };

function fieldsFromFormData(formData: FormData): B2BFields {
  return {
    empresa: String(formData.get('empresa') ?? ''),
    cnpj: String(formData.get('cnpj') ?? ''),
    telefone: String(formData.get('telefone') ?? ''),
    email: String(formData.get('email') ?? ''),
    mensagem: String(formData.get('mensagem') ?? ''),
  };
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json<B2BActionData>({ status: 'error' }, { status: 405 });
  }

  const formData = await request.formData();
  const intent = String(formData.get('intent') ?? 'register');
  const honeypot = String(formData.get('website') ?? '');

  // Honeypot: pretend success.
  if (honeypot.trim()) {
    return json<B2BActionData>({ status: 'success' });
  }

  if (intent !== 'register') {
    return json<B2BActionData>({ status: 'error', message: 'intent_invalid' });
  }

  const fields = fieldsFromFormData(formData);
  const errors = validateB2BFields(fields);
  if (Object.keys(errors).length > 0) {
    return json<B2BActionData>({ status: 'idle', errors });
  }

  // Forward as JSON to existing register handler (Bearer passthrough).
  const registerRequest = new Request(request.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(request.headers.get('Authorization')
        ? { Authorization: request.headers.get('Authorization')! }
        : {}),
    },
    body: JSON.stringify({
      empresa: fields.empresa,
      cnpj: fields.cnpj,
      telefone: fields.telefone,
      email: fields.email,
      mensagem: fields.mensagem,
      website: honeypot,
    }),
  });

  const registerResponse = await registerHandler(registerRequest);
  const registerBody = (await registerResponse.json().catch(() => ({}))) as {
    success?: boolean;
    status?: string;
    error?: string;
    message?: string;
  };

  if (registerBody.error === 'server_not_configured') {
    // Legacy Resend-only fallback.
    const legacyRequest = new Request(request.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    });
    const legacyResponse = await submitHandler(legacyRequest);
    if (!legacyResponse.ok) {
      if (legacyResponse.status === 500) {
        const legacyBody = (await legacyResponse
          .json()
          .catch(() => ({}))) as { error?: string };
        if (legacyBody.error === 'Server configuration error') {
          return json<B2BActionData>({ status: 'no-config' });
        }
      }
      return json<B2BActionData>({ status: 'error' });
    }
    return json<B2BActionData>({ status: 'success' });
  }

  if (registerResponse.status === 409 && registerBody.error === 'already_approved') {
    return json<B2BActionData>({
      status: 'error',
      message: registerBody.message ?? 'already_approved',
      gateHint: 'login',
    });
  }

  if (registerBody.error && !registerBody.success) {
    return json<B2BActionData>({
      status: 'error',
      message: registerBody.error,
    });
  }

  return json<B2BActionData>({
    status: 'success',
    message: registerBody.message,
    gateHint: registerBody.status,
  });
}

export default function B2BRoute() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === 'submitting' &&
    navigation.formData?.get('intent') === 'register';

  return (
    <B2BPage actionData={actionData} isSubmitting={isSubmitting} />
  );
}
