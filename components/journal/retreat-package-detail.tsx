'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { CheckCircle2, Loader2 } from 'lucide-react'
import type { RetreatPackage } from '@/types/database'

export default function RetreatPackageDetail({ pkg, sectionColor }: { pkg: RetreatPackage; sectionColor: string }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', preferred_dates: '', people_count: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (key: keyof typeof form, value: string) => setForm((p) => ({ ...p, [key]: value }))

  const imageUrl = pkg.image_path
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/store-media/${pkg.image_path}`
    : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone) {
      toast.error('Name, email, and phone are required.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/retreat-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package_id: pkg.id,
          ...form,
          people_count: form.people_count ? parseInt(form.people_count) : null,
        }),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
    } catch {
      toast.error('Could not send your booking request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        {imageUrl && (
          <div className="relative h-56">
            <Image src={imageUrl} alt={pkg.name} fill className="object-cover" />
          </div>
        )}
        <div className="p-6">
          <h1 className="font-display text-2xl font-bold mb-2">{pkg.name}</h1>
          <div className="flex items-center gap-3 mb-4 text-sm font-mono">
            {pkg.duration_note && <span className="text-muted-foreground">{pkg.duration_note}</span>}
            {pkg.price != null && (
              <span className="font-bold" style={{ color: sectionColor }}>
                {pkg.currency} {Number(pkg.price).toLocaleString()}
              </span>
            )}
          </div>
          {pkg.description && (
            <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line">{pkg.description}</p>
          )}
        </div>
      </div>

      {submitted ? (
        <div className="bg-white rounded-2xl border border-border p-8 text-center">
          <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold mb-2">Booking Request Sent!</h2>
          <p className="text-muted-foreground text-sm">We&apos;ll contact you shortly to confirm your {pkg.name} retreat.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-6 space-y-5">
          <h2 className="font-display text-lg font-bold">Book This Retreat</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Full Name *</Label>
              <Input value={form.name} onChange={(e) => set('name', e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>Email *</Label>
              <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Phone *</Label>
            <Input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Preferred Dates</Label>
              <Input value={form.preferred_dates} onChange={(e) => set('preferred_dates', e.target.value)} placeholder="e.g. 15-17 Nov" />
            </div>
            <div className="space-y-1.5">
              <Label>Number of People</Label>
              <Input type="number" min="1" value={form.people_count} onChange={(e) => set('people_count', e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Message</Label>
            <Textarea value={form.message} onChange={(e) => set('message', e.target.value)} rows={3} />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 h-12">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {loading ? 'Sending...' : 'Request Booking'}
          </Button>
        </form>
      )}
    </div>
  )
}
