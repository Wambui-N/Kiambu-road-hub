import { createClient } from '@/lib/supabase/server'

async function getData() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false })
    return data ?? []
  } catch { return [] }
}

export default async function SubscribersPage() {
  const items = await getData()
  const active = items.filter((i) => i.status === 'active').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Newsletter Subscribers</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{items.length} total · {active} active</p>
      </div>
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {items.length === 0 ? (
          <div className="text-center py-16"><p className="text-4xl mb-4">✉️</p><p className="text-sm text-muted-foreground">No subscribers yet.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">#</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Email</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Subscribed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item, i) => (
                  <tr key={item.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{i + 1}</td>
                    <td className="px-4 py-3 font-medium">
                      <a href={`mailto:${item.email}`} className="hover:text-primary">{item.email}</a>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{new Date(item.subscribed_at).toLocaleDateString()}</td>
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
