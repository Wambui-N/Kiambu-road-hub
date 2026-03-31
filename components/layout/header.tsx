'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Menu, X, ChevronDown, Phone,
  UtensilsCrossed, Heart, Car, GraduationCap, ShoppingBag,
  Building2, Briefcase, Truck, Shield, Home, Trees, Wallet, Users, Church,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

const navLinks = [
  { label: 'Directory', href: '/directory' },
  { label: 'Lifestyle Vibes', href: '/journal' },
  { label: 'Newswatch', href: '/journal/newswatch' },
  { label: 'Jobs & Careers', href: '/jobs' },
  { label: 'Compare Prices', href: '/prices' },
  { label: 'Travel', href: '/travel' },
  { label: 'Ask Kiambu Road', href: '/ask-kiambu-road' },
]

const PHONE_NUMBER = '+254 720 950 500'
const PHONE_HREF = 'tel:+254720950500'

const quickCategories = [
  { label: 'Eat & Stay', href: '/directory/eat-drink-stay', icon: UtensilsCrossed },
  { label: 'Health', href: '/directory/health-wellness', icon: Heart },
  { label: 'Automotive', href: '/directory/automotive', icon: Car },
  { label: 'Education', href: '/directory/education-childcare', icon: GraduationCap },
  { label: 'Shopping', href: '/directory/retail-shopping', icon: ShoppingBag },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      {/* Row 1 — Brand + Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
              K
            </span>
            <span className="font-display font-bold text-lg text-foreground leading-tight hidden sm:block">
              Kiambu Road Explorer
            </span>
            <span className="font-display font-bold text-lg text-foreground leading-tight sm:hidden">
              KRH
            </span>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-2">
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
              <Button size="sm" className="bg-accent hover:bg-amber-500 text-black font-semibold text-xs px-3">
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

      {/* Row 2 — Navigation links (desktop only) */}
      <div className="hidden md:block mt-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-center gap-6 h-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm font-semibold text-primary whitespace-nowrap pb-[2px]
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
            className="fixed inset-0 top-14 bg-white z-40 md:hidden overflow-y-auto"
          >
            <nav className="px-4 py-6 flex flex-col gap-1">
              {navLinks.map((link) => (
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
                  <Button className="w-full bg-accent hover:bg-amber-500 text-black font-semibold">
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
