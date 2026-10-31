'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { BadgeCheck, Crown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getImageUrl, truncateWords } from '@/lib/utils'
import BusinessImagePlaceholder from '@/components/directory/business-image-placeholder'
import type { Business } from '@/types/database'

interface BusinessCardProps {
  business: Business
  variant?: 'default' | 'featured' | 'compact'
}

export default function BusinessCard({ business }: BusinessCardProps) {
  const coverImage = business.images?.find((i) => i.is_cover) ?? business.images?.[0]
  const imageUrl = coverImage ? getImageUrl(coverImage.image_path) : null
  const profileHref = `/directory/business/${business.slug}`

  // Compute own-site rating from approved reviews
  const reviews = business.reviews ?? []
  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null

  const description = business.short_description
    ? truncateWords(business.short_description, 22)
    : null

  // One mono fact row: area, price band, rating, hours — whichever apply
  const factParts = [
    business.area?.name,
    business.price_range,
    avgRating !== null ? `★ ${avgRating.toFixed(1)}` : null,
    business.opening_hours_text,
  ].filter(Boolean)

  return (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.15 }}
      className="group bg-card rounded-lg border border-border overflow-hidden hover:border-primary transition-colors flex flex-col"
    >
      <Link href={profileHref} className="block">
        <div className="relative h-44 bg-muted overflow-hidden shrink-0">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={coverImage?.alt_text ?? business.name}
              fill
              className="object-cover muted-photo scale-100 group-hover:scale-[1.03] transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <BusinessImagePlaceholder
              name={business.name}
              categorySlug={business.category?.slug}
              categoryColor={business.category?.color}
              categoryIcon={business.category?.icon}
            />
          )}
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            {business.is_sponsor && (
              <Badge className="bg-accent text-accent-foreground text-[10px] font-mono gap-1">
                <Crown className="w-2.5 h-2.5" /> Featured
              </Badge>
            )}
            {business.verified && (
              <Badge className="bg-primary text-primary-foreground text-[10px] font-mono gap-1">
                <BadgeCheck className="w-2.5 h-2.5" /> Verified
              </Badge>
            )}
          </div>
          {business.subcategory && (
            <div className="absolute bottom-3 left-3">
              <Badge variant="secondary" className="text-[10px] font-mono">
                {business.subcategory.name}
              </Badge>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-semibold text-foreground leading-snug line-clamp-1">
          {business.name}
        </h3>

        {factParts.length > 0 && (
          <p className="text-xs font-mono text-muted-foreground flex items-center gap-1.5 flex-wrap">
            {factParts.join('  ·  ')}
          </p>
        )}

        {description && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {description}
          </p>
        )}

        <Link href={profileHref} className="mt-auto pt-2">
          <Button variant="outline" size="sm" className="w-full">
            View Details
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}
