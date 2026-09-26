'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Loader2, KeyRound } from 'lucide-react'
import type { StoreOrder, StoreOrderStatus } from '@/types/database'

const STATUS_OPTIONS: StoreOrderStatus[] = ['pending_payment', 'paid', 'fulfilled', 'cancelled']

export default function StoreOrderActions({ order }: { order: StoreOrder }) {
  const router = useRouter()
  const [updating, setUpdating] = useState(false)
  const [generatingFor, setGeneratingFor] = useState<string | null>(null)

  const handleStatusChange = async (status: StoreOrderStatus) => {
    setUpdating(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('store_orders').update({ status }).eq('id', order.id)
      if (error) throw error
      toast.success('Order status updated')
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update')
    } finally {
      setUpdating(false)
    }
  }

  const handleGenerateLink = async (productId: string, productName: string) => {
    setGeneratingFor(productId)
    try {
      const supabase = createClient()
      const { data: product, error: fetchError } = await supabase
        .from('store_products')
        .select('digital_file_path')
        .eq('id', productId)
        .single()
      if (fetchError) throw fetchError
      if (!product?.digital_file_path) throw new Error('No file uploaded for this product')

      const { data, error } = await supabase.storage
        .from('ebook-files')
        .createSignedUrl(product.digital_file_path, 7 * 24 * 60 * 60)
      if (error) throw error

      await navigator.clipboard.writeText(data.signedUrl)
      toast.success(`Download link for "${productName}" copied to clipboard (valid 7 days)`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate link')
    } finally {
      setGeneratingFor(null)
    }
  }

  const ebookItems = order.items.filter((i) => i.product_type === 'ebook')
  const canDeliver = order.status === 'paid' || order.status === 'fulfilled'

  return (
    <div className="flex flex-col gap-2 items-end">
      <select
        value={order.status}
        disabled={updating}
        onChange={(e) => handleStatusChange(e.target.value as StoreOrderStatus)}
        className="text-xs font-mono px-2 py-1 rounded-lg border border-border bg-background disabled:opacity-50"
      >
        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      {canDeliver && ebookItems.map((item) => (
        <button
          key={item.product_id}
          type="button"
          disabled={generatingFor === item.product_id}
          onClick={() => handleGenerateLink(item.product_id, item.name)}
          className="text-[10px] text-primary hover:underline inline-flex items-center gap-1 disabled:opacity-50"
        >
          {generatingFor === item.product_id ? <Loader2 className="w-3 h-3 animate-spin" /> : <KeyRound className="w-3 h-3" />}
          Copy link: {item.name}
        </button>
      ))}
    </div>
  )
}
