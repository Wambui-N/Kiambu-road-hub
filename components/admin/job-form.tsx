'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface Area {
  id: string
  name: string
  slug: string
}

interface JobFormProps {
  areas: Area[]
  initialData?: Record<string, unknown>
}

export default function JobForm({ areas, initialData }: JobFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: (initialData?.title as string) ?? '',
    company: (initialData?.company as string) ?? '',
    area_id: (initialData?.area_id as string) ?? '',
    location_text: (initialData?.location_text as string) ?? '',
    job_type: (initialData?.job_type as string) ?? 'full_time',
    description: (initialData?.description as string) ?? '',
    salary_text: (initialData?.salary_text as string) ?? '',
    deadline: (initialData?.deadline as string) ?? '',
    contact_email: (initialData?.contact_email as string) ?? '',
    contact_phone: (initialData?.contact_phone as string) ?? '',
    status: (initialData?.status as string) ?? 'draft',
  })

  const setField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const payload = {
        ...form,
        area_id: form.area_id || null,
        deadline: form.deadline || null,
        salary_text: form.salary_text || null,
        published_at: form.status === 'published' ? new Date().toISOString() : null,
        created_by: user?.id ?? null,
      }

      if (initialData?.id) {
        const { error } = await supabase.from('job_listings').update(payload).eq('id', initialData.id as string)
        if (error) throw error
        toast.success('Job updated')
        router.refresh()
      } else {
        const { error } = await supabase.from('job_listings').insert(payload)
        if (error) throw error
        toast.success('Job created')
        router.push('/admin/jobs')
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
          <Label>Job Title *</Label>
          <Input value={form.title} onChange={(e) => setField('title', e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label>Company *</Label>
          <Input value={form.company} onChange={(e) => setField('company', e.target.value)} required />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label>Job Type</Label>
          <select value={form.job_type} onChange={(e) => setField('job_type', e.target.value)} className={selectClass}>
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Area</Label>
          <select value={form.area_id} onChange={(e) => setField('area_id', e.target.value)} className={selectClass}>
            <option value="">Select area</option>
            {areas.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <select value={form.status} onChange={(e) => setField('status', e.target.value)} className={selectClass}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Location (text)</Label>
        <Input value={form.location_text} onChange={(e) => setField('location_text', e.target.value)} placeholder="e.g. Ridgeways, Nairobi" />
      </div>

      <div className="space-y-1.5">
        <Label>Job Description *</Label>
        <Textarea value={form.description} onChange={(e) => setField('description', e.target.value)} rows={5} required />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Salary / Range</Label>
          <Input value={form.salary_text} onChange={(e) => setField('salary_text', e.target.value)} placeholder="e.g. KES 50,000–80,000/month" />
        </div>
        <div className="space-y-1.5">
          <Label>Application Deadline</Label>
          <Input type="date" value={form.deadline} onChange={(e) => setField('deadline', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Contact Email</Label>
          <Input type="email" value={form.contact_email} onChange={(e) => setField('contact_email', e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Contact Phone</Label>
          <Input value={form.contact_phone} onChange={(e) => setField('contact_phone', e.target.value)} placeholder="+254 7XX XXX XXX" />
        </div>
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
        {loading ? 'Saving...' : initialData ? 'Update Job' : 'Create Job'}
      </Button>
    </form>
  )
}
