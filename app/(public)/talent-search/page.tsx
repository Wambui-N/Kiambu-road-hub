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

export default function TalentSearchPage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    company_name: '',
    role_needed: '',
    description: '',
    contact_name: '',
    phone: '',
    email: '',
  })

  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.company_name || !form.role_needed || !form.phone || !form.email) {
      toast.error('Company name, role, phone, and email are required.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/talent-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
    } catch {
      toast.error('Could not submit your inquiry. Please try again.')
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
          className="bg-white rounded-2xl border border-border p-10 text-center max-w-md"
        >
          <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-3">Inquiry Received!</h2>
          <p className="text-muted-foreground text-sm mb-6">
            We&apos;ll be in touch within 24 hours with suitable candidates from our network.
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
      <div className="bg-primary py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-accent font-mono text-xs uppercase tracking-widest mb-2">Kiambu Road Explorer</p>
          <h1 className="font-display text-4xl font-bold text-white mb-2">Talent Search</h1>
          <p className="text-white/75 text-sm max-w-xl">
            Looking for the right candidate? Tell us who you need and we&apos;ll connect you with qualified talent from our community.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:flex lg:gap-10">
          <div className="lg:flex-1">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-6 sm:p-8 space-y-5">
              <h2 className="font-semibold">Tell us what you need</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Company / Organisation *</Label>
                  <Input value={form.company_name} onChange={(e) => set('company_name', e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Role Needed *</Label>
                  <Input value={form.role_needed} onChange={(e) => set('role_needed', e.target.value)} placeholder="e.g. Accountant, Driver" required />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Job Description / Requirements</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Describe the role, skills required, experience level..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>Contact Name *</Label>
                  <Input value={form.contact_name} onChange={(e) => set('contact_name', e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone *</Label>
                  <Input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Email *</Label>
                  <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 h-12">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {loading ? 'Sending...' : 'Submit Talent Inquiry'}
              </Button>
            </form>
          </div>

          {/* Side info */}
          <div className="lg:w-72 mt-8 lg:mt-0 space-y-4">
            <div className="bg-white rounded-2xl border border-border p-6">
              <h3 className="font-display font-bold text-lg mb-3">How it works</h3>
              <ol className="space-y-3 text-sm text-muted-foreground">
                {[
                  'Fill in your talent inquiry form',
                  'Our team reviews your requirement',
                  'We match you with suitable candidates from our community network',
                  'You receive a shortlist within 24–48 hours',
                ].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
            <div className="bg-primary/5 rounded-2xl border border-primary/20 p-5">
              <p className="text-sm font-semibold mb-2">Also looking to post a job?</p>
              <Link href="/jobs/post" className="text-primary text-sm font-semibold hover:underline">
                → Post a Job Listing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
