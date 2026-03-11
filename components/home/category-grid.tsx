'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  UtensilsCrossed, Building2, Briefcase, ShoppingBag, Truck, Shield,
  Heart, Home, Car, GraduationCap, Church, Trees, Wallet, Users,
} from 'lucide-react'
import type { Category } from '@/types/database'

const iconMap: Record<string, React.ElementType> = {
  UtensilsCrossed, Building2, Briefcase, ShoppingBag, Truck, Shield,
  Heart, Home, Car, GraduationCap, Church, Trees, Wallet, Users,
}

interface CategoryGridProps {
  categories: (Category & { business_count?: number })[]
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-16 bg-brand-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl font-bold text-foreground">Browse by Category</h2>
          <p className="text-muted-foreground mt-2">
            Explore {categories.length} categories of local businesses along Kiambu Road
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3"
        >
          {categories.map((category) => {
            const Icon = iconMap[category.icon ?? ''] ?? ShoppingBag
            return (
              <motion.div key={category.id} variants={cardVariants}>
                <Link href={`/directory/${category.slug}`}>
                  <motion.div
                    whileHover={{
                      y: -4,
                      boxShadow: '0 12px 40px rgba(27,107,58,0.15)',
                    }}
                    transition={{ duration: 0.2 }}
                    className="group flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-border hover:border-primary cursor-pointer transition-colors text-center"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
                      style={{ backgroundColor: (category.color ?? '#1B6B3A') + '20' }}
                    >
                      <Icon
                        className="w-6 h-6 transition-colors group-hover:text-primary"
                        style={{ color: category.color ?? '#1B6B3A' }}
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground leading-tight">
                        {category.name}
                      </p>
                      {category.business_count !== undefined && (
                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                          {category.business_count} businesses
                        </p>
                      )}
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
