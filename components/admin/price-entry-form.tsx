'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import BusinessPicker, { type PickerBusiness } from './business-picker'

interface PriceItem {
  id: string
  name: string
  category: string
  unit: string
}

interface PriceEntryInitialData {
  id: string
  price_item_id: string
  business_id: string | null
  store_name_snapshot: string
  amount: number
  currency: string
  observed_at: string
  source_note: string | null
}

interface PriceEntryFormProps {
  priceItems: PriceItem[]
  businesses: PickerBusiness[]
  mode?: 'create' | 'edit'
  initialData?: PriceEntryInitialData
  onSaved?: () => void
}

export default function PriceEntryForm({ priceItems, businesses, mode = 'create', initialData, onSaved }: PriceEntryFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [businessId, setBusinessId] = useState<string | null>(initialData?.business_id ?? null)
  const [form, setForm] = useState({
    price_item_id: initialData?.price_item_id ?? '',
    store_name_snapshot: initialData?.store_name_snapshot ?? '',
    amount: initialData ? String(initialData.amount) : '',
    currency: initialData?.currency ?? 'KES',
    observed_at: initialData?.observed_at ?? new Date().toISOString().split('T')[0],
    source_note: initialData?.source_note ?? '',
  })

  const setField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleBusinessChange = (id: string | null, business: PickerBusiness | null) => {
    setBusinessId(id)
    if (business) {
      setField('store_name_snapshot', business.name)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.price_item_id || !form.amount || !form.store_name_snapshot) return
    setLoading(true)
    try {
      const supabase = createClient()
      const payload = {
        price_item_id: form.price_item_id,
        business_id: businessId,
        store_name_snapshot: form.store_name_snapshot,
        amount: parseFloat(form.amount),
        currency: form.currency,
        observed_at: form.observed_at,
        source_note: form.source_note || null,
        status: 'published',
      }

      if (mode === 'edit' && initialData?.id) {
        const { error } = await supabase.from('price_entries').update(payload).eq('id', initialData.id)
        if (error) throw error
        toast.success('Price entry updated')
      } else {
        const { error } = await supabase.from('price_entries').insert(payload)
        if (error) throw error
        toast.success('Price entry added')
        setForm((prev) => ({ ...prev, amount: '', store_name_snapshot: '', source_note: '' }))
        setBusinessId(null)
      }
      router.refresh()
      onSaved?.()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  const selectClass = 'w-full px-3 py-2 rounded-lg border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary'

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label>Price Item *</Label>
          <select value={form.price_item_id} onChange={(e) => setField('price_item_id', e.target.value)} className={selectClass} required>
            <option value="">Select item</option>
            {priceItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.category} · {item.unit})
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Linked Business</Label>
          <BusinessPicker businesses={businesses} value={businessId} onChange={handleBusinessChange} />
        </div>
        <div className="space-y-1.5">
          <Label>Store / Business Name *</Label>
          <Input value={form.store_name_snapshot} onChange={(e) => setField('store_name_snapshot', e.target.value)} placeholder="e.g. Naivas Ridgeways" required />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <Label>Amount *</Label>
          <Input type="number" step="0.01" min="0" value={form.amount} onChange={(e) => setField('amount', e.target.value)} placeholder="250" required />
        </div>
        <div className="space-y-1.5">
          <Label>Currency</Label>
          <select value={form.currency} onChange={(e) => setField('currency', e.target.value)} className={selectClass}>
            <option value="KES">KES</option>
            <option value="USD">USD</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Observed Date</Label>
          <Input type="date" value={form.observed_at} onChange={(e) => setField('observed_at', e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Source Note</Label>
          <Input value={form.source_note} onChange={(e) => setField('source_note', e.target.value)} placeholder="How was this price obtained?" />
        </div>
      </div>

      <Button type="submit" disabled={loading} size="sm" className="bg-primary hover:bg-primary/90">
        {loading ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Add Price Entry'}
      </Button>
    </form>
  )
}
