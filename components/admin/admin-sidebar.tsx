'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Building2, FolderTree, FileText,
  Briefcase, DollarSign, Inbox, Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Businesses', href: '/admin/businesses', icon: Building2 },
  { label: 'Categories', href: '/admin/categories', icon: FolderTree },
  { label: 'Articles', href: '/admin/articles', icon: FileText },
  { label: 'Jobs Board', href: '/admin/jobs', icon: Briefcase },
  { label: 'Prices', href: '/admin/prices', icon: DollarSign },
  { label: 'Submissions', href: '/admin/submissions', icon: Inbox },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 bg-white border-r border-border flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-border shrink-0">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">K</span>
          <div>
            <p className="font-semibold text-sm leading-none">KRH Admin</p>
            <p className="text-[10px] text-muted-foreground font-mono mt-0.5">Control Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-border shrink-0">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:bg-muted transition-colors"
        >
          <span className="w-4 h-4 flex items-center justify-center">↗</span>
          View Live Site
        </Link>
      </div>
    </aside>
  )
}
