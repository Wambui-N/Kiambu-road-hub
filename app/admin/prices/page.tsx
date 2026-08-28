import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import PriceEntryForm from '@/components/admin/price-entry-form'
import PriceEntriesTable from '@/components/admin/price-entries-table'

async function getPriceData() {
  try {
    const supabase = await createClient()
    const [{ data: items }, { data: entries }, { data: businesses }] = await Promise.all([
      supabase.from('price_items').select('*').eq('status', 'published').order('category').order('name'),
      supabase
        .from('price_entries')
        .select('*, price_item:price_items(name, category, unit), business:businesses(name)')
        .eq('status', 'published')
        .order('observed_at', { ascending: false })
        .limit(50),
      supabase
        .from('businesses')
        .select('id, name, slug, area:areas(name)')
        .eq('status', 'published')
        .order('name'),
    ])
    return {
      items: items ?? [],
      entries: entries ?? [],
      businesses: (businesses ?? []).map((b) => ({
        id: b.id,
        name: b.name,
        slug: b.slug,
        area: (b.area as { name?: string } | null)?.name ?? null,
      })),
    }
  } catch {
    return { items: [], entries: [], businesses: [] }
  }
}

export default async function AdminPricesPage() {
  const { items, entries, businesses } = await getPriceData()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Prices</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{items.length} price items · {entries.length} recent entries</p>
        </div>
        <Link href="/admin/prices/products" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
          Manage Products <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Add price entry */}
      <div>
        <h2 className="font-semibold text-base mb-4">Add Price Entry</h2>
        <PriceEntryForm priceItems={items} businesses={businesses} />
      </div>

      {/* Recent entries */}
      <div>
        <h2 className="font-semibold text-base mb-4">Recent Price Entries</h2>
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <PriceEntriesTable entries={entries} priceItems={items} businesses={businesses} />
        </div>
      </div>
    </div>
  )
}
