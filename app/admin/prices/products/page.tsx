import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import DeletePriceItemButton from '@/components/admin/delete-price-item-button'

async function getProducts() {
  try {
    const supabase = await createClient()
    const [{ data: items }, { data: entries }] = await Promise.all([
      supabase.from('price_items').select('*').order('category').order('name'),
      supabase.from('price_entries').select('price_item_id, amount'),
    ])

    const stats = new Map<string, { count: number; min: number; max: number }>()
    for (const entry of entries ?? []) {
      const existing = stats.get(entry.price_item_id)
      if (!existing) {
        stats.set(entry.price_item_id, { count: 1, min: entry.amount, max: entry.amount })
      } else {
        existing.count += 1
        existing.min = Math.min(existing.min, entry.amount)
        existing.max = Math.max(existing.max, entry.amount)
      }
    }

    return { items: items ?? [], stats }
  } catch {
    return { items: [], stats: new Map() }
  }
}

const STATUS_COLOR: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  review: 'bg-amber-100 text-amber-700',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-red-100 text-red-700',
}

export default async function AdminPriceProductsPage() {
  const { items, stats } = await getProducts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/prices" className="text-xs text-muted-foreground hover:text-foreground">← Prices</Link>
          </div>
          <h1 className="font-display text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{items.length} price items</p>
        </div>
        <Link href="/admin/prices/products/new">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-1" /> Add Product
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">🏷️</p>
            <h3 className="font-semibold mb-2">No products yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Add the core products you want to track prices for.</p>
            <Link href="/admin/prices/products/new">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-1" /> Add Product
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Category</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Unit</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground"># Entries</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Min–Max Price</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => {
                  const stat = stats.get(item.id)
                  return (
                    <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-[10px] font-mono text-muted-foreground">{item.slug}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{item.category ?? '—'}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{item.unit ?? '—'}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{stat?.count ?? 0}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {stat ? `KES ${stat.min.toLocaleString()}–${stat.max.toLocaleString()}` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${STATUS_COLOR[item.status] ?? ''}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-3 items-center">
                          <Link href={`/admin/prices/products/${item.id}`} className="text-xs text-primary hover:underline">Edit</Link>
                          <DeletePriceItemButton id={item.id} name={item.name} entryCount={stat?.count ?? 0} />
                        </div>
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
  )
}
