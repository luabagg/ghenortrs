// Vercel Edge Function — B2B lead-capture email delivery via Resend REST API.
// Required env vars: RESEND_API_KEY, RESEND_TO_EMAIL
// Optional: RESEND_FROM (defaults to noreply@ghenortrs.com.br)

export const config = { runtime: 'edge' };

type B2BPayload = {
  empresa?: string;
  cnpj?: string;
  telefone?: string;
  email?: string;
  mensagem?: string;
};

function escHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildEmailHtml(p: Required<B2BPayload>): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>Lead B2B GHENO</title></head>
<body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111">
  <h2 style="color:#E81414;margin-bottom:4px">Novo lead B2B</h2>
  <p style="color:#666;margin-top:0">GHENO Componentes para MTB</p>
  <table style="width:100%;border-collapse:collapse;margin-top:16px">
    <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:bold;width:160px">Empresa</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${escHtml(p.empresa)}</td></tr>
    <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:bold">CNPJ</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${escHtml(p.cnpj)}</td></tr>
    <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:bold">Telefone / WhatsApp</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${escHtml(p.telefone)}</td></tr>
    <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:bold">E-mail</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${escHtml(p.email)}</td></tr>
    <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:bold;vertical-align:top">Necessidades</td><td style="padding:8px 12px;white-space:pre-wrap">${escHtml(p.mensagem)}</td></tr>
  </table>
  <p style="color:#888;font-size:12px;margin-top:24px">Submetido via formulário B2B em ghenortrs.com.br</p>
</body>
</html>`;
}

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

  const empresa = (raw.empresa ?? '').trim();
  const cnpj = (raw.cnpj ?? '').trim();
  const telefone = (raw.telefone ?? '').trim();
  const email = (raw.email ?? '').trim();
  const mensagem = (raw.mensagem ?? '').trim();

  if (!empresa || !email)
    return json({ error: 'Missing required fields' }, 400);

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.RESEND_TO_EMAIL;
  const fromEmail =
    process.env.RESEND_FROM ?? 'GHENO B2B <noreply@ghenortrs.com.br>';

  if (!apiKey || !toEmail) {
    return json({ error: 'Server configuration error' }, 500);
  }

  const payload = { empresa, cnpj, telefone, email, mensagem };

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: `[Lead B2B] ${empresa}`,
        html: buildEmailHtml(payload),
      }),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'unknown' }))) as {
        message?: string;
      };
      console.error('Resend error', res.status, err);
      return json({ error: 'Email delivery failed' }, 500);
    }

    return json({ success: true });
  } catch (err) {
    console.error('Fetch error', err);
    return json({ error: 'Email delivery failed' }, 500);
  }
}
