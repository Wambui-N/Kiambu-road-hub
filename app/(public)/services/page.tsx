import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Our Services — Kiambu Road Explorer',
  description: 'Explore all the services offered by Kiambu Road Explorer — from business directory listings to editorial content and local guides.',
}

const SERVICES = [
  {
    icon: '🗂️',
    title: 'Business Directory',
    description: 'A comprehensive, searchable database of businesses along the Kiambu Road corridor, organized by category and area.',
    href: '/directory',
    cta: 'Browse Directory',
  },
  {
    icon: '📝',
    title: 'List Your Business',
    description: 'Submit your business for inclusion in the directory. Free standard listings available for all local businesses.',
    href: '/list-your-business',
    cta: 'Get Listed',
  },
  {
    icon: '📰',
    title: 'Lifestyle Journal',
    description: 'Editorial content covering health, travel, community news, and business insights from around Kiambu.',
    href: '/journal',
    cta: 'Read Journal',
  },
  {
    icon: '💼',
    title: 'Jobs Board',
    description: 'Connect local employers with qualified candidates. Post job openings or find opportunities near you.',
    href: '/jobs',
    cta: 'View Jobs',
  },
  {
    icon: '🏷️',
    title: 'Price Guide',
    description: 'Community-sourced price comparisons for groceries, fuel, dining, and everyday services along Kiambu Road.',
    href: '/prices',
    cta: 'View Prices',
  },
  {
    icon: '✈️',
    title: 'Travel Bookings',
    description: 'Book hotels, car hire, and curated local experiences through our trusted network of travel partners.',
    href: '/travel',
    cta: 'Plan a Trip',
  },
  {
    icon: '📢',
    title: 'Advertising',
    description: 'Promote your business to thousands of local residents. Featured listings, sponsored content, and banner placements.',
    href: '/advertise',
    cta: 'Advertise',
  },
  {
    icon: '🚨',
    title: 'Emergency Contacts',
    description: 'A curated list of essential emergency contacts for the Kiambu Road area — hospitals, police, fire, and more.',
    href: '/emergency',
    cta: 'View Contacts',
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-accent font-mono text-xs uppercase tracking-widest mb-2">What We Offer</p>
          <h1 className="font-display text-4xl font-bold text-white">Our Services</h1>
          <p className="text-white/70 text-sm mt-2">
            Everything you need to navigate, discover, and connect with the Kiambu Road community.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <div key={service.title} className="bg-white rounded-2xl border border-border p-6 flex flex-col">
              <span className="text-3xl block mb-4">{service.icon}</span>
              <h2 className="font-display font-bold text-foreground mb-2">{service.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5">
                {service.description}
              </p>
              <Link
                href={service.href}
                className="inline-flex items-center text-sm text-primary font-semibold hover:underline"
              >
                {service.cta} →
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 bg-primary rounded-2xl p-8 text-center text-white">
          <h3 className="font-display text-2xl font-bold mb-2">Have a question?</h3>
          <p className="text-white/70 text-sm mb-6">
            Our team is happy to help you find the right service or listing option for your needs.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center bg-accent hover:bg-amber-500 text-black font-semibold px-8 py-3 rounded-xl text-sm transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
