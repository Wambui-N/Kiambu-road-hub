import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Advertise With Us — Kiambu Road Hub',
  description: 'Reach thousands of residents and visitors along the Kiambu Road corridor. Learn about our advertising and sponsorship options.',
}

const PACKAGES = [
  {
    name: 'Standard Listing',
    price: 'Free',
    color: '#64748B',
    features: [
      'Basic business profile',
      'Name, phone, address',
      'Category placement',
      'WhatsApp & call button',
    ],
  },
  {
    name: 'Featured Listing',
    price: 'Contact Us',
    color: '#1B6B3A',
    highlight: true,
    features: [
      'Everything in Standard',
      'Priority placement in category',
      'Photo gallery (up to 10 images)',
      'Featured badge',
      'Homepage carousel inclusion',
      'Highlighted in search results',
    ],
  },
  {
    name: 'Sponsor Package',
    price: 'Contact Us',
    color: '#E8A020',
    features: [
      'Everything in Featured',
      'Banner placement on relevant pages',
      'Journal article sponsorship',
      'Social media mentions',
      'Monthly performance report',
      'Dedicated account manager',
    ],
  },
]

export default function AdvertisePage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-accent font-mono text-xs uppercase tracking-widest mb-2">Grow Your Business</p>
          <h1 className="font-display text-4xl font-bold text-white">Advertise With Us</h1>
          <p className="text-white/70 text-sm mt-2 max-w-2xl">
            Reach thousands of residents, visitors, and business owners along the Kiambu Road corridor.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
          {[
            { label: 'Monthly Visitors', value: 'Growing' },
            { label: 'Business Listings', value: '100+' },
            { label: 'Categories', value: '14' },
            { label: 'Areas Covered', value: '10+' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-border p-5 text-center">
              <p className="font-display text-2xl font-bold text-primary mb-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground font-mono">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Packages */}
        <h2 className="font-display text-2xl font-bold text-foreground mb-8">Advertising Packages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.name}
              className={`bg-white rounded-2xl border p-7 flex flex-col ${pkg.highlight ? 'border-primary shadow-lg ring-2 ring-primary/20' : 'border-border'}`}
            >
              {pkg.highlight && (
                <span className="inline-block text-xs font-mono font-bold text-white bg-primary px-3 py-1 rounded-full mb-4 self-start">
                  Most Popular
                </span>
              )}
              <h3 className="font-display text-lg font-bold text-foreground mb-1">{pkg.name}</h3>
              <p className="text-2xl font-bold mb-6" style={{ color: pkg.color }}>{pkg.price}</p>
              <ul className="space-y-2.5 flex-1">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center justify-center bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="bg-white rounded-2xl border border-border p-8 text-center max-w-2xl mx-auto">
          <h3 className="font-display text-xl font-bold mb-2">Ready to get started?</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Contact us to discuss the best package for your business. We offer flexible options for businesses of all sizes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-primary text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/list-your-business"
              className="inline-flex items-center justify-center bg-white border border-border text-foreground px-8 py-3 rounded-xl text-sm font-semibold hover:bg-muted transition-colors"
            >
              List Your Business
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
