'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { CheckCircle2, Loader2, HeartHandshake } from 'lucide-react'
import SimpleMarkdown from '@/components/journal/simple-markdown'
import type { CommunityProgramme } from '@/types/database'

export default function CommunityProgrammeDetail({ programme, sectionColor }: { programme: CommunityProgramme; sectionColor: string }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (key: keyof typeof form, value: string) => setForm((p) => ({ ...p, [key]: value }))

  const imageUrl = programme.image_path
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/store-media/${programme.image_path}`
    : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone) {
      toast.error('Name, email, and phone are required.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/programme-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ programme_id: programme.id, ...form }),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
    } catch {
      toast.error('Could not sign you up. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Banner + title */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        {imageUrl && (
          <div className="relative h-56 sm:h-72">
            <Image src={imageUrl} alt={programme.name} fill className="object-cover" />
          </div>
        )}
        <div className="p-6">
          <h1 className="font-display text-2xl sm:text-3xl font-bold mb-2">{programme.name}</h1>
          {programme.tagline && (
            <p className="text-base font-semibold mb-1" style={{ color: sectionColor }}>{programme.tagline}</p>
          )}
          {programme.schedule_note && (
            <p className="text-sm font-mono text-muted-foreground">{programme.schedule_note}</p>
          )}
          {!programme.body_content && programme.description && (
            <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line mt-3">{programme.description}</p>
          )}
        </div>
      </div>

      {/* Full campaign body */}
      {programme.body_content && (
        <div className="bg-white rounded-2xl border border-border p-6 sm:p-8">
          <SimpleMarkdown text={programme.body_content} />
        </div>
      )}

      {/* Donate + Get Involved */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {programme.donate_project_label && (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <HeartHandshake className="w-8 h-8 text-primary mb-3" />
              <h2 className="font-display text-lg font-bold mb-2">Support This Project</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Your donation goes directly towards {programme.name}. Every contribution helps us push this campaign forward.
              </p>
            </div>
            <Link href={`/partner-with-us?project=${encodeURIComponent(programme.donate_project_label)}#donate`}>
              <Button className="w-full bg-primary hover:bg-primary/90 h-12">
                <HeartHandshake className="w-4 h-4 mr-2" /> Donate to This Project
              </Button>
            </Link>
          </div>
        )}

        {submitted ? (
          <div className="bg-white rounded-2xl border border-border p-8 text-center flex flex-col items-center justify-center">
            <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold mb-2">You&apos;re Signed Up!</h2>
            <p className="text-muted-foreground text-sm">We&apos;ll be in touch with details about {programme.name}.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-6 space-y-5">
            <h2 className="font-display text-lg font-bold">Get Involved</h2>
            <p className="text-sm text-muted-foreground -mt-3">Sign up to stay informed and help us with {programme.name}.</p>
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
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
