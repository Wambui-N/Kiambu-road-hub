import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const rl = checkRateLimit(`submit-price:${ip}`, { limit: 10, windowSeconds: 3600 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many submissions.' }, { status: 429 })
    }

    const body = await req.json()
    const { store_name, item_name, price, unit, category } = body

    if (!store_name?.trim() || !item_name?.trim() || !price) {
      return NextResponse.json({ error: 'Store name, item, and price are required.' }, { status: 400 })
    }

    const supabase = await createAdminClient()
    const { error } = await supabase.from('price_submissions').insert({
      store_name: store_name.trim(),
      item_name: item_name.trim(),
      price: Number(price),
      unit: unit?.trim() || null,
      category: category || null,
      status: 'pending',
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
