import Link from 'next/link'
import { Mail, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'
import NewsletterForm from '@/components/layout/newsletter-form'

export default function Footer() {
  return (
    <footer className="bg-brand-surface-dark text-white">
      {/* Newsletter bar */}
      <div className="bg-primary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-xl font-semibold text-white">
                Stay in the loop
              </h3>
              <p className="text-primary-foreground/80 text-sm mt-1">
                Get updates on new listings and local news.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Main footer columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand col */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">K</span>
              <span className="font-display font-bold text-lg text-white">Kiambu Road Hub</span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              Your complete business directory and lifestyle journal for the Kiambu Road corridor, Nairobi.
            </p>
            <p className="text-xs text-white/40 mb-3">
              Serving Ridgeways · Thindigua · Runda · Ruaka · Kiambu Town
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-xs font-bold">
                WA
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide font-mono">Company</h4>
            <ul className="space-y-2">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Advertise With Us', href: '/advertise' },
                { label: 'Other Services', href: '/other-services' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide font-mono">Support</h4>
            <ul className="space-y-2">
              {[
                { label: 'Contact Us', href: '/contact' },
                { label: 'List Your Business', href: '/list-your-business' },
                { label: 'Emergency Contacts', href: '/emergency' },
                { label: 'Jobs Board', href: '/jobs' },
                { label: 'Travel Bookings', href: '/travel' },
                { label: 'Prices at a Glance', href: '/prices' },
                { label: 'Talent Search', href: '/talent-search' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide font-mono">Legal</h4>
            <ul className="space-y-2">
              {[
                { label: 'Terms & Conditions', href: '/terms' },
                { label: 'Privacy Policy', href: '/privacy' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <p className="text-xs text-white/40 font-mono">Contact us:</p>
              <a href="mailto:info@kiamburoad-hub.com"
                className="flex items-center gap-1 text-sm text-white/60 hover:text-white mt-1 transition-colors">
                <Mail className="w-3 h-3" />
                info@kiamburoad-hub.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/40 font-mono">
            © {new Date().getFullYear()} Kiambu Road Hub. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-white/40">
            <Link href="/terms" className="hover:text-white/70 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white/70 transition-colors">Privacy</Link>
            <Link href="/sitemap.xml" className="hover:text-white/70 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
