import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SubmitPriceForm from './submit-price-form'

export const metadata: Metadata = {
  title: 'Prices at a Glance',
  description: 'Compare community-sourced prices for groceries, fuel, dining, and more along Kiambu Road, Nairobi.',
  alternates: { canonical: 'https://kiamburoad-hub.com/prices' },
}

export const revalidate = 3600

const CATEGORY_LABELS: Record<string, string> = {
  groceries: '🛒 Groceries',
  fuel: '⛽ Fuel',
  medical: '💊 Medical',
  dining: '🍽️ Dining',
}

async function getPriceData() {
  try {
    const supabase = await createClient()
    const { data: entries } = await supabase
      .from('price_entries')
      .select(`
        *,
        price_item:price_items(id, name, category, unit),
        business:businesses(id, name, slug)
      `)
      .eq('status', 'published')
      .order('observed_at', { ascending: false })
      .limit(200)
    return entries ?? []
  } catch {
    return []
  }
}

type Entry = {
  id: string
  amount: number
  currency: string
  store_name_snapshot: string
  observed_at: string
  price_item: { id?: string; name?: string; category?: string; unit?: string } | null
  business: { id?: string; name?: string; slug?: string } | null
}

export default async function PricesPage() {
  const entries = await getPriceData()

  type GroupedItems = Record<string, { name: string; unit: string | null; prices: Record<string, { amount: number; currency: string; observed_at: string }> }>
  type CategoryGroup = Record<string, GroupedItems>

  const grouped: CategoryGroup = {}
  const allStores = new Set<string>()

  entries.forEach((entry) => {
    const e = entry as Entry
    const item = e.price_item
    if (!item?.name) return
    const cat = item.category ?? 'other'
    const storeName = (e.business?.name ?? e.store_name_snapshot) ?? 'Other'
    allStores.add(storeName)
    if (!grouped[cat]) grouped[cat] = {}
    if (!grouped[cat][item.name]) {
      grouped[cat][item.name] = { name: item.name, unit: item.unit ?? null, prices: {} }
    }
    grouped[cat][item.name].prices[storeName] = {
      amount: e.amount,
      currency: e.currency,
      observed_at: e.observed_at,
    }
  })

  const categories = Object.keys(grouped)
  const stores = Array.from(allStores).slice(0, 6)
  const hasData = entries.length > 0

  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-accent font-mono text-xs uppercase tracking-widest mb-2">Kiambu Road Hub</p>
          <h1 className="font-display text-4xl font-bold text-white mb-2">Prices at a Glance</h1>
          <p className="text-white/70 text-sm max-w-xl">
            Community-sourced prices for everyday goods and services along Kiambu Road.
            Updated regularly by our community.
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
          </div>
        ) : (
          <Tabs defaultValue={categories[0] ?? 'groceries'}>
            <TabsList className="mb-6 flex-wrap h-auto">
              {categories.map((cat) => (
                <TabsTrigger key={cat} value={cat} className="text-xs font-mono">
                  {CATEGORY_LABELS[cat] ?? cat.charAt(0).toUpperCase() + cat.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((cat) => {
              const items = grouped[cat]
              return (
                <TabsContent key={cat} value={cat}>
                  <div className="bg-white rounded-2xl border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm min-w-[640px]">
                        <thead>
                          <tr className="border-b border-border bg-muted/50">
                            <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground sticky left-0 bg-muted/50 min-w-[140px]">
                              Item
                            </th>
                            {stores.map((store) => (
                              <th key={store} className="px-4 py-3 font-mono text-xs text-muted-foreground text-center min-w-[100px]">
                                {store}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {Object.values(items).map((item) => (
                            <tr key={item.name} className="hover:bg-muted/20 transition-colors">
                              <td className="px-4 py-3 sticky left-0 bg-white">
                                <p className="font-medium">{item.name}</p>
                                {item.unit && <p className="text-[10px] font-mono text-muted-foreground">per {item.unit}</p>}
                              </td>
                              {stores.map((store) => {
                                const entry = item.prices[store]
                                return (
                                  <td key={store} className="px-4 py-3 text-center">
                                    {entry ? (
                                      <div>
                                        <p className="font-bold text-foreground">
                                          {entry.currency} {Number(entry.amount).toLocaleString()}
                                        </p>
                                        <p className="text-[10px] font-mono text-muted-foreground">
                                          {new Date(entry.observed_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
                                        </p>
                                      </div>
                                    ) : (
                                      <span className="text-muted-foreground text-xs">—</span>
                                    )}
                                  </td>
                                )
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
              )
            })}
          </Tabs>
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
