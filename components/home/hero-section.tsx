'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Search, MapPin, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CATEGORY_OPTIONS } from '@/lib/data/options'
import AdSlot from '@/components/ads/ad-slot'
import type { AdSlot as AdSlotType, Area } from '@/types/database'

interface HeroSectionProps {
  areas?: Area[]
  heroAdSlot?: AdSlotType | null
}

export default function HeroSection({ areas = [], heroAdSlot = null }: HeroSectionProps) {
  const [query, setQuery] = useState('')
  const [categoryValue, setCategoryValue] = useState('')
  const [areaValue, setAreaValue] = useState('')
  const [catOpen, setCatOpen] = useState(false)
  const [areaOpen, setAreaOpen] = useState(false)
  const router = useRouter()

  const selectedLabel = CATEGORY_OPTIONS.find((c) => c.value === categoryValue)?.label ?? 'All Categories'
  const selectedAreaLabel = areas.find((a) => a.slug === areaValue)?.name ?? 'All Areas'
  const compactAreaLabel =
    selectedAreaLabel.length > 12 ? `${selectedAreaLabel.slice(0, 12)}...` : selectedAreaLabel

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (categoryValue) params.set('category', categoryValue)
    if (areaValue) params.set('area', areaValue)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <section className="relative overflow-hidden min-h-[520px] flex items-center">
      {/* Background photo — muted grade for a calmer, cohesive tone */}
      <div className="absolute inset-0">
        <Image
          src="/hero.jpg"
          alt="Kiambu Road, Nairobi"
          fill
          priority
          className="object-cover muted-photo"
          sizes="100vw"
        />
      </div>
      {/* Flat legibility scrim behind the left-aligned text — no colour tint */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 w-full py-16">
        <div className="max-w-xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 14 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
              }}
              className="flex items-center gap-1.5 text-white/80 font-mono text-xs tracking-widest uppercase mb-3"
            >
              <MapPin className="w-3.5 h-3.5" />
              Kiambu Road, Nairobi
            </motion.p>

            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 14 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
              }}
              className="font-display text-4xl sm:text-5xl font-medium text-white leading-tight mb-4"
            >
              Kiambu Road Explorer
            </motion.h1>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 14 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
              }}
              className="text-white/85 text-lg mb-1"
            >
              Your complete business directory &amp; lifestyle journal
            </motion.p>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 14 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
              }}
              className="text-white/65 text-sm mb-8"
            >
              Helping you discover, compare and connect with the best of Kiambu Road
            </motion.p>
          </motion.div>

          {/* Search bar — mounted plainly, outside the stagger, so it's usable immediately */}
          <div>
            <form onSubmit={handleSearch}>
              <div className="flex flex-col sm:flex-row gap-2 bg-white/10 backdrop-blur-md p-2 rounded-lg border border-white/20">
                {/* Category selector */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => { setCatOpen((v) => !v); setAreaOpen(false) }}
                    className="flex items-center gap-2 px-4 py-3 rounded-md bg-white/15 hover:bg-white/25 text-white text-sm font-medium whitespace-nowrap transition-colors w-full sm:w-auto"
                  >
                    {selectedLabel}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {catOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-card rounded-lg shadow-sm z-20 min-w-[220px] py-1 border border-border max-h-72 overflow-y-auto">
                      <button
                        type="button"
                        onClick={() => { setCategoryValue(''); setCatOpen(false) }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${!categoryValue ? 'text-primary font-semibold' : 'text-foreground'}`}
                      >
                        All Categories
                      </button>
                      {CATEGORY_OPTIONS.map((cat) => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => { setCategoryValue(cat.value); setCatOpen(false) }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${categoryValue === cat.value ? 'text-primary font-semibold' : 'text-foreground'}`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Text input */}
                <div className="flex-1 flex items-center gap-2 bg-white rounded-md px-4">
                  <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search restaurants, hospitals, schools..."
                    className="flex-1 py-3 text-sm text-foreground placeholder:text-muted-foreground bg-transparent outline-none min-w-0"
                  />

                  {/* Area selector inside the text input box */}
                  {areas.length > 0 && (
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() => { setAreaOpen((v) => !v); setCatOpen(false) }}
                        className="flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-primary transition-colors whitespace-nowrap py-1 px-2 rounded-md hover:bg-muted"
                      >
                        <MapPin className="w-3 h-3" />
                        <span className="max-w-[90px] truncate">{compactAreaLabel}</span>
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      {areaOpen && (
                        <div className="absolute top-full right-0 mt-1 bg-card rounded-lg shadow-sm z-20 min-w-[180px] py-1 border border-border max-h-60 overflow-y-auto">
                          <button
                            type="button"
                            onClick={() => { setAreaValue(''); setAreaOpen(false) }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${!areaValue ? 'text-primary font-semibold' : 'text-foreground'}`}
                          >
                            All Areas
                          </button>
                          {areas.map((area) => (
                            <button
                              key={area.id}
                              type="button"
                              onClick={() => { setAreaValue(area.slug); setAreaOpen(false) }}
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${areaValue === area.slug ? 'text-primary font-semibold' : 'text-foreground'}`}
                            >
                              {area.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <Button type="submit" size="lg" className="px-8 h-auto py-3 text-sm font-semibold">
                  Search
                </Button>
              </div>
            </form>

            {/* Hero ad slot — shown below the search bar */}
            {heroAdSlot && (
              <div className="mt-4">
                <AdSlot slot={heroAdSlot} tier="secondary" className="w-full rounded-lg overflow-hidden" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
