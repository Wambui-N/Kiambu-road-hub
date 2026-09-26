'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { CheckCircle2, Loader2, MessageCircle, Phone, HeartHandshake } from 'lucide-react'

const VOLUNTEER_WAYS = [
  'Give financial support to support research, documentation and education',
  'Donate to our charity projects',
  'Become a Patron or Donor',
  'Become a business or wellness mentor to the community through our network',
]

const PROJECT_WAYS = [
  'Fund and broadcast our charity projects',
  'Advertise your business on our platform',
  'Display our banners in your business premises',
  'Co-host events with us',
]

const DONATION_AMOUNTS = ['5,000', '10,000', '50,000', '100,000', '500,000']

const FREQUENCIES: { label: string; value: 'one_time' | 'weekly' | 'monthly' | 'annual' }[] = [
  { label: 'One-time', value: 'one_time' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Annual', value: 'annual' },
]

const DONATION_PROJECTS = ['General Support', 'Road safety campaign', 'Clean Kiambu Road campaign']

function PartnerWithUsContent() {
  const searchParams = useSearchParams()
  const projectFromQuery = searchParams.get('project')

  // Partner inquiry form
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [inquiryLoading, setInquiryLoading] = useState(false)
  const [inquirySubmitted, setInquirySubmitted] = useState(false)

  const setInquiryField = (key: keyof typeof inquiryForm, value: string) =>
    setInquiryForm((p) => ({ ...p, [key]: value }))

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inquiryForm.name || !inquiryForm.email) {
      toast.error('Name and email are required.')
      return
    }
    setInquiryLoading(true)
    try {
      const res = await fetch('/api/partner-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryForm),
      })
      if (!res.ok) throw new Error('Submission failed')
      setInquirySubmitted(true)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setInquiryLoading(false)
    }
  }

  // Donation form
  const [selectedAmount, setSelectedAmount] = useState<string>('10,000')
  const [customAmount, setCustomAmount] = useState('')
  const [frequency, setFrequency] = useState<'one_time' | 'weekly' | 'monthly' | 'annual'>('one_time')
  const [project, setProject] = useState(projectFromQuery || 'General Support')
  const [instructions, setInstructions] = useState('')

  const projectOptions = projectFromQuery && !DONATION_PROJECTS.includes(projectFromQuery)
    ? [...DONATION_PROJECTS, projectFromQuery]
    : DONATION_PROJECTS
  const [donorForm, setDonorForm] = useState({ donor_name: '', email: '', phone: '' })
  const [donationLoading, setDonationLoading] = useState(false)
  const [donationSubmitted, setDonationSubmitted] = useState(false)

  const setDonorField = (key: keyof typeof donorForm, value: string) =>
    setDonorForm((p) => ({ ...p, [key]: value }))

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = selectedAmount === 'Other' ? customAmount : selectedAmount.replace(/,/g, '')
    if (!donorForm.donor_name || !donorForm.email) {
      toast.error('Name and email are required.')
      return
    }
    if (!amount || Number(amount) <= 0) {
      toast.error('Please select or enter a donation amount.')
      return
    }
    setDonationLoading(true)
    try {
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...donorForm,
          amount,
          frequency,
          project,
          additional_instructions: instructions,
        }),
      })
      if (!res.ok) throw new Error('Submission failed')
      setDonationSubmitted(true)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setDonationLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-surface">
      {/* Hero */}
      <div className="bg-primary py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-accent font-mono text-xs uppercase tracking-widest mb-2">Make a Difference</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">Want to Impact Kiambu Road?</h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
            Partner with us and make a real difference
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">

        {/* Intro */}
        <section className="prose max-w-none space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            Our mission is to help people discover, compare and connect with the best of Kiambu Road, and we can&apos;t do this alone.
          </p>
          <p className="text-muted-foreground leading-relaxed text-base">
            We need advertisers, volunteers, champions, and even financial supporters to strengthen our impact on business and society.
          </p>
        </section>

        {/* Ways to Support */}
        <section className="space-y-10">
          <h2 className="font-display text-2xl font-bold text-foreground">Ways to Support</h2>

          {/* Volunteer Partnership */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-3">Volunteer Partnership</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-2">
              If you share our passion and want to volunteer your time, skills and talents, there are many ways to engage.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              We are always eager to work with individuals with specific skills such as marketing and networking, photography,
              storytelling, and fundraising.
            </p>
            <p className="text-sm font-semibold text-foreground mb-3">You can also:</p>
            <ul className="space-y-2">
              {VOLUNTEER_WAYS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary font-bold mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Project Partnership */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-3">Project Partnership</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Let us unite in mutually beneficial partnerships with businesses and not-for-profit organisations working around
              Kiambu Road
            </p>
            <p className="text-sm font-semibold text-foreground mb-3">Ways to support:</p>
            <ul className="space-y-2">
              {PROJECT_WAYS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary font-bold mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Stakeholder Engagement */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-3">Stakeholder Engagement</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Through networking with like-minded stakeholders, we can jointly lobby for favourable policies to safeguard the
              environment, promote road safety and enhance the business climate
            </p>
          </div>
        </section>

        {/* Partner Inquiry */}
        <section>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">Get In Touch</h2>
          <p className="text-sm text-muted-foreground mb-6">For more information about partnering with us, please get in touch</p>

          {inquirySubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl border border-border p-10 text-center max-w-lg"
            >
              <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold mb-2">Message Sent!</h3>
              <p className="text-muted-foreground text-sm">Thank you for your interest. Our team will get back to you within 24 hours.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="bg-white rounded-2xl border border-border p-6 space-y-5 max-w-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Full Name *</Label>
                  <Input value={inquiryForm.name} onChange={(e) => setInquiryField('name', e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Email *</Label>
                  <Input type="email" value={inquiryForm.email} onChange={(e) => setInquiryField('email', e.target.value)} required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input type="tel" value={inquiryForm.phone} onChange={(e) => setInquiryField('phone', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Message</Label>
                <Textarea
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryField('message', e.target.value)}
                  rows={4}
                  placeholder="Tell us how you'd like to partner with us..."
                />
              </div>
              <Button type="submit" disabled={inquiryLoading} className="w-full bg-primary hover:bg-primary/90 py-3 h-auto">
                {inquiryLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {inquiryLoading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          )}
        </section>

        {/* Donate */}
        <section id="donate" className="scroll-mt-24">
          <div className="flex items-center gap-2 mb-2">
            <HeartHandshake className="w-6 h-6 text-primary" />
            <h2 className="font-display text-2xl font-bold text-foreground">Donate</h2>
          </div>

          {donationSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl border border-border p-10 text-center max-w-lg"
            >
              <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold mb-2">Thank You!</h3>
              <p className="text-muted-foreground text-sm">
                We&apos;ve recorded your donation pledge and will contact you shortly to arrange payment.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleDonationSubmit} className="bg-white rounded-2xl border border-border p-6 space-y-6 max-w-lg">
              {/* Amount */}
              <div className="space-y-1.5">
                <Label>Select Donation Amount (KES)</Label>
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                  {DONATION_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setSelectedAmount(amt)}
                      className={`px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all text-center ${
                        selectedAmount === amt
                          ? 'border-primary bg-primary/5 text-foreground'
                          : 'border-border hover:border-primary/50 text-muted-foreground'
                      }`}
                    >
                      {amt}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSelectedAmount('Other')}
                    className={`px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all text-center ${
                      selectedAmount === 'Other'
                        ? 'border-primary bg-primary/5 text-foreground'
                        : 'border-border hover:border-primary/50 text-muted-foreground'
                    }`}
                  >
                    Other
                  </button>
                </div>
                {selectedAmount === 'Other' && (
                  <Input
                    type="number"
                    min="1"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Enter amount in KES"
                    className="mt-2"
                  />
                )}
              </div>

              {/* Frequency */}
              <div className="space-y-1.5">
                <Label>Frequency</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {FREQUENCIES.map((f) => (
                    <button
                      key={f.value}
                      type="button"
                      onClick={() => setFrequency(f.value)}
                      className={`px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all text-center ${
                        frequency === f.value
                          ? 'border-primary bg-primary/5 text-foreground'
                          : 'border-border hover:border-primary/50 text-muted-foreground'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Project */}
              <div className="space-y-1.5">
                <Label>How should we use your donation?</Label>
                <p className="text-xs text-muted-foreground">Flagship Projects</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {projectOptions.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setProject(p)}
                      className={`px-3 py-2.5 rounded-xl border-2 text-xs font-medium transition-all text-center ${
                        project === p
                          ? 'border-primary bg-primary/5 text-foreground'
                          : 'border-border hover:border-primary/50 text-muted-foreground'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional instructions */}
              <div className="space-y-1.5">
                <Label>Additional Instructions</Label>
                <Textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={3} />
              </div>

              {/* Donor details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border">
                <div className="space-y-1.5 pt-4">
                  <Label>Full Name *</Label>
                  <Input value={donorForm.donor_name} onChange={(e) => setDonorField('donor_name', e.target.value)} required />
                </div>
                <div className="space-y-1.5 pt-4">
                  <Label>Email *</Label>
                  <Input type="email" value={donorForm.email} onChange={(e) => setDonorField('email', e.target.value)} required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input type="tel" value={donorForm.phone} onChange={(e) => setDonorField('phone', e.target.value)} />
              </div>

              <p className="text-xs text-muted-foreground">
                No online payment is collected yet — we&apos;ll reach out to arrange payment once your pledge is submitted.
              </p>

              <Button type="submit" disabled={donationLoading} className="w-full bg-primary hover:bg-primary/90 py-3 h-auto">
                {donationLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {donationLoading ? 'Submitting...' : 'Pledge Donation'}
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
              href="https://wa.me/254720950500?text=Hi%2C%20I%27d%20like%20to%20partner%20with%20Kiambu%20Road%20Explorer"
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

export default function PartnerWithUsPage() {
  return (
    <Suspense fallback={null}>
      <PartnerWithUsContent />
    </Suspense>
  )
}
