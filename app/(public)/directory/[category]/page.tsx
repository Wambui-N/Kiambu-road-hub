import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import { Phone, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { CATEGORIES, CATEGORY_FILTER_TAGS } from '@/data/seed/categories'
import { NATIONAL_EMERGENCY_NUMBER } from '@/data/emergency-contacts'
import BusinessCard from '@/components/directory/business-card'
import FeaturedListingBanner from '@/components/directory/featured-listing-banner'
import AdSlot from '@/components/ads/ad-slot'
import { breadcrumbJsonLd, collectionPageJsonLd, buildCanonical } from '@/lib/seo'
import type { Business, Category, Subcategory, AdSlot as AdSlotType, Tag } from '@/types/database'

export const revalidate = 3600

interface Props {
  params: Promise<{ category: string }>
  searchParams: Promise<{ subcategory?: string; area?: string; sort?: string; tag?: string }>
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

async function getBusinesses(categorySlug: string, subcategorySlug?: string, areaSlug?: string, tagSlug?: string) {
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

    if (tagSlug) {
      const { data: tagData } = await supabase.from('tags').select('id').eq('slug', tagSlug).single()
      const { data: btRows } = tagData?.id
        ? await supabase.from('business_tags').select('business_id').eq('tag_id', tagData.id)
        : { data: [] }
      const businessIds = (btRows ?? []).map((r) => r.business_id)
      query = query.in('id', businessIds.length ? businessIds : ['00000000-0000-0000-0000-000000000000'])
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
  const description = categoryData.description ?? `Find the best ${categoryData.name.toLowerCase()} businesses along Kiambu Road, Nairobi.`
  return {
    title: `${categoryData.name} — Kiambu Road`,
    description,
    alternates: { canonical: buildCanonical(`/directory/${category}`) },
    openGraph: {
      title: `${categoryData.name} | Kiambu Road Explorer`,
      description,
      type: 'website',
    },
  }
}

async function getFilterTags(tagSlugs: string[]): Promise<Tag[]> {
  if (!tagSlugs.length) return []
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('tags').select('*').in('slug', tagSlugs)
    // Preserve the curated order from CATEGORY_FILTER_TAGS rather than DB order.
    const bySlug = new Map((data ?? []).map((t) => [t.slug, t]))
    return tagSlugs.map((s) => bySlug.get(s)).filter((t): t is Tag => Boolean(t))
  } catch {
    return []
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category: categorySlug } = await params
  const { subcategory, area, tag } = await searchParams

  const filterTagSlugs = CATEGORY_FILTER_TAGS[categorySlug] ?? []

  const [categoryData, businesses, filterTags] = await Promise.all([
    getCategoryData(categorySlug),
    getBusinesses(categorySlug, subcategory, area, tag),
    getFilterTags(filterTagSlugs),
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

  const breadcrumbLd = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Directory', path: '/directory' },
    { name: categoryData.name, path: `/directory/${categorySlug}` },
  ])
  const collectionLd = collectionPageJsonLd({
    name: categoryData.name,
    description: categoryData.description ?? undefined,
    path: `/directory/${categorySlug}`,
    items: businesses.slice(0, 50).map((b) => ({ name: b.name, path: `/directory/business/${b.slug}` })),
  })

  return (
    <>
      <Script id="category-breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Script id="category-collection-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
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
        {/* Emergency Help banner — Medical Services only */}
        {categorySlug === 'medical-services' && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-700">Need urgent medical help?</p>
                <p className="text-sm text-red-600/80">
                  Call {NATIONAL_EMERGENCY_NUMBER} now, or see 24-hour hospitals and ambulance services.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a href="tel:999" className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors">
                <Phone className="w-4 h-4" /> Call 999
              </a>
              <Link href="/emergency" className="inline-flex items-center px-4 py-2 bg-white border border-red-200 text-red-700 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors">
                Full Emergency List
              </Link>
            </div>
          </div>
        )}

        {/* Tag filter pills — categories with a curated tag set (Medical Services, Malls) */}
        {filterTags.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            <Link
              href={`/directory/${categorySlug}${subcategory ? `?subcategory=${subcategory}` : ''}`}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-colors ${
                !tag ? 'bg-foreground text-white' : 'bg-white border border-border text-muted-foreground hover:border-foreground'
              }`}
            >
              All services
            </Link>
            {filterTags.map((t) => (
              <Link
                key={t.id}
                href={`/directory/${categorySlug}?tag=${t.slug}${subcategory ? `&subcategory=${subcategory}` : ''}`}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-colors whitespace-nowrap ${
                  tag === t.slug ? 'bg-foreground text-white' : 'bg-white border border-border text-muted-foreground hover:border-foreground'
                }`}
              >
                {t.name}
              </Link>
            ))}
          </div>
        )}

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
    </>
  )
}
