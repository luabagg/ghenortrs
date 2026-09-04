import { beforeEach, describe, expect, it, vi } from 'vitest';

import { deliverEmail } from './email-delivery';
import { getServerEnv } from './env';
import { sendResendEmail } from './resend';

vi.mock('./env', () => ({ getServerEnv: vi.fn() }));
vi.mock('./resend', () => ({ sendResendEmail: vi.fn() }));

const input = {
  label: 'test alert',
  to: 'team@example.test',
  subject: 'Subject',
  html: '<html></html>',
};

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(getServerEnv).mockReturnValue({
    resendApiKey: 'key',
  } as ReturnType<typeof getServerEnv>);
  vi.mocked(sendResendEmail).mockResolvedValue({ ok: true });
});

describe('deliverEmail', () => {
  it('sends and reports success', async () => {
    await expect(deliverEmail(input)).resolves.toBe('sent');
    expect(sendResendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'team@example.test' }),
    );
  });

  it('reports a skip when no API key is configured', async () => {
    vi.mocked(getServerEnv).mockReturnValue({
      resendApiKey: null,
    } as ReturnType<typeof getServerEnv>);

    await expect(deliverEmail(input)).resolves.toBe('skipped');
    expect(sendResendEmail).not.toHaveBeenCalled();
  });

  it('reports a skip when there is no recipient', async () => {
    await expect(deliverEmail({ ...input, to: null })).resolves.toBe('skipped');
    expect(sendResendEmail).not.toHaveBeenCalled();
  });

  /** The whole point: a rejected send must never look like a sent one. */
  it('reports a rejected send instead of swallowing it', async () => {
    vi.mocked(sendResendEmail).mockResolvedValue({
      ok: false,
      reason: 'Email delivery failed',
    });

    await expect(deliverEmail(input)).resolves.toBe('failed');
  });

  it('reports a thrown send without propagating it', async () => {
    vi.mocked(sendResendEmail).mockRejectedValue(new Error('network down'));

    await expect(deliverEmail(input)).resolves.toBe('failed');
  });
});
