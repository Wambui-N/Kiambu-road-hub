import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const rl = checkRateLimit(`ad-inquiry:${ip}`, { limit: 3, windowSeconds: 3600 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })
    }

    const body = await req.json()
    const { business_name, contact_person, phone, email, message } = body

    if (!business_name?.trim() || !contact_person?.trim() || !phone?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'All required fields must be filled.' }, { status: 400 })
    }

    const supabase = await createAdminClient()
    const { error } = await supabase.from('ad_inquiries').insert({
      business_name: business_name.trim(),
      contact_person: contact_person.trim(),
      phone: phone.trim(),
      email: email.toLowerCase().trim(),
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
