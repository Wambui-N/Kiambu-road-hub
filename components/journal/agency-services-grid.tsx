import { createClient } from '@/lib/supabase/server'
import EditorialCard from '@/components/shared/editorial-card'
import type { AgencyService } from '@/types/database'

async function getServices(): Promise<AgencyService[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('agency_services')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true })
    return data ?? []
  } catch {
    return []
  }
}

export default async function AgencyServicesGrid({ sectionColor }: { sectionColor: string }) {
  const services = await getServices()

  if (services.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-5">💼</p>
        <h2 className="font-display text-2xl font-semibold mb-3">Services coming soon</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          We are putting together our own directory of services. Check back shortly.
        </p>
      </div>
    )
  }

  return (
    <>
      <p className="text-xs font-mono text-muted-foreground mb-6">
        {services.length} service{services.length !== 1 ? 's' : ''} available
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {services.map((service) => {
          const imageUrl = service.image_path
            ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/store-media/${service.image_path}`
            : null
          return (
            <EditorialCard
              key={service.id}
              href={`/journal/business-notes/${service.slug}`}
              imageUrl={imageUrl}
              imageAlt={service.name}
              fallbackEmoji="💼"
              imageHeight="h-40"
              title={service.name}
              description={service.description}
              meta={service.price_note}
              metaColor={sectionColor}
            />
          )
        })}
      </div>
    </>
  )
}
