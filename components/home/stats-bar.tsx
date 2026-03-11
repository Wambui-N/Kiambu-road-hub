'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion'

interface StatItem {
  value: number
  suffix?: string
  label: string
}

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration: 2,
      ease: 'easeOut' as const,
      onUpdate(v) {
        setDisplay(Math.round(v))
      },
    })
    return () => controls.stop()
  }, [inView, value])

  return (
    <span ref={ref} className="text-3xl sm:text-4xl font-display font-bold text-white">
      {display.toLocaleString()}{suffix}
    </span>
  )
}

const stats: StatItem[] = [
  { value: 200, suffix: '+', label: 'Businesses Listed' },
  { value: 14, label: 'Categories' },
  { value: 10, label: 'Local Areas' },
  { value: 5000, suffix: '+', label: 'Monthly Visitors' },
]

export default function StatsBar() {
  return (
    <section className="bg-brand-surface-dark py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
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
