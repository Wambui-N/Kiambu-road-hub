'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

const WHATSAPP_URL = 'https://wa.me/254720950500'
const SCROLL_THRESHOLD_PX = 400

export default function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY >= SCROLL_THRESHOLD_PX)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.18 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          className="fixed bottom-4 left-4 z-50 w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center shadow-sm"
        >
          <MessageCircle className="w-6 h-6 text-white" fill="white" strokeWidth={0} />
        </motion.a>
      )}
    </AnimatePresence>
  )
}
