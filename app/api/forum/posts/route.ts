import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'

const PAGE_SIZE = 20

export async function GET(req: NextRequest) {
  try {
    const before = req.nextUrl.searchParams.get('before')
    const supabase = await createClient()

    let query = supabase
      .from('forum_posts')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(PAGE_SIZE)

    if (before) query = query.lt('created_at', before)

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ posts: data ?? [] })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })
    }

    const rl = checkRateLimit(`forum-post:${user.id}`, { limit: 10, windowSeconds: 3600 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many posts. Please slow down.' }, { status: 429 })
    }

    const { post_type, title, body } = await req.json()

    if (post_type !== 'question' && post_type !== 'tip') {
      return NextResponse.json({ error: 'Invalid post_type.' }, { status: 400 })
    }
    if (!title?.trim() || title.length > 200) {
      return NextResponse.json({ error: 'Title is required (max 200 characters).' }, { status: 400 })
    }
    if (!body?.trim() || body.length > 5000) {
      return NextResponse.json({ error: 'Body is required (max 5000 characters).' }, { status: 400 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()

    const authorName = profile?.full_name?.trim() || user.email?.split('@')[0] || 'Community member'

    const { data, error } = await supabase
      .from('forum_posts')
      .insert({
        author_id: user.id,
        author_name: authorName,
        post_type,
        title: title.trim(),
        body: body.trim(),
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ post: data })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
