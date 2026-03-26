'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { CheckCircle2, Loader2 } from 'lucide-react'

export default function SubmitPriceForm() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    store_name: '',
    item_name: '',
    price: '',
    unit: '',
    category: '',
  })

  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.store_name || !form.item_name || !form.price) {
      toast.error('Store name, item name, and price are required.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/submit-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: parseFloat(form.price) }),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
    } catch {
      toast.error('Could not submit price. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-3 text-green-700">
        <CheckCircle2 className="w-6 h-6 shrink-0" />
        <p className="text-sm font-semibold">Thank you! Your price submission is under review.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Store Name *</Label>
          <Input value={form.store_name} onChange={(e) => set('store_name', e.target.value)} placeholder="e.g. Naivas Kiambu" className="h-9 text-sm" required />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Item Name *</Label>
          <Input value={form.item_name} onChange={(e) => set('item_name', e.target.value)} placeholder="e.g. Unga (2kg)" className="h-9 text-sm" required />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Price (KES) *</Label>
          <Input type="number" step="0.01" value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="e.g. 220" className="h-9 text-sm" required />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Unit (optional)</Label>
          <Input value={form.unit} onChange={(e) => set('unit', e.target.value)} placeholder="e.g. per kg" className="h-9 text-sm" />
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Category</Label>
        <select
          value={form.category}
          onChange={(e) => set('category', e.target.value)}
          className="w-full h-9 text-sm rounded-md border border-input bg-background px-3 py-1 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Select category...</option>
          <option value="groceries">Groceries</option>
          <option value="fuel">Fuel</option>
          <option value="medical">Medical / Pharmacy</option>
          <option value="dining">Dining</option>
        </select>
      </div>
      <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90">
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
        {loading ? 'Submitting...' : 'Submit Price'}
      </Button>
    </form>
  )
}
