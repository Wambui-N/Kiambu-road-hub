import { createClient } from '@/lib/supabase/server'

async function getData() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('feedback').select('*').order('created_at', { ascending: false })
    return data ?? []
  } catch { return [] }
}

const STATUS_COLOR: Record<string, string> = {
  new: 'bg-amber-100 text-amber-700',
  read: 'bg-blue-100 text-blue-700',
  noted: 'bg-green-100 text-green-700',
}

export default async function FeedbackPage() {
  const items = await getData()
  const newCount = items.filter((i) => i.status === 'new').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Site Feedback</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{items.length} total · {newCount} new</p>
      </div>
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {items.length === 0 ? (
          <div className="text-center py-16"><p className="text-4xl mb-4">💬</p><p className="text-sm text-muted-foreground">No feedback yet.</p></div>
        ) : (
          <div className="divide-y divide-border">
            {items.map((item) => (
              <div key={item.id} className={`p-4 hover:bg-muted/20 ${item.status === 'new' ? 'bg-amber-50/40' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {item.name && <p className="font-medium text-sm">{item.name}</p>}
                      {item.email && <a href={`mailto:${item.email}`} className="text-xs text-primary hover:underline">{item.email}</a>}
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${STATUS_COLOR[item.status] ?? ''}`}>{item.status}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.message}</p>
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground shrink-0">{new Date(item.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
