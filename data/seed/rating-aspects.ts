export interface RatingAspect {
  key: string
  label: string
}

/**
 * Category-slug -> the aspects reviewers rate (1-5 each) instead of one
 * flat star. The overall `rating` stored on the review is the average of
 * these. Categories not listed here fall back to DEFAULT_ASPECTS, so every
 * category gets a breakdown rather than only a hardcoded few.
 */
export const RATING_ASPECTS: Record<string, RatingAspect[]> = {
  'medical-services': [
    { key: 'cleanliness', label: 'Cleanliness' },
    { key: 'staff_friendliness', label: 'Staff Friendliness' },
    { key: 'wait_time', label: 'Wait Time' },
    { key: 'value', label: 'Value' },
  ],
  'eat-drink-stay': [
    { key: 'family_friendly', label: 'Family Friendly' },
    { key: 'parking', label: 'Parking' },
    { key: 'value', label: 'Value' },
    { key: 'cleanliness', label: 'Cleanliness' },
    { key: 'food_variety', label: 'Food Variety' },
  ],
  'malls': [
    { key: 'value', label: 'Value' },
    { key: 'product_range', label: 'Product Range' },
    { key: 'customer_service', label: 'Customer Service' },
    { key: 'cleanliness', label: 'Cleanliness' },
  ],
  'retail-shopping': [
    { key: 'value', label: 'Value' },
    { key: 'product_range', label: 'Product Range' },
    { key: 'customer_service', label: 'Customer Service' },
    { key: 'cleanliness', label: 'Cleanliness' },
  ],
  'lifestyle-wellness': [
    { key: 'cleanliness', label: 'Cleanliness' },
    { key: 'staff_friendliness', label: 'Staff Friendliness' },
    { key: 'value', label: 'Value' },
    { key: 'ambience', label: 'Ambience' },
  ],
  'education-childcare': [
    { key: 'safety', label: 'Safety' },
    { key: 'staff_friendliness', label: 'Staff Friendliness' },
    { key: 'value', label: 'Value' },
    { key: 'facilities', label: 'Facilities' },
  ],
}

export const DEFAULT_RATING_ASPECTS: RatingAspect[] = [
  { key: 'value', label: 'Value' },
  { key: 'service', label: 'Service' },
  { key: 'cleanliness', label: 'Cleanliness' },
]

export function getRatingAspects(categorySlug: string | null | undefined): RatingAspect[] {
  if (!categorySlug) return DEFAULT_RATING_ASPECTS
  return RATING_ASPECTS[categorySlug] ?? DEFAULT_RATING_ASPECTS
}

export function averageAspectRatings(values: Record<string, number>): number {
  const nums = Object.values(values)
  if (!nums.length) return 0
  return Math.round((nums.reduce((s, n) => s + n, 0) / nums.length) * 10) / 10
}
