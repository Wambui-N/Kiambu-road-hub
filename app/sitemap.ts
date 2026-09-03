import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

const BASE_URL = 'https://kiamburoad.com'

// Fallback "last modified" for routes with no real per-row timestamp in the
// schema (categories, journal sections, price items) — using new Date() at
// request time made the sitemap claim everything changed on every
// regeneration, which undermines the freshness signal to crawlers. Bump this
// by hand when the underlying seed data actually changes.
const STATIC_LAST_MODIFIED = new Date('2026-08-24')

export const revalidate = 86400 // 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/directory`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/journal`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/travel`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/jobs`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/prices`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/talent-search`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/ask-kiambu-road`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/dear-doctor`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/advertise`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/list-your-business`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/emergency`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/other-services`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/terms`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.3 },
  ]

  // Category pages (categories have no updated_at column — use the static baseline)
  const { data: categories } = await supabase
    .from('categories')
    .select('slug')
    .eq('status', 'published')

  const categoryRoutes: MetadataRoute.Sitemap = (categories ?? []).map((cat) => ({
    url: `${BASE_URL}/directory/${cat.slug}`,
    lastModified: STATIC_LAST_MODIFIED,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Journal section pages
  const { data: sections } = await supabase
    .from('journal_sections')
    .select('slug')
    .eq('status', 'published')

  const sectionRoutes: MetadataRoute.Sitemap = (sections ?? []).map((s) => ({
    url: `${BASE_URL}/journal/${s.slug}`,
    lastModified: STATIC_LAST_MODIFIED,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Business profile pages
  const { data: businesses } = await supabase
    .from('businesses')
    .select('slug, updated_at')
    .eq('status', 'published')

  const businessRoutes: MetadataRoute.Sitemap = (businesses ?? []).map((b) => ({
    url: `${BASE_URL}/directory/business/${b.slug}`,
    lastModified: new Date(b.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Journal article pages
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, updated_at')
    .eq('status', 'published')

  const articleRoutes: MetadataRoute.Sitemap = (articles ?? []).map((a) => ({
    url: `${BASE_URL}/journal/article/${a.slug}`,
    lastModified: new Date(a.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Price item detail pages
  const { data: priceItems } = await supabase
    .from('price_items')
    .select('slug')
    .eq('status', 'published')

  const priceItemRoutes: MetadataRoute.Sitemap = (priceItems ?? []).map((p) => ({
    url: `${BASE_URL}/prices/${p.slug}`,
    lastModified: STATIC_LAST_MODIFIED,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...sectionRoutes,
    ...businessRoutes,
    ...articleRoutes,
    ...priceItemRoutes,
  ]
}
