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

interface JournalSection {
  id: string
  name: string
  slug: string
}

interface ArticleFormProps {
  sections: JournalSection[]
  initialData?: Record<string, unknown>
}

export default function ArticleForm({ sections, initialData }: ArticleFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    section_id: (initialData?.section_id as string) ?? '',
    title: (initialData?.title as string) ?? '',
    slug: (initialData?.slug as string) ?? '',
    excerpt: (initialData?.excerpt as string) ?? '',
    body_json: (initialData?.body_json as string) ?? '',
    author_name: (initialData?.author_name as string) ?? '',
    read_time_minutes: String(initialData?.read_time_minutes ?? ''),
    featured: (initialData?.featured as boolean) ?? false,
    status: (initialData?.status as string) ?? 'draft',
    seo_title: (initialData?.seo_title as string) ?? '',
    seo_description: (initialData?.seo_description as string) ?? '',
  })

  const setField = (key: string, value: string | boolean) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value }
      if (key === 'title' && !initialData) {
        updated.slug = slugify(value as string)
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

      const payload = {
        section_id: form.section_id || null,
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt || null,
        body_json: form.body_json ? JSON.parse(form.body_json) : null,
        author_name: form.author_name || null,
        read_time_minutes: form.read_time_minutes ? parseInt(form.read_time_minutes) : null,
        featured: form.featured,
        status: form.status,
        seo_title: form.seo_title || null,
        seo_description: form.seo_description || null,
        published_at: form.status === 'published' ? new Date().toISOString() : null,
        updated_by: user?.id ?? null,
      }

      if (initialData?.id) {
        const { error } = await supabase.from('articles').update(payload).eq('id', initialData.id as string)
        if (error) throw error
        toast.success('Article updated')
        router.refresh()
      } else {
        const { error } = await supabase.from('articles').insert({ ...payload, created_by: user?.id ?? null })
        if (error) throw error
        toast.success('Article created')
        router.push('/admin/articles')
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  const selectClass = 'w-full px-3 py-2 rounded-lg border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary'

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border p-6 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Title *</Label>
          <Input value={form.title} onChange={(e) => setField('title', e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label>Slug</Label>
          <Input value={form.slug} onChange={(e) => setField('slug', e.target.value)} className="font-mono text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label>Journal Section</Label>
          <select value={form.section_id} onChange={(e) => setField('section_id', e.target.value)} className={selectClass}>
            <option value="">Select section</option>
            {sections.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Author Name</Label>
          <Input value={form.author_name} onChange={(e) => setField('author_name', e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Read Time (min)</Label>
          <Input type="number" min="1" value={form.read_time_minutes} onChange={(e) => setField('read_time_minutes', e.target.value)} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Excerpt (shown in previews)</Label>
        <Textarea value={form.excerpt} onChange={(e) => setField('excerpt', e.target.value)} rows={2} maxLength={300} />
      </div>

      <div className="space-y-1.5">
        <Label>Article Body</Label>
        <Textarea
          value={form.body_json}
          onChange={(e) => setField('body_json', e.target.value)}
          rows={10}
          placeholder='Write the article content here. For rich content, enter JSON or plain text that will be stored as-is.'
          className="font-mono text-xs"
        />
        <p className="text-xs text-muted-foreground">Plain text or JSON content. Rich text editor integration can be added later.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>SEO Title</Label>
          <Input value={form.seo_title} onChange={(e) => setField('seo_title', e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <select value={form.status} onChange={(e) => setField('status', e.target.value)} className={selectClass}>
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>SEO Description</Label>
        <Textarea value={form.seo_description} onChange={(e) => setField('seo_description', e.target.value)} rows={2} />
      </div>

      <div className="flex items-center gap-2">
        <Switch checked={form.featured} onCheckedChange={(v) => setField('featured', v)} id="featured" />
        <Label htmlFor="featured" className="cursor-pointer">Featured article (shown in highlights)</Label>
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
        {loading ? 'Saving...' : initialData ? 'Update Article' : 'Create Article'}
      </Button>
    </form>
  )
}
