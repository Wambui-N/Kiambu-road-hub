import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import type { RetreatPackage } from '@/types/database'

async function getPackages(): Promise<RetreatPackage[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('retreat_packages')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true })
    return data ?? []
  } catch {
    return []
  }
}

export default async function RetreatPackagesGrid({ sectionColor }: { sectionColor: string }) {
  const packages = await getPackages()

  if (packages.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-5">🏕️</p>
        <h2 className="font-display text-2xl font-semibold mb-3">Retreats coming soon</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          We are curating retreat packages around Kiambu Road. Check back shortly.
        </p>
      </div>
    )
  }

  return (
    <>
      <p className="text-xs font-mono text-muted-foreground mb-6">
        {packages.length} package{packages.length !== 1 ? 's' : ''} available
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {packages.map((pkg) => {
          const imageUrl = pkg.image_path
            ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/store-media/${pkg.image_path}`
            : null
          return (
            <Link
              key={pkg.id}
              href={`/journal/kiambu-here-n-there/${pkg.slug}`}
              className="group bg-white rounded-2xl border border-border overflow-hidden hover:border-primary hover:shadow-md transition-all flex flex-col"
            >
              {imageUrl && (
                <div className="relative h-40 overflow-hidden bg-muted shrink-0">
                  <Image src={imageUrl} alt={pkg.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors leading-snug mb-2">
                  {pkg.name}
                </h3>
                {pkg.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-3">{pkg.description}</p>
                )}
                <div className="flex items-center justify-between mt-auto pt-2 text-xs">
                  {pkg.duration_note && <span className="text-muted-foreground font-mono">{pkg.duration_note}</span>}
                  {pkg.price != null && (
                    <span className="font-mono font-bold" style={{ color: sectionColor }}>
                      {pkg.currency} {Number(pkg.price).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
