import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { getArticleSnippet } from '@/lib/utils'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80'

interface FeaturedArticle {
  id: string
  title: string
  slug: string
  excerpt: string | null
  body_json: Record<string, unknown> | null
  cover_image_path: string | null
  published_at: string | null
}

async function getFeaturedArticles(): Promise<FeaturedArticle[]> {
  try {
    const supabase = await createClient()
    const { data: section } = await supabase
      .from('journal_sections')
      .select('id')
      .eq('slug', 'nature-trivia')
      .single()

    if (!section) return []

    const { data } = await supabase
      .from('articles')
      .select('id, title, slug, excerpt, body_json, cover_image_path, published_at')
      .eq('section_id', section.id)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(3)

    return data ?? []
  } catch {
    return []
  }
}

export default async function CurrentFeatures() {
  const articles = await getFeaturedArticles()

  return (
    <section className="py-16 bg-brand-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-bold text-foreground">Current Features</h2>
          <p className="text-muted-foreground mt-2">A look at what&rsquo;s on the pages this month</p>
        </div>

        {articles.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-border p-10 text-center">
            <p className="text-4xl mb-4">✍️</p>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
              New sponsored features are added to the magazine regularly — check back soon.
            </p>
            <Link
              href="/journal/nature-trivia"
              className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Visit Sponsored Features
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article) => {
              const imageUrl = article.cover_image_path
                ? article.cover_image_path.startsWith('http')
                  ? article.cover_image_path
                  : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/article-media/${article.cover_image_path}`
                : FALLBACK_IMAGE
              const snippet = getArticleSnippet(article.excerpt, article.body_json)

              return (
                <Link
                  key={article.id}
                  href={`/journal/article/${article.slug}`}
                  className="group block bg-white rounded-2xl border border-border overflow-hidden hover:border-primary hover:shadow-sm transition-all"
                >
                  <div className="relative h-44 overflow-hidden bg-muted">
                    <Image
                      src={imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    {snippet && <p className="text-sm text-muted-foreground leading-relaxed">{snippet}</p>}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
