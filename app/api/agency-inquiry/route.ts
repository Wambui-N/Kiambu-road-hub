import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const rl = checkRateLimit(`agency-inquiry:${ip}`, { limit: 3, windowSeconds: 3600 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })
    }

    const body = await req.json()
    const { service_id, name, email, phone, message } = body

    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: 'All required fields must be filled.' }, { status: 400 })
    }

    const supabase = await createAdminClient()
    const { error } = await supabase.from('agency_service_inquiries').insert({
      service_id: service_id || null,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      message: message?.trim() || null,
      status: 'new',
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
