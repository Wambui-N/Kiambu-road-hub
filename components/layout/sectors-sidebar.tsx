'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SectorLink {
  label: string
  href: string
  external?: boolean
}

interface SectorGroup {
  label: string
  color: string
  bgColor: string
  links: SectorLink[]
}

const SECTOR_GROUPS: SectorGroup[] = [
  {
    label: 'LIFESTYLE & WELLBEING',
    color: '#10B981',
    bgColor: '#F0FDF4',
    links: [
      { label: 'Health Digest', href: '/journal/health-digest' },
      { label: 'Dear Doctor', href: '/journal/dear-doctor' },
      { label: "This N' That", href: '/journal/this-n-that' },
      { label: 'Prayer & Verse', href: '/journal/prayer-verse' },
      { label: 'Inspiration', href: '/journal/inspiration' },
      { label: 'E-Books', href: '/journal/e-books' },
    ],
  },
  {
    label: 'TRAVEL & NATURE',
    color: '#3B82F6',
    bgColor: '#EFF6FF',
    links: [
      { label: 'Travel Booking', href: '/travel' },
      { label: "Kiambu Here N' There", href: '/journal/kiambu-here-n-there' },
      { label: 'Destination Review', href: '/journal/destination-review' },
      { label: 'Nature Trivia', href: '/journal/nature-trivia' },
    ],
  },
  {
    label: 'CAREERS & BUSINESS',
    color: '#E8A020',
    bgColor: '#FFFBEB',
    links: [
      { label: 'Jobs Board', href: '/jobs' },
      { label: 'Talent Search', href: '/talent-search' },
      { label: 'Prices at a Glance', href: '/prices' },
      { label: 'Business Notes', href: '/journal/business-notes' },
      { label: 'Business Opportunities', href: '/journal/business-opportunities' },
      { label: 'Opinion', href: '/journal/opinion' },
      { label: 'Newswatch', href: '/journal/newswatch' },
    ],
  },
]

const QUICK_ACTIONS: SectorLink[] = [
  { label: 'Advertise with Us', href: '/advertise' },
  { label: 'List Your Business', href: '/list-your-business' },
  { label: 'Other Services', href: '/other-services' },
]

interface GroupPanelProps {
  group: SectorGroup
  defaultOpen?: boolean
}

function GroupPanel({ group, defaultOpen = true }: GroupPanelProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="mb-2 overflow-hidden rounded-xl border border-border">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full px-4 py-3 text-left"
        style={{ backgroundColor: group.bgColor }}
      >
        <span className="text-[10px] font-mono font-bold tracking-widest" style={{ color: group.color }}>
          {group.label}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4" style={{ color: group.color }} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <ul className="bg-white px-3 py-2 space-y-0.5">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors group"
                  >
                    <span className="w-1 h-1 rounded-full shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: group.color }} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface SectorsSidebarProps {
  className?: string
  variant?: 'sidebar' | 'accordion'
}

export default function SectorsSidebar({ className, variant = 'sidebar' }: SectorsSidebarProps) {
  return (
    <div className={cn('', className)}>
      {variant === 'sidebar' && (
        <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest mb-3 px-1">
          Sectors
        </p>
      )}

      {SECTOR_GROUPS.map((group, i) => (
        <GroupPanel key={group.label} group={group} defaultOpen={i === 0} />
      ))}

      {/* Quick actions */}
      <div className="mt-3 space-y-1 px-1">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-foreground bg-white border border-border hover:border-primary hover:text-primary transition-colors"
          >
            → {action.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
