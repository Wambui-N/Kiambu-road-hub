import { createClient } from '@/lib/supabase/server'
import CategoryManager from '@/components/admin/category-manager'

async function getCategoriesWithCounts() {
  try {
    const supabase = await createClient()
    const [{ data: categories }, { data: businessCounts }] = await Promise.all([
      supabase
        .from('categories')
        .select('*, subcategories(id, name, slug, sort_order, status)')
        .order('sort_order'),
      supabase.from('businesses').select('category_id').eq('status', 'published'),
    ])

    const countMap: Record<string, number> = {}
    businessCounts?.forEach((b) => {
      if (b.category_id) countMap[b.category_id] = (countMap[b.category_id] ?? 0) + 1
    })

    return (categories ?? []).map((cat) => ({
      ...cat,
      business_count: countMap[cat.id] ?? 0,
    }))
  } catch {
    return []
  }
}

export default async function CategoriesPage() {
  const categories = await getCategoriesWithCounts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Categories</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {categories.length} categories in the directory
          </p>
        </div>
      </div>

      <CategoryManager categories={categories} />
    </div>
  )
}
