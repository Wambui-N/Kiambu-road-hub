'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Menu, X, ChevronDown, Phone, Siren,
  UtensilsCrossed, Heart, Car, GraduationCap, ShoppingBag,
  Building2, Briefcase, Truck, Shield, Home, Trees, Wallet, Users, Church,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

const PRIMARY_NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Directory', href: '/directory' },
  { label: 'Magazine', href: '/journal' },
  { label: 'Events & Expos', href: '/events' },
  { label: 'Travel', href: '/travel' },
  { label: 'People', href: '/people' },
]

const SHOP_LINK = { label: 'Shop', href: '/shop' }

const SECONDARY_NAV_LINKS = [
  { label: 'News', href: '/journal/newswatch' },
  { label: 'Jobs & Careers', href: '/jobs' },
  { label: 'Compare Prices', href: '/prices' },
  { label: 'Books', href: '/journal/e-books' },
  { label: 'Ask Kiambu Road', href: '/ask-kiambu-road' },
]

const PHONE_NUMBER = '+254 720 950 500'
const PHONE_HREF = 'tel:+254720950500'

const quickCategories = [
  { label: 'Eat & Stay', href: '/directory/eat-drink-stay', icon: UtensilsCrossed },
  { label: 'Medical Services', href: '/directory/medical-services', icon: Heart },
  { label: 'Car & Motor Dealers', href: '/directory/car-motor-dealers', icon: Car },
  { label: 'Education', href: '/directory/education-childcare', icon: GraduationCap },
  { label: 'Shopping', href: '/directory/retail-shopping', icon: ShoppingBag },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b transition-shadow duration-200 ${
        scrolled ? 'border-border shadow-sm' : 'border-border'
      }`}
    >
      {/* Row 1 — Brand + Actions */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className={`flex items-center justify-between transition-[padding] duration-200 ${scrolled ? 'pt-2.5 pb-2.5' : 'pt-4 pb-3'}`}>
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/KRE logo.png"
              alt="Kiambu Road Explorer"
              width={1564}
              height={578}
              priority
              className={`w-auto transition-[height] duration-200 ${scrolled ? 'h-10 sm:h-11' : 'h-12 sm:h-14'}`}
            />
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/emergency"
              aria-label="Emergency contacts"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md px-3 py-1.5 transition-colors"
            >
              <Siren className="w-3.5 h-3.5 shrink-0" />
              Emergency
            </Link>

            <a
              href={PHONE_HREF}
              aria-label={`Call us at ${PHONE_NUMBER}`}
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="w-5 h-5 shrink-0" />
              {/* <span className="whitespace-nowrap">{PHONE_NUMBER}</span> */}
            </a>

            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link href="/list-your-business" className="hidden sm:block">
              <Button variant="outline" size="sm" className="text-xs px-3">
                List Your Business
              </Button>
            </Link>

            <button
              className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Row 2 — Primary nav band (desktop only) */}
      <div className="hidden md:block bg-primary">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <nav className="flex items-center justify-center gap-7 h-12">
            {PRIMARY_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-base font-bold tracking-wide uppercase text-white/90 whitespace-nowrap pb-[2px]
                  after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-white
                  after:transition-all after:duration-300 after:ease-out
                  hover:text-white hover:after:w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-sm"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={SHOP_LINK.href}
              className="text-sm font-bold tracking-wide uppercase text-white border border-white/70 rounded-md px-5 py-1.5 whitespace-nowrap hover:bg-white hover:text-primary transition-colors"
            >
              {SHOP_LINK.label}
            </Link>
          </nav>
        </div>
      </div>

      {/* Row 3 — Secondary nav band (desktop only). Neutral sand chrome — gold stays reserved for page-level CTAs. */}
      <div className="hidden md:block bg-surface-sand border-t border-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <nav className="flex items-center justify-center gap-6 h-10">
            {SECONDARY_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-xs font-mono font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap pb-[2px] hover:text-primary
                  after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-primary
                  after:transition-all after:duration-300 after:ease-out
                  hover:after:w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Expandable search bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border overflow-hidden"
          >
            <form onSubmit={handleSearch} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex gap-2">
                <Input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search restaurants, hospitals, schools..."
                  className="flex-1 border-primary/30 focus-visible:ring-primary"
                />
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  <Search className="w-4 h-4 mr-1" /> Search
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setSearchOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 top-14 bg-background z-40 md:hidden overflow-y-auto"
          >
            <nav className="px-4 py-6 flex flex-col gap-1">
              <Link
                href="/emergency"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 font-bold text-sm mb-3"
              >
                <Siren className="w-4 h-4" />
                Emergency Contacts
              </Link>
              {PRIMARY_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="group px-4 py-3 rounded-lg text-base font-semibold text-primary hover:bg-muted transition-colors"
                >
                  <span className="relative inline-block pb-[2px]
                    after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-primary
                    after:transition-all after:duration-300 after:ease-out
                    group-hover:after:w-full">
                    {link.label}
                  </span>
                </Link>
              ))}
              <Link
                href={SHOP_LINK.href}
                onClick={() => setMobileOpen(false)}
                className="mx-4 my-1 px-4 py-2.5 rounded-lg text-base font-bold text-center uppercase tracking-wide bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                {SHOP_LINK.label}
              </Link>
              <div className="border-t border-border mt-3 pt-2">
                {SECONDARY_NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="group px-4 py-3 rounded-lg text-base font-semibold text-foreground/80 hover:bg-muted hover:text-primary transition-colors block"
                  >
                    <span className="relative inline-block pb-[2px]
                      after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-primary
                      after:transition-all after:duration-300 after:ease-out
                      group-hover:after:w-full">
                      {link.label}
                    </span>
                  </Link>
                ))}
              </div>
              <div className="border-t border-border mt-4 pt-4">
                <p className="px-4 text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wide">
                  Quick categories
                </p>
                {quickCategories.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <cat.icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{cat.label}</span>
                  </Link>
                ))}
              </div>
              <div className="border-t border-border mt-4 pt-4 px-4 flex flex-col gap-3">
                <a
                  href={PHONE_HREF}
                  aria-label={`Call us at ${PHONE_NUMBER}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm font-medium">{PHONE_NUMBER}</span>
                </a>
                <Link href="/list-your-business" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">
                    List Your Business
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
