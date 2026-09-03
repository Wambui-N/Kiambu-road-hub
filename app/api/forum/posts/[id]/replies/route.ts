import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('forum_replies')
      .select('*')
      .eq('post_id', id)
      .eq('status', 'published')
      .order('created_at', { ascending: true })

    if (error) throw error

    return NextResponse.json({ replies: data ?? [] })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id: postId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })
    }

    const rl = checkRateLimit(`forum-reply:${user.id}`, { limit: 30, windowSeconds: 3600 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many replies. Please slow down.' }, { status: 429 })
    }

    const { body } = await req.json()
    if (!body?.trim() || body.length > 3000) {
      return NextResponse.json({ error: 'Reply is required (max 3000 characters).' }, { status: 400 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()

    const authorName = profile?.full_name?.trim() || user.email?.split('@')[0] || 'Community member'

    const { data, error } = await supabase
      .from('forum_replies')
      .insert({
        post_id: postId,
        author_id: user.id,
        author_name: authorName,
        body: body.trim(),
      })
      .select()
      .single()

    if (error) throw error

    const { data: replyCount } = await supabase.rpc('increment_forum_post_reply_count', { p_post_id: postId })

    return NextResponse.json({ reply: data, reply_count: replyCount })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
