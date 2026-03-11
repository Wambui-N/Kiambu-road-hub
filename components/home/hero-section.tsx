'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Search, MapPin, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CATEGORY_OPTIONS } from '@/lib/data/options'

export default function HeroSection() {
  const [query, setQuery] = useState('')
  const [categoryValue, setCategoryValue] = useState('')
  const [catOpen, setCatOpen] = useState(false)
  const router = useRouter()

  const selectedLabel = CATEGORY_OPTIONS.find((c) => c.value === categoryValue)?.label ?? 'All Categories'

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (categoryValue) params.set('category', categoryValue)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <section className="relative overflow-hidden min-h-[520px] flex items-center">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-linear-to-br from-[#1B6B3A] via-[#2D9E58] to-[#1B6B3A]" />
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #E8A020 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, #1A1F16 0%, transparent 50%)`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="max-w-3xl mx-auto text-center">
          {/* Staggered headline */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          >
            <motion.p
              custom={0}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
              }}
              className="text-accent font-mono text-sm tracking-widest uppercase mb-3"
            >
              📍 Kiambu Road, Nairobi
            </motion.p>

            <motion.h1
              custom={1}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
              }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
            >
              Kiambu Road Hub
            </motion.h1>

            <motion.p
              custom={2}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
              }}
              className="text-white/80 text-lg sm:text-xl mb-2"
            >
              Your Complete Business Directory & Lifestyle Journal
            </motion.p>

            <motion.p
              custom={3}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
              }}
              className="text-white/60 text-sm sm:text-base mb-10"
            >
              Discover businesses, find exact locations, and connect with local services
            </motion.p>

            {/* Search bar */}
            <motion.div
              custom={4}
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
                      onClick={() => setCatOpen((v) => !v)}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white text-sm font-medium whitespace-nowrap transition-colors w-full sm:w-auto"
                    >
                      {selectedLabel}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {catOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl z-10 min-w-[220px] py-1 border border-border max-h-72 overflow-y-auto">
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
                      className="flex-1 py-3 text-sm text-foreground placeholder:text-muted-foreground bg-transparent outline-none"
                    />
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" /> Kiambu Road
                    </span>
                  </div>

                  <Button
                    type="submit"
                    className="bg-accent hover:bg-amber-500 text-black font-bold px-8 py-3 rounded-xl h-auto text-sm"
                  >
                    Search
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
