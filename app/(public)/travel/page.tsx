'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { MapPin, Calendar, Users } from 'lucide-react'

const TRAVEL_TYPES = [
  { value: 'accommodation', label: 'Accommodation' },
  { value: 'car_hire', label: 'Car Hire' },
  { value: 'day_trip', label: 'Day Trip' },
  { value: 'airport_transfer', label: 'Airport Transfer' },
  { value: 'group_tour', label: 'Group Tour' },
  { value: 'conference', label: 'Conference Package' },
]

export default function TravelPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    travel_type: '',
    travel_dates: '',
    people_count: '',
    budget_range: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const setField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/travel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
      toast.success('Travel enquiry submitted! We will be in touch shortly.')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const selectClass = 'w-full px-3 py-2 rounded-lg border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary'

  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-accent font-mono text-xs uppercase tracking-widest mb-2">Plan Your Stay</p>
          <h1 className="font-display text-4xl font-bold text-white mb-2">Travel Bookings</h1>
          <p className="text-white/70 text-sm">
            Hotels, car hire, day trips and curated local experiences around Kiambu
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Features sidebar */}
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground mb-4">What We Can Arrange</h2>
              <div className="space-y-3">
                {[
                  { icon: '🏨', title: 'Hotels & Lodges', desc: 'From budget to luxury options along Kiambu Road' },
                  { icon: '🚗', title: 'Car Hire', desc: 'Self-drive or chauffeured vehicles' },
                  { icon: '🗺️', title: 'Day Trips', desc: 'Curated excursions to nearby attractions' },
                  { icon: '✈️', title: 'Airport Transfers', desc: 'Reliable pickups and drop-offs' },
                  { icon: '🏟️', title: 'Conference Packages', desc: 'Meeting rooms and facilities' },
                ].map((item) => (
                  <div key={item.title} className="bg-white rounded-xl border border-border p-4 flex gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="font-semibold text-sm mb-3">Or browse directly</h3>
              <div className="space-y-2">
                <Link href="/directory/eat-drink-stay" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  → Hotels &amp; Accommodation
                </Link>
                <Link href="/directory/transport-logistics" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  → Transport &amp; Car Hire
                </Link>
                <Link href="/directory/leisure-outdoors" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  → Leisure &amp; Activities
                </Link>
              </div>
            </div>
          </div>

          {/* Enquiry form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-white rounded-2xl border border-border p-10 text-center">
                <div className="text-5xl mb-4">✈️</div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">Enquiry Received!</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Thank you for your travel enquiry. Our team will contact you within 24 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', travel_type: '', travel_dates: '', people_count: '', budget_range: '', message: '' }) }}
                  className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-6 lg:p-8 space-y-5">
                <h2 className="font-display text-xl font-bold text-foreground">Submit Travel Enquiry</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-muted-foreground mb-1.5">Your Name *</label>
                    <Input name="name" value={form.name} onChange={(e) => setField('name', e.target.value)} required placeholder="John Kamau" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-muted-foreground mb-1.5">Email *</label>
                    <Input name="email" type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} required />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-muted-foreground mb-1.5">Phone</label>
                    <Input value={form.phone} onChange={(e) => setField('phone', e.target.value)} placeholder="+254 7XX XXX XXX" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-muted-foreground mb-1.5">Travel Type</label>
                    <select value={form.travel_type} onChange={(e) => setField('travel_type', e.target.value)} className={selectClass}>
                      <option value="">Select type</option>
                      {TRAVEL_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-muted-foreground mb-1.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Travel Dates
                    </label>
                    <Input value={form.travel_dates} onChange={(e) => setField('travel_dates', e.target.value)} placeholder="e.g. 15–17 April 2026" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-muted-foreground mb-1.5 flex items-center gap-1">
                      <Users className="w-3 h-3" /> Number of People
                    </label>
                    <Input type="number" min="1" value={form.people_count} onChange={(e) => setField('people_count', e.target.value)} placeholder="2" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-muted-foreground mb-1.5">Budget Range</label>
                    <select value={form.budget_range} onChange={(e) => setField('budget_range', e.target.value)} className={selectClass}>
                      <option value="">Select range</option>
                      <option value="budget">Budget (Under KES 5,000/night)</option>
                      <option value="mid">Mid-range (KES 5,000–15,000)</option>
                      <option value="premium">Premium (KES 15,000+)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-muted-foreground mb-1.5">Additional Details</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setField('message', e.target.value)}
                    rows={4}
                    placeholder="Tell us more about what you're looking for..."
                    className="w-full px-3 py-2.5 rounded-lg border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl h-auto"
                >
                  {loading ? 'Submitting...' : 'Submit Enquiry'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
