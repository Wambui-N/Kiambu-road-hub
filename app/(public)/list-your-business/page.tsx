'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Loader2, CheckCircle2 } from 'lucide-react'

const CATEGORIES = [
  'Eat, Drink & Stay', 'Property & Construction', 'Professional Services',
  'Retail & Shopping', 'Transport & Logistics', 'Security & Emergency',
  'Health & Wellness', 'Home & Garden', 'Automotive', 'Education & Childcare',
  'Faith & Community', 'Leisure & Outdoors', 'Finance', 'Membership Clubs',
]

export default function ListYourBusinessPage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    business_name: '',
    category_name: '',
    subcategory_name: '',
    location_text: '',
    phone: '',
    whatsapp: '',
    email: '',
    website: '',
    description: '',
    opening_hours_text: '',
    price_range: '',
    source_note: '',
  })

  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/submit-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Submission failed')
      setSubmitted(true)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-surface flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-border p-10 text-center max-w-md">
          <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-3">Submission Received!</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Thank you for submitting your business. Our team will review your listing and get in touch within 1–2 business days.
          </p>
          <Button className="mt-6 bg-primary hover:bg-primary/90" onClick={() => window.location.href = '/'}>
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="bg-primary py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl font-bold text-white mb-3">List Your Business</h1>
          <p className="text-white/75">
            Get discovered by thousands of residents along Kiambu Road. Basic listing is free.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Benefits */}
        <div className="bg-white rounded-2xl border border-border p-6 mb-8">
          <h2 className="font-semibold mb-3">Why list with us?</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[
              '✅ Free basic listing with your business details',
              '✅ WhatsApp button connects customers directly to you',
              '✅ Featured prominently in category pages',
              '✅ Mobile-optimised for Kenyan users',
              '✅ Be part of the largest Kiambu Road directory',
            ].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-6 space-y-5">
          {/* Honeypot: hidden from real users, traps bots */}
          <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
            <input
              type="text"
              name="url"
              tabIndex={-1}
              autoComplete="off"
              value={(form as Record<string, string>).url ?? ''}
              onChange={(e) => set('url', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Business Name *</Label>
              <Input value={form.business_name} onChange={(e) => set('business_name', e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>Category *</Label>
              <select
                value={form.category_name}
                onChange={(e) => set('category_name', e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Subcategory (optional)</Label>
              <Input value={form.subcategory_name} onChange={(e) => set('subcategory_name', e.target.value)} placeholder="e.g. Restaurants" />
            </div>
            <div className="space-y-1.5">
              <Label>Location / Area *</Label>
              <Input value={form.location_text} onChange={(e) => set('location_text', e.target.value)} placeholder="e.g. Thindigua, Kiambu Road" required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Phone Number *</Label>
              <Input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+254 7XX XXX XXX" required />
            </div>
            <div className="space-y-1.5">
              <Label>WhatsApp Number</Label>
              <Input value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} placeholder="+254 7XX XXX XXX" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Website (optional)</Label>
              <Input type="url" value={form.website} onChange={(e) => set('website', e.target.value)} placeholder="https://" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Business Description *</Label>
            <Textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={4} required placeholder="Tell us about your business, products, and services..." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Opening Hours</Label>
              <Input value={form.opening_hours_text} onChange={(e) => set('opening_hours_text', e.target.value)} placeholder="Mon–Fri 8am–6pm" />
            </div>
            <div className="space-y-1.5">
              <Label>Price Range</Label>
              <select
                value={form.price_range}
                onChange={(e) => set('price_range', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Not sure</option>
                <option value="$">$ — Under KES 500</option>
                <option value="$$">$$ — KES 500–1,500</option>
                <option value="$$$">$$$ — KES 1,500–3,500</option>
                <option value="$$$$">$$$$ — Above KES 3,500</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>How did you hear about us?</Label>
            <select
              value={form.source_note}
              onChange={(e) => set('source_note', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Please select</option>
              <option>Google Search</option>
              <option>WhatsApp</option>
              <option>Facebook</option>
              <option>Friend / Word of mouth</option>
              <option>Flyer / Poster</option>
              <option>Other</option>
            </select>
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 py-3" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {loading ? 'Submitting...' : 'Submit Your Listing'}
          </Button>

          <p className="text-[10px] text-center text-muted-foreground">
            By submitting, you agree to our Terms & Conditions. Our team will review and contact you within 1–2 business days.
          </p>
        </form>
      </div>
    </div>
  )
}
