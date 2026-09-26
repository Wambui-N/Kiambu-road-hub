'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { CheckCircle2, Loader2 } from 'lucide-react'
import type { AgencyService } from '@/types/database'

export default function AgencyServiceDetail({ service, sectionColor }: { service: AgencyService; sectionColor: string }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (key: keyof typeof form, value: string) => setForm((p) => ({ ...p, [key]: value }))

  const imageUrl = service.image_path
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/store-media/${service.image_path}`
    : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone) {
      toast.error('Name, email, and phone are required.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/agency-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service_id: service.id, ...form }),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
    } catch {
      toast.error('Could not send your enquiry. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        {imageUrl && (
          <div className="relative h-56">
            <Image src={imageUrl} alt={service.name} fill className="object-cover" />
          </div>
        )}
        <div className="p-6">
          <h1 className="font-display text-2xl font-bold mb-2">{service.name}</h1>
          {service.price_note && (
            <p className="text-sm font-mono font-semibold mb-4" style={{ color: sectionColor }}>{service.price_note}</p>
          )}
          {service.description && (
            <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line">{service.description}</p>
          )}
        </div>
      </div>

      {submitted ? (
        <div className="bg-white rounded-2xl border border-border p-8 text-center">
          <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold mb-2">Enquiry Sent!</h2>
          <p className="text-muted-foreground text-sm">We&apos;ll get back to you shortly about {service.name}.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-6 space-y-5">
          <h2 className="font-display text-lg font-bold">Enquire About This Service</h2>
          <div className="space-y-1.5">
            <Label>Full Name *</Label>
            <Input value={form.name} onChange={(e) => set('name', e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Email *</Label>
            <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Phone *</Label>
            <Input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Message</Label>
            <Textarea value={form.message} onChange={(e) => set('message', e.target.value)} rows={4} placeholder="Tell us what you need..." />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 h-12">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {loading ? 'Sending...' : 'Send Enquiry'}
          </Button>
        </form>
      )}
    </div>
  )
}
