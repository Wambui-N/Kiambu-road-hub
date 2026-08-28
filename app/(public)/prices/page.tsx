import { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { createClient } from '@/lib/supabase/server'
import PriceFilters from './price-filters'
import PriceComparisonList from './price-comparison-list'
import SubmitPriceForm from './submit-price-form'
import { breadcrumbJsonLd, collectionPageJsonLd } from '@/lib/seo'
import type { PriceRow } from '@/components/prices/types'

export const metadata: Metadata = {
  title: 'Prices at a Glance',
  description: 'Compare community-sourced prices for groceries, fuel, dining, and more along Kiambu Road, Nairobi.',
  alternates: { canonical: 'https://kiamburoad.com/prices' },
}

export const revalidate = 3600

type Props = {
  searchParams: Promise<{
    category?: string
    q?: string
    min?: string
    max?: string
    outlet?: string
    sort?: string
  }>
}

async function getPriceRows(category?: string, search?: string): Promise<PriceRow[]> {
  try {
    const supabase = await createClient()
    let query = supabase
      .from('price_entries')
      .select(`
        id, amount, currency, store_name_snapshot, observed_at,
        price_item:price_items!inner(id, name, slug, category, unit, status),
        business:businesses(id, name, slug, latitude, longitude, google_maps_url, whatsapp, phone, road_street, area:areas(name))
      `)
      .eq('status', 'published')
      .eq('price_item.status', 'published')
      .order('amount', { ascending: true })
      .limit(500)

    if (category) query = query.eq('price_item.category', category)
    if (search) query = query.ilike('price_item.name', `%${search}%`)

    const { data } = await query
    if (!data) return []

    return data.map((entry): PriceRow => {
      const item = entry.price_item as unknown as { id: string; name: string; slug: string; category: string | null; unit: string | null }
      const business = entry.business as unknown as {
        id: string; name: string; slug: string; latitude: number | null; longitude: number | null
        google_maps_url: string | null; whatsapp: string | null; phone: string | null
        road_street: string | null; area: { name: string } | null
      } | null

      return {
        id: entry.id,
        itemId: item.id,
        itemName: item.name,
        itemSlug: item.slug,
        category: item.category,
        unit: item.unit,
        amount: entry.amount,
        currency: entry.currency,
        observedAt: entry.observed_at,
        storeName: business?.name ?? entry.store_name_snapshot,
        businessId: business?.id ?? null,
        businessSlug: business?.slug ?? null,
        areaName: business?.area?.name ?? business?.road_street ?? null,
        lat: business?.latitude ?? null,
        lng: business?.longitude ?? null,
        googleMapsUrl: business?.google_maps_url ?? null,
        whatsapp: business?.whatsapp ?? null,
        phone: business?.phone ?? null,
      }
    })
  } catch {
    return []
  }
}

export default async function PricesPage({ searchParams }: Props) {
  const params = await searchParams
  const rows = await getPriceRows(params.category, params.q)
  const hasData = rows.length > 0

  const uniqueItems = Array.from(new Map(rows.map((r) => [r.itemSlug, r.itemName])).entries())
  const breadcrumbLd = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Price Comparison', path: '/prices' },
  ])
  const collectionLd = collectionPageJsonLd({
    name: 'Price Comparison',
    description: 'Compare community-sourced prices for groceries, fuel, dining, and more along Kiambu Road, Nairobi.',
    path: '/prices',
    items: uniqueItems.map(([slug, name]) => ({ name, path: `/prices/${slug}` })),
  })

  return (
    <div className="min-h-screen bg-brand-surface">
      <Script id="prices-breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Script id="prices-collection-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-accent font-mono text-xs uppercase tracking-widest mb-2">Kiambu Road Explorer</p>
          <h1 className="font-display text-4xl font-bold text-white mb-2">Price Comparison</h1>
          <p className="text-white/70 text-sm max-w-xl">
            Compare community-sourced prices for everyday goods and services across outlets along Kiambu Road.
            Updated regularly by our community.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!hasData && !params.category && !params.q ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-5">🏷️</div>
            <h2 className="font-display text-2xl font-semibold mb-3">Price data coming soon</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8">
              Our team is gathering local price data. This section will be updated regularly once live.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <PriceFilters
              currentCategory={params.category}
              currentSearch={params.q}
              currentMin={params.min}
              currentMax={params.max}
              currentOutlet={params.outlet}
              currentSort={params.sort}
            />
            <PriceComparisonList
              rows={rows}
              min={params.min}
              max={params.max}
              outlet={params.outlet}
              sort={params.sort}
            />
          </div>
        )}

        {/* Community submission */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-border p-8">
            <h3 className="font-display text-xl font-bold mb-2">Know a price we&apos;re missing?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Help the community by submitting a local price. All submissions are reviewed before publishing.
            </p>
            <SubmitPriceForm />
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8">
            <h3 className="font-display text-xl font-bold mb-2">About this data</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Prices are submitted by community members and verified by our team before publishing.
              Prices may vary and should be confirmed with the store directly.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                Submitted prices are reviewed within 24 hours
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                All data includes a &ldquo;Last updated&rdquo; timestamp
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <Link href="/directory/retail-shopping" className="text-primary hover:underline">Browse the retail directory</Link> for store details
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
