'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface SubmissionActionsProps {
  id: string
  status: string
}

export default function SubmissionActions({ id, status }: SubmissionActionsProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAction = async (action: 'approve' | 'reject') => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, submissionId: id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Request failed')

      if (action === 'approve' && data.businessId) {
        toast.success('Submission approved — business created in review status')
        router.push(`/admin/businesses/${data.businessId}`)
      } else {
        toast.success('Submission rejected')
        router.refresh()
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Action failed')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'approved' || status === 'rejected') {
    return <span className="text-xs text-muted-foreground font-mono">{status}</span>
  }

  return (
    <div className="flex gap-1.5">
      <button
        onClick={() => handleAction('approve')}
        disabled={loading}
        className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors disabled:opacity-50"
      >
        Approve →
      </button>
      <button
        onClick={() => handleAction('reject')}
        disabled={loading}
        className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  )
}
