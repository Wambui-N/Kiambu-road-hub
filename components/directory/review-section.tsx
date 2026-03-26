'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, CheckCircle2, Loader2, PenLine, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import type { Review } from '@/types/database'

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

interface ReviewSectionProps {
  businessId: string
  initialReviews: Review[]
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110 focus:outline-none"
          aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
        >
          <Star
            className="w-8 h-8"
            fill={(hover || value) >= star ? '#F59E0B' : 'transparent'}
            color={(hover || value) >= star ? '#F59E0B' : '#D1D5DB'}
          />
        </button>
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="border-b border-border pb-4 last:border-0 last:pb-0">
      <div className="flex items-start justify-between mb-1.5">
        <div>
          <span className="font-semibold text-sm">{review.reviewer_name}</span>
          <div className="flex gap-0.5 mt-0.5">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`}
              />
            ))}
          </div>
        </div>
        <span className="text-xs font-mono text-muted-foreground shrink-0 mt-0.5">
          {new Date(review.created_at).toLocaleDateString('en-KE', { month: 'short', year: 'numeric' })}
        </span>
      </div>
      {review.comment && (
        <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
      )}
    </div>
  )
}

export default function ReviewSection({ businessId, initialReviews }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rating, setRating] = useState(0)
  const [form, setForm] = useState({ reviewer_name: '', comment: '' })

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rating) { toast.error('Please select a star rating.'); return }
    if (!form.reviewer_name.trim()) { toast.error('Please enter your name.'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: businessId,
          reviewer_name: form.reviewer_name.trim(),
          rating,
          comment: form.comment.trim(),
        }),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
    } catch {
      toast.error('Could not submit your review. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <h2 className="font-semibold text-lg">Reviews</h2>
          {reviews.length > 0 && (
            <span className="text-xs font-mono text-muted-foreground">
              ({reviews.length})
            </span>
          )}
        </div>

        {/* Aggregate rating badge */}
        {avgRating !== null && (
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-bold text-amber-700">{avgRating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Existing reviews */}
      {reviews.length === 0 && !showForm && (
        <p className="text-sm text-muted-foreground mb-4">
          No reviews yet. Be the first to share your experience!
        </p>
      )}

      {reviews.length > 0 && (
        <div className="space-y-4 mb-6">
          {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
        </div>
      )}

      {/* Write a review toggle / form */}
      {!submitted ? (
        <>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            <PenLine className="w-4 h-4" />
            Write a Review
            {showForm
              ? <ChevronUp className="w-4 h-4" />
              : <ChevronDown className="w-4 h-4" />
            }
          </button>

          <AnimatePresence>
            {showForm && (
              <motion.form
                key="review-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleSubmit}
                className="overflow-hidden"
              >
                <div className="pt-5 space-y-4 border-t border-border mt-4">
                  {/* Star picker */}
                  <div className="space-y-1.5">
                    <Label>Your Rating *</Label>
                    <StarPicker value={rating} onChange={setRating} />
                    {rating > 0 && (
                      <p className="text-xs font-mono text-muted-foreground">
                        {RATING_LABELS[rating]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label>Your Name *</Label>
                    <Input
                      value={form.reviewer_name}
                      onChange={(e) => setForm((p) => ({ ...p, reviewer_name: e.target.value }))}
                      placeholder="How should we address you?"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Your Review <span className="text-muted-foreground font-normal">(optional)</span></Label>
                    <Textarea
                      value={form.comment}
                      onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))}
                      placeholder="Share your experience with this business..."
                      rows={3}
                    />
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Reviews are moderated before publishing. Please keep feedback honest and respectful.
                  </p>

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-primary hover:bg-primary/90"
                    >
                      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      {loading ? 'Submitting…' : 'Submit Review'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-xl p-4 mt-4"
        >
          <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-primary">Thank you for your review!</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              It will appear here once our team has approved it.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
