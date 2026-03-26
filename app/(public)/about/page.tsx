import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Kiambu Road Explorer is a comprehensive commercial guide to Kiambu Road and its environs — a social and knowledge platform designed for the community.',
  alternates: { canonical: 'https://kiamburoad-hub.com/about' },
}

const QUICK_LINKS = [
  { label: 'Browse the Directory', href: '/directory' },
  { label: 'Lifestyle Journal', href: '/journal' },
  { label: 'List Your Business', href: '/list-your-business' },
  { label: 'Jobs Board', href: '/jobs' },
  { label: 'Travel Bookings', href: '/travel' },
  { label: 'Contact Us', href: '/contact' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-accent font-mono text-xs uppercase tracking-widest mb-2">Our Story</p>
          <h1 className="font-display text-4xl font-bold text-white">About Us</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="lg:flex lg:gap-12">
          {/* Main content */}
          <div className="lg:flex-1 space-y-10">

            <section className="bg-white rounded-2xl border border-border p-8 space-y-4">
              <p className="text-foreground leading-relaxed">
                Kiambu Road Explorer is a comprehensive commercial guide to Kiambu Road and its environs.
                It is also a social and knowledge platform designed for you.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We connect you with essential business services and information to make life convenient,
                easy, and enjoyable.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We are professionally committed to our readers and users of our services. We guarantee
                respect, understanding and privacy to everyone interacting with us.
              </p>
              <p className="text-foreground font-semibold leading-relaxed">
                Join our community and share our site with your friends and family.
              </p>
            </section>

            {/* Mission */}
            <section className="bg-white rounded-2xl border border-border p-8">
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We aim to become the most important reference platform for everything about Kiambu Road —
                from{' '}
                <Link href="/directory" className="text-primary hover:underline font-semibold">Business</Link>,{' '}
                <Link href="/journal/newswatch" className="text-primary hover:underline font-semibold">News</Link>{' '}
                and{' '}
                <Link href="/leisure-outdoors" className="text-primary hover:underline font-semibold">Events</Link>{' '}
                to Social Life.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-3">
                As we pursue this, we remain professionally committed to our readers and users of our services.
                Respect, understanding and privacy are guaranteed while interacting with us.
              </p>
              <p className="text-foreground font-semibold text-lg mt-4">Karibu!</p>
            </section>

            {/* What we offer */}
            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">What We Offer</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  {
                    icon: '🗂️',
                    title: 'Business Directory',
                    desc: 'Comprehensive listings across 16 categories — from food and health to professional services and leisure.',
                    href: '/directory',
                  },
                  {
                    icon: '📰',
                    title: 'Lifestyle Journal',
                    desc: 'Editorial content covering health, travel, community news, business insights, and local stories.',
                    href: '/journal',
                  },
                  {
                    icon: '💼',
                    title: 'Jobs Board',
                    desc: 'Local employment opportunities connecting job seekers with Kiambu Road businesses.',
                    href: '/jobs',
                  },
                  {
                    icon: '🏷️',
                    title: 'Price Guide',
                    desc: 'Community-sourced price comparisons for groceries, fuel, and everyday services.',
                    href: '/prices',
                  },
                  {
                    icon: '✈️',
                    title: 'Travel Bookings',
                    desc: 'Hiking, camping, safaris, honeymoons and hotel bookings arranged for you.',
                    href: '/travel',
                  },
                  {
                    icon: '📣',
                    title: 'Advertise With Us',
                    desc: 'Reach 40,000+ residents along Kiambu Road through our directory and journal.',
                    href: '/advertise',
                  },
                ].map((item) => (
                  <Link key={item.title} href={item.href} className="bg-white rounded-2xl border border-border p-6 hover:border-primary hover:shadow-sm transition-all">
                    <span className="text-3xl block mb-3">{item.icon}</span>
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </Link>
                ))}
              </div>
            </section>

            {/* Areas */}
            <section className="bg-white rounded-2xl border border-border p-8">
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">Areas We Cover</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our <Link href="/directory" className="text-primary hover:underline">directory</Link> covers businesses and services across the full Kiambu Road corridor, including:
              </p>
              <div className="flex flex-wrap gap-2">
                {['Ridgeways', 'Thindigua', 'Runda', 'Ruaka', 'Ndenderu', 'Kasarini', 'Kitisuru', 'Kiambu Town', 'Two Rivers', 'Karura'].map((area) => (
                  <span key={area} className="px-3 py-1.5 bg-muted border border-border rounded-full text-sm text-foreground font-medium">
                    {area}
                  </span>
                ))}
              </div>
            </section>

            {/* CTA */}
            <section className="bg-primary rounded-2xl p-8 text-center text-white">
              <h3 className="font-display text-2xl font-bold mb-2">List Your Business</h3>
              <p className="text-white/70 text-sm mb-6 max-w-md mx-auto">
                Are you a business owner along Kiambu Road? Get listed and reach thousands of local residents for free.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/list-your-business" className="inline-flex items-center justify-center bg-accent hover:bg-amber-500 text-black font-semibold px-8 py-3 rounded-xl text-sm transition-colors">
                  List Your Business
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center bg-white/15 hover:bg-white/25 text-white px-8 py-3 rounded-xl text-sm font-semibold transition-colors">
                  Contact Us
                </Link>
              </div>
            </section>
          </div>

          {/* Quick Links Sidebar */}
          <div className="lg:w-64 mt-10 lg:mt-0">
            <div className="bg-white rounded-2xl border border-border p-6 lg:sticky lg:top-24">
              <h3 className="font-semibold text-sm uppercase tracking-wide font-mono text-muted-foreground mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors py-1">
                      <span className="text-primary">→</span> {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
