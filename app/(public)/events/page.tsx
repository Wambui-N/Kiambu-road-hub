import { Metadata } from 'next'
import Link from 'next/link'
import EventsList from '@/components/events/events-list'

export const metadata: Metadata = {
  title: 'Events & Expos — Kiambu Road Explorer',
  description: 'Upcoming events, expos, markets and gatherings happening along the Kiambu Road corridor.',
  alternates: { canonical: 'https://kiamburoad.com/events' },
}

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="bg-primary py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-accent font-mono text-xs uppercase tracking-widest mb-2">Bringing Our Community Together</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">Events &amp; Expos</h1>
          <p className="text-white/80 text-base max-w-2xl mb-3">
            Kiambu Road Explorer believes that good businesses and a strong community need opportunities to meet, connect
            and grow together. We support, sponsor and facilitate events, expos and other initiatives that showcase local
            enterprise, create opportunities and bring the Kiambu Road community together.
          </p>
          <Link href="/partner-with-us" className="text-white font-semibold underline underline-offset-4 hover:text-accent transition-colors text-sm">
            Welcome to partner with us →
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="font-display text-xl font-bold mb-6">Upcoming Events</h2>
        <EventsList />
      </div>
    </div>
  )
}
