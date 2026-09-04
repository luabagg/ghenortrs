// One place that actually reports a failed send.
//
// sendResendEmail returns a result instead of throwing, which is right: a
// saved quote must not be lost because an email bounced. But a caller that
// drops that result makes a missing email invisible, which is how quote
// notifications went unnoticed. Every send goes through here.

import { getServerEnv } from './env';
import { sendResendEmail } from './resend';

export type EmailOutcome = 'sent' | 'skipped' | 'failed';

export async function deliverEmail(input: {
  /** Short name for the logs, e.g. "b2b-quote team alert". */
  label: string;
  to: string | string[] | null;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<EmailOutcome> {
  const { resendApiKey } = getServerEnv();

  if (!resendApiKey) {
    console.warn(`${input.label}: not sent, RESEND_API_KEY is missing`);
    return 'skipped';
  }
  const recipients = (Array.isArray(input.to) ? input.to : [input.to]).filter(
    (entry): entry is string => Boolean(entry),
  );
  if (recipients.length === 0) {
    console.warn(`${input.label}: not sent, no recipient configured`);
    return 'skipped';
  }

  try {
    const result = await sendResendEmail({
      to: recipients,
      subject: input.subject,
      html: input.html,
      replyTo: input.replyTo,
    });
    if (!result.ok) {
      console.error(`${input.label}: send failed, ${result.reason}`);
      return 'failed';
    }
    return 'sent';
  } catch (error) {
    console.error(`${input.label}: send threw`, error);
    return 'failed';
  }
}
