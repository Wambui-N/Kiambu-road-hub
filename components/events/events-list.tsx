import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
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
          <Link
            key={event.id}
            href={`/events/${event.slug}`}
            className="group bg-white rounded-2xl border border-border overflow-hidden hover:border-primary hover:shadow-md transition-all flex flex-col"
          >
            <div className="relative h-44 overflow-hidden bg-muted shrink-0 flex items-center justify-center">
              {imageUrl ? (
                <Image src={imageUrl} alt={event.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 50vw" />
              ) : (
                <span className="text-4xl">🎪</span>
              )}
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors leading-snug mb-2">
                {event.name}
              </h3>
              {(event.tagline || event.description) && (
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-3">
                  {event.tagline ?? event.description}
                </p>
              )}
              {event.date_note && (
                <p className="text-xs font-mono mt-auto pt-2" style={{ color: EVENTS_COLOR }}>{event.date_note}</p>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
