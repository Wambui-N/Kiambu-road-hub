import { createClient } from '@/lib/supabase/server'
import BusinessForm from '@/components/admin/business-form'

async function getFormData() {
  try {
    const supabase = await createClient()
    const [{ data: categories }, { data: areas }] = await Promise.all([
      supabase.from('categories').select('id, name, slug, subcategories(id, name, slug)').eq('status', 'published').order('sort_order'),
      supabase.from('areas').select('id, name, slug').order('sort_order'),
    ])
    return { categories: categories ?? [], areas: areas ?? [] }
  } catch {
    return { categories: [], areas: [] }
  }
}

export default async function NewBusinessPage() {
  const { categories, areas } = await getFormData()
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Add Business</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Create a new business listing</p>
      </div>
      <BusinessForm categories={categories} areas={areas} />
    </div>
  )
}
