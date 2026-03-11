import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { JOURNAL_SECTIONS } from '@/data/seed/categories'

interface Props {
  params: Promise<{ section: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section: sectionSlug } = await params
  const section = JOURNAL_SECTIONS.find((s) => s.slug === sectionSlug)
  if (!section) return { title: 'Section Not Found' }
  return {
    title: `${section.name} — Kiambu Road Hub Journal`,
    description: section.tagline,
  }
}

export default async function JournalSectionPage({ params }: Props) {
  const { section: sectionSlug } = await params
  const section = JOURNAL_SECTIONS.find((s) => s.slug === sectionSlug)
  if (!section) notFound()

  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="bg-primary py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-xs text-white/60 mb-3 flex items-center gap-1.5 font-mono">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/journal" className="hover:text-white">Journal</Link>
            <span>/</span>
            <span className="text-white">{section.name}</span>
          </nav>
          <h1 className="font-display text-3xl font-bold text-white">{section.name}</h1>
          <p className="text-white/70 italic mt-1 text-sm">{section.tagline}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center py-20">
          <p className="text-5xl mb-5">✍️</p>
          <h2 className="font-display text-2xl font-semibold mb-3">Articles coming soon</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8">
            We are preparing content for <strong>{section.name}</strong>. Check back shortly — this section will be updated regularly.
          </p>
          <Link
            href="/journal"
            className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            ← All Sections
          </Link>
        </div>
      </div>
    </div>
  )
}
