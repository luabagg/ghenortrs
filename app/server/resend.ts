import { getServerEnv } from './env';
import { escHtml } from './http';

type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
};

export async function sendResendEmail(
  input: SendEmailInput,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const env = getServerEnv();
  if (!env.resendApiKey) {
    return { ok: false, reason: 'RESEND_API_KEY not configured' };
  }

  const to = Array.isArray(input.to) ? input.to : [input.to];
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.resendFrom,
      to,
      reply_to: input.replyTo,
      subject: input.subject,
      html: input.html,
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => 'unknown');
    console.error('Resend error', res.status, err);
    return { ok: false, reason: 'Email delivery failed' };
  }
  return { ok: true };
}

export function buildSellerRegistrationHtml(input: {
  companyName: string;
  cnpj: string;
  phone: string;
  email: string;
  message: string;
  approveUrl?: string;
}): string {
  const approveBlock = input.approveUrl
    ? `<p style="margin-top:20px"><a href="${escHtml(input.approveUrl)}" style="background:#E81414;color:#fff;padding:10px 16px;text-decoration:none;border-radius:4px;font-weight:bold">Aprovar cadastro</a></p>`
    : '';

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>Cadastro B2B GHENO</title></head>
<body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111">
  <h2 style="color:#E81414;margin-bottom:4px">Novo cadastro B2B</h2>
  <p style="color:#666;margin-top:0">Aguardando aprovação manual.</p>
  <table style="width:100%;border-collapse:collapse;margin-top:16px">
    <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:bold;width:160px">Empresa</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${escHtml(input.companyName)}</td></tr>
    <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:bold">CNPJ</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${escHtml(input.cnpj)}</td></tr>
    <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:bold">Telefone / WhatsApp</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${escHtml(input.phone)}</td></tr>
    <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:bold">E-mail</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${escHtml(input.email)}</td></tr>
    <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:bold;vertical-align:top">Necessidades</td><td style="padding:8px 12px;white-space:pre-wrap">${escHtml(input.message)}</td></tr>
  </table>
  ${approveBlock}
  <p style="color:#888;font-size:12px;margin-top:24px">Submetido via /b2b em ghenortrs.com.br</p>
</body>
</html>`;
}

export function buildSellerApprovedHtml(input: {
  companyName: string;
  loginUrl: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>Acesso B2B liberado</title></head>
<body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111">
  <h2 style="color:#E81414">Acesso B2B liberado</h2>
  <p>Olá, ${escHtml(input.companyName)}.</p>
  <p>Seu cadastro comercial GHENO foi aprovado. Use o mesmo e-mail para entrar no catálogo B2B:</p>
  <p><a href="${escHtml(input.loginUrl)}" style="background:#E81414;color:#fff;padding:10px 16px;text-decoration:none;border-radius:4px;font-weight:bold">Acessar catálogo B2B</a></p>
  <p style="color:#666;font-size:14px">Não há checkout online. Após selecionar os itens, envie a solicitação de orçamento pela área B2B.</p>
</body>
</html>`;
}

export function buildQuoteRequestHtml(input: {
  companyName: string;
  email: string;
  phone: string;
  notes: string;
  items: Array<{
    name: string;
    sku: string | null;
    quantity: number;
    minQuantity: number;
  }>;
}): string {
  const rows = input.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee">${escHtml(item.name)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee">${escHtml(item.sku ?? '—')}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee">${item.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee">${item.minQuantity}</td>
        </tr>`,
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>Solicitação B2B</title></head>
<body style="font-family:sans-serif;max-width:720px;margin:0 auto;padding:24px;color:#111">
  <h2 style="color:#E81414">Solicitação de orçamento B2B</h2>
  <p><strong>${escHtml(input.companyName)}</strong> · ${escHtml(input.email)} · ${escHtml(input.phone)}</p>
  <table style="width:100%;border-collapse:collapse;margin-top:16px">
    <thead>
      <tr style="background:#f5f5f5;text-align:left">
        <th style="padding:8px 12px">Produto</th>
        <th style="padding:8px 12px">SKU</th>
        <th style="padding:8px 12px">Qtd</th>
        <th style="padding:8px 12px">Mín.</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <p style="margin-top:16px;white-space:pre-wrap">${escHtml(input.notes || 'Sem observações.')}</p>
</body>
</html>`;
}
