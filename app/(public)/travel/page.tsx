'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { CheckCircle2, Loader2, MessageCircle } from 'lucide-react'

const TRAVEL_TYPES = [
  { label: '🏕️ Camping', value: 'camping' },
  { label: '🏔️ Hiking', value: 'hiking' },
  { label: '🦒 Safari', value: 'safari' },
  { label: '🏨 Hotel Bookings', value: 'hotel-bookings' },
  { label: '🛥️ Beach & Coast', value: 'beach-coast' },
  { label: '🌍 Africa Touring', value: 'africa-touring' },
  { label: '💐 Honeymoon', value: 'honeymoon' },
  { label: '🎒 Budget Travel', value: 'budget-travel' },
]

const BUDGET_RANGES = [
  'Under KES 10,000',
  'KES 10,000 – 25,000',
  'KES 25,000 – 50,000',
  'KES 50,000 – 100,000',
  'Above KES 100,000',
]

type FormData = {
  name: string
  email: string
  phone: string
  travel_type: string
  travel_dates: string
  people_count: string
  budget_range: string
  message: string
}

const EMPTY: FormData = {
  name: '',
  email: '',
  phone: '',
  travel_type: '',
  travel_dates: '',
  people_count: '',
  budget_range: '',
  message: '',
}

export default function TravelPage() {
  const [form, setForm] = useState<FormData>(EMPTY)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (key: keyof FormData, value: string) => setForm((p) => ({ ...p, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone) {
      toast.error('Name, email, and phone are required.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/travel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          people_count: form.people_count ? parseInt(form.people_count) : null,
        }),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
    } catch {
      toast.error('Could not send your inquiry. Please try again.')
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
          <h2 className="font-display text-2xl font-bold mb-3">Inquiry Received!</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            Thank you, {form.name}! Our travel team will contact you within 24 hours to discuss your trip.
            Check your email for a confirmation message.
          </p>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => { setSubmitted(false); setForm(EMPTY) }}
          >
            Make Another Inquiry
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-surface">
      {/* Hero */}
      <div className="bg-primary py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-accent font-mono text-xs uppercase tracking-widest mb-2">Travel & Adventure</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Plan Your Perfect Trip
          </h1>
          <p className="text-white/80 text-base leading-relaxed max-w-2xl mb-5">
            We arrange personalised travel experiences across Kenya and beyond. From wildlife safaris and coastal escapes to mountain hikes and romantic honeymoons.
          </p>
          {/* Service chips */}
          <div className="flex flex-wrap gap-2">
            {TRAVEL_TYPES.map((t) => (
              <span
                key={t.value}
                className="text-xs font-mono font-semibold bg-white/20 text-white px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors cursor-default"
              >
                {t.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Banner ad slot */}
      <div className="bg-muted border-b border-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-24 bg-white border-2 border-dashed border-border rounded-xl flex items-center justify-center text-sm text-muted-foreground">
            <Link href="/advertise" className="hover:text-primary transition-colors">
              📢 Banner Ad Slot — <strong>Contact us to advertise here</strong>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Left column — Travel Inquiry form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-6 sm:p-8 space-y-6">
            <h2 className="font-display text-xl font-bold">Travel Inquiry</h2>
            <p className="text-sm text-muted-foreground -mt-3">
              Tell us about your dream trip and we&apos;ll create a personalised itinerary for you.
            </p>

            {/* Contact details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Full Name *</Label>
                <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Your name" required />
              </div>
              <div className="space-y-1.5">
                <Label>Email *</Label>
                <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="your@email.com" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Phone / WhatsApp *</Label>
              <Input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+254 7XX XXX XXX" required />
            </div>

            {/* Travel type */}
            <div className="space-y-1.5">
              <Label>Travel Type</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TRAVEL_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => set('travel_type', t.value)}
                    className={`p-3 rounded-xl border-2 text-xs font-medium transition-all text-center ${
                      form.travel_type === t.value
                        ? 'border-primary bg-primary/5 text-foreground'
                        : 'border-border hover:border-primary/50 text-muted-foreground'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dates + people */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Travel Dates (preferred)</Label>
                <Input value={form.travel_dates} onChange={(e) => set('travel_dates', e.target.value)} placeholder="e.g. 15–20 April 2026" />
              </div>
              <div className="space-y-1.5">
                <Label>Number of People</Label>
                <Input type="number" min="1" value={form.people_count} onChange={(e) => set('people_count', e.target.value)} placeholder="e.g. 2" />
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-1.5">
              <Label>Budget Range (per person)</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {BUDGET_RANGES.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => set('budget_range', b)}
                    className={`text-left px-4 py-2.5 rounded-xl border-2 text-sm transition-all ${
                      form.budget_range === b
                        ? 'border-primary bg-primary/5 font-semibold text-foreground'
                        : 'border-border hover:border-primary/50 text-muted-foreground'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <Label>Additional Info / Special Requests</Label>
              <Textarea
                value={form.message}
                onChange={(e) => set('message', e.target.value)}
                placeholder="Tell us more about your ideal trip — specific destinations, activities, dietary requirements, special occasions..."
                rows={4}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 h-12">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {loading ? 'Sending Inquiry...' : '✈️  Send Travel Inquiry'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Prefer WhatsApp?{' '}
              <a
                href="https://wa.me/254720950500?text=Hi%2C%20I%27d%20like%20to%20inquire%20about%20a%20travel%20booking"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 font-semibold hover:underline inline-flex items-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5" /> Chat with us
              </a>
            </p>
          </form>

          {/* Right column — Book a Reservation (Coming Soon) */}
          <div className="bg-white rounded-2xl border-2 border-dashed border-border p-6 sm:p-8 flex flex-col justify-between min-h-[420px]">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
                Coming Soon
              </p>
              <h2 className="font-display text-xl font-bold mb-3">Book a Reservation</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Soon you&apos;ll be able to browse curated travel packages, check live availability,
                and book your stay or experience along the Kiambu Road corridor and beyond — all in one place.
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground mb-8">
                {[
                  'Weekend getaways and family packages',
                  'Honeymoon and special-occasion trips',
                  'Safari and adventure packages',
                  'Group and corporate travel options',
                  'Local stays along the Kiambu Road corridor',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <button
                disabled
                className="w-full inline-flex items-center justify-center rounded-xl border border-dashed border-border text-xs font-mono text-muted-foreground py-3 cursor-not-allowed bg-muted/40"
              >
                Reservation booking coming soon
              </button>
              <p className="text-center text-xs text-muted-foreground">
                Want to be first to know?{' '}
                <a
                  href="https://www.facebook.com/groups/kiamburoadcommunity"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1877F2] font-semibold hover:underline"
                >
                  Join our Facebook community
                </a>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
