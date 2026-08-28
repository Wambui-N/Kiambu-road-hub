import { createClient } from '@/lib/supabase/server'
import BusinessForm from '@/components/admin/business-form'

async function getFormData() {
  try {
    const supabase = await createClient()
    const [{ data: categories }, { data: areas }, { data: tags }] = await Promise.all([
      supabase.from('categories').select('id, name, slug, subcategories(id, name, slug)').eq('status', 'published').order('sort_order'),
      supabase.from('areas').select('id, name, slug').order('sort_order'),
      supabase.from('tags').select('id, name, slug, tag_type').order('tag_type').order('name'),
    ])
    return { categories: categories ?? [], areas: areas ?? [], tags: tags ?? [] }
  } catch {
    return { categories: [], areas: [], tags: [] }
  }
}

export default async function NewBusinessPage() {
  const { categories, areas, tags } = await getFormData()
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Add Business</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Create a new business listing</p>
      </div>
      <BusinessForm categories={categories} areas={areas} tags={tags} />
    </div>
  )
}
