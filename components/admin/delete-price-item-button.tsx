'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface DeletePriceItemButtonProps {
  id: string
  name: string
  entryCount: number
}

export default function DeletePriceItemButton({ id, name, entryCount }: DeletePriceItemButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    const warning = entryCount > 0
      ? `Deleting "${name}" will also delete ${entryCount} linked price ${entryCount === 1 ? 'entry' : 'entries'}. Continue?`
      : `Delete "${name}"?`
    if (!window.confirm(warning)) return

    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('price_items').delete().eq('id', id)
      if (error) throw error
      toast.success('Product deleted')
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
