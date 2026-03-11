import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PriceEntryForm from '@/components/admin/price-entry-form'

async function getPriceData() {
  try {
    const supabase = await createClient()
    const [{ data: items }, { data: entries }] = await Promise.all([
      supabase.from('price_items').select('*').eq('status', 'published').order('category').order('name'),
      supabase
        .from('price_entries')
        .select('*, price_item:price_items(name, category, unit), business:businesses(name)')
        .eq('status', 'published')
        .order('observed_at', { ascending: false })
        .limit(50),
    ])
    return { items: items ?? [], entries: entries ?? [] }
  } catch {
    return { items: [], entries: [] }
  }
}

export default async function AdminPricesPage() {
  const { items, entries } = await getPriceData()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Prices</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{items.length} price items · {entries.length} recent entries</p>
        </div>
      </div>

      {/* Add price entry */}
      <div>
        <h2 className="font-semibold text-base mb-4">Add Price Entry</h2>
        <PriceEntryForm priceItems={items} />
      </div>

      {/* Recent entries */}
      <div>
        <h2 className="font-semibold text-base mb-4">Recent Price Entries</h2>
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          {entries.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-3xl mb-3">🏷️</p>
              <p className="text-sm text-muted-foreground">No price entries yet. Add one above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Item</th>
                    <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Business / Store</th>
                    <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Price</th>
                    <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Observed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {entries.map((entry) => {
                    const item = entry.price_item as { name?: string; category?: string; unit?: string } | null
                    const business = entry.business as { name?: string } | null
                    return (
                      <tr key={entry.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium">{item?.name ?? '—'}</p>
                          <p className="text-[10px] font-mono text-muted-foreground">{item?.category} · {item?.unit}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {business?.name ?? entry.store_name_snapshot ?? '—'}
                        </td>
                        <td className="px-4 py-3 font-semibold">
                          {entry.currency} {Number(entry.amount).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                          {new Date(entry.observed_at).toLocaleDateString()}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Manage price items */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-base">Price Items</h2>
          <span className="text-xs text-muted-foreground font-mono">Define trackable items below</span>
        </div>
        <div className="bg-white rounded-xl border border-border divide-y divide-border overflow-hidden">
          {items.length === 0 ? (
            <div className="text-center py-10 text-sm text-muted-foreground">
              No price items defined. Add them via the Supabase table or seed script.
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="px-4 py-3 flex items-center gap-3">
                <span className="font-medium text-sm">{item.name}</span>
                <span className="text-[10px] font-mono text-muted-foreground">{item.category} · {item.unit}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-green-100 text-green-700 ml-auto">{item.status}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
