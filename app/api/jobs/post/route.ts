import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const rl = checkRateLimit(`jobs-post:${ip}`, { limit: 5, windowSeconds: 3600 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })
    }

    const body = await req.json()
    const { title, company, location_text, job_type, salary_text, deadline, description, contact_name, contact_email, contact_phone } = body

    if (!title?.trim() || !contact_email?.trim() || !description?.trim()) {
      return NextResponse.json({ error: 'Title, description, and contact email are required.' }, { status: 400 })
    }

    const supabase = await createAdminClient()
    const { error } = await supabase.from('job_listings').insert({
      title: title.trim(),
      company: company?.trim() || null,
      location_text: location_text?.trim() || null,
      job_type: job_type || null,
      salary_text: salary_text?.trim() || null,
      deadline: deadline || null,
      description: description.trim(),
      contact_email: contact_email.toLowerCase().trim(),
      contact_phone: contact_phone?.trim() || null,
      status: 'draft',
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
