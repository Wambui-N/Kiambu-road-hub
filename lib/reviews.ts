import type { SupabaseClient } from '@supabase/supabase-js'

export interface ReviewAggregate {
  average: number | null
  count: number
}

/**
 * Average + count over ALL approved reviews for a business, not just the
 * most recent page of them — used for the headline rating so it matches what
 * business-card.tsx / category / search pages already compute via their
 * unlimited `reviews:reviews(rating)` join.
 */
export async function getReviewAggregate(
  supabase: SupabaseClient,
  businessId: string
): Promise<ReviewAggregate> {
  const { data } = await supabase
    .from('reviews')
    .select('rating')
    .eq('business_id', businessId)
    .eq('status', 'approved')

  if (!data || data.length === 0) return { average: null, count: 0 }
  const average = data.reduce((sum, r) => sum + Number(r.rating), 0) / data.length
  return { average: Math.round(average * 10) / 10, count: data.length }
}
