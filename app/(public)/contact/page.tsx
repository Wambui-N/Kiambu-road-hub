'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to send message')
      setSubmitted(true)
      toast.success('Message sent! We will get back to you shortly.')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-accent font-mono text-xs uppercase tracking-widest mb-2">Get in Touch</p>
          <h1 className="font-display text-4xl font-bold text-white">Contact Us</h1>
          <p className="text-white/70 text-sm mt-2">
            Questions, listings, partnerships, or just a hello — we would love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Contact details */}
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-mono">Email</p>
                    <a href="mailto:info@kiamburoad-hub.com"
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                      info@kiamburoad-hub.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-mono">Coverage Area</p>
                    <p className="text-sm font-medium text-foreground">
                      Kiambu Road Corridor, Nairobi, Kenya
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-5">
              <h3 className="font-semibold text-sm text-foreground mb-3">Quick Links</h3>
              <ul className="space-y-2">
                {[
                  { label: 'List Your Business', href: '/list-your-business' },
                  { label: 'Browse Directory', href: '/directory' },
                  { label: 'Emergency Contacts', href: '/emergency' },
                  { label: 'About Us', href: '/about' },
                ].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      → {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-white rounded-2xl border border-border p-10 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">Message Sent!</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Thank you for reaching out. We typically respond within 1–2 business days.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }) }}
                  className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-6 lg:p-8 space-y-5">
                <h2 className="font-display text-xl font-bold text-foreground">Send Us a Message</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-muted-foreground mb-1.5">Your Name *</label>
                    <Input name="name" value={form.name} onChange={handleChange} required placeholder="John Kamau" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-muted-foreground mb-1.5">Email Address *</label>
                    <Input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="john@example.com" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-muted-foreground mb-1.5">Phone (optional)</label>
                    <Input name="phone" value={form.phone} onChange={handleChange} placeholder="+254 7xx xxx xxx" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-muted-foreground mb-1.5">Subject *</label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select subject</option>
                      <option value="general">General Enquiry</option>
                      <option value="listing">Business Listing Query</option>
                      <option value="update">Update / Claim a Listing</option>
                      <option value="partnership">Partnership / Advertising</option>
                      <option value="error">Report an Error</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-muted-foreground mb-1.5">Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="w-full px-3 py-2.5 rounded-lg border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl h-auto"
                >
                  {loading ? 'Sending...' : (
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" /> Send Message
                    </span>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
