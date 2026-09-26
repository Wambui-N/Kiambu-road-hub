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

interface CommunityProgrammeFormProps {
  initialData?: Record<string, unknown>
}

const STATUS_OPTIONS = ['draft', 'review', 'published', 'archived']

export default function CommunityProgrammeForm({ initialData }: CommunityProgrammeFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: (initialData?.name as string) ?? '',
    slug: (initialData?.slug as string) ?? '',
    tagline: (initialData?.tagline as string) ?? '',
    description: (initialData?.description as string) ?? '',
    body_content: (initialData?.body_content as string) ?? '',
    donate_project_label: (initialData?.donate_project_label as string) ?? '',
    schedule_note: (initialData?.schedule_note as string) ?? '',
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
      const payload = {
        ...form,
        tagline: form.tagline || null,
        body_content: form.body_content || null,
        donate_project_label: form.donate_project_label || null,
      }
      if (initialData?.id) {
        const { error } = await supabase.from('community_programmes').update(payload).eq('id', initialData.id as string)
        if (error) throw error
        toast.success('Project updated')
        router.refresh()
      } else {
        const { error } = await supabase.from('community_programmes').insert(payload)
        if (error) throw error
        toast.success('Project created')
        router.push('/admin/community-programmes')
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
          <Label>Project Name *</Label>
          <Input value={form.name} onChange={(e) => setField('name', e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label>Slug *</Label>
          <Input value={form.slug} onChange={(e) => setField('slug', e.target.value)} className="font-mono text-sm" required />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Tagline</Label>
        <Input value={form.tagline} onChange={(e) => setField('tagline', e.target.value)} placeholder="e.g. Road Safety for Better Living" />
      </div>

      <div className="space-y-1.5">
        <Label>Short Description (used in the project grid card)</Label>
        <Textarea value={form.description} onChange={(e) => setField('description', e.target.value)} rows={3} />
      </div>

      <div className="space-y-1.5">
        <Label>Full Campaign Content</Label>
        <Textarea
          value={form.body_content}
          onChange={(e) => setField('body_content', e.target.value)}
          rows={14}
          className="font-mono text-xs"
          placeholder={'Write the full campaign page here.\n\nSeparate paragraphs with a blank line.\n\n## A Subheading\n- A bullet point\n- Another bullet point'}
        />
        <p className="text-xs text-muted-foreground">
          Plain text. A line starting with &quot;## &quot; becomes a subheading, consecutive lines starting with &quot;- &quot; become a bullet list,
          and blank-line-separated blocks become paragraphs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Schedule (optional)</Label>
          <Input value={form.schedule_note} onChange={(e) => setField('schedule_note', e.target.value)} placeholder="e.g. Every Saturday, 10am" />
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <select value={form.status} onChange={(e) => setField('status', e.target.value)} className={selectClass}>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Donate Project Label (optional)</Label>
        <Input
          value={form.donate_project_label}
          onChange={(e) => setField('donate_project_label', e.target.value)}
          placeholder="e.g. Road safety campaign"
        />
        <p className="text-xs text-muted-foreground">
          If set, a &quot;Donate to This Project&quot; button links to the Partner With Us donate form pre-selecting this label.
        </p>
      </div>

      <FileUploadField
        label="Cover Image"
        bucket="store-media"
        folder="community-programmes"
        accept="image/jpeg,image/png,image/webp"
        value={form.image_path}
        onChange={(path) => setField('image_path', path)}
      />

      <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90">
        {loading ? 'Saving...' : initialData?.id ? 'Save Changes' : 'Create Project'}
      </Button>
    </form>
  )
}
