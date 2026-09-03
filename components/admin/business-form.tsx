'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Loader2, Plus, X } from 'lucide-react'
import { slugify } from '@/lib/utils'

type MallTenantCategory = 'eat' | 'shop' | 'services' | 'entertainment'
const MALL_TENANT_CATEGORIES: { value: MallTenantCategory; label: string }[] = [
  { value: 'eat', label: 'Eat' },
  { value: 'shop', label: 'Shop' },
  { value: 'services', label: 'Services' },
  { value: 'entertainment', label: 'Entertainment' },
]

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

interface TagOption {
  id: string
  name: string
  slug: string
  tag_type: string | null
}

const TAG_TYPE_LABELS: Record<string, string> = {
  medical_service: 'Medical Services',
  quick_fact: 'Quick Facts',
  emergency_criteria: 'Emergency Criteria',
}

interface MallTenantInput {
  id?: string
  name: string
  category: MallTenantCategory
}

interface BusinessFormProps {
  categories: Category[]
  areas: Area[]
  tags?: TagOption[]
  initialTagIds?: string[]
  initialMallTenants?: MallTenantInput[]
  initialData?: Record<string, unknown>
}

export default function BusinessForm({ categories, areas, tags = [], initialTagIds = [], initialMallTenants = [], initialData }: BusinessFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    (initialData?.category_id as string) ?? ''
  )
  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(new Set(initialTagIds))

  const initialMallFacts = Object.entries(
    (initialData?.mall_quick_facts as Record<string, string> | null) ?? {}
  ).map(([key, value]) => ({ key, value }))
  const [mallFacts, setMallFacts] = useState<{ key: string; value: string }[]>(initialMallFacts)
  const [mallTenants, setMallTenants] = useState<MallTenantInput[]>(initialMallTenants)

  const addMallFact = () => setMallFacts((prev) => [...prev, { key: '', value: '' }])
  const updateMallFact = (i: number, field: 'key' | 'value', value: string) =>
    setMallFacts((prev) => prev.map((f, idx) => (idx === i ? { ...f, [field]: value } : f)))
  const removeMallFact = (i: number) => setMallFacts((prev) => prev.filter((_, idx) => idx !== i))

  const addMallTenant = () => setMallTenants((prev) => [...prev, { name: '', category: 'eat' }])
  const updateMallTenant = (i: number, field: 'name' | 'category', value: string) =>
    setMallTenants((prev) => prev.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)))
  const removeMallTenant = (i: number) => setMallTenants((prev) => prev.filter((_, idx) => idx !== i))

  const tagGroups = tags.reduce<Record<string, TagOption[]>>((acc, t) => {
    const key = t.tag_type ?? 'other'
    acc[key] = acc[key] ?? []
    acc[key].push(t)
    return acc
  }, {})

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) => {
      const next = new Set(prev)
      if (next.has(tagId)) next.delete(tagId)
      else next.add(tagId)
      return next
    })
  }

  const subcategories = categories.find((c) => c.id === selectedCategoryId)?.subcategories ?? []
  const isMallCategory = categories.find((c) => c.id === selectedCategoryId)?.slug === 'malls'

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
      const { data: { user } } = await supabase.auth.getUser()
      const userId = user?.id ?? null

      const mallFactsObject = isMallCategory
        ? Object.fromEntries(mallFacts.filter((f) => f.key.trim() && f.value.trim()).map((f) => [f.key.trim(), f.value.trim()]))
        : null

      const payload = {
        ...form,
        google_rating: form.google_rating ? Number(form.google_rating) : null,
        google_review_count: form.google_review_count ? Number(form.google_review_count) : null,
        category_id: form.category_id || null,
        subcategory_id: form.subcategory_id || null,
        area_id: form.area_id || null,
        price_range: form.price_range || null,
        updated_by: userId,
        published_at: form.status === 'published' ? new Date().toISOString() : (initialData?.published_at as string | null ?? null),
        mall_quick_facts: mallFactsObject && Object.keys(mallFactsObject).length > 0 ? mallFactsObject : null,
      }

      let businessId = initialData?.id as string | undefined

      if (businessId) {
        const { error } = await supabase.from('businesses').update(payload).eq('id', businessId)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('businesses').insert({ ...payload, created_by: userId }).select('id').single()
        if (error) throw error
        businessId = data.id
      }

      // Replace business_tags with the current selection
      if (businessId) {
        await supabase.from('business_tags').delete().eq('business_id', businessId)
        if (selectedTagIds.size > 0) {
          const rows = Array.from(selectedTagIds).map((tag_id) => ({ business_id: businessId, tag_id }))
          const { error: tagError } = await supabase.from('business_tags').insert(rows)
          if (tagError) throw tagError
        }
      }

      // Replace mall_tenants — only relevant while this business is in the Malls category
      if (businessId) {
        await supabase.from('mall_tenants').delete().eq('mall_id', businessId)
        const validTenants = isMallCategory ? mallTenants.filter((t) => t.name.trim()) : []
        if (validTenants.length > 0) {
          const rows = validTenants.map((t, i) => ({
            mall_id: businessId,
            name: t.name.trim(),
            category: t.category,
            sort_order: i,
          }))
          const { error: tenantError } = await supabase.from('mall_tenants').insert(rows)
          if (tenantError) throw tenantError
        }
      }

      if (initialData?.id) {
        toast.success('Business updated')
        router.refresh()
      } else {
        toast.success('Business created')
        router.push('/admin/businesses')
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string')
            ? err.message
            : 'Failed to save'
      toast.error(message)
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

      {/* Quick Facts / Tags */}
      {Object.keys(tagGroups).length > 0 && (
        <div className="space-y-4 border-t border-border pt-5">
          <Label>Quick Facts &amp; Tags</Label>
          {Object.entries(tagGroups).map(([groupKey, groupTags]) => (
            <div key={groupKey} className="space-y-2">
              <p className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
                {TAG_TYPE_LABELS[groupKey] ?? groupKey}
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {groupTags.map((t) => (
                  <label key={t.id} className="flex items-center gap-2 text-sm cursor-pointer group/field">
                    <Checkbox
                      checked={selectedTagIds.has(t.id)}
                      onCheckedChange={() => toggleTag(t.id)}
                    />
                    {t.name}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mall hub profile: Quick Facts (key/value) + Inside-the-Mall tenants */}
      {isMallCategory && (
        <div className="space-y-6 border-t border-border pt-5">
          <div className="space-y-2">
            <Label>Mall Quick Facts</Label>
            <p className="text-xs text-muted-foreground">e.g. Parking → &quot;Available&quot;, Cinema → &quot;Yes — Century Cinemax&quot;, Banks → &quot;3 (KCB, Equity, NCBA)&quot;</p>
            {mallFacts.map((fact, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  placeholder="Item (e.g. Parking)"
                  value={fact.key}
                  onChange={(e) => updateMallFact(i, 'key', e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Details (e.g. Available)"
                  value={fact.value}
                  onChange={(e) => updateMallFact(i, 'value', e.target.value)}
                  className="flex-1"
                />
                <Button type="button" variant="outline" size="icon" onClick={() => removeMallFact(i)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addMallFact} className="gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Add fact
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Inside the Mall — Tenants</Label>
            <p className="text-xs text-muted-foreground">Shown grouped by category on the mall&apos;s public profile.</p>
            {mallTenants.map((tenant, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  placeholder="Tenant name (e.g. Java House)"
                  value={tenant.name}
                  onChange={(e) => updateMallTenant(i, 'name', e.target.value)}
                  className="flex-1"
                />
                <select
                  value={tenant.category}
                  onChange={(e) => updateMallTenant(i, 'category', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {MALL_TENANT_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <Button type="button" variant="outline" size="icon" onClick={() => removeMallTenant(i)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addMallTenant} className="gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Add tenant
            </Button>
          </div>
        </div>
      )}

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
        {loading ? 'Saving...' : initialData ? 'Update Business' : 'Create Business'}
      </Button>
    </form>
  )
}
