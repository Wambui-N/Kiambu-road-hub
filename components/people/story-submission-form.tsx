'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { CheckCircle2, Loader2 } from 'lucide-react'

export default function StorySubmissionForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (key: keyof typeof form, value: string) => setForm((p) => ({ ...p, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email) {
      toast.error('Name and email are required.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/people-story-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
    } catch {
      toast.error('Could not send your suggestion. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-border p-8 text-center max-w-lg mx-auto">
        <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-4" />
        <h3 className="font-display text-xl font-bold mb-2">Thank You!</h3>
        <p className="text-muted-foreground text-sm">We&apos;ll be in touch if it&apos;s a great fit for a future feature.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-6 space-y-5 max-w-lg mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Your Name *</Label>
          <Input value={form.name} onChange={(e) => set('name', e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label>Your Email *</Label>
          <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Your Phone</Label>
        <Input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label>Tell us about them</Label>
        <Textarea
          value={form.message}
          onChange={(e) => set('message', e.target.value)}
          rows={4}
          placeholder="Who are they, and what's their connection to Kiambu Road?"
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 h-12">
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
        {loading ? 'Sending...' : 'Tell Us About Them'}
      </Button>
    </form>
  )
}
