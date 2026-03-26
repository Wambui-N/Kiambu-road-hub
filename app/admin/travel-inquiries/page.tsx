import { createClient } from '@/lib/supabase/server'

async function getData() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('travel_inquiries')
      .select('*')
      .order('created_at', { ascending: false })
    return data ?? []
  } catch { return [] }
}

const STATUS_COLOR: Record<string, string> = {
  new: 'bg-amber-100 text-amber-700',
  responded: 'bg-blue-100 text-blue-700',
  closed: 'bg-muted text-muted-foreground',
}

export default async function TravelInquiriesPage() {
  const items = await getData()
  const newCount = items.filter((i) => i.status === 'new').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Travel Inquiries</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{items.length} total · {newCount} new</p>
      </div>
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {items.length === 0 ? (
          <div className="text-center py-16"><p className="text-4xl mb-4">✈️</p><p className="text-sm text-muted-foreground">No travel inquiries yet.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Contact</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Travel Type</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Dates</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Budget</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      <a href={`mailto:${item.email}`} className="hover:text-primary block">{item.email}</a>
                      {item.phone && <a href={`tel:${item.phone}`} className="hover:text-primary">{item.phone}</a>}
                    </td>
                    <td className="px-4 py-3 text-xs">{item.travel_type ?? '—'}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{item.travel_dates ?? '—'}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{item.budget_range ?? '—'}</td>
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
