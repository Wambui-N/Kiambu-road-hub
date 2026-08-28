import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import ProductOutletList from './product-outlet-list'
import { breadcrumbJsonLd, productJsonLd } from '@/lib/seo'
import type { PriceRow } from '@/components/prices/types'

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

const CATEGORY_LABELS: Record<string, string> = {
  groceries: '🛒 Groceries',
  fuel: '⛽ Fuel',
  medical: '💊 Medical',
  dining: '🍽️ Dining',
}

async function getProductData(slug: string) {
  try {
    const supabase = await createClient()
    const { data: item } = await supabase
      .from('price_items')
      .select('id, name, slug, category, unit')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (!item) return null

    const { data: entries } = await supabase
      .from('price_entries')
      .select(`
        id, amount, currency, store_name_snapshot, observed_at,
        business:businesses(id, name, slug, latitude, longitude, google_maps_url, whatsapp, phone, road_street, area:areas(name))
      `)
      .eq('price_item_id', item.id)
      .eq('status', 'published')
      .order('amount', { ascending: true })

    const rows: PriceRow[] = (entries ?? []).map((entry) => {
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

    return { item, rows }
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const data = await getProductData(slug)
  if (!data) return { title: 'Product Not Found' }

  const description = `Compare ${data.item.name} prices across outlets along Kiambu Road, Nairobi. Community-sourced and updated regularly.`

  return {
    title: `${data.item.name} Prices`,
    description,
    alternates: { canonical: `https://kiamburoad.com/prices/${slug}` },
    openGraph: { title: `${data.item.name} Prices | Kiambu Road Explorer`, description, type: 'website' },
  }
}

export default async function ProductPricePage({ params }: Props) {
  const { slug } = await params
  const data = await getProductData(slug)
  if (!data) notFound()

  const { item, rows } = data
  const prices = rows.map((r) => r.amount)
  const cheapest = prices.length ? Math.min(...prices) : null
  const highest = prices.length ? Math.max(...prices) : null
  const average = prices.length ? prices.reduce((sum, p) => sum + p, 0) / prices.length : null
  const currency = rows[0]?.currency ?? 'KES'

  const productLd = productJsonLd(item, rows.map((r) => ({ amount: r.amount, currency: r.currency })))
  const breadcrumbLd = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Price Comparison', path: '/prices' },
    { name: item.name, path: `/prices/${slug}` },
  ])

  return (
    <div className="min-h-screen bg-brand-surface">
      {productLd && (
        <Script id="price-item-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
      )}
      <Script id="price-item-breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="bg-primary py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/prices" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-mono mb-4 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Price Comparison
          </Link>
          <p className="text-accent font-mono text-xs uppercase tracking-widest mb-2">
            {item.category ? CATEGORY_LABELS[item.category] ?? item.category : 'Product'}
          </p>
          <h1 className="font-display text-4xl font-bold text-white mb-1">{item.name}</h1>
          {item.unit && <p className="text-white/70 text-sm">Priced per {item.unit}</p>}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {rows.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-border">
            <p className="text-4xl mb-3">🏷️</p>
            <p className="font-semibold mb-1">No prices recorded yet for {item.name}</p>
            <p className="text-sm text-muted-foreground">Check back soon, or submit one from the price comparison page.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-2xl border border-border p-5 text-center">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide mb-1">Cheapest</p>
                <p className="text-2xl font-bold text-green-700">{currency} {cheapest?.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-2xl border border-border p-5 text-center">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide mb-1">Average</p>
                <p className="text-2xl font-bold text-foreground">{currency} {average ? Math.round(average).toLocaleString() : '—'}</p>
              </div>
              <div className="bg-white rounded-2xl border border-border p-5 text-center">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide mb-1">Price Range</p>
                <p className="text-2xl font-bold text-foreground">{currency} {cheapest?.toLocaleString()}–{highest?.toLocaleString()}</p>
              </div>
            </div>

            <h2 className="font-display text-lg font-bold mb-4">Outlets ({rows.length})</h2>
            <ProductOutletList rows={rows} />
          </>
        )}
      </div>
    </div>
  )
}
