import Link from 'next/link'
import Image from 'next/image'
import { Phone, MessageCircle, Globe, MapPin, BadgeCheck, Crown, Star, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getWhatsAppUrl, getImageUrl, truncateWords } from '@/lib/utils'
import type { Business } from '@/types/database'

const CATEGORY_IMAGE_MAP: Record<string, string> = {
  'eat-drink-stay':        'https://images.unsplash.com/photo-1768697359488-9cc9937056a6?auto=format&fit=crop&w=1200&q=80',
  'health-wellness':       'https://images.unsplash.com/photo-1755995083683-50d08cd83d09?auto=format&fit=crop&w=1200&q=80',
  'education-childcare':   'https://images.unsplash.com/photo-1549380883-4dd936bbc0fa?auto=format&fit=crop&w=1200&q=80',
  'retail-shopping':       'https://images.unsplash.com/photo-1672363547647-8fad02572412?auto=format&fit=crop&w=1200&q=80',
  'car-motor-dealers':     'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80',
  'auto-services':         'https://images.unsplash.com/photo-1632823469850-2f77dd9c7f93?auto=format&fit=crop&w=1200&q=80',
  'real-estate-property':  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
  'building-construction': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
  'home-garden':           'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80',
  'professional-services': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
  'leisure-outdoors':      'https://images.unsplash.com/photo-1540206395-68808572332f?auto=format&fit=crop&w=1200&q=80',
  'transport-logistics':   'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
  'security-emergency':    'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1200&q=80',
  'faith-community':       'https://images.unsplash.com/photo-1438232992991-995b671e4267?auto=format&fit=crop&w=1200&q=80',
  'finance':               'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80',
  'membership-clubs':      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
  default:                 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1200&q=80',
}

interface Props {
  business: Business
}

export default function FeaturedListingBanner({ business }: Props) {
  const coverImage = business.images?.find((i) => i.is_cover) ?? business.images?.[0]
  const categorySlug = business.category?.slug
  const fallbackPath =
    coverImage?.image_path ??
    (categorySlug ? CATEGORY_IMAGE_MAP[categorySlug] ?? CATEGORY_IMAGE_MAP.default : CATEGORY_IMAGE_MAP.default)
  const imageUrl = getImageUrl(fallbackPath)
  const whatsappUrl = business.whatsapp ? getWhatsAppUrl(business.whatsapp) : null

  const locationParts = [
    business.road_street,
    business.building_name,
    business.area?.name,
  ].filter(Boolean)

  const reviews = business.reviews ?? []
  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null

  const description = business.short_description
    ? truncateWords(business.short_description, 25)
    : business.description
      ? truncateWords(business.description, 25)
      : null

  return (
    <div className="relative w-full bg-white rounded-2xl border-2 border-accent overflow-hidden shadow-md mb-6">
      {/* Featured ribbon */}
      <div className="absolute top-0 left-0 z-10 bg-accent text-black text-[10px] font-mono font-bold px-3 py-1 rounded-br-xl flex items-center gap-1">
        <Crown className="w-3 h-3" /> Featured Listing
      </div>

      <div className="flex flex-col sm:flex-row">
        {/* Cover image */}
        <div className="relative sm:w-64 lg:w-80 h-52 sm:h-auto shrink-0 overflow-hidden">
          <Image
            src={imageUrl}
            alt={coverImage?.alt_text ?? business.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 320px"
            priority
          />
          {business.price_range && (
            <div className="absolute bottom-3 right-3">
              <span className="text-[10px] font-mono font-bold bg-black/60 text-white px-2 py-0.5 rounded-full">
                {business.price_range}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5 sm:p-6 flex flex-col gap-3 pt-8 sm:pt-6">
          {/* Name + badges */}
          <div className="flex flex-wrap items-start gap-2">
            <Link href={`/directory/business/${business.slug}`}>
              <h2 className="font-display text-xl font-bold text-foreground hover:text-primary transition-colors leading-tight">
                {business.name}
              </h2>
            </Link>
            <div className="flex gap-1.5 flex-wrap">
              {business.verified && (
                <Badge className="bg-primary text-white text-[10px] font-mono gap-1">
                  <BadgeCheck className="w-2.5 h-2.5" /> Verified
                </Badge>
              )}
              {business.subcategory && (
                <Badge variant="secondary" className="text-[10px]">
                  {business.subcategory.name}
                </Badge>
              )}
            </div>
          </div>

          {/* Rating */}
          {avgRating !== null && (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`}
                  />
                ))}
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                {avgRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}

          {/* Location */}
          {locationParts.length > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{locationParts.join(', ')}</span>
            </div>
          )}

          {/* Description */}
          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 mt-auto pt-1">
            {business.phone && (
              <a
                href={`tel:${business.phone}`}
                className="flex items-center gap-1.5 text-sm h-9 px-4 rounded-lg border border-border bg-background hover:bg-muted transition-colors font-medium"
              >
                <Phone className="w-3.5 h-3.5" /> Call
              </a>
            )}
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm h-9 px-4 rounded-lg border border-green-500 text-green-700 hover:bg-green-50 transition-colors font-medium"
              >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
              </a>
            )}
            {business.website && (
              <a
                href={business.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm h-9 px-4 rounded-lg border border-border bg-background hover:bg-muted transition-colors font-medium"
              >
                <Globe className="w-3.5 h-3.5" /> Website
              </a>
            )}
            <Link
              href={`/directory/business/${business.slug}`}
              className="flex items-center gap-1.5 text-sm h-9 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium ml-auto"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
