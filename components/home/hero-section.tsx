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
    <section className="relative overflow-hidden min-h-[560px] flex items-center">
      {/* Background image — absolute wrapper gives fill a sized parent */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1920&q=80"
          alt="Kiambu Road, Nairobi"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/55" />
      {/* Green tint overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-[#1B6B3A]/60 via-transparent to-[#1B6B3A]/30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          >
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
              }}
              className="text-amber-300 font-mono text-sm tracking-widest uppercase mb-3"
            >
              📍 Kiambu Road, Nairobi
            </motion.p>

            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
              }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
            >
              Kiambu Road Explorer
            </motion.h1>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
              }}
              className="text-white/85 text-lg sm:text-xl mb-2"
            >
              Your Complete Business Directory & Lifestyle Journal
            </motion.p>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
              }}
              className="text-white/65 text-sm sm:text-base mb-10"
            >
              Discover businesses, find exact locations, and connect with local services
            </motion.p>

            {/* Search bar */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
              }}
            >
              <form onSubmit={handleSearch}>
                <div className="flex flex-col sm:flex-row gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
                  {/* Category selector */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => { setCatOpen((v) => !v); setAreaOpen(false) }}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white text-sm font-medium whitespace-nowrap transition-colors w-full sm:w-auto"
                    >
                      {selectedLabel}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {catOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl z-20 min-w-[220px] py-1 border border-border max-h-72 overflow-y-auto">
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
                  <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-4">
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
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors whitespace-nowrap py-1 px-2 rounded-lg hover:bg-muted"
                        >
                          <MapPin className="w-3 h-3" />
                          <span className="max-w-[90px] truncate">{compactAreaLabel}</span>
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        {areaOpen && (
                          <div className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-xl z-20 min-w-[180px] py-1 border border-border max-h-60 overflow-y-auto">
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

                  <Button
                    type="submit"
                    className="bg-accent hover:bg-amber-500 text-black font-bold px-8 py-3 rounded-xl h-auto text-sm"
                  >
                    Search
                  </Button>
                </div>
              </form>

              {/* Hero ad slot — shown below the search bar */}
              {heroAdSlot && (
                <div className="mt-4">
                  <AdSlot slot={heroAdSlot} tier="secondary" className="w-full rounded-xl overflow-hidden" />
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
