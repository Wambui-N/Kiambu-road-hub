'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Users } from 'lucide-react'

const FB_COMMUNITY_URL = 'https://www.facebook.com/groups/kiamburoadcommunity'
const LS_KEY = 'krh_fb_popup_last_dismissed'
const COOLDOWN_DAYS = 7
const SCROLL_THRESHOLD_PX = 400
const SHOW_DELAY_MS = 2000

export default function FacebookCommunityPopup() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Respect the cooldown window — only proceed if enough time has passed
    try {
      const stored = localStorage.getItem(LS_KEY)
      if (stored) {
        const daysSince = (Date.now() - parseInt(stored, 10)) / (1000 * 60 * 60 * 24)
        if (daysSince < COOLDOWN_DAYS) return
      }
    } catch {
      // localStorage unavailable (SSR safety, private browsing)
      return
    }

    let timer: ReturnType<typeof setTimeout> | null = null
    let triggered = false

    const handleScroll = () => {
      if (triggered) return
      if (window.scrollY >= SCROLL_THRESHOLD_PX) {
        triggered = true
        window.removeEventListener('scroll', handleScroll)
        timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (timer) clearTimeout(timer)
    }
  }, [])

  const dismiss = () => {
    try {
      localStorage.setItem(LS_KEY, String(Date.now()))
    } catch {
      // ignore in restricted environments
    }
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label="Join our Facebook community"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: 'spring', damping: 22, stiffness: 200 }}
          className="fixed bottom-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-border overflow-hidden"
        >
          {/* Facebook-branded header band */}
          <div className="bg-[#1877F2] px-5 py-4 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-white" />
              </div>
              <p className="text-white font-display font-bold text-sm leading-snug">
                Join our Facebook<br />Community
              </p>
            </div>
            <button
              onClick={dismiss}
              aria-label="Close"
              className="text-white/70 hover:text-white transition-colors mt-0.5 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4">
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Connect with neighbours, discover local businesses, and stay updated on everything happening along the Kiambu Road corridor.
            </p>
            <div className="flex flex-col gap-2">
              <a
                href={FB_COMMUNITY_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={dismiss}
                className="w-full inline-flex items-center justify-center bg-[#1877F2] hover:bg-[#166fe5] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
              >
                Join on Facebook
              </a>
              <button
                onClick={dismiss}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors text-center py-1"
              >
                Not now
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
