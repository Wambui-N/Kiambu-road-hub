import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { JOURNAL_SECTIONS, SECTION_COLORS } from '@/data/seed/categories'

export const metadata: Metadata = {
  title: 'Lifestyle Journal — Kiambu Road Explorer',
  description:
    'Health, travel, business and community stories from around the Kiambu Road corridor.',
}

const SECTION_ICONS: Record<string, string> = {
  'health-digest': '🏥',
  'dear-doctor': '🩺',
  'this-n-that': '✨',
  'prayer-verse': '🙏',
  'inspiration': '💡',
  'kiambu-here-n-there': '🗺️',
  'nature-trivia': '🌿',
  'business-notes': '💼',
  'e-books': '📚',
}

// Sections with a dedicated feature template (not the generic article grid)
// always have real content — never show "Coming Soon" for these.
const FUNCTIONAL_SLUGS = new Set([
  'business-notes',
  'kiambu-here-n-there',
  'business-opportunities',
  'e-books',
])

async function getSlugsWithArticles(): Promise<Set<string>> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('articles')
      .select('section:journal_sections(slug)')
      .eq('status', 'published')
    return new Set(
      (data ?? [])
        .map((a) => {
          const section = a.section as unknown
          if (Array.isArray(section)) return section[0]?.slug as string | undefined
          return (section as { slug?: string } | null)?.slug
        })
        .filter((slug): slug is string => Boolean(slug))
    )
  } catch {
    return new Set()
  }
}

export default async function JournalPage() {
  const slugsWithArticles = await getSlugsWithArticles()
  const sections = JOURNAL_SECTIONS.filter((s) => s.slug !== 'newswatch')
  const anyComingSoon = sections.some(
    (s) => !FUNCTIONAL_SLUGS.has(s.slug) && !slugsWithArticles.has(s.slug)
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <p className="text-white/70 font-mono text-xs uppercase tracking-widest mb-2">
            Kiambu Road Explorer
          </p>
          <h1 className="font-display text-4xl font-medium text-white mb-3">Lifestyle Journal</h1>
          <p className="text-white/70 text-base max-w-2xl">
            For a comprehensive lifestyle guide
          </p>
        </div>
      </div>

      {/* Banner ad slot */}
      <div className="bg-muted border-b border-border py-4">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="h-24 bg-card border-2 border-dashed border-border rounded-lg flex items-center justify-center text-sm text-muted-foreground">
            <Link href="/advertise" className="hover:text-primary transition-colors">
              Banner Ad Slot — <strong>Contact us to advertise here</strong>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12">
        {anyComingSoon && (
          <div className="bg-card border border-border rounded-lg p-6 mb-10 flex items-start gap-4">
            <div>
              <h2 className="font-semibold text-foreground mb-1">More articles on the way</h2>
              <p className="text-sm text-muted-foreground">
                Our editorial team is preparing content across the remaining sections — articles will appear there as they are published.
              </p>
            </div>
          </div>
        )}

        {/* Section grid */}
        <h2 className="font-display text-xl font-medium text-foreground mb-6">Journal Sections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sections.map((section) => {
            const comingSoon = !FUNCTIONAL_SLUGS.has(section.slug) && !slugsWithArticles.has(section.slug)
            return (
              <Link
                key={section.slug}
                href={`/journal/${section.slug}`}
                className="group bg-card rounded-lg border border-border p-6 hover:border-primary transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{SECTION_ICONS[section.slug] ?? '📄'}</span>
                  {comingSoon && (
                    <span
                      className="text-xs font-mono font-bold px-2 py-0.5 rounded-md text-white"
                      style={{ backgroundColor: SECTION_COLORS[section.slug as keyof typeof SECTION_COLORS] ?? '#64748B' }}
                    >
                      Coming Soon
                    </span>
                  )}
                </div>
                <h3 className="font-display font-medium text-foreground mb-1 group-hover:text-primary transition-colors">
                  {section.name}
                </h3>
                <p className="text-xs text-muted-foreground italic">{section.tagline}</p>
              </Link>
            )
          })}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-12 bg-primary rounded-lg p-8 text-center text-white">
          <h3 className="font-display text-2xl font-medium mb-2">Be the first to read</h3>
          <Link
            href="/#newsletter"
            className="inline-flex items-center bg-accent hover:bg-accent/85 text-accent-foreground font-semibold px-8 py-3 rounded-md text-sm transition-colors"
          >
            Subscribe to Newsletter
          </Link>
        </div>
      </div>
    </div>
  )
}
