import nodemailer from 'nodemailer';

/**
 * Mail goes out directly through the company's own Google account over SMTP —
 * no third-party mail service. SMTP_PASS is a Google *app password* (needs
 * 2-Step Verification on the account), never the account's real password.
 */
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const host = process.env.SMTP_HOST ?? 'smtp.gmail.com';
const port = Number(process.env.SMTP_PORT ?? 465);
const to = (process.env.MAIL_TO ?? 'sales-1@vntgroup.co.jp').split(',').map((s) => s.trim());

const transport =
  user && pass ? nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } }) : null;

export type MailResult = { delivered: boolean; reason?: string };

/**
 * Sends a notification to the office inbox. Without SMTP_USER / SMTP_PASS the
 * payload is only logged, and the caller reports the form as not sent, so an
 * enquiry is never silently dropped.
 */
export async function sendNotification(subject: string, rows: [string, string][], replyTo?: string): Promise<MailResult> {
  const text = rows.map(([label, value]) => `${label}: ${value}`).join('\n');

  if (!transport) {
    console.warn(`[mail] SMTP_USER / SMTP_PASS not set — not sending.\nSubject: ${subject}\n${text}`);
    return { delivered: false, reason: 'not-configured' };
  }

  try {
    await transport.sendMail({
      // Gmail only sends as the signed-in account, so the sender is SMTP_USER.
      from: { name: 'VNT GROUP', address: user! },
      to,
      subject,
      replyTo,
      text,
      html: renderHtml(subject, rows),
    });
    return { delivered: true };
  } catch (error) {
    console.error('[mail] send failed', error);
    return { delivered: false, reason: 'send-failed' };
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderHtml(subject: string, rows: [string, string][]) {
  const body = rows
    .map(
      ([label, value]) => `
        <tr>
          <th align="left" style="padding:10px 16px 10px 0;font:500 12px/1.6 system-ui;color:#8c8781;white-space:nowrap;vertical-align:top;letter-spacing:.08em;text-transform:uppercase">${escapeHtml(label)}</th>
          <td style="padding:10px 0;font:400 14px/1.7 system-ui;color:#111;white-space:pre-wrap">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join('');

  return `<div style="background:#f6f3ed;padding:32px">
    <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e8e2d7;padding:32px">
      <p style="margin:0 0 4px;font:400 11px/1 system-ui;letter-spacing:.3em;text-transform:uppercase;color:#b3924f">VNT GROUP</p>
      <h1 style="margin:0 0 24px;font:400 20px/1.4 Georgia,serif;color:#0a0a0b">${escapeHtml(subject)}</h1>
      <table style="width:100%;border-collapse:collapse;border-top:1px solid #e8e2d7">${body}</table>
    </div>
  </div>`;
}
