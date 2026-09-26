import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'

const VALID_FREQUENCIES = ['one_time', 'weekly', 'monthly', 'annual']

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const rl = checkRateLimit(`donate:${ip}`, { limit: 5, windowSeconds: 3600 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })
    }

    const body = await req.json()
    const { donor_name, email, phone, amount, frequency, project, additional_instructions } = body

    if (!donor_name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
    }
    const parsedAmount = Number(amount)
    if (!parsedAmount || parsedAmount <= 0) {
      return NextResponse.json({ error: 'A valid donation amount is required.' }, { status: 400 })
    }
    if (!VALID_FREQUENCIES.includes(frequency)) {
      return NextResponse.json({ error: 'A valid frequency is required.' }, { status: 400 })
    }

    const supabase = await createAdminClient()
    const { error } = await supabase.from('donation_pledges').insert({
      donor_name: donor_name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || null,
      amount: parsedAmount,
      currency: 'KES',
      frequency,
      project: project?.trim() || null,
      additional_instructions: additional_instructions?.trim() || null,
      status: 'pending_payment',
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
