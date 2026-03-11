'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import BusinessCard from '@/components/directory/business-card'
import type { Business } from '@/types/database'

interface FeaturedBusinessesProps {
  businesses: Business[]
}

export default function FeaturedBusinesses({ businesses }: FeaturedBusinessesProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' })
  }

  if (!businesses.length) return null

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground">Featured Businesses</h2>
            <p className="text-muted-foreground mt-1">Top-rated local businesses on Kiambu Road</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {businesses.map((business, i) => (
            <motion.div
              key={business.id}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="shrink-0 w-72"
              style={{ scrollSnapAlign: 'start' }}
            >
              <BusinessCard business={business} variant="featured" />
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/directory"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline text-sm"
          >
            Browse all businesses →
          </Link>
        </div>
      </div>
    </section>
  )
}
