'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Check } from 'lucide-react'

interface ShareBarProps {
  url: string
  title: string
  variant?: 'inline' | 'floating' | 'popup'
}

interface ShareButton {
  label: string
  icon: string
  color: string
  getUrl: (url: string, title: string) => string | 'clipboard'
}

const SHARE_BUTTONS: ShareButton[] = [
  {
    label: 'Email',
    icon: '✉️',
    color: '#6B7280',
    getUrl: (url, title) => `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
  },
  {
    label: 'Facebook',
    icon: '📘',
    color: '#1877F2',
    getUrl: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    label: 'X / Twitter',
    icon: '🐦',
    color: '#000000',
    getUrl: (url, title) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    label: 'Pinterest',
    icon: '📌',
    color: '#E60023',
    getUrl: (url) => `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}`,
  },
  {
    label: 'LinkedIn',
    icon: '💼',
    color: '#0A66C2',
    getUrl: (url) => `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}`,
  },
  {
    label: 'Instagram',
    icon: '📸',
    color: '#E1306C',
    getUrl: () => 'clipboard',
  },
  {
    label: 'WhatsApp',
    icon: '💬',
    color: '#25D366',
    getUrl: (url, title) => `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
]

function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false)

  const handleClick = async (btn: ShareButton) => {
    const href = btn.getUrl(url, title)
    if (href === 'clipboard') {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } else {
      window.open(href, '_blank', 'noopener,noreferrer,width=600,height=450')
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm text-muted-foreground font-medium">
        Enjoy this? Please spread the word :)
      </span>
      <div className="flex gap-2 flex-wrap">
        {SHARE_BUTTONS.map((btn) => (
          <button
            key={btn.label}
            type="button"
            onClick={() => handleClick(btn)}
            title={btn.label === 'Instagram' ? 'Copy link' : `Share on ${btn.label}`}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold hover:scale-110 transition-transform shadow-sm"
            style={{ backgroundColor: btn.color }}
          >
            {btn.label === 'Instagram' && copied ? <Check className="w-4 h-4" /> : btn.icon}
          </button>
        ))}

        {/* Copy link button */}
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }}
          title="Copy link"
          className="w-10 h-10 rounded-full flex items-center justify-center bg-muted border border-border hover:bg-primary hover:text-white hover:border-primary text-foreground transition-all"
        >
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}

export default function ShareBar({ url, title, variant = 'inline' }: ShareBarProps) {
  const [showPopup, setShowPopup] = useState(false)

  const handleScroll = useCallback(() => {
    const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
    if (scrolled > 0.8 && !showPopup) setShowPopup(true)
  }, [showPopup])

  useEffect(() => {
    if (variant === 'popup') {
      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [variant, handleScroll])

  if (variant === 'inline') {
    return (
      <div className="bg-white rounded-2xl border border-border p-6">
        <ShareButtons url={url} title={title} />
      </div>
    )
  }

  if (variant === 'floating') {
    return (
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-2">
        {SHARE_BUTTONS.map((btn) => (
          <button
            key={btn.label}
            type="button"
            onClick={() => {
              const href = btn.getUrl(url, title)
              if (href === 'clipboard') {
                navigator.clipboard.writeText(url)
              } else {
                window.open(href, '_blank', 'noopener,noreferrer,width=600,height=450')
              }
            }}
            title={btn.label}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs hover:scale-110 transition-transform shadow-md"
            style={{ backgroundColor: btn.color }}
          >
            {btn.icon}
          </button>
        ))}
      </div>
    )
  }

  if (variant === 'popup') {
    return (
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 18 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="bg-white rounded-2xl border border-border shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-sm">Enjoy this blog? Please spread the word :)</span>
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <ShareButtons url={url} title={title} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  return null
}
