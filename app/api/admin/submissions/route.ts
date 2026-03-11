import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    // Verify the caller is an authenticated admin
    const userClient = await createClient()
    const { data: { user } } = await userClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { data: roleData } = await userClient.from('admin_roles').select('role').eq('user_id', user.id).single()
    if (!roleData) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { action, submissionId } = await req.json()
    if (!submissionId) {
      return NextResponse.json({ error: 'submissionId is required' }, { status: 400 })
    }

    const supabase = await createAdminClient()

    // Load the submission
    const { data: submission, error: subError } = await supabase
      .from('business_submissions')
      .select('*')
      .eq('id', submissionId)
      .single()

    if (subError || !submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    if (action === 'reject') {
      const { error } = await supabase
        .from('business_submissions')
        .update({ status: 'rejected', reviewed_at: new Date().toISOString(), reviewed_by: user.id })
        .eq('id', submissionId)
      if (error) throw error
      return NextResponse.json({ success: true, action: 'rejected' })
    }

    if (action === 'approve') {
      // Try to find matching category and area by name
      const [{ data: matchedCategory }, { data: matchedArea }] = await Promise.all([
        supabase
          .from('categories')
          .select('id')
          .ilike('name', `%${submission.category_name ?? ''}%`)
          .limit(1)
          .maybeSingle(),
        submission.location_text
          ? supabase
              .from('areas')
              .select('id')
              .ilike('name', `%${submission.location_text}%`)
              .limit(1)
              .maybeSingle()
          : Promise.resolve({ data: null }),
      ])

      // Generate a unique slug
      const baseSlug = slugify(submission.business_name)
      let slug = baseSlug
      let attempt = 0
      while (true) {
        const { data: existing } = await supabase
          .from('businesses')
          .select('id')
          .eq('slug', slug)
          .maybeSingle()
        if (!existing) break
        attempt++
        slug = `${baseSlug}-${attempt}`
      }

      // Create the business record in 'review' status (admin must publish manually)
      const { data: newBusiness, error: createError } = await supabase
        .from('businesses')
        .insert({
          name: submission.business_name,
          slug,
          category_id: matchedCategory?.id ?? null,
          area_id: matchedArea?.id ?? null,
          address_line: submission.location_text ?? null,
          short_description: submission.description ? submission.description.slice(0, 160) : null,
          description: submission.description ?? null,
          phone: submission.phone ?? null,
          whatsapp: submission.whatsapp ?? null,
          email: submission.email ?? null,
          website: submission.website ?? null,
          opening_hours_text: submission.opening_hours_text ?? null,
          price_range: submission.price_range ?? null,
          status: 'review',
          verification_status: 'pending',
          source_url: submission.source_note ?? null,
          created_by: user.id,
        })
        .select('id')
        .single()

      if (createError) throw createError

      // Mark submission as approved and link to created business
      const { error: updateError } = await supabase
        .from('business_submissions')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
        })
        .eq('id', submissionId)

      if (updateError) throw updateError

      // Write audit log
      await supabase.from('audit_logs').insert({
        actor_user_id: user.id,
        action: 'approve_submission',
        entity_type: 'business',
        entity_id: newBusiness.id,
        summary: `Approved submission "${submission.business_name}" → created business ${slug}`,
      })

      return NextResponse.json({ success: true, action: 'approved', businessId: newBusiness.id })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
