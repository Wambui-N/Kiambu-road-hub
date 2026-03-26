'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { CheckCircle2, Loader2 } from 'lucide-react'

const JOB_TYPES = ['Full Time', 'Part Time', 'Contract', 'Internship']

export default function PostJobPage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    title: '',
    company: '',
    location_text: '',
    job_type: '',
    salary_text: '',
    deadline: '',
    description: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
  })

  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.contact_email || !form.description) {
      toast.error('Job title, description, and contact email are required.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/jobs/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
    } catch {
      toast.error('Could not submit your listing. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-surface flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl border border-border p-10 text-center max-w-md w-full"
        >
          <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-3">Job Submitted!</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Your job listing is under review. It will appear on the jobs board within 1–2 business days.
          </p>
          <Link href="/jobs" className="inline-flex items-center justify-center bg-primary text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
            Back to Jobs Board
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="bg-primary py-10">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-white mb-1">Post a Job</h1>
          <p className="text-white/75 text-sm">Reach qualified candidates along the Kiambu Road corridor</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-6 sm:p-8 space-y-5">
          <h2 className="font-semibold">Job Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Job Title *</Label>
              <Input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Sales Manager" required />
            </div>
            <div className="space-y-1.5">
              <Label>Company Name</Label>
              <Input value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="Your company" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Location</Label>
              <Input value={form.location_text} onChange={(e) => set('location_text', e.target.value)} placeholder="e.g. Ridgeways, Nairobi" />
            </div>
            <div className="space-y-1.5">
              <Label>Salary (optional)</Label>
              <Input value={form.salary_text} onChange={(e) => set('salary_text', e.target.value)} placeholder="e.g. KES 50,000/month" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Job Type</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {JOB_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set('job_type', t.toLowerCase().replace(/ /g, '_'))}
                  className={`px-3 py-2 rounded-xl border-2 text-xs font-medium transition-all ${
                    form.job_type === t.toLowerCase().replace(/ /g, '_')
                      ? 'border-primary bg-primary/5 text-foreground font-semibold'
                      : 'border-border hover:border-primary/50 text-muted-foreground'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Application Deadline</Label>
            <Input type="date" value={form.deadline} onChange={(e) => set('deadline', e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label>Job Description *</Label>
            <Textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Describe the role, responsibilities, and requirements..."
              rows={5}
              required
            />
          </div>

          <div className="border-t border-border pt-5">
            <h3 className="font-semibold text-sm mb-4">Contact Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>Contact Name</Label>
                <Input value={form.contact_name} onChange={(e) => set('contact_name', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Email *</Label>
                <Input type="email" value={form.contact_email} onChange={(e) => set('contact_email', e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input type="tel" value={form.contact_phone} onChange={(e) => set('contact_phone', e.target.value)} />
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            By submitting, you agree to our <Link href="/terms" className="text-primary hover:underline">Terms & Conditions</Link>.
            Listings are reviewed within 1–2 business days.
          </p>

          <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 h-12">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {loading ? 'Submitting...' : 'Submit Job Listing'}
          </Button>
        </form>
      </div>
    </div>
  )
}
