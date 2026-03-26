import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CATEGORIES } from '@/data/seed/categories'
import BusinessCard from '@/components/directory/business-card'
import FeaturedListingBanner from '@/components/directory/featured-listing-banner'
import AdSlot from '@/components/ads/ad-slot'
import type { Business, Category, Subcategory, AdSlot as AdSlotType } from '@/types/database'

export const revalidate = 3600

interface Props {
  params: Promise<{ category: string }>
  searchParams: Promise<{ subcategory?: string; area?: string; sort?: string }>
}

async function getCategoryData(categorySlug: string) {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('categories')
      .select('*, subcategories(*)')
      .eq('slug', categorySlug)
      .eq('status', 'published')
      .single()
    return data
  } catch {
    const seed = CATEGORIES.find((c) => c.slug === categorySlug)
    if (!seed) return null
    return { ...seed, id: `seed-${categorySlug}`, status: 'published', cover_image_path: null, sort_order: 0 }
  }
}

async function getBusinesses(categorySlug: string, subcategorySlug?: string, areaSlug?: string) {
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

    const { data: catData } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single()

    if (catData?.id) {
      query = query.eq('category_id', catData.id)
    }

    if (subcategorySlug) {
      const { data: subData } = await supabase
        .from('subcategories')
        .select('id')
        .eq('slug', subcategorySlug)
        .single()
      if (subData?.id) query = query.eq('subcategory_id', subData.id)
    }

    if (areaSlug) {
      const { data: areaData } = await supabase
        .from('areas')
        .select('id')
        .eq('slug', areaSlug)
        .single()
      if (areaData?.id) query = query.eq('area_id', areaData.id)
    }

    // Order: featured/sponsor (paid) first, then by date
    const { data } = await query
      .order('featured', { ascending: false })
      .order('is_sponsor', { ascending: false })
      .order('created_at', { ascending: false })

    return data ?? []
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const categoryData = await getCategoryData(category)
  if (!categoryData) return { title: 'Category Not Found' }
  return {
    title: `${categoryData.name} — Kiambu Road`,
    description: categoryData.description ?? `Find the best ${categoryData.name.toLowerCase()} businesses along Kiambu Road, Nairobi.`,
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category: categorySlug } = await params
  const { subcategory, area } = await searchParams

  const [categoryData, businesses] = await Promise.all([
    getCategoryData(categorySlug),
    getBusinesses(categorySlug, subcategory, area),
  ])

  // Fetch ad slots for this category page
  let adSlots: AdSlotType[] = []
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('ad_slots')
      .select('*, advertiser:businesses(id, name, slug)')
      .or(`page.eq.directory/${categorySlug},page.eq.global`)
      .eq('active', true)
      .order('tier')
      .order('position')
    adSlots = data ?? []
  } catch { /* silently fall through to placeholders */ }

  const tertiaryAds = adSlots.filter((s) => s.tier === 'tertiary').slice(0, 3)

  if (!categoryData) notFound()

  const subcategories: Subcategory[] = (categoryData as { subcategories?: Subcategory[] }).subcategories ?? []

  // Split: first featured/sponsor listing gets the banner treatment
  const topBusiness = businesses.length > 0 && (businesses[0].featured || businesses[0].is_sponsor)
    ? businesses[0]
    : null
  const listingBusinesses = topBusiness ? businesses.slice(1) : businesses

  return (
    <div className="min-h-screen bg-brand-surface">
      {/* Breadcrumb + header */}
      <div className="bg-primary py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-xs text-white/60 mb-3 flex items-center gap-1.5 font-mono">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/directory" className="hover:text-white">Directory</Link>
            <span>/</span>
            <span className="text-white">{categoryData.name}</span>
          </nav>
          <h1 className="font-display text-3xl font-bold text-white">{categoryData.name}</h1>
          {categoryData.description && (
            <p className="text-white/70 mt-2 text-sm">{categoryData.description}</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Subcategory filter tabs */}
        {subcategories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            <Link
              href={`/directory/${categorySlug}`}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !subcategory ? 'bg-primary text-white' : 'bg-white border border-border text-muted-foreground hover:border-primary hover:text-primary'
              }`}
            >
              All
            </Link>
            {subcategories.map((sub) => (
              <Link
                key={sub.id ?? sub.slug}
                href={`/directory/${categorySlug}?subcategory=${sub.slug}`}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  subcategory === sub.slug
                    ? 'bg-primary text-white'
                    : 'bg-white border border-border text-muted-foreground hover:border-primary hover:text-primary'
                }`}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-6 font-mono">
          {businesses.length > 0
            ? `${businesses.length} business${businesses.length !== 1 ? 'es' : ''} found`
            : 'No businesses listed yet in this category'}
        </p>

        {/* Tertiary Ad Slots */}
        {tertiaryAds.length > 0 && (
          <div className="flex gap-3 mb-6 overflow-x-auto">
            {tertiaryAds.map((s, i) => (
              <AdSlot key={i} slot={s} tier="tertiary" className="min-w-[280px] flex-1" />
            ))}
          </div>
        )}

        {businesses.length > 0 ? (
          <>
            {/* Top featured listing banner */}
            {topBusiness && (
              <FeaturedListingBanner business={topBusiness} />
            )}

            {/* Remaining listings grid — paid/featured first, then free */}
            {listingBusinesses.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listingBusinesses.map((business) => (
                  <BusinessCard key={business.id} business={business} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <h3 className="font-display text-xl font-semibold mb-2">No listings yet</h3>
            <p className="text-muted-foreground text-sm mb-6">
              We&apos;re actively adding businesses to this category.
            </p>
            <Link
              href="/list-your-business"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              List your business here →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
