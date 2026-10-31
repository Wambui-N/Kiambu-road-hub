import { createClient } from '@/lib/supabase/server'
import EditorialCard from '@/components/shared/editorial-card'
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

  const intro = (
    <div className="rounded-2xl p-6 mb-8 bg-white border border-border">
      <p className="font-display text-lg font-bold mb-1">Discover more. Explore more. Enjoy more.</p>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Kiambu &amp; Beyond highlights interesting places for Kiambu Road residents to discover, visit, stay and explore —
        you don&apos;t always have to travel far to feel far away.
      </p>
    </div>
  )

  if (packages.length === 0) {
    return (
      <>
        {intro}
        <div className="text-center py-20">
          <p className="text-5xl mb-5">🏕️</p>
          <h2 className="font-display text-2xl font-semibold mb-3">Retreats coming soon</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            We are curating retreat packages around Kiambu Road. Check back shortly.
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      {intro}
      <p className="text-xs font-mono text-muted-foreground mb-6">
        {packages.length} package{packages.length !== 1 ? 's' : ''} available
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {packages.map((pkg) => {
          const imageUrl = pkg.image_path
            ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/store-media/${pkg.image_path}`
            : null
          const meta = [
            pkg.duration_note,
            pkg.price != null ? `${pkg.currency} ${Number(pkg.price).toLocaleString()}` : null,
          ].filter(Boolean).join(' · ')
          return (
            <EditorialCard
              key={pkg.id}
              href={`/journal/kiambu-here-n-there/${pkg.slug}`}
              imageUrl={imageUrl}
              imageAlt={pkg.name}
              imageHeight="h-40"
              title={pkg.name}
              description={pkg.description}
              meta={meta || null}
              metaColor={sectionColor}
            />
          )
        })}
      </div>
    </>
  )
}
