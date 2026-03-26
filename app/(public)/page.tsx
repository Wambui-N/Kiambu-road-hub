import { Metadata } from 'next'
import Script from 'next/script'
import { createClient } from '@/lib/supabase/server'
import HeroSection from '@/components/home/hero-section'
import StatsBar from '@/components/home/stats-bar'
import CategoryGrid from '@/components/home/category-grid'
import FeaturedBusinesses from '@/components/home/featured-businesses'
import QuickLinks from '@/components/home/quick-links'
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo'
import type { Business, Category } from '@/types/database'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Kiambu Road Hub — Business Directory & Lifestyle Journal',
  description:
    'Your complete online business directory for Kiambu Road, Nairobi. Find restaurants, hotels, hospitals, schools and more.',
  alternates: { canonical: 'https://kiamburoad-hub.com' },
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
        images:business_images(*)
      `)
      .eq('status', 'published')
      .eq('featured', true)
      .order('is_sponsor', { ascending: false })
      .order('google_rating', { ascending: false })
      .limit(10)
    return data ?? []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [categories, featuredBusinesses] = await Promise.all([
    getCategories(),
    getFeaturedBusinesses(),
  ])

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

      <HeroSection />
      <StatsBar />
      <QuickLinks />
      <CategoryGrid categories={displayCategories} />
      <FeaturedBusinesses businesses={featuredBusinesses} />

      {/* Journal teaser section */}
      <section className="py-16 bg-brand-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-foreground">
              From the Lifestyle Journal
            </h2>
            <p className="text-muted-foreground mt-2">
              Health, travel, business and community stories from around Kiambu
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                section: 'Health Digest',
                slug: 'health-digest',
                color: '#10B981',
                title: 'Coming Soon',
                excerpt: 'Our health and wellness articles are being prepared. Check back shortly.',
              },
              {
                section: "Kiambu Here N' There",
                slug: 'kiambu-here-n-there',
                color: '#3B82F6',
                title: 'Coming Soon',
                excerpt: 'Local travel guides and hidden gems around Kiambu Road are being compiled.',
              },
              {
                section: 'Business Notes',
                slug: 'business-notes',
                color: '#E8A020',
                title: 'Coming Soon',
                excerpt: 'Business insights, tips and local entrepreneurship stories — launching soon.',
              },
            ].map((item) => (
              <a key={item.section} href={`/journal/${item.slug}`} className="block bg-white rounded-2xl border border-border p-6 hover:border-primary hover:shadow-sm transition-all">
                <span
                  className="inline-block text-xs font-mono font-semibold px-2 py-1 rounded-full mb-4 text-white"
                  style={{ backgroundColor: item.color }}
                >
                  {item.section}
                </span>
                <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.excerpt}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
