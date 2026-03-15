import { Resend } from 'resend';
import { env } from '@/lib/env';

function getResend() {
  return new Resend(env.resend.apiKey);
}

export async function sendHighIntentAlert(toEmail: string, leadCount: number) {
  await getResend().emails.send({
    from: env.resend.fromEmail,
    to: toEmail,
    subject: `🔥 ${leadCount} new high-intent lead${leadCount > 1 ? 's' : ''} detected`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#1d4ed8">LeadPulse Alert</h2>
        <p>We found <strong>${leadCount} new high-intent lead${leadCount > 1 ? 's' : ''}</strong> matching your campaigns.</p>
        <a href="${env.app.url}/leads?intent=high"
           style="display:inline-block;background:#1d4ed8;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;margin-top:12px">
          View Leads
        </a>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(toEmail: string, firstName: string) {
  await getResend().emails.send({
    from: env.resend.fromEmail,
    to: toEmail,
    subject: `Welcome to LeadPulse, ${firstName}!`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#1d4ed8">Welcome aboard 🚀</h2>
        <p>Hi ${firstName}, your LeadPulse account is ready.</p>
        <p>Create your first campaign to start discovering high-intent leads from Reddit and X.</p>
        <a href="${env.app.url}/campaigns"
           style="display:inline-block;background:#1d4ed8;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;margin-top:12px">
          Create Campaign
        </a>
      </div>
    `,
  });
}
