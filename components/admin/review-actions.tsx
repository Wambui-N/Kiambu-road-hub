'use client'

import { useState } from 'react'
import { toast } from 'sonner'

interface Props {
  id: string
  status: string
}

export default function ReviewActions({ id, status }: Props) {
  const [loading, setLoading] = useState<string | null>(null)
  const [current, setCurrent] = useState(status)

  const act = async (newStatus: string) => {
    setLoading(newStatus)
    try {
      const res = await fetch('/api/admin/moderate-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      })
      if (!res.ok) throw new Error()
      setCurrent(newStatus)
      toast.success(`Review ${newStatus}`)
    } catch {
      toast.error('Action failed')
    } finally {
      setLoading(null)
    }
  }

  if (current === 'approved') {
    return (
      <button onClick={() => act('rejected')} className="text-xs text-red-600 hover:underline font-mono" disabled={!!loading}>
        Reject
      </button>
    )
  }

  if (current === 'rejected') {
    return (
      <button onClick={() => act('approved')} className="text-xs text-green-600 hover:underline font-mono" disabled={!!loading}>
        Approve
      </button>
    )
  }

  return (
    <div className="flex gap-2">
      <button onClick={() => act('approved')} disabled={!!loading} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 font-mono transition-colors">
        {loading === 'approved' ? '...' : 'Approve'}
      </button>
      <button onClick={() => act('rejected')} disabled={!!loading} className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 font-mono transition-colors">
        {loading === 'rejected' ? '...' : 'Reject'}
      </button>
    </div>
  )
}
