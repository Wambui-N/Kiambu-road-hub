import { createClient } from '@/lib/supabase/server'
import EditorialCard from '@/components/shared/editorial-card'
import type { KiambuEvent } from '@/types/database'

async function getEvents(): Promise<KiambuEvent[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true })
    return data ?? []
  } catch {
    return []
  }
}

const EVENTS_COLOR = '#E8A020'

export default async function EventsList() {
  const events = await getEvents()

  if (events.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-5">🎪</p>
        <h2 className="font-display text-2xl font-semibold mb-3">Events coming soon</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          We are putting together our events calendar. Check back shortly.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {events.map((event) => {
        const imageUrl = event.image_path
          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/store-media/${event.image_path}`
          : null
        return (
          <EditorialCard
            key={event.id}
            href={`/events/${event.slug}`}
            imageUrl={imageUrl}
            imageAlt={event.name}
            fallbackEmoji="🎪"
            title={event.name}
            description={event.tagline ?? event.description}
            meta={event.date_note}
            metaColor={EVENTS_COLOR}
          />
        )
      })}
    </div>
  )
}
