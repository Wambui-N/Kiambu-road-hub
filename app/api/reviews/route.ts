import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const rl = checkRateLimit(`review:${ip}`, { limit: 5, windowSeconds: 3600 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many submissions.' }, { status: 429 })
    }

    const body = await req.json()
    const { business_id, reviewer_name, rating, comment, aspect_ratings } = body

    if (!business_id || !reviewer_name?.trim() || !rating) {
      return NextResponse.json({ error: 'Business ID, name, and rating are required.' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5.' }, { status: 400 })
    }

    let finalRating = Number(rating)
    let aspectRatings: Record<string, number> | null = null

    if (aspect_ratings && typeof aspect_ratings === 'object') {
      const entries = Object.entries(aspect_ratings as Record<string, unknown>)
      const values: number[] = []
      for (const [, v] of entries) {
        const n = Number(v)
        if (!Number.isFinite(n) || n < 1 || n > 5) {
          return NextResponse.json({ error: 'Each aspect rating must be between 1 and 5.' }, { status: 400 })
        }
        values.push(n)
      }
      if (values.length > 0) {
        aspectRatings = Object.fromEntries(entries.map(([k, v]) => [k, Number(v)]))
        // Trust the client-computed average within rounding, but recompute
        // server-side rather than accept an arbitrary rating value outright.
        finalRating = Math.round((values.reduce((s, n) => s + n, 0) / values.length) * 10) / 10
      }
    }

    const supabase = await createAdminClient()
    const { error } = await supabase.from('reviews').insert({
      business_id,
      reviewer_name: reviewer_name.trim(),
      rating: finalRating,
      aspect_ratings: aspectRatings,
      comment: comment?.trim() || null,
      status: 'pending',
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
