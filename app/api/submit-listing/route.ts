import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 3 submissions per IP per hour
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const rl = checkRateLimit(`submit-listing:${ip}`, { limit: 3, windowSeconds: 3600 })
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const {
      business_name, category_name, subcategory_name, location_text,
      phone, whatsapp, email, website, description,
      opening_hours_text, price_range, source_note,
      url, // honeypot
    } = body

    // Honeypot: bots fill hidden fields
    if (url) {
      return NextResponse.json({ success: true }) // silent reject
    }

    // Required field validation
    if (!business_name?.trim()) {
      return NextResponse.json({ error: 'Business name is required' }, { status: 400 })
    }
    if (!phone?.trim()) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
    }
    if (!description?.trim() || description.trim().length < 20) {
      return NextResponse.json({ error: 'Please provide a description of at least 20 characters' }, { status: 400 })
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const supabase = await createAdminClient()
    const { error } = await supabase.from('business_submissions').insert({
      business_name: business_name.trim(),
      category_name: category_name?.trim() || null,
      subcategory_name: subcategory_name?.trim() || null,
      location_text: location_text?.trim() || null,
      phone: phone.trim(),
      whatsapp: whatsapp?.trim() || null,
      email: email?.toLowerCase().trim() || null,
      website: website?.trim() || null,
      description: description.trim(),
      opening_hours_text: opening_hours_text?.trim() || null,
      price_range: price_range || null,
      source_note: source_note || null,
      status: 'new',
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
