import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 subscribes per IP per 10 minutes
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
      honeypot = body?.website // honeypot field
    } else {
      const formData = await req.formData()
      email = formData.get('email')?.toString()
      honeypot = formData.get('website')?.toString()
    }

    // Honeypot: if the hidden field has a value, it's a bot
    if (honeypot) {
      return NextResponse.json({ success: true }) // silent reject
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    const supabase = await createAdminClient()
    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert({ email: email.toLowerCase().trim(), status: 'active' }, { onConflict: 'email' })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
