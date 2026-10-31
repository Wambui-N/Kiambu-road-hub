import { createClient } from '@/lib/supabase/server'
import EditorialCard from '@/components/shared/editorial-card'
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
          <EditorialCard
            key={profile.id}
            href={`/people/${profile.slug}`}
            imageUrl={photoUrl}
            imageAlt={profile.name}
            fallbackEmoji="🧑‍🤝‍🧑"
            imageHeight="h-48"
            title={profile.name}
            description={profile.role_connection}
            meta={profile.featured_month}
          />
        )
      })}
    </div>
  )
}
