import { Resend } from 'resend'
import { env } from '@/lib/env'

export const resendClient = new Resend(env.resend.apiKey)

export async function sendHighIntentAlert({
  to,
  userName,
  leadCount,
  campaignName,
}: {
  to: string
  userName: string
  leadCount: number
  campaignName: string
}) {
  return resendClient.emails.send({
    from: env.resend.fromEmail,
    to,
    subject: `🔥 ${leadCount} high-intent lead${leadCount > 1 ? 's' : ''} detected — LeadPulse`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">LeadPulse Alert 📊</h2>
        <p>Hi ${userName},</p>
        <p>We detected <strong>${leadCount} high-intent lead${leadCount > 1 ? 's' : ''}</strong> in your <strong>${campaignName}</strong> campaign.</p>
        <p>These people are actively looking for what you offer right now.</p>
        <a href="${env.app.url}/dashboard" style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:16px;">View Leads</a>
        <p style="color:#6b7280;font-size:12px;margin-top:32px;">LeadPulse &mdash; Catch the signal before your competitors do.</p>
      </div>
    `,
  })
}
