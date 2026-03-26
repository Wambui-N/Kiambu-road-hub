import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Other Services',
  description:
    'Kiambu Road Explorer offers website development, graphic design, content writing, business planning, marketing training and more.',
  alternates: { canonical: 'https://kiamburoad-hub.com/other-services' },
}

const SERVICES = [
  {
    icon: '🌐',
    title: 'Web & Social Media',
    desc: 'Development and maintenance of websites, social media accounts, and online campaigns.',
  },
  {
    icon: '🎨',
    title: 'Graphic Design & 3D',
    desc: 'All things Graphic Design and 3D animations for your brand and marketing materials.',
  },
  {
    icon: '✍️',
    title: 'Content Writing',
    desc: 'Writing blogs, company publications, and editorial content that engages your audience.',
  },
  {
    icon: '📊',
    title: 'Business Planning',
    desc: 'Business and project management plans tailored to your goals and industry.',
  },
  {
    icon: '📣',
    title: 'Marketing & Training',
    desc: 'Marketing and customer service training to help your team grow your business.',
  },
  {
    icon: '💻',
    title: 'IT & AI Training',
    desc: 'Practical IT and AI training courses for individuals and corporate teams.',
  },
]

export default function OtherServicesPage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-accent font-mono text-xs uppercase tracking-widest mb-2">What We Do</p>
          <h1 className="font-display text-4xl font-bold text-white mb-3">Other Services</h1>
          <p className="text-white/75 text-sm max-w-2xl">
            Kiambu Road Explorer is a powerhouse of skills and expertise ready to serve individuals, companies, and businesses.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">

        <section>
          <p className="text-muted-foreground text-base leading-relaxed mb-8">
            Contact us for customised and affordable services in the following categories:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {SERVICES.map((service, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border p-6 flex gap-4">
                <span className="text-3xl shrink-0">{service.icon}</span>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Affiliate services */}
        <section className="bg-white rounded-2xl border border-border p-8">
          <h2 className="font-display text-xl font-bold text-foreground mb-3">Affiliate Services</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We also offer Environment and Travel services through our affiliate companies.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              🌿 Environment Services
            </a>
            <Link
              href="/travel"
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              ✈️ Travel Services
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary rounded-2xl p-8 text-center text-white">
          <h3 className="font-display text-xl font-bold mb-2">Get in Touch</h3>
          <p className="text-white/75 text-sm mb-6">
            Contact us for more details and inquiries about any of our services.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-white text-primary font-semibold px-8 py-3 rounded-xl text-sm hover:bg-white/90 transition-colors"
            >
              Contact Us
            </Link>
            <a
              href="mailto:info@kiambu-road.com"
              className="inline-flex items-center justify-center bg-white/15 hover:bg-white/25 text-white font-semibold px-8 py-3 rounded-xl text-sm transition-colors"
            >
              info@kiambu-road.com
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
