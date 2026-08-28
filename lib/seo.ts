import type { Business, Article, JobListing } from '@/types/database'

const BASE_URL = 'https://kiamburoad.com'

export function buildCanonical(path: string): string {
  return `${BASE_URL}${path}`
}

// ─── JSON-LD generators ────────────────────────────────────────────────────────

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Kiambu Road Explorer',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+254720950500',
      contactType: 'customer service',
      areaServed: 'KE',
    },
    sameAs: [
      'https://facebook.com/kiamburoadhub',
      'https://twitter.com/kiamburoadhub',
      'https://instagram.com/kiamburoadhub',
    ],
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Kiambu Road Explorer',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function localBusinessJsonLd(business: Business, aggregate?: { average: number | null; count: number }) {
  const imageUrl = business.images?.[0]?.image_path
    ? business.images[0].image_path.startsWith('http')
      ? business.images[0].image_path
      : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/business-media/${business.images[0].image_path}`
    : undefined

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    description: business.short_description ?? business.description ?? undefined,
    url: `${BASE_URL}/directory/business/${business.slug}`,
    telephone: business.phone ?? undefined,
    email: business.email ?? undefined,
    image: imageUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.road_street ?? business.address_line ?? undefined,
      addressLocality: business.area?.name ?? 'Kiambu',
      addressCountry: 'KE',
    },
    ...(business.latitude && business.longitude ? {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: business.latitude,
        longitude: business.longitude,
      },
    } : {}),
    ...((aggregate?.average != null && aggregate.count > 0) ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: aggregate.average.toFixed(1),
        reviewCount: aggregate.count,
        bestRating: 5,
        worstRating: 1,
      },
    } : {}),
    ...(business.price_range ? {
      priceRange: business.price_range,
    } : {}),
  }
}

export function articleJsonLd(article: Article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt ?? undefined,
    author: {
      '@type': 'Person',
      name: article.author_name ?? 'Kiambu Road Explorer',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Kiambu Road Explorer',
      url: BASE_URL,
    },
    datePublished: article.published_at ?? article.created_at,
    dateModified: article.updated_at,
    url: `${BASE_URL}/journal/article/${article.slug}`,
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.path}`,
    })),
  }
}

export function collectionPageJsonLd(params: {
  name: string
  description?: string
  path: string
  items: { name: string; path: string }[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: params.name,
    description: params.description,
    url: `${BASE_URL}${params.path}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: params.items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        url: `${BASE_URL}${item.path}`,
      })),
    },
  }
}

export function productJsonLd(
  item: { name: string; slug: string; unit?: string | null },
  entries: { amount: number; currency: string }[]
) {
  if (!entries.length) return null
  const amounts = entries.map((e) => e.amount)
  const currency = entries[0]?.currency ?? 'KES'
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.name,
    url: `${BASE_URL}/prices/${item.slug}`,
    ...(item.unit ? { description: `Price per ${item.unit}` } : {}),
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: currency,
      lowPrice: Math.min(...amounts).toFixed(2),
      highPrice: Math.max(...amounts).toFixed(2),
      offerCount: entries.length,
    },
  }
}

export function jobPostingJsonLd(job: JobListing) {
  const typeMap: Record<string, string> = {
    full_time: 'FULL_TIME',
    part_time: 'PART_TIME',
    contract: 'CONTRACTOR',
    internship: 'INTERN',
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description ?? '',
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company ?? 'Confidential',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location_text ?? job.area?.name ?? 'Kiambu Road',
        addressCountry: 'KE',
      },
    },
    employmentType: job.job_type ? typeMap[job.job_type] : 'FULL_TIME',
    datePosted: job.published_at ?? job.created_at,
    ...(job.deadline ? { validThrough: job.deadline } : {}),
    ...(job.salary_text ? { baseSalary: { '@type': 'MonetaryAmount', currency: 'KES', value: job.salary_text } } : {}),
  }
}
