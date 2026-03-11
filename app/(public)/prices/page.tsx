import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Prices at a Glance — Kiambu Road Hub',
  description: 'Compare prices for groceries, fuel, dining, and more along Kiambu Road, Nairobi.',
}

export const revalidate = 3600

async function getPriceData() {
  try {
    const supabase = await createClient()
    const { data: entries } = await supabase
      .from('price_entries')
      .select(`
        *,
        price_item:price_items(name, category, unit),
        business:businesses(name, slug)
      `)
      .eq('status', 'published')
      .order('observed_at', { ascending: false })
      .limit(100)
    return entries ?? []
  } catch {
    return []
  }
}

const CATEGORY_ICONS: Record<string, string> = {
  groceries: '🛒',
  fuel: '⛽',
  medical: '💊',
  dining: '🍽️',
}

export default async function PricesPage() {
  const entries = await getPriceData()

  // Group by category
  type Entry = (typeof entries)[0]
  const grouped: Record<string, Entry[]> = {}
  entries.forEach((entry) => {
    const item = entry.price_item as { category?: string } | null
    const cat = item?.category ?? 'other'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(entry)
  })

  const hasData = entries.length > 0

  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-accent font-mono text-xs uppercase tracking-widest mb-2">Kiambu Road Hub</p>
          <h1 className="font-display text-4xl font-bold text-white mb-2">Prices at a Glance</h1>
          <p className="text-white/70 text-sm">
            Community-sourced prices for everyday goods and services along Kiambu Road
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!hasData ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-5">🏷️</div>
            <h2 className="font-display text-2xl font-semibold mb-3">Price data coming soon</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8">
              Our team is gathering local price data. This section will be updated regularly once live.
            </p>
            <Link
              href="/directory"
              className="inline-flex items-center justify-center bg-primary text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Browse Directory
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(grouped).map(([category, categoryEntries]) => (
              <section key={category}>
                <h2 className="font-display text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                  <span>{CATEGORY_ICONS[category] ?? '📦'}</span>
                  <span className="capitalize">{category}</span>
                </h2>
                <div className="bg-white rounded-2xl border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Item</th>
                        <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Store</th>
                        <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Price</th>
                        <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground hidden sm:table-cell">Updated</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {categoryEntries.map((entry) => {
                        const item = entry.price_item as { name?: string; unit?: string } | null
                        const business = entry.business as { name?: string; slug?: string } | null
                        return (
                          <tr key={entry.id} className="hover:bg-muted/20 transition-colors">
                            <td className="px-4 py-3">
                              <p className="font-medium">{item?.name ?? '—'}</p>
                              {item?.unit && <p className="text-[10px] font-mono text-muted-foreground">per {item.unit}</p>}
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">
                              {business ? (
                                <Link href={`/directory/business/${business.slug}`} className="hover:text-primary transition-colors">
                                  {business.name}
                                </Link>
                              ) : (
                                entry.store_name_snapshot ?? '—'
                              )}
                            </td>
                            <td className="px-4 py-3 font-bold text-foreground">
                              {entry.currency} {Number(entry.amount).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-xs font-mono text-muted-foreground hidden sm:table-cell">
                              {new Date(entry.observed_at).toLocaleDateString()}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Contribute CTA */}
        <div className="mt-12 bg-white rounded-2xl border border-border p-8 text-center">
          <h3 className="font-display text-xl font-bold mb-2">Know a price we&rsquo;re missing?</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
            Help the community by submitting local price data. Contact us to contribute.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-primary text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Submit a Price
          </Link>
        </div>
      </div>
    </div>
  )
}
