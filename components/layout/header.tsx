'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Menu, X, ChevronDown,
  UtensilsCrossed, Heart, Car, GraduationCap, ShoppingBag,
  Building2, Briefcase, Truck, Shield, Home, Trees, Wallet, Users, Church,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

const navLinks = [
  { label: 'Directory', href: '/directory' },
  { label: 'Journal', href: '/journal' },
  { label: 'Jobs', href: '/jobs' },
  { label: 'Prices', href: '/prices' },
  { label: 'Travel', href: '/travel' },
]

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
      {/* Main header row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
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

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
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
            className="fixed inset-0 top-16 bg-white z-40 md:hidden overflow-y-auto"
          >
            <nav className="px-4 py-6 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-lg text-base font-medium text-foreground hover:bg-muted transition-colors"
                >
                  {link.label}
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
              <div className="border-t border-border mt-4 pt-4 px-4">
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
