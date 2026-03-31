import { Metadata } from 'next'
import Link from 'next/link'
import { MessageCircle, Users, ThumbsUp, Bell } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ask Kiambu Road — Community Forum',
  description:
    'A community discussion forum for residents, businesses and visitors along the Kiambu Road corridor. Coming soon.',
}

const FEATURES = [
  {
    icon: MessageCircle,
    title: 'Ask Anything',
    description: 'Post questions about local services, businesses, events, safety, and life along the Kiambu Road corridor.',
  },
  {
    icon: Users,
    title: 'Community Answers',
    description: 'Get real responses from neighbours, locals, and business owners who know the area.',
  },
  {
    icon: ThumbsUp,
    title: 'Trusted Recommendations',
    description: 'Upvote the most helpful answers and surface the best local knowledge for everyone.',
  },
  {
    icon: Bell,
    title: 'Stay Notified',
    description: 'Subscribe to topics that matter to you and never miss an update from your community.',
  },
]

export default function AskKiambuRoadPage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      {/* Hero header */}
      <div className="bg-primary py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-accent font-mono text-xs uppercase tracking-widest mb-2">
            Coming Soon
          </p>
          <h1 className="font-display text-4xl font-bold text-white mb-3">
            Ask Kiambu Road
          </h1>
          <p className="text-white/70 text-base max-w-2xl">
            A community discussion forum where residents, business owners and visitors along the Kiambu Road corridor can ask questions, share knowledge, and connect.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main placeholder card */}
        <div className="bg-white border border-border rounded-2xl p-8 text-center mb-12 shadow-sm">
          <div className="text-6xl mb-5">💬</div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">
            We&rsquo;re building your community forum
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-lg mx-auto mb-8">
            Ask Kiambu Road is our upcoming discussion forum. Whether you need the best mechanic in Ruaka, want to know which school is enrolling, or simply have a local tip to share — this is the place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/#newsletter"
              className="inline-flex items-center justify-center bg-primary text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              <Bell className="w-4 h-4 mr-2" />
              Notify me when it launches
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-white border border-border text-foreground px-6 py-3 rounded-xl text-sm font-semibold hover:bg-muted transition-colors"
            >
              Send us a suggestion
            </Link>
          </div>
        </div>

        {/* Feature preview grid */}
        <h3 className="font-display text-lg font-semibold text-foreground mb-6 text-center">
          What to expect
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="bg-white border border-border rounded-2xl p-6 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm mb-1">{feature.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Back link */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
          >
            ← Back to Kiambu Road Explorer
          </Link>
        </div>
      </div>
    </div>
  )
}
