import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import type { PeopleProfile } from '@/types/database'

async function getProfiles(): Promise<PeopleProfile[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('people_profiles')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true })
    return data ?? []
  } catch {
    return []
  }
}

export default async function PeopleList() {
  const profiles = await getProfiles()

  if (profiles.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-5">🧑‍🤝‍🧑</p>
        <h2 className="font-display text-2xl font-semibold mb-3">Our first story is on its way</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Each month we&apos;ll feature someone whose life, work or experience is connected to Kiambu Road. Know someone
          whose story belongs here? Tell us about them below.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {profiles.map((profile) => {
        const photoUrl = profile.photo_path
          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/store-media/${profile.photo_path}`
          : null
        return (
          <Link
            key={profile.id}
            href={`/people/${profile.slug}`}
            className="group bg-white rounded-2xl border border-border overflow-hidden hover:border-primary hover:shadow-md transition-all flex flex-col"
          >
            <div className="relative h-48 overflow-hidden bg-muted shrink-0 flex items-center justify-center">
              {photoUrl ? (
                <Image src={photoUrl} alt={profile.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
              ) : (
                <span className="text-4xl">🧑‍🤝‍🧑</span>
              )}
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors leading-snug mb-1">
                {profile.name}
              </h3>
              {profile.role_connection && (
                <p className="text-sm text-muted-foreground leading-relaxed mb-2">{profile.role_connection}</p>
              )}
              {profile.featured_month && (
                <p className="text-xs font-mono text-primary mt-auto pt-2">{profile.featured_month}</p>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
