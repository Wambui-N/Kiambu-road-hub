import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import { createClient } from '@/lib/supabase/server'
import { SECTION_COLORS } from '@/data/seed/categories'
import SectorsSidebar from '@/components/layout/sectors-sidebar'
import ShareBar from '@/components/share-bar'
import { articleJsonLd } from '@/lib/seo'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, User } from 'lucide-react'
import type { Article } from '@/types/database'

interface Props {
  params: Promise<{ slug: string }>
}

export const revalidate = 3600

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('articles')
      .select('*, section:journal_sections(id, name, slug, tagline)')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
    return data
  } catch {
    return null
  }
}

async function getComments(articleId: string) {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('article_comments')
      .select('*')
      .eq('article_id', articleId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
    return data ?? []
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return { title: 'Article Not Found' }

  return {
    title: article.seo_title ?? article.title,
    description: article.seo_description ?? article.excerpt ?? '',
    authors: article.author_name ? [{ name: article.author_name }] : undefined,
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.excerpt ?? '',
      images: article.cover_image_path ? [article.cover_image_path] : [],
      publishedTime: article.published_at ?? undefined,
    },
    alternates: { canonical: `https://kiamburoad-hub.com/journal/article/${slug}` },
  }
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) notFound()

  const comments = await getComments(article.id)
  const sectionSlug = article.section?.slug
  const sectionColor = sectionSlug ? (SECTION_COLORS[sectionSlug as keyof typeof SECTION_COLORS] ?? '#1B6B3A') : '#1B6B3A'
  const fallback = 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1600&q=80'
  const imageUrl = article.cover_image_path
    ? article.cover_image_path.startsWith('http')
      ? article.cover_image_path
      : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/article-media/${article.cover_image_path}`
    : fallback

  const articleUrl = `https://kiamburoad-hub.com/journal/article/${slug}`
  const isTravelSection = sectionSlug === 'kiambu-here-n-there' || sectionSlug === 'destination-review'

  return (
    <>
      <Script
        id="article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(article)) }}
      />
      <ShareBar url={articleUrl} title={article.title} variant="popup" />

      <div className="min-h-screen bg-brand-surface">
        {/* Section badge + breadcrumb */}
        <div className="bg-white border-b border-border py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <span>/</span>
              <Link href="/journal" className="hover:text-foreground">Journal</Link>
              {article.section && (
                <>
                  <span>/</span>
                  <Link href={`/journal/${article.section.slug}`} className="hover:text-foreground">
                    {article.section.name}
                  </Link>
                </>
              )}
              <span>/</span>
              <span className="truncate max-w-[160px] text-foreground">{article.title}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="lg:flex lg:gap-10">
            {/* Article content */}
            <article className="lg:flex-1 max-w-3xl">
              {/* Section badge & meta */}
              <div className="mb-5">
                {article.section && (
                  <Link href={`/journal/${article.section.slug}`}>
                    <Badge className="text-xs font-mono mb-3 text-white border-0 hover:opacity-90" style={{ backgroundColor: sectionColor }}>
                      {article.section.name}
                    </Badge>
                  </Link>
                )}

                <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-4">
                  {article.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {article.author_name && (
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      {article.author_name}
                    </span>
                  )}
                  {article.published_at && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(article.published_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  )}
                  {article.read_time_minutes && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {article.read_time_minutes} min read
                    </span>
                  )}
                </div>
              </div>

              {/* Social share row - inline */}
              <div className="mb-6">
                <ShareBar url={articleUrl} title={article.title} variant="inline" />
              </div>

              {/* Cover image */}
              <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-muted mb-8">
                <Image
                  src={imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 65vw"
                />
              </div>

              {/* Excerpt */}
              {article.excerpt && (
                <p className="text-lg text-muted-foreground leading-relaxed mb-6 italic border-l-4 pl-4" style={{ borderColor: sectionColor }}>
                  {article.excerpt}
                </p>
              )}

              {/* Article body */}
              <div className="prose prose-sm max-w-none text-foreground space-y-4">
                {article.body_json ? (
                  <ArticleBody body={article.body_json} />
                ) : (
                  <p className="text-muted-foreground">Article content is being prepared.</p>
                )}
              </div>

              {/* Bottom social share row */}
              <div className="mt-10">
                <ShareBar url={articleUrl} title={article.title} variant="inline" />
              </div>

              {/* Travel inquiry embed for travel sections */}
              {isTravelSection && (
                <div className="mt-8 bg-primary/5 border border-primary/20 rounded-2xl p-6">
                  <h3 className="font-display font-bold text-lg mb-2">Planning a trip?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Interested in visiting the destinations mentioned in this article? Our travel team can arrange a personalised trip for you.
                  </p>
                  <Link
                    href="/travel"
                    className="inline-flex items-center bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    ✈️ Make a Travel Inquiry
                  </Link>
                </div>
              )}

              {/* Comments */}
              <div className="mt-12">
                <h2 className="font-display text-xl font-bold mb-6">
                  Comments {comments.length > 0 && <span className="text-base text-muted-foreground font-normal">({comments.length})</span>}
                </h2>

                {comments.length === 0 ? (
                  <p className="text-muted-foreground text-sm mb-6">No comments yet. Be the first to share your thoughts.</p>
                ) : (
                  <div className="space-y-4 mb-8">
                    {comments.map((c) => (
                      <div key={c.id} className="bg-white rounded-xl border border-border p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm">{c.commenter_name}</span>
                          <span className="text-xs font-mono text-muted-foreground">
                            {new Date(c.created_at).toLocaleDateString('en-KE', { month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{c.comment}</p>
                      </div>
                    ))}
                  </div>
                )}

                <Link
                  href={`/journal/article/${slug}/comment`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  💬 Leave a comment
                </Link>
              </div>
            </article>

            {/* Sectors sidebar */}
            <div className="lg:w-64 mt-10 lg:mt-0 shrink-0">
              <div className="lg:sticky lg:top-24">
                <SectorsSidebar variant="sidebar" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function ArticleBody({ body }: { body: Record<string, unknown> }) {
  if (!body || typeof body !== 'object') return null

  if (Array.isArray((body as { content?: unknown[] }).content)) {
    const portableText = body as { content: Array<{ type: string; content?: Array<{ type: string; value: string }> }> }
    return (
      <div className="space-y-4">
        {portableText.content.map((block, i) => {
          if (block.type === 'paragraph') {
            const text = block.content?.map((s) => s.value).join('') ?? ''
            return <p key={i} className="text-muted-foreground leading-relaxed">{text}</p>
          }
          return null
        })}
      </div>
    )
  }

  if (typeof (body as { text?: string }).text === 'string') {
    return (
      <div className="space-y-4">
        {(body as { text: string }).text.split('\n\n').map((para, i) => (
          <p key={i} className="text-muted-foreground leading-relaxed">{para}</p>
        ))}
      </div>
    )
  }

  return null
}
