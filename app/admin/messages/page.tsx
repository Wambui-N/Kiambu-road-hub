import { createClient } from '@/lib/supabase/server'
import MessageActions from '@/components/admin/message-actions'

async function getMessages() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
    return data ?? []
  } catch {
    return []
  }
}

const STATUS_COLOR: Record<string, string> = {
  new: 'bg-amber-100 text-amber-700',
  read: 'bg-blue-100 text-blue-700',
  replied: 'bg-green-100 text-green-700',
  archived: 'bg-muted text-muted-foreground',
}

export default async function AdminMessagesPage() {
  const messages = await getMessages()
  const newCount = messages.filter((m) => m.status === 'new').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Contact Messages</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {messages.length} total · {newCount} unread
        </p>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {messages.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">📬</p>
            <h3 className="font-semibold mb-1">No messages yet</h3>
            <p className="text-sm text-muted-foreground">Messages submitted via the contact form will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {messages.map((msg) => (
              <div key={msg.id} className={`p-4 hover:bg-muted/20 transition-colors ${msg.status === 'new' ? 'bg-amber-50/50' : ''}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{msg.name}</p>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${STATUS_COLOR[msg.status] ?? ''}`}>
                        {msg.status}
                      </span>
                      {msg.subject && (
                        <span className="text-xs text-muted-foreground">· {msg.subject}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      <a href={`mailto:${msg.email}`} className="hover:text-primary">{msg.email}</a>
                      {msg.phone && ` · ${msg.phone}`}
                    </p>
                    <p className="text-sm text-foreground leading-relaxed line-clamp-2">{msg.message}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <p className="text-[10px] font-mono text-muted-foreground">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </p>
                    <MessageActions id={msg.id} status={msg.status} email={msg.email} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
