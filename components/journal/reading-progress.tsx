'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

/** A thin progress line pinned to the top of the viewport, tracking scroll through the page. */
export default function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, mass: 0.2 })

  return (
    <motion.div
      style={{ scaleX: progress }}
      className="fixed top-0 left-0 right-0 h-0.5 bg-primary z-[60] origin-left"
    />
  )
}
