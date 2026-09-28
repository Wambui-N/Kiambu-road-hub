import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import AdSlot from '@/components/ads/ad-slot'
import ForumSection from '@/components/forum/forum-section'
import { breadcrumbJsonLd, buildCanonical } from '@/lib/seo'
import type { AdSlot as AdSlotType, ForumPost } from '@/types/database'

export const metadata: Metadata = {
  title: 'Ask Kiambu Road — Community Q&A',
  description:
    'Ask the Kiambu Road community a question or share advice and local tips. A community discussion space for residents, business owners and visitors along the Kiambu Road corridor.',
  alternates: { canonical: buildCanonical('/ask-kiambu-road') },
  openGraph: {
    title: 'Ask Kiambu Road — Community Q&A',
    description: 'Ask a question or share advice with the Kiambu Road community.',
    url: buildCanonical('/ask-kiambu-road'),
  },
}

async function getData() {
  const supabase = await createClient()

  const [{ data: adSlots }, { data: posts }, { data: { user } }] = await Promise.all([
    supabase
      .from('ad_slots')
      .select('*, advertiser:businesses(id, name, slug)')
      .or('page.eq.ask-kiambu-road,page.eq.global')
      .eq('active', true)
      .order('tier')
      .order('position'),
    supabase
      .from('forum_posts')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(20),
    supabase.auth.getUser(),
  ])

  return {
    adSlots: (adSlots ?? []) as AdSlotType[],
    posts: (posts ?? []) as ForumPost[],
    isSignedIn: !!user,
  }
}

export default async function AskKiambuRoadPage() {
  const { adSlots, posts, isSignedIn } = await getData()
  const leaderboard = adSlots.find((s) => s.tier === 'primary') ?? null

  const jsonLd = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Ask Kiambu Road', path: '/ask-kiambu-road' },
  ])

  return (
    <div className="min-h-screen bg-brand-surface">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Ad section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <AdSlot slot={leaderboard} tier="primary" className="w-full" />
      </div>

      {/* Hero */}
      <div className="py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-primary font-mono text-xs uppercase tracking-widest mb-2">
            Community
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Ask Kiambu Road
          </h1>
          <p className="text-muted-foreground text-base max-w-2xl">
            Platform for information exchange – ask questions, share advice or useful tips
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <ForumSection initialPosts={posts} isSignedIn={isSignedIn} />
      </div>
    </div>
  )
}
