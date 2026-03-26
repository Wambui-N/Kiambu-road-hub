import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { JOURNAL_SECTIONS, SECTION_COLORS } from '@/data/seed/categories'
import SectorsSidebar from '@/components/layout/sectors-sidebar'
import { Calendar, Clock, MessageCircle, Share2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Article } from '@/types/database'

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
    alternates: { canonical: `https://kiamburoad-hub.com/journal/${sectionSlug}` },
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

  return (
    <Link href={`/journal/article/${article.slug}`} className="group bg-white rounded-2xl border border-border overflow-hidden hover:border-primary hover:shadow-md transition-all flex flex-col">
      <div className="relative h-48 overflow-hidden bg-muted shrink-0">
        <Image
          src={imageUrl}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3">
          <span
            className="text-[10px] font-mono font-bold text-white px-2.5 py-1 rounded-full"
            style={{ backgroundColor: sectionColor }}
          >
            {article.section?.name}
          </span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors leading-snug mb-2 line-clamp-2">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-3">
            {article.excerpt}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {article.published_at && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(article.published_at).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            )}
            {article.read_time_minutes && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.read_time_minutes} min
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MessageCircle className="w-3 h-3" />
            <Share2 className="w-3 h-3" />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default async function JournalSectionPage({ params }: Props) {
  const { section: sectionSlug } = await params
  const section = JOURNAL_SECTIONS.find((s) => s.slug === sectionSlug)
  if (!section) notFound()

  const articles = await getSectionArticles(sectionSlug)
  const sectionColor = SECTION_COLORS[sectionSlug as keyof typeof SECTION_COLORS] ?? '#1B6B3A'

  return (
    <div className="min-h-screen bg-brand-surface">
      {/* Large banner ad slot */}
      <div className="bg-muted border-b border-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-24 bg-white border-2 border-dashed border-border rounded-xl flex items-center justify-center text-sm text-muted-foreground">
            <Link href="/advertise" className="hover:text-primary transition-colors">
              📢 Banner Ad Slot — <strong>Contact us to advertise here</strong>
            </Link>
          </div>
        </div>
      </div>

      {/* Section header */}
      <div className="py-10" style={{ backgroundColor: sectionColor + '15' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <h1 className="font-display text-3xl font-bold text-foreground">{section.name}</h1>
          <p className="text-muted-foreground italic mt-2 text-sm">{section.tagline}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="lg:flex lg:gap-10">
          {/* Articles grid */}
          <div className="lg:flex-1">
            {articles.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-5">✍️</p>
                <h2 className="font-display text-2xl font-semibold mb-3">Articles coming soon</h2>
                <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8">
                  We are preparing content for <strong>{section.name}</strong>. Check back shortly.
                </p>
                <Link
                  href="/journal"
                  className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
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
