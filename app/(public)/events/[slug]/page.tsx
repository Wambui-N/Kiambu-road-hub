import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import EventDetail from '@/components/events/event-detail'
import type { KiambuEvent } from '@/types/database'

interface Props {
  params: Promise<{ slug: string }>
}

async function getEvent(slug: string): Promise<KiambuEvent | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('events').select('*').eq('slug', slug).eq('status', 'published').single()
  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const event = await getEvent(slug)
  if (!event) return { title: 'Not Found' }
  return {
    title: `${event.name} — Events & Expos`,
    description: event.description ?? event.tagline ?? undefined,
    alternates: { canonical: `https://kiamburoad.com/events/${slug}` },
  }
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params
  const event = await getEvent(slug)
  if (!event) notFound()

  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="py-8 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-xs text-muted-foreground flex items-center gap-1.5 font-mono">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/events" className="hover:text-foreground">Events &amp; Expos</Link>
            <span>/</span>
            <span className="text-foreground">{event.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EventDetail event={event} />
      </div>
    </div>
  )
}
