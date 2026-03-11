'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface SubmissionActionsProps {
  id: string
  status: string
}

export default function SubmissionActions({ id, status }: SubmissionActionsProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const updateStatus = async (newStatus: string) => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('business_submissions')
        .update({ status: newStatus, reviewed_at: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
      toast.success(`Submission marked as ${newStatus}`)
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Update failed')
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
        onClick={() => updateStatus('approved')}
        disabled={loading}
        className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors disabled:opacity-50"
      >
        Approve
      </button>
      <button
        onClick={() => updateStatus('rejected')}
        disabled={loading}
        className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  )
}
