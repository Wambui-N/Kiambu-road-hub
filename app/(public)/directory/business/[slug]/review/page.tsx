'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { CheckCircle2, Loader2, Star } from 'lucide-react'

async function getBusinessId(slug: string): Promise<{ id: string; name: string } | null> {
  try {
    const res = await fetch(`/api/business-lookup?slug=${encodeURIComponent(slug)}`)
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default function WriteReviewPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [form, setForm] = useState({ reviewer_name: '', comment: '' })
  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rating) { toast.error('Please select a rating.'); return }
    if (!form.reviewer_name.trim()) { toast.error('Please enter your name.'); return }
    setLoading(true)
    try {
      const business = await getBusinessId(slug)
      if (!business) throw new Error('Business not found')

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: business.id,
          reviewer_name: form.reviewer_name,
          rating,
          comment: form.comment,
        }),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
    } catch {
      toast.error('Could not submit review. Please try again.')
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
          className="bg-white rounded-2xl border border-border p-10 text-center max-w-md"
        >
          <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-3">Thank You!</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Your review has been submitted and will appear after moderation. We appreciate your feedback!
          </p>
          <Button className="bg-primary hover:bg-primary/90" onClick={() => router.push(`/directory/business/${slug}`)}>
            Back to Business
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="bg-primary py-10">
        <div className="max-w-2xl mx-auto px-4">
          <nav className="text-xs font-mono text-white/60 mb-3 flex items-center gap-1.5">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href={`/directory/business/${slug}`} className="hover:text-white">Business</Link>
            <span>/</span>
            <span className="text-white">Write a Review</span>
          </nav>
          <h1 className="font-display text-3xl font-bold text-white">Write a Review</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-6 sm:p-8 space-y-5">
          {/* Star rating */}
          <div className="space-y-2">
            <Label>Your Rating *</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className="w-9 h-9"
                    fill={(hover || rating) >= star ? '#F59E0B' : 'transparent'}
                    color={(hover || rating) >= star ? '#F59E0B' : '#D1D5DB'}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-xs font-mono text-muted-foreground">
                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Your Name *</Label>
            <Input
              value={form.reviewer_name}
              onChange={(e) => set('reviewer_name', e.target.value)}
              placeholder="How should we address you?"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>Your Review</Label>
            <Textarea
              value={form.comment}
              onChange={(e) => set('comment', e.target.value)}
              placeholder="Share your experience with this business..."
              rows={4}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Reviews are moderated before publishing. Please keep feedback honest and respectful.
          </p>

          <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 h-12">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {loading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </div>
    </div>
  )
}
