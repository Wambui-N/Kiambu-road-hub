import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us — Kiambu Road Hub',
  description:
    'Learn about Kiambu Road Hub — the definitive business directory and lifestyle journal for the Kiambu Road corridor, Nairobi.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-accent font-mono text-xs uppercase tracking-widest mb-2">Our Story</p>
          <h1 className="font-display text-4xl font-bold text-white">About Kiambu Road Hub</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">

        {/* Mission */}
        <section>
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            Kiambu Road Hub is the definitive online business directory and lifestyle journal for the Kiambu Road
            corridor — one of Nairobi&rsquo;s most vibrant and fast-growing neighbourhoods stretching from Gigiri
            through Ridgeways, Runda, Thindigua, and beyond towards Kiambu Town.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            We exist to help residents, visitors, and business owners connect. Whether you are looking for a great
            restaurant, a reliable mechanic, a school for your child, or a weekend escape, Kiambu Road Hub helps you
            find it quickly.
          </p>
        </section>

        {/* What we offer */}
        <section>
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">What We Offer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                icon: '🗂️',
                title: 'Business Directory',
                desc: 'Comprehensive listings across 14 categories — from food and health to professional services and leisure.',
              },
              {
                icon: '📰',
                title: 'Lifestyle Journal',
                desc: 'Editorial content covering health, travel, community news, business insights, and local stories.',
              },
              {
                icon: '💼',
                title: 'Jobs Board',
                desc: 'Local employment opportunities connecting job seekers with Kiambu Road businesses.',
              },
              {
                icon: '🏷️',
                title: 'Price Guide',
                desc: 'Community-sourced price comparisons for groceries, fuel, and everyday services.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl border border-border p-6">
                <span className="text-3xl block mb-3">{item.icon}</span>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Area coverage */}
        <section>
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">Areas We Cover</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Our directory covers businesses and services across the full Kiambu Road corridor, including:
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              'Ridgeways', 'Thindigua', 'Runda', 'Ruaka', 'Ndenderu', 'Kasarini',
              'Kitisuru', 'Kiambu Town', 'Two Rivers', 'Karura',
            ].map((area) => (
              <span
                key={area}
                className="px-3 py-1.5 bg-white border border-border rounded-full text-sm text-foreground font-medium"
              >
                {area}
              </span>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary rounded-2xl p-8 text-center text-white">
          <h3 className="font-display text-2xl font-bold mb-2">List Your Business</h3>
          <p className="text-white/70 text-sm mb-6 max-w-md mx-auto">
            Are you a business owner along Kiambu Road? Get listed and reach thousands of local residents.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/list-your-business"
              className="inline-flex items-center justify-center bg-accent hover:bg-amber-500 text-black font-semibold px-8 py-3 rounded-xl text-sm transition-colors"
            >
              List Your Business
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-white/15 hover:bg-white/25 text-white px-8 py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
