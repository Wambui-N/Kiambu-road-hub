'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { CheckCircle2, Loader2, MapPin, Calendar } from 'lucide-react'
import SimpleMarkdown from '@/components/journal/simple-markdown'
import type { KiambuEvent } from '@/types/database'

const EVENTS_COLOR = '#E8A020'

export default function EventDetail({ event }: { event: KiambuEvent }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (key: keyof typeof form, value: string) => setForm((p) => ({ ...p, [key]: value }))

  const imageUrl = event.image_path
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/store-media/${event.image_path}`
    : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone) {
      toast.error('Name, email, and phone are required.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/event-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: event.id, ...form }),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
    } catch {
      toast.error('Could not send your inquiry. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        {imageUrl && (
          <div className="relative h-56 sm:h-72">
            <Image src={imageUrl} alt={event.name} fill className="object-cover" />
          </div>
        )}
        <div className="p-6">
          <h1 className="font-display text-2xl sm:text-3xl font-bold mb-2">{event.name}</h1>
          {event.tagline && (
            <p className="text-base font-semibold mb-3" style={{ color: EVENTS_COLOR }}>{event.tagline}</p>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-mono">
            {event.venue_note && (
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {event.venue_note}</span>
            )}
            {event.date_note && (
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {event.date_note}</span>
            )}
          </div>
          {!event.body_content && event.description && (
            <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line mt-3">{event.description}</p>
          )}
        </div>
      </div>

      {event.body_content && (
        <div className="bg-white rounded-2xl border border-border p-6 sm:p-8">
          <SimpleMarkdown text={event.body_content} />
        </div>
      )}

      {submitted ? (
        <div className="bg-white rounded-2xl border border-border p-8 text-center max-w-lg">
          <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold mb-2">Inquiry Sent!</h2>
          <p className="text-muted-foreground text-sm">We&apos;ll be in touch about {event.name}.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-6 space-y-5 max-w-lg">
          <h2 className="font-display text-lg font-bold">Get In Touch About This Event</h2>
          <p className="text-sm text-muted-foreground -mt-3">Exhibiting, partnering or just want more details? Send us a message.</p>
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
            <Textarea value={form.message} onChange={(e) => set('message', e.target.value)} rows={3} />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 h-12">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {loading ? 'Sending...' : 'Send Inquiry'}
          </Button>
        </form>
      )}
    </div>
  )
}
