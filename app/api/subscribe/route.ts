import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const rl = checkRateLimit(`subscribe:${ip}`, { limit: 5, windowSeconds: 600 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    let email: string | undefined
    let honeypot: string | undefined

    const contentType = req.headers.get('content-type') ?? ''
    if (contentType.includes('application/json')) {
      const body = await req.json()
      email = body?.email
      honeypot = body?.website
    } else {
      const formData = await req.formData()
      email = formData.get('email')?.toString()
      honeypot = formData.get('website')?.toString()
    }

    if (honeypot) return NextResponse.json({ success: true })

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    const supabase = await createAdminClient()
    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert({ email: email.toLowerCase().trim(), status: 'active' }, { onConflict: 'email' })

    if (error) throw error

    // Send welcome email via Resend
    try {
      const resendKey = process.env.RESEND_API_KEY
      if (resendKey) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Kiambu Road Explorer <noreply@kiamburoad-hub.com>',
            to: email,
            subject: 'Welcome to the Kiambu Road Explorer Community!',
            html: `
              <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px">
                <h1 style="color:#1B6B3A;font-size:24px;margin-bottom:8px">Welcome to our Community!</h1>
                <p style="color:#555;font-size:15px;line-height:1.6">Thanks for subscribing to Kiambu Road Explorer!</p>
                <p style="color:#555;font-size:15px;line-height:1.6">
                  We'll keep you updated with the latest local business news, lifestyle content, and community announcements
                  from Kiambu Road.
                </p>
                <p style="color:#555;font-size:15px;line-height:1.6">Talk soon.</p>
                <div style="margin-top:28px;display:flex;gap:12px">
                  <a href="https://kiamburoad-hub.com" style="background:#1B6B3A;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">Back to Site</a>
                  <a href="https://wa.me/?text=Check%20out%20Kiambu%20Road%20Hub%20%E2%80%94%20the%20complete%20guide%20to%20businesses%20along%20Kiambu%20Road%3A%20https%3A%2F%2Fkiamburoad-hub.com" style="background:#f5f5f5;color:#333;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">Refer a Friend</a>
                </div>
              </div>
            `,
          }),
        })
      }
    } catch {
      // Email failure should not break the subscription
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
