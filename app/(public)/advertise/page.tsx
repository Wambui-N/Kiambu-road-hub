'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { ChevronDown, CheckCircle2, Loader2, MessageCircle, Phone } from 'lucide-react'

const WHY_ADVERTISE = [
  {
    icon: '👥',
    text: 'Nucleus audience of 40,000+ residents in Kiambu, Ruaka, and Gigiri — able and ready consumers.',
  },
  {
    icon: '📱',
    text: 'Reach 2,000+ people by SMS weekly and 10,000 by email monthly across greater Nairobi.',
  },
  {
    icon: '💬',
    text: 'Advertisements are connected directly to your WhatsApp — customers reach you instantly.',
  },
  {
    icon: '📲',
    text: 'Daily social media engagement drives continuous traffic and exposure to your ad.',
  },
  {
    icon: '⭐',
    text: 'Main advertisers become sponsors — acknowledged in every article with links to their sites.',
  },
  {
    icon: '📄',
    text: 'Hard copy leaflet printed and distributed freely to major business outlets on Kiambu Road and satellite areas: Ruaka, Rosslyn, Gigiri, Thome, Thika Road, Muthaiga.',
  },
  {
    icon: '📰',
    text: 'Regular articles on health, business, lifestyle, travel, and leisure keep the community engaged and loyal — your ad reaches an active readership.',
  },
]

const TERMS = [
  'We reserve the right to reject any advertisement that flouts our values.',
  'The site does not guarantee any business outcome and takes no responsibility.',
  'Advertising rates are subject to change with prior notice.',
  'Advertising with us binds the client to our terms and conditions.',
]

export default function AdvertisePage() {
  const [termsOpen, setTermsOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    business_name: '',
    contact_person: '',
    phone: '',
    email: '',
    message: '',
  })

  const set = (key: string, value: string) =>
    setForm((p) => ({ ...p, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.business_name || !form.contact_person || !form.phone || !form.email) {
      toast.error('Please fill in all required fields.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/ad-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-surface">
      {/* Hero */}
      <div className="bg-primary py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-accent font-mono text-xs uppercase tracking-widest mb-2">Grow Your Business</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">Advertise with Us</h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
            We connect you to a modern and highly dynamic residential and commercial community.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">

        {/* Intro paragraph */}
        <section className="prose max-w-none">
          <p className="text-muted-foreground leading-relaxed text-base">
            Kiambu Road is a highly cosmopolitan area, both nationally and internationally. It hosts people from all parts of Kenya and
            offers residence and business to foreign visitors and residents working in the diplomatic community of Gigiri, which is just
            next door. We invite you to advertise your products and services to this community through our site.
          </p>
        </section>

        {/* Why Advertise */}
        <section>
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">Why Advertise With Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WHY_ADVERTISE.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl border border-border p-5 flex gap-4"
              >
                <span className="text-2xl shrink-0">{item.icon}</span>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Residents Reached', value: '40,000+' },
            { label: 'Weekly SMS', value: '2,000+' },
            { label: 'Monthly Email', value: '10,000+' },
            { label: 'Categories', value: '16' },
          ].map((stat) => (
            <div key={stat.label} className="bg-primary/10 rounded-2xl p-5 text-center">
              <p className="font-display text-2xl font-bold text-primary mb-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground font-mono">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Advertising Terms accordion */}
        <section>
          <button
            type="button"
            onClick={() => setTermsOpen((o) => !o)}
            className="flex items-center justify-between w-full bg-white border border-border rounded-2xl p-5 hover:border-primary transition-colors"
          >
            <span className="font-semibold text-foreground">Advertising Terms</span>
            <motion.div animate={{ rotate: termsOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          </button>
          <AnimatePresence>
            {termsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <ul className="bg-white border-x border-b border-border rounded-b-2xl px-5 pb-5 space-y-3 pt-4">
                  {TERMS.map((term, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                      {term}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Inquiry Form */}
        <section>
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">Advertising Inquiry</h2>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl border border-border p-10 text-center max-w-lg mx-auto"
            >
              <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold mb-2">Inquiry Sent!</h3>
              <p className="text-muted-foreground text-sm">
                Thank you for your interest. Our team will get back to you within 24 hours.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-6 space-y-5 max-w-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Business Name *</Label>
                  <Input value={form.business_name} onChange={(e) => set('business_name', e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Contact Person *</Label>
                  <Input value={form.contact_person} onChange={(e) => set('contact_person', e.target.value)} required />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Phone Number *</Label>
                  <Input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Email *</Label>
                  <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Message (optional)</Label>
                <Textarea value={form.message} onChange={(e) => set('message', e.target.value)} rows={4} placeholder="Tell us about your advertising requirements..." />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 py-3 h-auto">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {loading ? 'Sending...' : 'Send Inquiry'}
              </Button>
            </form>
          )}

          <div className="mt-6 text-sm text-muted-foreground">
            Need help? Call or WhatsApp{' '}
            <a href="tel:+254720950500" className="text-primary font-semibold hover:underline">
              <Phone className="w-3.5 h-3.5 inline-block mr-1" />0720 950 500
            </a>
            {' '}or{' '}
            <a
              href="https://wa.me/254720950500?text=Hi%2C%20I%27d%20like%20to%20advertise%20on%20Kiambu%20Road%20Hub"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 font-semibold hover:underline"
            >
              <MessageCircle className="w-3.5 h-3.5 inline-block mr-1" />WhatsApp us
            </a>{' '}
            for assistance.
          </div>
        </section>
      </div>
    </div>
  )
}
