import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import {
  Phone, MessageCircle, Globe, Mail, MapPin, Clock, Star,
  BadgeCheck, ExternalLink, ArrowLeft, Building2, User, DoorOpen,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import BusinessCard from '@/components/directory/business-card'
import ReviewSection from '@/components/directory/review-section'
import { getWhatsAppUrl, getImageUrl, getPriceRangeLabel } from '@/lib/utils'
import { buildTrackedUrl } from '@/lib/tracking'
import { localBusinessJsonLd } from '@/lib/seo'
import type { Business } from '@/types/database'

const CATEGORY_IMAGE_MAP: Record<string, string> = {
  'eat-drink-stay':        'https://images.unsplash.com/photo-1768697359488-9cc9937056a6?auto=format&fit=crop&w=1600&q=80',
  'health-wellness':       'https://images.unsplash.com/photo-1755995083683-50d08cd83d09?auto=format&fit=crop&w=1600&q=80',
  'education-childcare':   'https://images.unsplash.com/photo-1549380883-4dd936bbc0fa?auto=format&fit=crop&w=1600&q=80',
  'retail-shopping':       'https://images.unsplash.com/photo-1672363547647-8fad02572412?auto=format&fit=crop&w=1600&q=80',
  'car-motor-dealers':     'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1600&q=80',
  'auto-services':         'https://images.unsplash.com/photo-1632823469850-2f77dd9c7f93?auto=format&fit=crop&w=1600&q=80',
  'real-estate-property':  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80',
  'building-construction': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80',
  'home-garden':           'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=80',
  'professional-services': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1600&q=80',
  'leisure-outdoors':      'https://images.unsplash.com/photo-1540206395-68808572332f?auto=format&fit=crop&w=1600&q=80',
  'transport-logistics':   'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=80',
  'security-emergency':    'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1600&q=80',
  'faith-community':       'https://images.unsplash.com/photo-1438232992991-995b671e4267?auto=format&fit=crop&w=1600&q=80',
  'finance':               'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80',
  'membership-clubs':      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80',
  default:                 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1600&q=80',
}

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

async function getBusiness(slug: string): Promise<Business | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('businesses')
      .select(`
        *,
        category:categories(id, name, slug, icon, color),
        subcategory:subcategories(id, name, slug),
        area:areas(id, name, slug),
        images:business_images(*),
        hours:business_hours(*),
        tags:business_tags(tag:tags(*))
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
    return data
  } catch {
    return null
  }
}

async function getRelatedBusinesses(subcategoryId: string | null, categoryId: string, excludeId: string): Promise<Business[]> {
  try {
    const supabase = await createClient()
    let query = supabase
      .from('businesses')
      .select(`
        *,
        category:categories(id, name, slug, icon, color),
        subcategory:subcategories(id, name, slug),
        area:areas(id, name, slug),
        images:business_images(*)
      `)
      .eq('status', 'published')
      .neq('id', excludeId)
      .limit(3)

    if (subcategoryId) {
      query = query.eq('subcategory_id', subcategoryId)
    } else {
      query = query.eq('category_id', categoryId)
    }

    const { data } = await query
    return data ?? []
  } catch {
    return []
  }
}

async function getApprovedReviews(businessId: string) {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('business_id', businessId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(10)
    return data ?? []
  } catch {
    return []
  }
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const business = await getBusiness(slug)
  if (!business) return { title: 'Business Not Found' }

  const description = business.short_description ?? `Discover ${business.name} on Kiambu Road Explorer — ${business.category?.name ?? 'local business'} along Kiambu Road, Nairobi.`

  return {
    title: business.name,
    description,
    openGraph: {
      title: `${business.name} | Kiambu Road Explorer`,
      description,
      images: business.images?.[0] ? [getImageUrl(business.images[0].image_path)] : [],
      type: 'website',
    },
    alternates: {
      canonical: `https://kiamburoad-hub.com/directory/business/${slug}`,
    },
  }
}

export default async function BusinessProfilePage({ params }: Props) {
  const { slug } = await params
  const business = await getBusiness(slug)
  if (!business) notFound()

  const relatedBusinesses = await getRelatedBusinesses(
    business.subcategory_id,
    business.category_id ?? '',
    business.id,
  )
  const reviews = await getApprovedReviews(business.id)

  const whatsappUrl = business.whatsapp ? getWhatsAppUrl(business.whatsapp) : null
  const images = business.images ?? []
  const coverImage = images.find((i) => i.is_cover) ?? images[0]
  const categorySlug = business.category?.slug
  const coverPath =
    coverImage?.image_path ??
    (categorySlug ? CATEGORY_IMAGE_MAP[categorySlug] ?? CATEGORY_IMAGE_MAP.default : CATEGORY_IMAGE_MAP.default)
  const coverImageUrl = getImageUrl(coverPath)
  const galleryImages = images.filter((i) => !i.is_cover).slice(0, 4)

  const jsonLd = localBusinessJsonLd(business)

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null

  return (
    <>
      <Script
        id="business-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-brand-surface">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-border py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <span>/</span>
              <Link href="/directory" className="hover:text-foreground">Directory</Link>
              {business.category && (
                <>
                  <span>/</span>
                  <Link href={`/directory/${business.category.slug}`} className="hover:text-foreground">
                    {business.category.name}
                  </Link>
                </>
              )}
              <span>/</span>
              <span className="text-foreground truncate max-w-[160px]">{business.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="lg:flex lg:gap-8">
            {/* Main content */}
            <div className="lg:flex-1 space-y-6">
              {/* Cover image */}
              <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-muted">
                <Image
                  src={coverImageUrl}
                  alt={coverImage?.alt_text ?? business.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 65vw"
                />
              </div>

              {/* Gallery grid */}
              {galleryImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {galleryImages.map((img) => (
                    <div key={img.id} className="relative h-24 rounded-xl overflow-hidden bg-muted">
                      <Image
                        src={getImageUrl(img.image_path)}
                        alt={img.alt_text ?? business.name}
                        fill
                        className="object-cover"
                        sizes="25vw"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Name + badges */}
              <div>
                <div className="flex flex-wrap items-start gap-3 mb-3">
                  <h1 className="font-display text-3xl font-bold text-foreground flex-1">{business.name}</h1>
                  <div className="flex gap-2">
                    {business.verified && (
                      <Badge className="bg-primary text-white gap-1">
                        <BadgeCheck className="w-3 h-3" /> Verified
                      </Badge>
                    )}
                    {business.is_sponsor && (
                      <Badge className="bg-accent text-black gap-1">⭐ Featured</Badge>
                    )}
                  </div>
                </div>

                {/* Category + subcategory + area */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {business.category && (
                    <Link href={`/directory/${business.category.slug}`}>
                      <Badge variant="outline" className="hover:border-primary hover:text-primary cursor-pointer">
                        {business.category.name}
                      </Badge>
                    </Link>
                  )}
                  {business.subcategory && (
                    <Badge variant="secondary">{business.subcategory.name}</Badge>
                  )}
                  {business.price_range && (
                    <Badge variant="outline" className="font-mono">
                      {business.price_range} — {getPriceRangeLabel(business.price_range)}
                    </Badge>
                  )}
                </div>

                {/* Own-site ratings row */}
                {avgRating !== null && avgRating !== undefined && (
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-mono font-semibold">{avgRating.toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">
                        ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  </div>
                )}

                {/* Description */}
                {business.description && (
                  <p className="text-muted-foreground leading-relaxed text-sm">{business.description}</p>
                )}
              </div>

              {/* Opening hours */}
              {business.hours && business.hours.length > 0 && (
                <div className="bg-white rounded-2xl border border-border p-6">
                  <h2 className="font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" /> Opening Hours
                  </h2>
                  <div className="space-y-2">
                    {business.hours
                      .sort((a, b) => a.day_of_week - b.day_of_week)
                      .map((h) => (
                        <div key={h.id} className="flex justify-between text-sm">
                          <span className="font-medium">{DAY_NAMES[h.day_of_week]}</span>
                          <span className="text-muted-foreground font-mono">
                            {h.is_closed ? 'Closed' : `${h.opens_at} – ${h.closes_at}`}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {business.tags && business.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {business.tags.map((t) => {
                    const tag = (t as unknown as { tag: { id: string; name: string; slug: string } }).tag
                    return (
                      <span
                        key={tag.id}
                        className="text-xs font-mono px-3 py-1 bg-white border border-border rounded-full text-muted-foreground"
                      >
                        {tag.name}
                      </span>
                    )
                  })}
                </div>
              )}

              {/* Map embed */}
              {business.google_maps_url && (
                <div className="bg-white rounded-2xl border border-border overflow-hidden">
                  <div className="p-4 flex items-center justify-between border-b border-border">
                    <h2 className="font-semibold flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" /> Location
                    </h2>
                    <a
                      href={buildTrackedUrl(business.google_maps_url, { linkType: 'maps', surface: 'business_profile', businessId: business.id, businessSlug: business.slug })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1 font-mono"
                    >
                      Get Directions <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="h-56 bg-muted flex items-center justify-center text-sm text-muted-foreground">
                    {[business.road_street, business.building_name, business.area?.name]
                      .filter(Boolean)
                      .join(', ') || business.address_line || 'Location on Kiambu Road, Nairobi'}
                  </div>
                </div>
              )}

              {/* Community Reviews — inline form */}
              <ReviewSection businessId={business.id} initialReviews={reviews} />
            </div>

            {/* Sidebar */}
            <div className="lg:w-80 space-y-4 mt-6 lg:mt-0">
              {/* Contact card */}
              <div className="bg-white rounded-2xl border border-border p-6 lg:sticky lg:top-24">
                <h2 className="font-semibold mb-4">Contact & Info</h2>
                <div className="space-y-3">
                  {business.phone && (
                    <a
                      href={buildTrackedUrl(`tel:${business.phone}`, { linkType: 'phone', surface: 'business_profile', businessId: business.id, businessSlug: business.slug })}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-primary hover:text-white transition-colors group"
                    >
                      <Phone className="w-4 h-4 text-primary group-hover:text-white" />
                      <span className="text-sm font-medium">{business.phone}</span>
                    </a>
                  )}
                  {whatsappUrl && (
                    <a
                      href={buildTrackedUrl(whatsappUrl, { linkType: 'whatsapp', surface: 'business_profile', businessId: business.id, businessSlug: business.slug })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-200 hover:bg-green-100 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">Chat on WhatsApp</span>
                    </a>
                  )}
                  {business.website && (
                    <a
                      href={buildTrackedUrl(business.website, { linkType: 'website', surface: 'business_profile', businessId: business.id, businessSlug: business.slug })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                    >
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground truncate">{business.website.replace(/^https?:\/\//, '')}</span>
                    </a>
                  )}
                  {business.email && (
                    <a
                      href={buildTrackedUrl(`mailto:${business.email}`, { linkType: 'email', surface: 'business_profile', businessId: business.id, businessSlug: business.slug })}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                    >
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground truncate">{business.email}</span>
                    </a>
                  )}
                </div>

                <Separator className="my-4" />

                {/* Location details */}
                <div className="space-y-2">
                  {business.road_street && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                      <span>{business.road_street}</span>
                    </div>
                  )}
                  {business.building_name && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Building2 className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
                      <span>{business.building_name}</span>
                    </div>
                  )}
                  {business.door_number && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <DoorOpen className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
                      <span>Office / Door: {business.door_number}</span>
                    </div>
                  )}
                  {business.contact_name && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
                      <span>Contact: {business.contact_name}</span>
                    </div>
                  )}
                  {business.area && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
                      <span>{business.area.name}</span>
                    </div>
                  )}
                </div>

                <Separator className="my-4" />

                <p className="text-[10px] text-muted-foreground">
                  Is this your business?{' '}
                  <Link href="/contact" className="text-primary hover:underline">
                    Claim or update listing
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Related businesses */}
          {relatedBusinesses.length > 0 && (
            <div className="mt-12">
              <h2 className="font-display text-2xl font-bold mb-6">
                More in {business.subcategory?.name ?? business.category?.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedBusinesses.map((b) => (
                  <BusinessCard key={b.id} business={b} />
                ))}
              </div>
              <div className="mt-6">
                <Link
                  href={`/directory/${business.category?.slug}`}
                  className="inline-flex items-center gap-1 text-primary font-semibold hover:underline text-sm"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to {business.category?.name}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
