'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface MessageActionsProps {
  id: string
  status: string
  email: string
}

export default function MessageActions({ id, status, email }: MessageActionsProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const setStatus = async (newStatus: string) => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: newStatus })
        .eq('id', id)
      if (error) throw error
      toast.success(`Marked as ${newStatus}`)
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-1.5 flex-wrap justify-end">
      {status === 'new' && (
        <button
          onClick={() => setStatus('read')}
          disabled={loading}
          className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors disabled:opacity-50"
        >
          Mark Read
        </button>
      )}
      <a
        href={`mailto:${email}`}
        className="text-xs px-2 py-1 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
        onClick={() => { if (status === 'new' || status === 'read') setStatus('replied') }}
      >
        Reply
      </a>
      {status !== 'archived' && (
        <button
          onClick={() => setStatus('archived')}
          disabled={loading}
          className="text-xs px-2 py-1 border border-border rounded hover:bg-muted transition-colors disabled:opacity-50"
        >
          Archive
        </button>
      )}
    </div>
  )
}
