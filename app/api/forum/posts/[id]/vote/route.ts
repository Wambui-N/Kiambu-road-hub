import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface Params {
  params: Promise<{ id: string }>
}

export async function POST(_req: NextRequest, { params }: Params) {
  try {
    const { id: postId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })
    }

    const { error: insertError } = await supabase
      .from('forum_post_votes')
      .insert({ post_id: postId, user_id: user.id })

    if (insertError) {
      if (insertError.code === '23505') {
        const { data } = await supabase.from('forum_posts').select('upvote_count').eq('id', postId).single()
        return NextResponse.json({ already: true, upvote_count: data?.upvote_count ?? null })
      }
      throw insertError
    }

    const { data: upvoteCount, error } = await supabase.rpc('increment_forum_post_upvote', { p_post_id: postId })
    if (error) throw error

    return NextResponse.json({ already: false, upvote_count: upvoteCount })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
