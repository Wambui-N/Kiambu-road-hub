'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, animate } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  suffix?: string
  className?: string
}

/** Counts up from 0 to value once it scrolls into view. */
export default function AnimatedCounter({ value, suffix = '', className }: AnimatedCounterProps) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration: 1.5,
      ease: 'easeOut' as const,
      onUpdate(v) {
        setDisplay(Math.round(v))
      },
    })
    return () => controls.stop()
  }, [inView, value])

  return (
    <span ref={ref} className={className}>
      {display.toLocaleString()}{suffix}
    </span>
  )
}
