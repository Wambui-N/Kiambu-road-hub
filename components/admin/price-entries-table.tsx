'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import PriceEntryForm from './price-entry-form'
import type { PickerBusiness } from './business-picker'

interface PriceItem {
  id: string
  name: string
  category: string
  unit: string
}

interface PriceEntry {
  id: string
  amount: number
  currency: string
  observed_at: string
  store_name_snapshot: string
  business_id: string | null
  price_item_id: string
  source_note: string | null
  price_item: { name?: string; category?: string; unit?: string } | null
  business: { name?: string } | null
}

interface PriceEntriesTableProps {
  entries: PriceEntry[]
  priceItems: PriceItem[]
  businesses: PickerBusiness[]
}

export default function PriceEntriesTable({ entries, priceItems, businesses }: PriceEntriesTableProps) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const editingEntry = entries.find((e) => e.id === editingId) ?? null

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this price entry?')) return
    setDeletingId(id)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('price_entries').delete().eq('id', id)
      if (error) throw error
      toast.success('Price entry deleted')
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete')
    } finally {
      setDeletingId(null)
    }
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-3xl mb-3">🏷️</p>
        <p className="text-sm text-muted-foreground">No price entries yet. Add one above.</p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Item</th>
              <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Business / Store</th>
              <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Price</th>
              <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Observed</th>
              <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {entries.map((entry) => (
              <tr key={entry.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium">{entry.price_item?.name ?? '—'}</p>
                  <p className="text-[10px] font-mono text-muted-foreground">{entry.price_item?.category} · {entry.price_item?.unit}</p>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {entry.business?.name ?? entry.store_name_snapshot ?? '—'}
                </td>
                <td className="px-4 py-3 font-semibold">
                  {entry.currency} {Number(entry.amount).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                  {new Date(entry.observed_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3 items-center">
                    <button type="button" onClick={() => setEditingId(entry.id)} className="text-xs text-primary hover:underline">
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(entry.id)}
                      disabled={deletingId === entry.id}
                      className="text-xs text-destructive hover:underline inline-flex items-center gap-1 disabled:opacity-50"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editingId} onOpenChange={(open) => !open && setEditingId(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Price Entry</DialogTitle>
          </DialogHeader>
          {editingEntry && (
            <PriceEntryForm
              mode="edit"
              priceItems={priceItems}
              businesses={businesses}
              initialData={{
                id: editingEntry.id,
                price_item_id: editingEntry.price_item_id,
                business_id: editingEntry.business_id,
                store_name_snapshot: editingEntry.store_name_snapshot,
                amount: editingEntry.amount,
                currency: editingEntry.currency,
                observed_at: editingEntry.observed_at,
                source_note: editingEntry.source_note,
              }}
              onSaved={() => setEditingId(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
