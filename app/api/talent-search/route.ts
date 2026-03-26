import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const rl = checkRateLimit(`talent:${ip}`, { limit: 5, windowSeconds: 3600 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })
    }

    const body = await req.json()
    const { company_name, role_needed, description, contact_name, phone, email } = body

    if (!company_name?.trim() || !role_needed?.trim() || !phone?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'Required fields missing.' }, { status: 400 })
    }

    const supabase = await createAdminClient()
    const { error } = await supabase.from('talent_inquiries').insert({
      company_name: company_name.trim(),
      role_needed: role_needed.trim(),
      description: description?.trim() || null,
      contact_name: contact_name?.trim() || company_name.trim(),
      phone: phone.trim(),
      email: email.toLowerCase().trim(),
      status: 'new',
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
