import { Metadata } from 'next'
import ComingSoon from '@/components/ui/coming-soon'

export const metadata: Metadata = {
  title: 'Books & Guides — Kiambu Road Explorer',
  description: 'Recommended reading, local guides and e-books for life along the Kiambu Road corridor.',
}

export default function BooksAndGuidesPage() {
  return (
    <ComingSoon
      title="Books & Guides"
      description="Recommended reading, local guides and e-books for life along the Kiambu Road corridor."
      icon="📚"
      features={[
        'Curated e-books and reading recommendations',
        'Practical local guides for residents and newcomers',
        'Reference material tied to the Explorer Magazine',
      ]}
      ctaLabel="Explore the Magazine"
      ctaHref="/journal"
    />
  )
}
