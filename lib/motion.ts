import type { Transition, Variants } from 'framer-motion'

/** Soft, settling ease-out used across every reveal/interaction in the site. */
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

export const DURATION = {
  /** Hover/press/focus feedback */
  interaction: 0.18,
  /** Section/card/image reveals */
  reveal: 0.4,
} as const

/** Vertical travel distance for a reveal-on-scroll animation, in px. */
export const REVEAL_DISTANCE = 14

export const revealTransition: Transition = {
  duration: DURATION.reveal,
  ease: EASE_OUT,
}

export const interactionTransition: Transition = {
  duration: DURATION.interaction,
  ease: EASE_OUT,
}

/** Fade + rise — the one scroll-reveal effect used for sections and cards. */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: REVEAL_DISTANCE },
  visible: { opacity: 1, y: 0, transition: revealTransition },
}

/** Plain fade, no travel — for content that shouldn't shift position. */
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: revealTransition },
}

/**
 * Stagger container — children animate in with revealVariants. Capped at 8
 * visible items per the motion brief; pass only the first 8 children through
 * this container and render any remainder without stagger.
 */
export const STAGGER_MAX_ITEMS = 8
export const STAGGER_DELAY = 0.05 // 50ms, within the 40-60ms brief range

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER_DELAY } },
}

/** Slide-in panel (drawers, sheets, popovers) — translate + fade only. */
export const slideInPanelVariants = {
  fromRight: {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 200 } },
    exit: { x: '100%', opacity: 0 },
  },
  fromBottom: {
    hidden: { y: 40, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 22, stiffness: 200 } },
    exit: { y: 40, opacity: 0 },
  },
} as const

/** Hover lift for cards/links — 2-4px, transform only. */
export const hoverLift = { y: -3 }
export const pressScale = { scale: 0.98 }
