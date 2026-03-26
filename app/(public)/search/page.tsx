import { Metadata } from 'next'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import BusinessCard from '@/components/directory/business-card'
import SearchFilters from '@/components/directory/search-filters'
import { Skeleton } from '@/components/ui/skeleton'
import type { Business } from '@/types/database'

export const metadata: Metadata = {
  title: 'Search Businesses',
  description: 'Search for businesses, services and places along Kiambu Road.',
}

interface Props {
  searchParams: Promise<{
    q?: string
    category?: string
    area?: string
    price?: string
    page?: string
  }>
}

async function searchBusinesses(params: {
  q?: string
  category?: string
  area?: string
  price?: string
}): Promise<Business[]> {
  try {
    const supabase = await createClient()
    let query = supabase
      .from('businesses')
      .select(`
        *,
        category:categories(id, name, slug, icon, color),
        subcategory:subcategories(id, name, slug),
        area:areas(id, name, slug),
        images:business_images(*),
        reviews:reviews(rating)
      `)
      .eq('status', 'published')

    if (params.q) {
      query = query.or(
        `name.ilike.%${params.q}%,short_description.ilike.%${params.q}%,description.ilike.%${params.q}%`
      )
    }

    if (params.category) {
      const { data: catData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', params.category)
        .single()
      if (catData?.id) query = query.eq('category_id', catData.id)
    }

    if (params.area) {
      const { data: areaData } = await supabase
        .from('areas')
        .select('id')
        .eq('slug', params.area)
        .single()
      if (areaData?.id) query = query.eq('area_id', areaData.id)
    }

    const { data } = await query
      .order('featured', { ascending: false })
      .order('is_sponsor', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(48)
    return data ?? []
  } catch {
    return []
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams
  const businesses = await searchBusinesses(params)
  const query = params.q ?? ''

  return (
    <div className="min-h-screen bg-brand-surface">
      {/* Search header */}
      <div className="bg-primary py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-bold text-white mb-2">
            {query ? `Results for "${query}"` : 'Search Businesses'}
          </h1>
          <p className="text-white/70 text-sm font-mono">
            {businesses.length > 0
              ? `${businesses.length} business${businesses.length !== 1 ? 'es' : ''} found`
              : 'No businesses found'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense>
          <SearchFilters
            currentQuery={query}
            currentCategory={params.category}
            currentArea={params.area}
          />
        </Suspense>

        {businesses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {businesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🔍</p>
            <h3 className="font-display text-xl font-semibold mb-2">
              {query ? `No results for "${query}"` : 'Start searching'}
            </h3>
            <p className="text-muted-foreground text-sm">
              Try a different search term or browse by category
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
