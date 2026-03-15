import { Resend } from 'resend';
import { env } from '@/lib/env';

const resend = new Resend(env.resend.apiKey);

export async function sendHighIntentAlert(toEmail: string, leadCount: number) {
  await resend.emails.send({
    from: `LeadPulse Alerts <${env.resend.fromEmail}>`,
    to: toEmail,
    subject: `🔴 ${leadCount} new high-intent lead${leadCount > 1 ? 's' : ''} detected!`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;">
        <h1 style="font-size:24px;color:#7c3aed;">⚡ LeadPulse Alert</h1>
        <p style="font-size:16px;color:#374151;">
          You have <strong>${leadCount} new high-intent lead${leadCount > 1 ? 's' : ''}</strong> waiting for you.
        </p>
        <p style="font-size:14px;color:#6b7280;">
          These are people actively looking for a solution you might offer. Don&apos;t miss the window!
        </p>
        <a href="${env.app.url}/leads?intent=high"
          style="display:inline-block;margin-top:20px;padding:12px 28px;background:#7c3aed;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">
          View Leads Now →
        </a>
        <p style="margin-top:32px;font-size:12px;color:#9ca3af;">LeadPulse · Unsubscribe in settings</p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(toEmail: string, firstName: string) {
  await resend.emails.send({
    from: `LeadPulse <${env.resend.fromEmail}>`,
    to: toEmail,
    subject: `Welcome to LeadPulse, ${firstName}! 🚀`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;">
        <h1 style="font-size:24px;color:#7c3aed;">Welcome to ⚡ LeadPulse!</h1>
        <p style="font-size:16px;color:#374151;">Hi ${firstName},</p>
        <p style="font-size:14px;color:#6b7280;">
          You&apos;re all set. Create your first campaign and start discovering buyer-intent leads from Reddit and X in minutes.
        </p>
        <a href="${env.app.url}/campaigns"
          style="display:inline-block;margin-top:20px;padding:12px 28px;background:#7c3aed;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">
          Create Your First Campaign →
        </a>
      </div>
    `,
  });
}
