import { Resend } from 'resend'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const EMAIL_FROM = process.env.EMAIL_FROM || 'no-reply@deckntools.local'

export async function sendEmail({ to, subject, text, html }: { to: string; subject: string; text?: string; html?: string }) {
  if (!RESEND_API_KEY) {
    const payload = { from: EMAIL_FROM, to, subject, text, html }
    console.log('Email payload (no RESEND_API_KEY):', JSON.stringify(payload))
    return { mocked: true }
  }
  const resend = new Resend(RESEND_API_KEY)
  const result = await resend.emails.send({ from: EMAIL_FROM, to, subject, text, html })
  return result
}