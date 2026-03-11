'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { slugify } from '@/lib/utils'

interface Category {
  id: string
  name: string
  slug: string
  subcategories?: { id: string; name: string; slug: string }[]
}

interface Area {
  id: string
  name: string
  slug: string
}

interface BusinessFormProps {
  categories: Category[]
  areas: Area[]
  initialData?: Record<string, unknown>
}

export default function BusinessForm({ categories, areas, initialData }: BusinessFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    (initialData?.category_id as string) ?? ''
  )

  const subcategories = categories.find((c) => c.id === selectedCategoryId)?.subcategories ?? []

  const [form, setForm] = useState({
    name: (initialData?.name as string) ?? '',
    slug: (initialData?.slug as string) ?? '',
    category_id: (initialData?.category_id as string) ?? '',
    subcategory_id: (initialData?.subcategory_id as string) ?? '',
    area_id: (initialData?.area_id as string) ?? '',
    address_line: (initialData?.address_line as string) ?? '',
    short_description: (initialData?.short_description as string) ?? '',
    description: (initialData?.description as string) ?? '',
    phone: (initialData?.phone as string) ?? '',
    whatsapp: (initialData?.whatsapp as string) ?? '',
    email: (initialData?.email as string) ?? '',
    website: (initialData?.website as string) ?? '',
    google_maps_url: (initialData?.google_maps_url as string) ?? '',
    opening_hours_text: (initialData?.opening_hours_text as string) ?? '',
    price_range: (initialData?.price_range as string) ?? '',
    google_rating: String(initialData?.google_rating ?? ''),
    google_review_count: String(initialData?.google_review_count ?? ''),
    featured: (initialData?.featured as boolean) ?? false,
    verified: (initialData?.verified as boolean) ?? false,
    is_sponsor: (initialData?.is_sponsor as boolean) ?? false,
    status: (initialData?.status as string) ?? 'draft',
    source_url: (initialData?.source_url as string) ?? '',
  })

  const setField = (key: string, value: string | boolean) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value }
      if (key === 'name' && !initialData) {
        updated.slug = slugify(value as string)
      }
      if (key === 'category_id') {
        setSelectedCategoryId(value as string)
        updated.subcategory_id = ''
      }
      return updated
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const supabase = createClient()
      const payload = {
        ...form,
        google_rating: form.google_rating ? Number(form.google_rating) : null,
        google_review_count: form.google_review_count ? Number(form.google_review_count) : null,
        category_id: form.category_id || null,
        subcategory_id: form.subcategory_id || null,
        area_id: form.area_id || null,
      }

      if (initialData?.id) {
        const { error } = await supabase.from('businesses').update(payload).eq('id', initialData.id as string)
        if (error) throw error
        toast.success('Business updated')
      } else {
        const { error } = await supabase.from('businesses').insert(payload)
        if (error) throw error
        toast.success('Business created')
        router.push('/admin/businesses')
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border p-6 space-y-5">
      {/* Basic info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Business Name *</Label>
          <Input value={form.name} onChange={(e) => setField('name', e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label>Slug (URL-safe name)</Label>
          <Input value={form.slug} onChange={(e) => setField('slug', e.target.value)} className="font-mono text-sm" />
        </div>
      </div>

      {/* Category / area */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label>Category</Label>
          <select
            value={form.category_id}
            onChange={(e) => setField('category_id', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Subcategory</Label>
          <select
            value={form.subcategory_id}
            onChange={(e) => setField('subcategory_id', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={!subcategories.length}
          >
            <option value="">Select subcategory</option>
            {subcategories.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Area</Label>
          <select
            value={form.area_id}
            onChange={(e) => setField('area_id', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select area</option>
            {areas.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
      </div>

      {/* Descriptions */}
      <div className="space-y-1.5">
        <Label>Short Description (for cards)</Label>
        <Input value={form.short_description} onChange={(e) => setField('short_description', e.target.value)} maxLength={160} />
      </div>
      <div className="space-y-1.5">
        <Label>Full Description</Label>
        <Textarea value={form.description} onChange={(e) => setField('description', e.target.value)} rows={4} />
      </div>

      {/* Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Phone</Label>
          <Input value={form.phone} onChange={(e) => setField('phone', e.target.value)} placeholder="+254 7XX XXX XXX" />
        </div>
        <div className="space-y-1.5">
          <Label>WhatsApp Number</Label>
          <Input value={form.whatsapp} onChange={(e) => setField('whatsapp', e.target.value)} placeholder="+254 7XX XXX XXX" />
        </div>
        <div className="space-y-1.5">
          <Label>Email</Label>
          <Input type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Website</Label>
          <Input type="url" value={form.website} onChange={(e) => setField('website', e.target.value)} placeholder="https://" />
        </div>
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Address</Label>
          <Input value={form.address_line} onChange={(e) => setField('address_line', e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Google Maps URL</Label>
          <Input type="url" value={form.google_maps_url} onChange={(e) => setField('google_maps_url', e.target.value)} />
        </div>
      </div>

      {/* Other details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label>Opening Hours</Label>
          <Input value={form.opening_hours_text} onChange={(e) => setField('opening_hours_text', e.target.value)} placeholder="Mon–Sat 8am–8pm" />
        </div>
        <div className="space-y-1.5">
          <Label>Price Range</Label>
          <select
            value={form.price_range}
            onChange={(e) => setField('price_range', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">—</option>
            <option value="$">$ (Under KES 500)</option>
            <option value="$$">$$ (KES 500–1,500)</option>
            <option value="$$$">$$$ (KES 1,500–3,500)</option>
            <option value="$$$$">$$$$ (Above KES 3,500)</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <select
            value={form.status}
            onChange={(e) => setField('status', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Google ratings */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Google Rating (0–5)</Label>
          <Input type="number" min="0" max="5" step="0.1" value={form.google_rating} onChange={(e) => setField('google_rating', e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Google Review Count</Label>
          <Input type="number" min="0" value={form.google_review_count} onChange={(e) => setField('google_review_count', e.target.value)} />
        </div>
      </div>

      {/* Source URL */}
      <div className="space-y-1.5">
        <Label>Source URL (verification)</Label>
        <Input type="url" value={form.source_url} onChange={(e) => setField('source_url', e.target.value)} placeholder="https://..." />
      </div>

      {/* Flags */}
      <div className="flex flex-wrap gap-6 py-2">
        {[
          { key: 'featured', label: 'Featured listing' },
          { key: 'verified', label: 'Verified' },
          { key: 'is_sponsor', label: 'Sponsor (shown in carousels)' },
        ].map((flag) => (
          <div key={flag.key} className="flex items-center gap-2">
            <Switch
              checked={form[flag.key as keyof typeof form] as boolean}
              onCheckedChange={(v) => setField(flag.key, v)}
              id={flag.key}
            />
            <Label htmlFor={flag.key} className="cursor-pointer">{flag.label}</Label>
          </div>
        ))}
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
        {loading ? 'Saving...' : initialData ? 'Update Business' : 'Create Business'}
      </Button>
    </form>
  )
}
