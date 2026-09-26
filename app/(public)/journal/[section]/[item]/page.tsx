import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { JOURNAL_SECTIONS, SECTION_COLORS } from '@/data/seed/categories'
import SectorsSidebar from '@/components/layout/sectors-sidebar'
import AgencyServiceDetail from '@/components/journal/agency-service-detail'
import RetreatPackageDetail from '@/components/journal/retreat-package-detail'
import CommunityProgrammeDetail from '@/components/journal/community-programme-detail'
import StoreProductDetail from '@/components/journal/store-product-detail'
import type { AgencyService, RetreatPackage, CommunityProgramme, StoreProduct } from '@/types/database'

interface Props {
  params: Promise<{ section: string; item: string }>
}

async function getItem(sectionSlug: string, itemSlug: string) {
  const supabase = await createClient()

  switch (sectionSlug) {
    case 'business-notes': {
      const { data } = await supabase.from('agency_services').select('*').eq('slug', itemSlug).eq('status', 'published').single()
      return data ? { kind: 'agency_service' as const, data: data as AgencyService } : null
    }
    case 'kiambu-here-n-there': {
      const { data } = await supabase.from('retreat_packages').select('*').eq('slug', itemSlug).eq('status', 'published').single()
      return data ? { kind: 'retreat_package' as const, data: data as RetreatPackage } : null
    }
    case 'business-opportunities': {
      const { data } = await supabase.from('community_programmes').select('*').eq('slug', itemSlug).eq('status', 'published').single()
      return data ? { kind: 'community_programme' as const, data: data as CommunityProgramme } : null
    }
    case 'opinion':
    case 'e-books': {
      const { data } = await supabase.from('store_products').select('*').eq('slug', itemSlug).eq('status', 'published').single()
      return data ? { kind: 'store_product' as const, data: data as StoreProduct } : null
    }
    default:
      return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section: sectionSlug, item: itemSlug } = await params
  const result = await getItem(sectionSlug, itemSlug)
  if (!result) return { title: 'Not Found' }
  return {
    title: result.data.name,
    description: result.data.description ?? undefined,
    alternates: { canonical: `https://kiamburoad.com/journal/${sectionSlug}/${itemSlug}` },
  }
}

export default async function JournalItemPage({ params }: Props) {
  const { section: sectionSlug, item: itemSlug } = await params
  const section = JOURNAL_SECTIONS.find((s) => s.slug === sectionSlug)
  if (!section) notFound()

  const result = await getItem(sectionSlug, itemSlug)
  if (!result) notFound()

  const sectionColor = SECTION_COLORS[sectionSlug as keyof typeof SECTION_COLORS] ?? '#1B6B3A'

  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="py-8" style={{ backgroundColor: sectionColor + '15' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-xs text-muted-foreground flex items-center gap-1.5 font-mono">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/journal" className="hover:text-foreground">Journal</Link>
            <span>/</span>
            <Link href={`/journal/${sectionSlug}`} className="hover:text-foreground">{section.name}</Link>
            <span>/</span>
            <span className="text-foreground">{result.data.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="lg:flex lg:gap-10">
          <div className="lg:flex-1">
            {result.kind === 'agency_service' && <AgencyServiceDetail service={result.data} sectionColor={sectionColor} />}
            {result.kind === 'retreat_package' && <RetreatPackageDetail pkg={result.data} sectionColor={sectionColor} />}
            {result.kind === 'community_programme' && <CommunityProgrammeDetail programme={result.data} sectionColor={sectionColor} />}
            {result.kind === 'store_product' && <StoreProductDetail product={result.data} sectionColor={sectionColor} />}
          </div>

          <div className="lg:w-64 mt-10 lg:mt-0 shrink-0">
            <div className="lg:sticky lg:top-24">
              <SectorsSidebar variant="sidebar" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
