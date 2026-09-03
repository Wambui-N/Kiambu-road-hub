import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'

const DOCTOR_EMAIL = 'murailincoln@gmail.com'
const CC_EMAIL = 'info@kiamburoad.com'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const rl = checkRateLimit(`dear-doctor:${ip}`, { limit: 5, windowSeconds: 600 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const body = await req.json()
    const { service_type, age, gender, county, marital_status, message } = body

    if (service_type !== 'consultation' && service_type !== 'counselling') {
      return NextResponse.json({ error: 'Invalid service type.' }, { status: 400 })
    }
    const ageNum = Number(age)
    if (!Number.isInteger(ageNum) || ageNum < 1 || ageNum > 120) {
      return NextResponse.json({ error: 'Please enter a valid age.' }, { status: 400 })
    }
    if (gender !== 'male' && gender !== 'female') {
      return NextResponse.json({ error: 'Please select a gender.' }, { status: 400 })
    }
    if (service_type === 'counselling' && marital_status !== 'single' && marital_status !== 'married') {
      return NextResponse.json({ error: 'Please select a marital status.' }, { status: 400 })
    }
    if (!message?.trim() || message.trim().length < 10) {
      return NextResponse.json({ error: 'Please share a bit more detail.' }, { status: 400 })
    }

    const supabase = await createAdminClient()
    const { data: record, error } = await supabase
      .from('doctor_consultations')
      .insert({
        service_type,
        age: ageNum,
        gender,
        county: service_type === 'consultation' ? county?.trim() || null : null,
        marital_status: service_type === 'counselling' ? marital_status : null,
        message: message.trim(),
      })
      .select()
      .single()

    if (error) throw error

    let emailSent = false
    try {
      const resendKey = process.env.RESEND_API_KEY
      if (resendKey) {
        const isConsultation = service_type === 'consultation'
        const subject = isConsultation ? 'New Dear Doctor consultation request' : 'New Counselling Services request'
        const salutation = isConsultation ? 'Hello Doctor' : 'Dear Counsellor'

        const detailRows = [
          ['Age', String(ageNum)],
          ['Gender', gender === 'male' ? 'Male' : 'Female'],
          ...(isConsultation ? [['County of residence', county?.trim() || '—']] : []),
          ...(!isConsultation ? [['Marital status', marital_status === 'married' ? 'Married' : 'Single']] : []),
        ]

        const html = `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
            <h2 style="color:#1B6B3A;margin-bottom:4px">${subject}</h2>
            <p style="color:#888;font-size:12px;margin-top:0">via Kiambu Road Explorer — ${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0">
              ${detailRows.map(([label, value]) => `
                <tr>
                  <td style="padding:6px 0;color:#666;font-size:13px;width:160px;vertical-align:top">${label}</td>
                  <td style="padding:6px 0;color:#111;font-size:13px;font-weight:600">${escapeHtml(value)}</td>
                </tr>
              `).join('')}
            </table>
            <p style="color:#666;font-size:13px;margin-bottom:4px">${salutation}:</p>
            <div style="background:#f7f7f7;border-radius:8px;padding:16px;color:#111;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(message.trim())}</div>
            <p style="color:#aaa;font-size:11px;margin-top:20px">Record ID: ${record.id}</p>
          </div>
        `

        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Kiambu Road Explorer <noreply@kiamburoad.com>',
            to: DOCTOR_EMAIL,
            cc: CC_EMAIL,
            subject,
            html,
          }),
        })
        emailSent = res.ok
      }
    } catch {
      // Submission is already saved — email failure shouldn't fail the request
    }

    if (emailSent) {
      await supabase.from('doctor_consultations').update({ email_sent: true }).eq('id', record.id)
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
