import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 3 travel inquiries per IP per 10 minutes
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const rl = checkRateLimit(`travel:${ip}`, { limit: 3, windowSeconds: 600 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const body = await req.json()
    const { name, email, phone, travel_type, travel_dates, people_count, budget_range, message, website } = body

    // Honeypot
    if (website) {
      return NextResponse.json({ success: true })
    }

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    const supabase = await createAdminClient()
    const { error } = await supabase.from('travel_inquiries').insert({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || null,
      travel_type: travel_type || null,
      travel_dates: travel_dates?.trim() || null,
      people_count: people_count ? parseInt(people_count) : null,
      budget_range: budget_range || null,
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
