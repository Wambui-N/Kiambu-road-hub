'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface DeleteRecordButtonProps {
  table: string
  id: string
  name: string
  confirmMessage?: string
}

export default function DeleteRecordButton({ table, id, name, confirmMessage }: DeleteRecordButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm(confirmMessage ?? `Delete "${name}"?`)) return

    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) throw error
      toast.success('Deleted')
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="text-xs text-destructive hover:underline inline-flex items-center gap-1 disabled:opacity-50"
    >
      <Trash2 className="w-3 h-3" /> Delete
    </button>
  )
}
