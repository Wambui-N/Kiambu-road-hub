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
    text: 'We target a nucleus audience of over 40,000 people who reside within the Kiambu, Ruaka, and Gigiri areas. The majority are able and ready consumers of many products and services',
  },
  {
    icon: '📱',
    text: 'We reach over 2,000 people by sms every week and 10,000 by email in the greater Nairobi area every month',
  },
  {
    icon: '💬',
    text: 'The advertisement is connected to your WhatsApp. Customers will reach you directly',
  },
  {
    icon: '📲',
    text: 'We engage our readers on social media daily, attracting attention to our site, which gives you potential exposure',
  },
  {
    icon: '⭐',
    text: 'We carry a brief feature promoting all the main advertisers',
  },
]

const HOMEPAGE_BANNER_SIZES = [
  { size: 'Size 1', price: 'KES 150,000 per year' },
  { size: 'Size 2', price: 'KES 80,000 per year' },
  { size: 'Size 3', price: 'KES 60,000 per year' },
]

const RATE_ITEMS = [
  { label: 'Category-page sponsorship', price: 'KES 80,000 per year' },
  { label: 'Subcategory-page sponsorship', price: 'KES 60,000 per year' },
  { label: 'WhatsApp Channel sponsorship', price: 'KES 10,000 per month' },
  { label: 'SMS sponsorship', price: 'KES 10,000 per month' },
  { label: 'Social media promotion', price: 'KES 20,000 per month' },
]

const ADVERTORIAL_RATES = [
  { label: 'Client ready', price: 'KES 10,000 per feature' },
  { label: 'Plus writing', price: 'KES 30,000 per feature' },
]

const EXPLORER_PACKAGE_FEATURES = [
  'Premium listing',
  'Featured position',
  'Website advertisement',
  'Social media mention',
  'WhatsApp feature',
  'Inclusion in relevant newsletter',
]

const PREMIUM_LISTING_FEATURES = [
  'Mention in the premium column on the home page',
  'Priority position on category',
  'More photographs',
  'Enhanced description',
  'Featured placement and promotions, etc.',
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

        {/* Intro paragraphs */}
        <section className="prose max-w-none space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            Research shows that Kiambu Road and the adjoining Ruaka have the highest uptake of housing units in all the Nairobi
            satellite towns. With an uptake of 93%, compared to an average of 73% for the other satellite towns.
          </p>
          <p className="text-muted-foreground leading-relaxed text-base">
            A recent report by a leading real estate firm ranked Thindigua on Kiambu Road with the highest consumer rating of 22.0%,
            compared to Ruiru at 19.7%, Kitengela at 19.4%, and Kikuyu at 18.2%.
          </p>
          <p className="text-muted-foreground leading-relaxed text-base">
            Additionally, Kiambu Road is a highly cosmopolitan area, both nationally and internationally. It hosts people from all
            parts of Kenya and offers residence and business to foreign visitors and residents working in the diplomatic community
            of Gigiri, which is just next door.
          </p>
          <p className="text-muted-foreground leading-relaxed text-base">
            We invite you to advertise your products and services to this community through our site.
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

        {/* Advertising Rates */}
        <section>
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">Advertising Rates</h2>

          <div className="space-y-4">
            {/* Homepage banner */}
            <div className="bg-white rounded-2xl border border-border p-5">
              <p className="font-semibold text-foreground mb-3">Homepage banner</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {HOMEPAGE_BANNER_SIZES.map((item) => (
                  <div key={item.size} className="bg-muted/40 rounded-xl p-4 text-center">
                    <p className="text-xs font-mono text-muted-foreground mb-1">{item.size}</p>
                    <p className="font-semibold text-primary">{item.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sponsored business feature (advertorial) */}
            <div className="bg-white rounded-2xl border border-border p-5">
              <p className="font-semibold text-foreground mb-3">Sponsored business feature (advertorial)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ADVERTORIAL_RATES.map((item) => (
                  <div key={item.label} className="bg-muted/40 rounded-xl p-4 text-center">
                    <p className="text-xs font-mono text-muted-foreground mb-1">{item.label}</p>
                    <p className="font-semibold text-primary">{item.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Remaining flat-rate items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {RATE_ITEMS.map((item) => (
                <div key={item.label} className="bg-white rounded-2xl border border-border p-5 flex items-center justify-between gap-4">
                  <p className="text-sm text-foreground">{item.label}</p>
                  <p className="font-semibold text-primary whitespace-nowrap">{item.price}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Packages */}
        <section>
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">Explorer Business Package &amp; Premium Listings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border-2 border-primary p-6 flex flex-col">
              <p className="font-display text-lg font-bold text-foreground mb-1">Explorer Business Package</p>
              <p className="font-display text-3xl font-bold text-primary mb-5">KES 300,000 <span className="text-sm font-normal text-muted-foreground">per year</span></p>
              <ul className="space-y-2.5 flex-1">
                {EXPLORER_PACKAGE_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6 flex flex-col">
              <p className="font-display text-lg font-bold text-foreground mb-1">Premium Listings Package</p>
              <p className="font-display text-3xl font-bold text-primary mb-5">KES 20,000 <span className="text-sm font-normal text-muted-foreground">per month</span></p>
              <ul className="space-y-2.5 flex-1">
                {PREMIUM_LISTING_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

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
