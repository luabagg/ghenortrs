import { formatCentsToBRL } from './br-money';
import { escHtml } from './http';

type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
};

/** Resend-only config — email delivery does not require the database. */
export function getResendMailConfig(): {
  apiKey: string | null;
  toEmail: string | null;
  from: string;
} {
  const apiKey = process.env.RESEND_API_KEY?.trim() || null;
  const toEmail = process.env.RESEND_TO_EMAIL?.trim() || null;
  const from =
    process.env.RESEND_FROM?.trim() || 'GHENO B2B <noreply@ghenortrs.com.br>';
  return { apiKey, toEmail, from };
}

type EmailShellInput = {
  title: string;
  maxWidth?: string;
  content: string;
  footer?: string;
};

function buildEmailShell(input: EmailShellInput): string {
  const maxWidth = input.maxWidth ?? '600px';
  const footer = input.footer
    ? `<p style="color:#888;font-size:12px;margin-top:24px">${input.footer}</p>`
    : '';

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>${escHtml(input.title)}</title></head>
<body style="font-family:sans-serif;max-width:${maxWidth};margin:0 auto;padding:24px;color:#111">
  ${input.content}
  ${footer}
</body>
</html>`;
}

function buildLabelValueTable(
  rows: Array<{
    label: string;
    value: string;
    labelStyle?: string;
    valueStyle?: string;
  }>,
): string {
  const trs = rows
    .map(
      (row) =>
        `<tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:bold;width:160px;${row.labelStyle ?? ''}">${escHtml(row.label)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;${row.valueStyle ?? ''}">${row.value}</td></tr>`,
    )
    .join('');

  return `<table style="width:100%;border-collapse:collapse;margin-top:16px">${trs}</table>`;
}

function buildPrimaryButton(href: string, label: string): string {
  return `<p style="margin-top:20px"><a href="${escHtml(href)}" style="background:#E81414;color:#fff;padding:10px 16px;text-decoration:none;border-radius:4px;font-weight:bold">${escHtml(label)}</a></p>`;
}

export async function sendResendEmail(
  input: SendEmailInput,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const mail = getResendMailConfig();
  if (!mail.apiKey) {
    return { ok: false, reason: 'RESEND_API_KEY not configured' };
  }

  const to = Array.isArray(input.to) ? input.to : [input.to];
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${mail.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: mail.from,
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
    ? buildPrimaryButton(input.approveUrl, 'Aprovar cadastro')
    : '';

  const content = `
  <h2 style="color:#E81414;margin-bottom:4px">Novo cadastro B2B</h2>
  <p style="color:#666;margin-top:0">Aguardando aprovação manual.</p>
  ${buildLabelValueTable([
    { label: 'Empresa', value: escHtml(input.companyName) },
    { label: 'CNPJ', value: escHtml(input.cnpj) },
    { label: 'Telefone / WhatsApp', value: escHtml(input.phone) },
    { label: 'E-mail', value: escHtml(input.email) },
    {
      label: 'Necessidades',
      value: escHtml(input.message),
      labelStyle: 'vertical-align:top',
      valueStyle: 'white-space:pre-wrap',
    },
  ])}
  ${approveBlock}`;

  return buildEmailShell({
    title: 'Cadastro B2B GHENO',
    content,
    footer: 'Submetido via /b2b em ghenortrs.com.br',
  });
}

export function buildSellerApprovedHtml(input: {
  companyName: string;
  loginUrl: string;
}): string {
  const content = `
  <h2 style="color:#E81414">Acesso B2B liberado</h2>
  <p>Olá, ${escHtml(input.companyName)}.</p>
  <p>Seu cadastro comercial GHENO foi aprovado. Use o mesmo e-mail para entrar no catálogo B2B:</p>
  <p><a href="${escHtml(input.loginUrl)}" style="background:#E81414;color:#fff;padding:10px 16px;text-decoration:none;border-radius:4px;font-weight:bold">Acessar catálogo B2B</a></p>
  <p style="color:#666;font-size:14px">Não há checkout online. Após selecionar os itens, envie a solicitação de orçamento pela área B2B.</p>`;

  return buildEmailShell({
    title: 'Acesso B2B liberado',
    content,
  });
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
    unitPriceCents: number;
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
          <td style="padding:8px 12px;border-bottom:1px solid #eee">${escHtml(formatCentsToBRL(item.unitPriceCents))}</td>
        </tr>`,
    )
    .join('');

  const content = `
  <h2 style="color:#E81414">Solicitação de orçamento B2B</h2>
  <p><strong>${escHtml(input.companyName)}</strong> · ${escHtml(input.email)} · ${escHtml(input.phone)}</p>
  <table style="width:100%;border-collapse:collapse;margin-top:16px">
    <thead>
      <tr style="background:#f5f5f5;text-align:left">
        <th style="padding:8px 12px">Produto</th>
        <th style="padding:8px 12px">SKU</th>
        <th style="padding:8px 12px">Qtd</th>
        <th style="padding:8px 12px">Mín.</th>
        <th style="padding:8px 12px">Preço un.</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <p style="margin-top:16px;white-space:pre-wrap">${escHtml(input.notes || 'Sem observações.')}</p>`;

  return buildEmailShell({
    title: 'Solicitação B2B',
    maxWidth: '720px',
    content,
  });
}
