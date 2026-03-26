import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    // Verify the caller is an authenticated admin
    const userClient = await createClient()
    const { data: { user } } = await userClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { data: roleData } = await userClient
      .from('admin_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()
    if (!roleData) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id, status } = await req.json()
    if (!id || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    const supabase = await createAdminClient()
    const { error } = await supabase.from('reviews').update({ status }).eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
