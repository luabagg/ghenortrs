// Vercel Edge: B2B lead email via Resend REST API.
// Required: RESEND_API_KEY, RESEND_TO_EMAIL
// Optional: RESEND_FROM (default noreply@ghenortrs.com.br)

import { parseB2BRegistration } from '../b2b/schemas';
import {
  buildSellerRegistrationHtml,
  getResendMailConfig,
  sendResendEmail,
} from './resend';

type B2BPayload = {
  empresa?: string;
  cnpj?: string;
  telefone?: string;
  email?: string;
  mensagem?: string;
};

export default async function handler(req: Request): Promise<Response> {
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });

  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  let raw: B2BPayload;
  try {
    raw = (await req.json()) as B2BPayload;
  } catch {
    return json({ error: 'Invalid request body' }, 400);
  }

  const parsed = parseB2BRegistration(raw);
  if (!parsed.ok) {
    return json({ error: 'Missing required fields' }, 400);
  }

  const { empresa, cnpj, telefone, email, mensagem } = parsed.data;

  const mail = getResendMailConfig();
  if (!mail.apiKey || !mail.toEmail) {
    return json({ error: 'Server configuration error' }, 500);
  }

  try {
    const result = await sendResendEmail({
      to: mail.toEmail,
      replyTo: email,
      subject: `[Lead B2B] ${empresa}`,
      html: buildSellerRegistrationHtml({
        companyName: empresa,
        cnpj,
        phone: telefone,
        email,
        message: mensagem,
      }),
    });

    if (!result.ok) {
      console.error('Resend error', result.reason);
      return json({ error: 'Email delivery failed' }, 500);
    }

    return json({ success: true });
  } catch (err) {
    console.error('Fetch error', err);
    return json({ error: 'Email delivery failed' }, 500);
  }
}
