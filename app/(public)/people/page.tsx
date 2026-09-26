import { Metadata } from 'next'
import ComingSoon from '@/components/ui/coming-soon'

export const metadata: Metadata = {
  title: 'People — Kiambu Road Explorer',
  description: 'Profiles and stories of the people who make the Kiambu Road corridor what it is.',
}

export default function PeoplePage() {
  return (
    <ComingSoon
      title="People"
      description="Profiles and stories of the people who make the Kiambu Road corridor what it is."
      icon="🧑‍🤝‍🧑"
      features={[
        'Profiles of local business owners and community figures',
        'Resident and newcomer spotlights',
        'Interviews and features from around the corridor',
      ]}
      ctaLabel="Explore the Magazine"
      ctaHref="/journal"
    />
  )
}
