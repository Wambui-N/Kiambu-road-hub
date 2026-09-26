'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { DonationStatus } from '@/types/database'

const STATUS_OPTIONS: DonationStatus[] = ['pending_payment', 'received', 'cancelled']

export default function DonationStatusSelect({ id, status }: { id: string; status: DonationStatus }) {
  const router = useRouter()
  const [updating, setUpdating] = useState(false)

  const handleChange = async (newStatus: DonationStatus) => {
    setUpdating(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('donation_pledges').update({ status: newStatus }).eq('id', id)
      if (error) throw error
      toast.success('Status updated')
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <select
      value={status}
      disabled={updating}
      onChange={(e) => handleChange(e.target.value as DonationStatus)}
      className="text-xs font-mono px-2 py-1 rounded-lg border border-border bg-background disabled:opacity-50"
    >
      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  )
}
