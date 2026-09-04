import { beforeEach, describe, expect, it, vi } from 'vitest';

import { sendResendEmail } from './resend';

const originalEnv = { ...process.env };

function lastBody() {
  const call = vi.mocked(fetch).mock.calls[0];
  return JSON.parse(String((call[1] as RequestInit).body));
}

beforeEach(() => {
  vi.resetAllMocks();
  process.env = { ...originalEnv, RESEND_API_KEY: 'key' };
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response('{}', { status: 200 })),
  );
});

describe('sendResendEmail', () => {
  /**
   * These messages are same-domain and arrive from an external sender, which
   * already looks like spoofing. HTML with no text alternative made it worse.
   */
  it('sends a plain-text alternative beside the HTML', async () => {
    await sendResendEmail({
      to: 'team@example.test',
      subject: 'Pedido',
      html: '<h2>Solicitação</h2><p>Disco&nbsp;180mm<br>2 unidades</p>',
    });

    const body = lastBody();
    expect(body.html).toContain('<h2>');
    expect(body.text).toBe('Solicitação\nDisco 180mm\n2 unidades');
    expect(body.text).not.toContain('<');
  });

  it('normalises a single recipient into a list', async () => {
    await sendResendEmail({
      to: 'team@example.test',
      subject: 'x',
      html: '<p>y</p>',
    });

    expect(lastBody().to).toEqual(['team@example.test']);
  });

  it('refuses to send without an API key', async () => {
    delete process.env.RESEND_API_KEY;

    await expect(
      sendResendEmail({ to: 'a@b.test', subject: 'x', html: '<p>y</p>' }),
    ).resolves.toEqual({ ok: false, reason: 'RESEND_API_KEY not configured' });
    expect(fetch).not.toHaveBeenCalled();
  });
});
