import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { hashIp } from '@/lib/ip-hash'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const rl = checkRateLimit(`review-vote:${ip}`, { limit: 20, windowSeconds: 3600 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })
    }

    const { review_id } = await req.json()
    if (!review_id) {
      return NextResponse.json({ error: 'review_id is required.' }, { status: 400 })
    }

    const supabase = await createAdminClient()
    const ipHash = hashIp(ip)

    const { error: insertError } = await supabase
      .from('review_votes')
      .insert({ review_id, ip_hash: ipHash })

    if (insertError) {
      // Unique violation on (review_id, ip_hash) — already voted from this browser/IP.
      if (insertError.code === '23505') {
        const { data } = await supabase.from('reviews').select('helpful_count').eq('id', review_id).single()
        return NextResponse.json({ already: true, helpful_count: data?.helpful_count ?? null })
      }
      throw insertError
    }

    const { data, error } = await supabase.rpc('increment_review_helpful', { p_review_id: review_id })
    if (error) throw error

    return NextResponse.json({ already: false, helpful_count: data })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
