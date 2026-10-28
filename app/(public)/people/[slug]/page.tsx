import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import SimpleMarkdown from '@/components/journal/simple-markdown'
import type { PeopleProfile } from '@/types/database'

interface Props {
  params: Promise<{ slug: string }>
}

async function getProfile(slug: string): Promise<PeopleProfile | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('people_profiles').select('*').eq('slug', slug).eq('status', 'published').single()
  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const profile = await getProfile(slug)
  if (!profile) return { title: 'Not Found' }
  return {
    title: `${profile.name} — People of Kiambu Road`,
    description: profile.role_connection ?? undefined,
    alternates: { canonical: `https://kiamburoad.com/people/${slug}` },
  }
}

export default async function PeopleProfilePage({ params }: Props) {
  const { slug } = await params
  const profile = await getProfile(slug)
  if (!profile) notFound()

  const photoUrl = profile.photo_path
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/store-media/${profile.photo_path}`
    : null

  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="py-8 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-xs text-muted-foreground flex items-center gap-1.5 font-mono">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/people" className="hover:text-foreground">People</Link>
            <span>/</span>
            <span className="text-foreground">{profile.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          {photoUrl && (
            <div className="relative h-72">
              <Image src={photoUrl} alt={profile.name} fill className="object-cover" />
            </div>
          )}
          <div className="p-6">
            <h1 className="font-display text-2xl sm:text-3xl font-bold mb-1">{profile.name}</h1>
            {profile.role_connection && (
              <p className="text-base font-semibold text-primary mb-1">{profile.role_connection}</p>
            )}
            {profile.featured_month && (
              <p className="text-xs font-mono text-muted-foreground">{profile.featured_month}</p>
            )}
          </div>
        </div>

        {profile.story && (
          <div className="bg-white rounded-2xl border border-border p-6 sm:p-8">
            <SimpleMarkdown text={profile.story} />
          </div>
        )}
      </div>
    </div>
  )
}
