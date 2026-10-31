'use client'

import { motion } from 'framer-motion'
import AnimatedCounter from '@/components/shared/animated-counter'
import { revealVariants, staggerContainerVariants } from '@/lib/motion'

interface StatItem {
  value: number
  suffix?: string
  label: string
}

const stats: StatItem[] = [
  { value: 76, suffix: '+', label: 'Businesses Listed' },
  { value: 14, label: 'Categories' },
  { value: 10, label: 'Local Areas' },
  { value: 5000, suffix: '+', label: 'Monthly Visitors' },
]

export default function StatsBar() {
  return (
    <section className="bg-surface-dark py-10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={revealVariants} className="text-center">
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                className="text-3xl sm:text-4xl font-display font-medium text-white"
              />
              <p className="text-white/50 text-xs font-mono mt-1 tracking-wide uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
