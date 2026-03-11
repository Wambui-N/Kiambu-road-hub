import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 3 messages per IP per 10 minutes
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const rl = checkRateLimit(`contact:${ip}`, { limit: 3, windowSeconds: 600 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const body = await req.json()
    const { name, email, phone, subject, message, website } = body

    // Honeypot: if the hidden field has a value, it's a bot
    if (website) {
      return NextResponse.json({ success: true }) // silent reject
    }

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    if (message.trim().length < 10) {
      return NextResponse.json({ error: 'Message is too short' }, { status: 400 })
    }

    const supabase = await createAdminClient()
    const { error } = await supabase.from('contact_messages').insert({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || null,
      subject: subject?.trim() || null,
      message: message.trim(),
      status: 'new',
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
