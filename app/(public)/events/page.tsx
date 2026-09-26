import { Metadata } from 'next'
import ComingSoon from '@/components/ui/coming-soon'

export const metadata: Metadata = {
  title: 'Events & Expos — Kiambu Road Explorer',
  description: 'Upcoming events, expos, markets and gatherings happening along the Kiambu Road corridor.',
}

export default function EventsPage() {
  return (
    <ComingSoon
      title="Events & Expos"
      description="Upcoming events, expos, markets and gatherings happening along the Kiambu Road corridor."
      icon="🎪"
      features={[
        'A running calendar of local events and expos',
        'Business and trade expos along the corridor',
        'Community markets, fairs and gatherings',
      ]}
      ctaLabel="Explore the Magazine"
      ctaHref="/journal"
    />
  )
}
