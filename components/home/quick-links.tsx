'use client'

import { Map, Mail, MessageSquare, Facebook, Twitter, Instagram, MessageCircle, Youtube, Share2 } from 'lucide-react'

const QUICK_LINKS = [
  { label: 'Map', icon: Map, href: '/directory', external: false },
  { label: 'Subscribe', icon: Mail, href: '#newsletter', external: false, action: 'subscribe' },
  { label: 'Feedback', icon: MessageSquare, href: 'mailto:info@kiamburoad-hub.com', external: true },
  { label: 'Facebook', icon: Facebook, href: 'https://facebook.com/kiamburoadhub', external: true },
  { label: 'X', icon: Twitter, href: 'https://twitter.com/kiamburoadhub', external: true },
  { label: 'Instagram', icon: Instagram, href: 'https://instagram.com/kiamburoadhub', external: true },
  { label: 'WhatsApp', icon: MessageCircle, href: 'https://wa.me/254720950500', external: true },
  { label: 'YouTube', icon: Youtube, href: 'https://youtube.com/@kiamburoadhub', external: true },
  { label: 'Share Site', icon: Share2, href: '#share', external: false, action: 'share' },
]

export default function QuickLinks() {
  const handleClick = (action?: string, href?: string) => {
    if (action === 'subscribe') {
      const el = document.querySelector('#newsletter-form, [data-newsletter]')
      el?.scrollIntoView({ behavior: 'smooth' })
      return true
    }
    if (action === 'share') {
      if (navigator.share) {
        navigator.share({
          title: 'Kiambu Road Explorer',
          text: 'Check out Kiambu Road Explorer — the complete guide to businesses and services along Kiambu Road!',
          url: 'https://kiamburoad-hub.com',
        })
      } else {
        navigator.clipboard.writeText('https://kiamburoad-hub.com')
          .then(() => alert('Link copied to clipboard!'))
      }
      return true
    }
    return false
  }

  return (
    <div className="bg-white border-b border-border py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center gap-4 overflow-x-auto pb-1 scrollbar-hide">
          {QUICK_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              onClick={(e) => {
                if (link.action) {
                  const handled = handleClick(link.action)
                  if (handled) e.preventDefault()
                }
              }}
              className="shrink-0 flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-muted transition-colors group cursor-pointer min-w-[56px]"
            >
              <link.icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono text-muted-foreground group-hover:text-foreground whitespace-nowrap">
                {link.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
