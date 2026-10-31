import { Metadata } from 'next'
import Script from 'next/script'
import { createClient } from '@/lib/supabase/server'
import HeroSection from '@/components/home/hero-section'
import StatsBar from '@/components/home/stats-bar'
import CategoryGrid from '@/components/home/category-grid'
import FeaturedBusinesses from '@/components/home/featured-businesses'
import CurrentFeatures from '@/components/home/current-features'
import HomeAdsSection from '@/components/ads/home-ads-section'
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo'
import type { Area, Business, Category, AdSlot as AdSlotType } from '@/types/database'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Kiambu Road Explorer — Business Directory & Lifestyle Journal',
  description:
    'Your complete online business directory for Kiambu Road, Nairobi. Find restaurants, hotels, hospitals, schools and more.',
  alternates: { canonical: 'https://kiamburoad.com' },
}

async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('categories')
      .select('*, subcategories(count)')
      .eq('status', 'published')
      .order('sort_order')

    if (data) {
      const { data: counts } = await supabase
        .from('businesses')
        .select('category_id')
        .eq('status', 'published')

      const countMap: Record<string, number> = {}
      counts?.forEach((b) => {
        if (b.category_id) countMap[b.category_id] = (countMap[b.category_id] ?? 0) + 1
      })

      return data.map((cat) => ({ ...cat, business_count: countMap[cat.id] ?? 0 }))
    }
    return []
  } catch {
    return []
  }
}

async function getFeaturedBusinesses(): Promise<Business[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
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
      .eq('featured', true)
      .order('is_sponsor', { ascending: false })
      .limit(10)
    return data ?? []
  } catch {
    return []
  }
}

async function getAreas(): Promise<Area[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('areas')
      .select('id, name, slug, description, sort_order')
      .order('sort_order')
    return data ?? []
  } catch {
    return []
  }
}

async function getHomeAdSlots(): Promise<AdSlotType[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('ad_slots')
      .select('*, advertiser:businesses(id, name, slug)')
      .in('page', ['home', 'home-hero', 'home-leaderboard', 'home-side-1', 'home-side-2', 'global'])
      .eq('active', true)
      .order('position')
    return data ?? []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [categories, featuredBusinesses, areas, homeAdSlots] = await Promise.all([
    getCategories(),
    getFeaturedBusinesses(),
    getAreas(),
    getHomeAdSlots(),
  ])

  const heroAdSlot      = homeAdSlots.find((s) => s.page === 'home-hero') ?? null
  const leaderboardSlot = homeAdSlots.find((s) => s.page === 'home-leaderboard') ?? null
  const sideLeftSlot    = homeAdSlots.find((s) => s.page === 'home-side-1') ?? null
  const sideRightSlot   = homeAdSlots.find((s) => s.page === 'home-side-2') ?? null

  const displayCategories: Category[] = categories.length
    ? categories
    : (await import('@/data/seed/categories')).CATEGORIES.map((cat, i) => ({
        id: `seed-${i}`,
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        color: cat.color,
        description: cat.description,
        cover_image_path: null,
        sort_order: i,
        status: 'published' as const,
        business_count: 0,
      }))

  return (
    <>
      <Script
        id="org-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
      />
      <Script
        id="website-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
      />

      <HeroSection areas={areas} heroAdSlot={heroAdSlot} />
      <StatsBar />

      {/* Ads section — leaderboard + two halves */}
      <HomeAdsSection
        leaderboard={leaderboardSlot}
        sideLeft={sideLeftSlot}
        sideRight={sideRightSlot}
      />

      <CategoryGrid categories={displayCategories} />
      <FeaturedBusinesses businesses={featuredBusinesses} />

      <CurrentFeatures />
    </>
  )
}
