import Link from 'next/link'
import Image from 'next/image'
import { BadgeCheck, Crown, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getImageUrl, truncateWords } from '@/lib/utils'
import BusinessImagePlaceholder from '@/components/directory/business-image-placeholder'
import type { Business } from '@/types/database'

interface Props {
  business: Business
}

export default function FeaturedListingBanner({ business }: Props) {
  const coverImage = business.images?.find((i) => i.is_cover) ?? business.images?.[0]
  const imageUrl = coverImage ? getImageUrl(coverImage.image_path) : null
  const profileHref = `/directory/business/${business.slug}`

  const reviews = business.reviews ?? []
  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null

  const description = business.short_description
    ? truncateWords(business.short_description, 25)
    : business.description
      ? truncateWords(business.description, 25)
      : null

  const factParts = [
    business.area?.name,
    business.price_range,
    avgRating !== null ? `★ ${avgRating.toFixed(1)}` : null,
    business.opening_hours_text,
  ].filter(Boolean)

  return (
    <div className="relative w-full bg-card rounded-lg border border-accent overflow-hidden mb-6">
      <div className="absolute top-0 left-0 z-10 bg-accent text-accent-foreground text-[10px] font-mono font-bold px-3 py-1 rounded-br-md flex items-center gap-1">
        <Crown className="w-3 h-3" /> Featured Listing
      </div>

      <div className="flex flex-col sm:flex-row">
        <div className="relative sm:w-64 lg:w-80 h-52 sm:h-auto shrink-0 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={coverImage?.alt_text ?? business.name}
              fill
              className="object-cover muted-photo"
              sizes="(max-width: 640px) 100vw, 320px"
              priority
            />
          ) : (
            <BusinessImagePlaceholder
              name={business.name}
              categorySlug={business.category?.slug}
              categoryColor={business.category?.color}
              categoryIcon={business.category?.icon}
            />
          )}
        </div>

        <div className="flex-1 p-5 sm:p-6 flex flex-col gap-2 pt-8 sm:pt-6">
          <div className="flex flex-wrap items-start gap-2">
            <Link href={profileHref}>
              <h2 className="font-display text-xl font-medium text-foreground hover:text-primary transition-colors leading-tight">
                {business.name}
              </h2>
            </Link>
            <div className="flex gap-1.5 flex-wrap">
              {business.verified && (
                <Badge className="bg-primary text-primary-foreground text-[10px] font-mono gap-1">
                  <BadgeCheck className="w-2.5 h-2.5" /> Verified
                </Badge>
              )}
              {business.subcategory && (
                <Badge variant="secondary" className="text-[10px] font-mono">
                  {business.subcategory.name}
                </Badge>
              )}
            </div>
          </div>

          {factParts.length > 0 && (
            <p className="text-xs font-mono text-muted-foreground">{factParts.join('  ·  ')}</p>
          )}

          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          )}

          <Link
            href={profileHref}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-foreground bg-accent hover:bg-accent/85 transition-colors h-9 px-4 rounded-md mt-auto pt-0 w-fit"
          >
            View Profile <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
