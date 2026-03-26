import { createClient } from '@/lib/supabase/server'
import ReviewActions from '@/components/admin/review-actions'
import { Star } from 'lucide-react'

async function getReviews() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('reviews')
      .select('*, business:businesses(id, name, slug)')
      .order('created_at', { ascending: false })
      .limit(200)
    return data ?? []
  } catch {
    return []
  }
}

const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

export default async function AdminReviewsPage() {
  const reviews = await getReviews()
  const pending = reviews.filter((r) => r.status === 'pending').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Community Reviews</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {reviews.length} total · {pending} pending approval
        </p>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {reviews.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">⭐</p>
            <h3 className="font-semibold mb-1">No reviews yet</h3>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {reviews.map((review) => {
              const business = review.business as { name?: string; slug?: string } | null
              return (
                <div key={review.id} className={`p-4 hover:bg-muted/20 transition-colors ${review.status === 'pending' ? 'bg-amber-50/40' : ''}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm">{review.reviewer_name}</p>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${STATUS_COLOR[review.status] ?? ''}`}>
                          {review.status}
                        </span>
                      </div>
                      {business?.name && (
                        <p className="text-xs text-primary font-mono mb-1">{business.name}</p>
                      )}
                      <div className="flex gap-0.5 mb-2">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} />
                        ))}
                      </div>
                      {review.comment && (
                        <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <p className="text-[10px] font-mono text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                      <ReviewActions id={review.id} status={review.status} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
