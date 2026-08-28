'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { slugify } from '@/lib/utils'

interface PriceItemFormProps {
  initialData?: Record<string, unknown>
}

const CATEGORY_OPTIONS = ['groceries', 'fuel', 'medical', 'dining']
const STATUS_OPTIONS = ['draft', 'review', 'published', 'archived']

export default function PriceItemForm({ initialData }: PriceItemFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: (initialData?.name as string) ?? '',
    slug: (initialData?.slug as string) ?? '',
    category: (initialData?.category as string) ?? 'groceries',
    unit: (initialData?.unit as string) ?? '',
    status: (initialData?.status as string) ?? 'published',
  })

  const selectClass = 'w-full px-3 py-2 rounded-lg border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary'

  const setField = (key: string, value: string) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value }
      if (key === 'name' && !initialData) {
        updated.slug = slugify(value)
      }
      return updated
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.slug) return
    setLoading(true)
    try {
      const supabase = createClient()
      if (initialData?.id) {
        const { error } = await supabase.from('price_items').update(form).eq('id', initialData.id as string)
        if (error) throw error
        toast.success('Product updated')
        router.refresh()
      } else {
        const { error } = await supabase.from('price_items').insert(form)
        if (error) throw error
        toast.success('Product created')
        router.push('/admin/prices/products')
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border p-6 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Product Name *</Label>
          <Input value={form.name} onChange={(e) => setField('name', e.target.value)} placeholder="e.g. Milk 500ml" required />
        </div>
        <div className="space-y-1.5">
          <Label>Slug (URL-safe name) *</Label>
          <Input value={form.slug} onChange={(e) => setField('slug', e.target.value)} className="font-mono text-sm" required />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label>Category</Label>
          <select value={form.category} onChange={(e) => setField('category', e.target.value)} className={selectClass}>
            {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Unit</Label>
          <Input value={form.unit} onChange={(e) => setField('unit', e.target.value)} placeholder="e.g. 500ml, kg, litre" />
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <select value={form.status} onChange={(e) => setField('status', e.target.value)} className={selectClass}>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90">
        {loading ? 'Saving...' : initialData?.id ? 'Save Changes' : 'Create Product'}
      </Button>
    </form>
  )
}
