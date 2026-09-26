'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import FileUploadField from '@/components/admin/file-upload-field'
import { toast } from 'sonner'
import { slugify } from '@/lib/utils'

interface RetreatPackageFormProps {
  initialData?: Record<string, unknown>
}

const STATUS_OPTIONS = ['draft', 'review', 'published', 'archived']

export default function RetreatPackageForm({ initialData }: RetreatPackageFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: (initialData?.name as string) ?? '',
    slug: (initialData?.slug as string) ?? '',
    description: (initialData?.description as string) ?? '',
    price: (initialData?.price as string)?.toString() ?? '',
    currency: (initialData?.currency as string) ?? 'KES',
    duration_note: (initialData?.duration_note as string) ?? '',
    image_path: (initialData?.image_path as string) ?? '',
    status: (initialData?.status as string) ?? 'draft',
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
      const payload = { ...form, price: form.price ? Number(form.price) : null }
      if (initialData?.id) {
        const { error } = await supabase.from('retreat_packages').update(payload).eq('id', initialData.id as string)
        if (error) throw error
        toast.success('Package updated')
        router.refresh()
      } else {
        const { error } = await supabase.from('retreat_packages').insert(payload)
        if (error) throw error
        toast.success('Package created')
        router.push('/admin/retreat-packages')
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
          <Label>Package Name *</Label>
          <Input value={form.name} onChange={(e) => setField('name', e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label>Slug *</Label>
          <Input value={form.slug} onChange={(e) => setField('slug', e.target.value)} className="font-mono text-sm" required />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Description</Label>
        <Textarea value={form.description} onChange={(e) => setField('description', e.target.value)} rows={4} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label>Price</Label>
          <Input type="number" min="0" value={form.price} onChange={(e) => setField('price', e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Duration</Label>
          <Input value={form.duration_note} onChange={(e) => setField('duration_note', e.target.value)} placeholder="e.g. 3 days / 2 nights" />
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <select value={form.status} onChange={(e) => setField('status', e.target.value)} className={selectClass}>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <FileUploadField
        label="Cover Image"
        bucket="store-media"
        folder="retreat-packages"
        accept="image/jpeg,image/png,image/webp"
        value={form.image_path}
        onChange={(path) => setField('image_path', path)}
      />

      <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90">
        {loading ? 'Saving...' : initialData?.id ? 'Save Changes' : 'Create Package'}
      </Button>
    </form>
  )
}
