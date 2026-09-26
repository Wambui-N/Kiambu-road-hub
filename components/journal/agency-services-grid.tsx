import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
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
            <Link
              key={service.id}
              href={`/journal/business-notes/${service.slug}`}
              className="group bg-white rounded-2xl border border-border overflow-hidden hover:border-primary hover:shadow-md transition-all flex flex-col"
            >
              {imageUrl && (
                <div className="relative h-40 overflow-hidden bg-muted shrink-0">
                  <Image src={imageUrl} alt={service.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors leading-snug mb-2">
                  {service.name}
                </h3>
                {service.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-3">{service.description}</p>
                )}
                {service.price_note && (
                  <p className="text-xs font-mono mt-auto pt-2" style={{ color: sectionColor }}>{service.price_note}</p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
