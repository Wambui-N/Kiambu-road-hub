import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get('slug')
    if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('businesses')
      .select('id, name, category:categories(slug)')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const category = data.category as unknown as { slug: string } | null
    return NextResponse.json({ id: data.id, name: data.name, category_slug: category?.slug ?? null })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
