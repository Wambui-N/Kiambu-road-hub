import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { JOURNAL_SECTIONS, SECTION_COLORS } from '@/data/seed/categories'
import SectorsSidebar from '@/components/layout/sectors-sidebar'
import { Badge } from '@/components/ui/badge'
import EditorialCard from '@/components/shared/editorial-card'
import type { Article } from '@/types/database'
import AgencyServicesGrid from '@/components/journal/agency-services-grid'
import RetreatPackagesGrid from '@/components/journal/retreat-packages-grid'
import CommunityProgrammesGrid from '@/components/journal/community-programmes-grid'
import StoreProductsGrid from '@/components/journal/store-products-grid'

// Slugs that render a dedicated feature template instead of the generic
// article grid below. Everything else (including the restored Dear Doctor,
// which is a plain section with no articles yet) falls through unchanged.
const FUNCTIONAL_SLUGS = new Set([
  'business-notes',
  'kiambu-here-n-there',
  'business-opportunities',
  'e-books',
])

interface Props {
  params: Promise<{ section: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section: sectionSlug } = await params
  const section = JOURNAL_SECTIONS.find((s) => s.slug === sectionSlug)
  if (!section) return { title: 'Section Not Found' }
  return {
    title: section.name,
    description: `${section.tagline} — Lifestyle journal articles from Kiambu Road Explorer`,
    alternates: { canonical: `https://kiamburoad.com/journal/${sectionSlug}` },
  }
}

async function getSectionArticles(sectionSlug: string): Promise<Article[]> {
  try {
    const supabase = await createClient()
    const { data: section } = await supabase
      .from('journal_sections')
      .select('id')
      .eq('slug', sectionSlug)
      .single()

    if (!section) return []

    const { data } = await supabase
      .from('articles')
      .select('*, section:journal_sections(id, name, slug, tagline)')
      .eq('section_id', section.id)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(24)

    return data ?? []
  } catch {
    return []
  }
}

function ArticleCard({ article, sectionColor }: { article: Article; sectionColor: string }) {
  const fallback = 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80'
  const imageUrl = article.cover_image_path
    ? article.cover_image_path.startsWith('http')
      ? article.cover_image_path
      : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/article-media/${article.cover_image_path}`
    : fallback

  const meta = [
    article.published_at
      ? new Date(article.published_at).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })
      : null,
    article.read_time_minutes ? `${article.read_time_minutes} min read` : null,
  ].filter(Boolean).join('  ·  ')

  return (
    <EditorialCard
      href={`/journal/article/${article.slug}`}
      imageUrl={imageUrl}
      imageAlt={article.title}
      imageHeight="h-48"
      badge={article.section?.name ?? null}
      title={article.title}
      description={article.excerpt}
      meta={meta || null}
      metaColor={sectionColor}
    />
  )
}

export default async function JournalSectionPage({ params }: Props) {
  const { section: sectionSlug } = await params
  const section = JOURNAL_SECTIONS.find((s) => s.slug === sectionSlug)
  if (!section) notFound()

  const isFunctional = FUNCTIONAL_SLUGS.has(sectionSlug)
  const articles = isFunctional ? [] : await getSectionArticles(sectionSlug)
  const sectionColor = SECTION_COLORS[sectionSlug as keyof typeof SECTION_COLORS] ?? '#1B6B3A'

  return (
    <div className="min-h-screen bg-background">
      {/* Large banner ad slot */}
      <div className="bg-muted border-b border-border py-4">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="h-24 bg-card border-2 border-dashed border-border rounded-lg flex items-center justify-center text-sm text-muted-foreground">
            <Link href="/advertise" className="hover:text-primary transition-colors">
              Banner Ad Slot — <strong>Contact us to advertise here</strong>
            </Link>
          </div>
        </div>
      </div>

      {/* Section header */}
      <div className="py-10" style={{ backgroundColor: sectionColor + '15' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <nav className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5 font-mono">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/journal" className="hover:text-foreground">Journal</Link>
            <span>/</span>
            <span className="text-foreground">{section.name}</span>
          </nav>
          <Badge className="text-xs font-mono mb-3 text-white border-0" style={{ backgroundColor: sectionColor }}>
            {section.name}
          </Badge>
          <h1 className="font-display text-3xl font-medium text-foreground">{section.name}</h1>
          <p className="text-muted-foreground italic mt-2 text-sm">{section.tagline}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-10">
        <div className="lg:flex lg:gap-10">
          {/* Articles grid / functional feature */}
          <div className="lg:flex-1">
            {sectionSlug === 'business-notes' ? (
              <AgencyServicesGrid sectionColor={sectionColor} />
            ) : sectionSlug === 'kiambu-here-n-there' ? (
              <RetreatPackagesGrid sectionColor={sectionColor} />
            ) : sectionSlug === 'business-opportunities' ? (
              <CommunityProgrammesGrid sectionColor={sectionColor} />
            ) : sectionSlug === 'e-books' ? (
              <>
                <div className="rounded-lg p-6 mb-8 bg-card border border-border">
                  <h2 className="font-display text-xl font-medium mb-2">Practical ideas. Useful knowledge. Local perspectives.</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Explorer Publications publishes practical, accessible materials for entrepreneurs, businesses, professionals,
                    residents and anyone seeking useful knowledge and fresh local insight. We produce concise e-books, how-to guides,
                    business guides, research reports, surveys and special publications on entrepreneurship, customer service,
                    business opportunities, local markets, property, hospitality, lifestyle and community issues.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Books & Guides', 'Research & Reports', 'Explorer Guides'].map((type) => (
                      <span key={type} className="text-xs font-mono font-semibold px-3 py-1 rounded-md" style={{ backgroundColor: sectionColor + '15', color: sectionColor }}>
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                <StoreProductsGrid productType="ebook" basePath="/journal/e-books" sectionColor={sectionColor} />
              </>
            ) : articles.length === 0 ? (
              <div className="text-center py-20">
                <h2 className="font-display text-2xl font-medium mb-3">Articles coming soon</h2>
                <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8">
                  We are preparing content for <strong>{section.name}</strong>. Check back shortly.
                </p>
                <Link
                  href="/journal"
                  className="inline-flex items-center gap-1.5 border border-primary text-primary px-6 py-3 rounded-md text-sm font-semibold hover:bg-sage transition-colors"
                >
                  ← All Sections
                </Link>
              </div>
            ) : (
              <>
                <p className="text-xs font-mono text-muted-foreground mb-6">
                  {articles.length} article{articles.length !== 1 ? 's' : ''} in this section
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} sectionColor={sectionColor} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sectors sidebar */}
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
