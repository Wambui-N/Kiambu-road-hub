import { createClient } from '@/lib/supabase/server'

async function getData() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('price_submissions').select('*').order('created_at', { ascending: false })
    return data ?? []
  } catch { return [] }
}

const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

export default async function PriceSubmissionsPage() {
  const items = await getData()
  const pending = items.filter((i) => i.status === 'pending').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Price Submissions</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{items.length} total · {pending} pending</p>
      </div>
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {items.length === 0 ? (
          <div className="text-center py-16"><p className="text-4xl mb-4">🏷️</p><p className="text-sm text-muted-foreground">No price submissions yet.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Item</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Store</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Price</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Category</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium">{item.item_name} {item.unit ? <span className="text-xs text-muted-foreground">/{item.unit}</span> : ''}</td>
                    <td className="px-4 py-3 text-sm">{item.store_name}</td>
                    <td className="px-4 py-3 font-bold">KES {Number(item.price).toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground capitalize">{item.category ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${STATUS_COLOR[item.status] ?? ''}`}>{item.status}</span>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
