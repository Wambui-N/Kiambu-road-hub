// ─── Outbound click tracking utilities ───────────────────────────────────────
// Used by server AND client components — pure functions only, no imports.

export type LinkType = 'website' | 'whatsapp' | 'phone' | 'email' | 'maps' | 'ad'

export type TrackingSurface =
  | 'business_card'
  | 'featured_banner'
  | 'business_profile'
  | 'home_ads'
  | 'category_ads'

export interface TrackingContext {
  linkType: LinkType
  surface: TrackingSurface
  businessId?: string | null
  businessSlug?: string | null
  categorySlug?: string | null
  adSlotId?: string | null
}

/**
 * Wraps any outbound URL so it routes through /api/out which logs the click
 * and (for website links) appends UTM parameters before redirecting.
 */
export function buildTrackedUrl(destinationUrl: string, ctx: TrackingContext): string {
  if (!destinationUrl) return destinationUrl
  const params = new URLSearchParams({
    url: destinationUrl,
    type: ctx.linkType,
    surface: ctx.surface,
  })
  if (ctx.businessId) params.set('bid', ctx.businessId)
  if (ctx.businessSlug) params.set('bslug', ctx.businessSlug)
  if (ctx.categorySlug) params.set('cat', ctx.categorySlug)
  if (ctx.adSlotId) params.set('sid', ctx.adSlotId)
  return `/api/out?${params.toString()}`
}
