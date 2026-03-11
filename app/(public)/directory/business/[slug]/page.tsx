import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Phone, MessageCircle, Globe, Mail, MapPin, Clock, Star,
  BadgeCheck, ExternalLink, ArrowLeft,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import BusinessCard from '@/components/directory/business-card'
import { getWhatsAppUrl, getImageUrl, getPriceRangeLabel } from '@/lib/utils'
import type { Business } from '@/types/database'

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

async function getRelatedBusinesses(categoryId: string, excludeId: string): Promise<Business[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('businesses')
      .select(`
        *,
        category:categories(id, name, slug, icon, color),
        subcategory:subcategories(id, name, slug),
        area:areas(id, name, slug),
        images:business_images(*)
      `)
      .eq('category_id', categoryId)
      .eq('status', 'published')
      .neq('id', excludeId)
      .limit(3)
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
  return {
    title: business.name,
    description: business.short_description ?? `Discover ${business.name} on Kiambu Road Hub.`,
    openGraph: {
      title: `${business.name} | Kiambu Road Hub`,
      description: business.short_description ?? '',
      images: business.images?.[0] ? [getImageUrl(business.images[0].image_path)] : [],
    },
  }
}

export default async function BusinessProfilePage({ params }: Props) {
  const { slug } = await params
  const business = await getBusiness(slug)
  if (!business) notFound()

  const relatedBusinesses = business.category_id
    ? await getRelatedBusinesses(business.category_id, business.id)
    : []

  const whatsappUrl = business.whatsapp ? getWhatsAppUrl(business.whatsapp) : null
  const images = business.images ?? []
  const coverImage = images.find((i) => i.is_cover) ?? images[0]
  const galleryImages = images.filter((i) => !i.is_cover).slice(0, 4)

  return (
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
              {coverImage ? (
                <Image
                  src={getImageUrl(coverImage.image_path)}
                  alt={coverImage.alt_text ?? business.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 65vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl opacity-20">🏢</span>
                </div>
              )}
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

              {/* Category + area */}
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
                {business.area && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" /> {business.area.name}
                  </span>
                )}
              </div>

              {/* Rating */}
              {business.google_rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(business.google_rating!) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-mono font-semibold">{business.google_rating.toFixed(1)}</span>
                  {business.google_review_count && (
                    <span className="text-xs text-muted-foreground">
                      ({business.google_review_count.toLocaleString()} reviews)
                    </span>
                  )}
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
                    href={business.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1 font-mono"
                  >
                    Get Directions <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="h-56 bg-muted flex items-center justify-center text-sm text-muted-foreground">
                  {business.address_line ?? 'Location on Kiambu Road, Nairobi'}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-4 mt-6 lg:mt-0">
            {/* Contact card — sticky */}
            <div className="bg-white rounded-2xl border border-border p-6 lg:sticky lg:top-24">
              <h2 className="font-semibold mb-4">Contact & Info</h2>
              <div className="space-y-3">
                {business.phone && (
                  <a
                    href={`tel:${business.phone}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-primary hover:text-white transition-colors group"
                  >
                    <Phone className="w-4 h-4 text-primary group-hover:text-white" />
                    <span className="text-sm font-medium">{business.phone}</span>
                  </a>
                )}
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
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
                    href={business.website}
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
                    href={`mailto:${business.email}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground truncate">{business.email}</span>
                  </a>
                )}
              </div>

              <Separator className="my-4" />

              {business.address_line && (
                <div className="flex items-start gap-2 text-sm text-muted-foreground mb-3">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                  <span>{business.address_line}</span>
                </div>
              )}
              {business.price_range && (
                <div className="text-sm text-muted-foreground mb-3">
                  <span className="font-mono font-semibold text-foreground">{business.price_range}</span>{' '}
                  {getPriceRangeLabel(business.price_range)}
                </div>
              )}

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
              More in {business.category?.name}
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
  )
}
