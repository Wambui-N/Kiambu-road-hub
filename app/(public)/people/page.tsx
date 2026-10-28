import { Metadata } from 'next'
import PeopleList from '@/components/people/people-list'
import StorySubmissionForm from '@/components/people/story-submission-form'

export const metadata: Metadata = {
  title: 'People of Kiambu Road — Kiambu Road Explorer',
  description: 'Encounter with people who make Kiambu Road tick — profiles and stories from the Kiambu Road corridor.',
  alternates: { canonical: 'https://kiamburoad.com/people' },
}

export default function PeoplePage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="bg-primary py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-accent font-mono text-xs uppercase tracking-widest mb-2">People of Kiambu Road</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Encounter with People Who Make Kiambu Road Tick
          </h1>
          <p className="text-white/80 text-base max-w-2xl mb-2">
            Every place has a story. Behind every growing neighbourhood and community are people who shape it daily.
          </p>
          <p className="text-white/80 text-base max-w-2xl">
            Each month, The Kiambu Road Explorer meets the people whose lives, work, businesses, ideas or experiences are
            connected to Kiambu Road. We ask about the person behind the name, their connection with Kiambu Road and what
            they would like to see in the future.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <PeopleList />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white rounded-2xl border border-dashed border-border p-6 sm:p-8 mb-8 text-center">
          <h2 className="font-display text-xl font-bold mb-2">Meet the People of Kiambu Road</h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            We are always looking for people with an interesting connection to Kiambu Road. Know someone whose story
            belongs here?
          </p>
        </div>
        <StorySubmissionForm />
      </div>
    </div>
  )
}
