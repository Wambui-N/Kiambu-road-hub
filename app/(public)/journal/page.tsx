import { Metadata } from 'next'
import Link from 'next/link'
import { JOURNAL_SECTIONS } from '@/data/seed/categories'

export const metadata: Metadata = {
  title: 'Lifestyle Journal — Kiambu Road Explorer',
  description:
    'Health, travel, business and community stories from around the Kiambu Road corridor.',
}

const SECTION_ICONS: Record<string, string> = {
  'health-digest': '🏥',
  'dear-doctor': '👨‍⚕️',
  'this-n-that': '✨',
  'prayer-verse': '🙏',
  'inspiration': '💡',
  'kiambu-here-n-there': '🗺️',
  'destination-review': '✈️',
  'nature-trivia': '🌿',
  'business-notes': '💼',
  'opinion': '📝',
}

const SECTION_COLORS: Record<string, string> = {
  'health-digest': '#10B981',
  'dear-doctor': '#06B6D4',
  'this-n-that': '#8B5CF6',
  'prayer-verse': '#F59E0B',
  'inspiration': '#EC4899',
  'kiambu-here-n-there': '#3B82F6',
  'destination-review': '#14B8A6',
  'nature-trivia': '#22C55E',
  'business-notes': '#E8A020',
  'opinion': '#EF4444',
}

export default function JournalPage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      {/* Header */}
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-accent font-mono text-xs uppercase tracking-widest mb-2">
            Kiambu Road Explorer
          </p>
          <h1 className="font-display text-4xl font-bold text-white mb-3">Lifestyle Journal</h1>
          <p className="text-white/70 text-base max-w-2xl">
            Health insights, travel guides, business wisdom, and community stories from the Kiambu Road corridor.
          </p>
        </div>
      </div>

      {/* Banner ad slot */}
      <div className="bg-muted border-b border-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-24 bg-white border-2 border-dashed border-border rounded-xl flex items-center justify-center text-sm text-muted-foreground">
            <Link href="/advertise" className="hover:text-primary transition-colors">
              📢 Banner Ad Slot — <strong>Contact us to advertise here</strong>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Coming soon notice */}
        <div className="bg-white border border-border rounded-2xl p-6 mb-10 flex items-start gap-4">
          <span className="text-3xl">✍️</span>
          <div>
            <h2 className="font-semibold text-foreground mb-1">Articles launching soon</h2>
            <p className="text-sm text-muted-foreground">
              Our editorial team is preparing content across all sections. Browse the sections below — articles will appear here as they are published.
            </p>
          </div>
        </div>

        {/* Section grid */}
        <h2 className="font-display text-xl font-bold text-foreground mb-6">Journal Sections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {JOURNAL_SECTIONS.filter((s) => s.slug !== 'newswatch').map((section) => (
            <Link
              key={section.slug}
              href={`/journal/${section.slug}`}
              className="group bg-white rounded-2xl border border-border p-6 hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{SECTION_ICONS[section.slug] ?? '📄'}</span>
                <span
                  className="text-xs font-mono font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: SECTION_COLORS[section.slug] ?? '#64748B' }}
                >
                  Coming Soon
                </span>
              </div>
              <h3 className="font-display font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                {section.name}
              </h3>
              <p className="text-xs text-muted-foreground italic">{section.tagline}</p>
            </Link>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-12 bg-primary rounded-2xl p-8 text-center text-white">
          <h3 className="font-display text-2xl font-bold mb-2">Be the first to read</h3>
          <p className="text-white/70 text-sm mb-6">
            Subscribe to the Kiambu Road Explorer newsletter and get new articles delivered to your inbox.
          </p>
          <Link
            href="/#newsletter"
            className="inline-flex items-center bg-accent hover:bg-amber-500 text-black font-semibold px-8 py-3 rounded-xl text-sm transition-colors"
          >
            Subscribe to Newsletter
          </Link>
        </div>
      </div>
    </div>
  )
}
