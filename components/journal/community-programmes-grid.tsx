import Link from 'next/link'
import Image from 'next/image'
import { HeartHandshake } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import type { CommunityProgramme } from '@/types/database'

async function getProgrammes(): Promise<CommunityProgramme[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('community_programmes')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true })
    return data ?? []
  } catch {
    return []
  }
}

export default async function CommunityProgrammesGrid({ sectionColor }: { sectionColor: string }) {
  const programmes = await getProgrammes()

  return (
    <>
      {/* Section banner */}
      <div className="rounded-2xl p-6 mb-8 text-white" style={{ backgroundColor: sectionColor }}>
        <p className="font-display text-xl font-bold">If you love Kiambu Road,</p>
        <p className="font-display text-xl font-bold">support our community projects</p>
      </div>

      {programmes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-5">🤝</p>
          <h2 className="font-display text-2xl font-semibold mb-3">Projects coming soon</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            We are setting up community projects. Check back shortly.
          </p>
        </div>
      ) : (
        <>
          <p className="text-xs font-mono text-muted-foreground mb-6">
            {programmes.length} project{programmes.length !== 1 ? 's' : ''} available
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            {programmes.map((programme) => {
              const imageUrl = programme.image_path
                ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/store-media/${programme.image_path}`
                : null
              return (
                <Link
                  key={programme.id}
                  href={`/journal/business-opportunities/${programme.slug}`}
                  className="group bg-white rounded-2xl border border-border overflow-hidden hover:border-primary hover:shadow-md transition-all flex flex-col"
                >
                  {imageUrl && (
                    <div className="relative h-40 overflow-hidden bg-muted shrink-0">
                      <Image src={imageUrl} alt={programme.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 50vw" />
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors leading-snug mb-2">
                      {programme.name}
                    </h3>
                    {(programme.tagline || programme.description) && (
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-3">
                        {programme.tagline ?? programme.description}
                      </p>
                    )}
                    {programme.schedule_note && (
                      <p className="text-xs font-mono mt-auto pt-2" style={{ color: sectionColor }}>{programme.schedule_note}</p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </>
      )}

      {/* Section-level closing CTA */}
      <div className="bg-white rounded-2xl border border-border p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between">
        <div className="flex items-start gap-3">
          <HeartHandshake className="w-8 h-8 text-primary shrink-0" />
          <div>
            <h3 className="font-display text-lg font-bold mb-1">Support Our Work</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
              We are eager to connect with philanthropists, businesses and volunteers passionate about uplifting the collective
              livelihood standards of Kiambu Road. Feel free to connect us with others in your network.
            </p>
          </div>
        </div>
        <Link href="/partner-with-us#donate" className="shrink-0">
          <Button className="bg-primary hover:bg-primary/90 h-11 px-6 whitespace-nowrap">Donate</Button>
        </Link>
      </div>
    </>
  )
}
