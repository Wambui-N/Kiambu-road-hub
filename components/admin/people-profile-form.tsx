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

interface PeopleProfileFormProps {
  initialData?: Record<string, unknown>
}

const STATUS_OPTIONS = ['draft', 'review', 'published', 'archived']

export default function PeopleProfileForm({ initialData }: PeopleProfileFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: (initialData?.name as string) ?? '',
    slug: (initialData?.slug as string) ?? '',
    role_connection: (initialData?.role_connection as string) ?? '',
    story: (initialData?.story as string) ?? '',
    featured_month: (initialData?.featured_month as string) ?? '',
    photo_path: (initialData?.photo_path as string) ?? '',
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
      const payload = {
        ...form,
        role_connection: form.role_connection || null,
        story: form.story || null,
        featured_month: form.featured_month || null,
      }
      if (initialData?.id) {
        const { error } = await supabase.from('people_profiles').update(payload).eq('id', initialData.id as string)
        if (error) throw error
        toast.success('Profile updated')
        router.refresh()
      } else {
        const { error } = await supabase.from('people_profiles').insert(payload)
        if (error) throw error
        toast.success('Profile created')
        router.push('/admin/people-profiles')
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
          <Label>Full Name *</Label>
          <Input value={form.name} onChange={(e) => setField('name', e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label>Slug *</Label>
          <Input value={form.slug} onChange={(e) => setField('slug', e.target.value)} className="font-mono text-sm" required />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Role / Connection to Kiambu Road</Label>
        <Input value={form.role_connection} onChange={(e) => setField('role_connection', e.target.value)} placeholder="e.g. Owner, Thindigua Cafe" />
      </div>

      <div className="space-y-1.5">
        <Label>Story</Label>
        <Textarea
          value={form.story}
          onChange={(e) => setField('story', e.target.value)}
          rows={10}
          className="font-mono text-xs"
          placeholder={'Write their story here.\n\nSeparate paragraphs with a blank line.\n\n## A Subheading\n- A bullet point'}
        />
        <p className="text-xs text-muted-foreground">
          Plain text. A line starting with &quot;## &quot; becomes a subheading, consecutive lines starting with &quot;- &quot; become a bullet list,
          and blank-line-separated blocks become paragraphs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Featured Month</Label>
          <Input value={form.featured_month} onChange={(e) => setField('featured_month', e.target.value)} placeholder="e.g. November 2026" />
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <select value={form.status} onChange={(e) => setField('status', e.target.value)} className={selectClass}>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <FileUploadField
        label="Photo"
        bucket="store-media"
        folder="people-profiles"
        accept="image/jpeg,image/png,image/webp"
        value={form.photo_path}
        onChange={(path) => setField('photo_path', path)}
      />

      <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90">
        {loading ? 'Saving...' : initialData?.id ? 'Save Changes' : 'Create Profile'}
      </Button>
    </form>
  )
}
