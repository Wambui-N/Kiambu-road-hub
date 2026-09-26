import {
  UtensilsCrossed, Building2, Heart, Car, Wrench, GraduationCap, Home,
  HardHat, Briefcase, ShoppingBag, Sparkles, Trees, Truck, Shield,
  Church, Wallet, Users, Store,
} from 'lucide-react'
import { CATEGORIES } from '@/data/seed/categories'

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  UtensilsCrossed, Building2, Heart, Car, Wrench, GraduationCap, Home,
  HardHat, Briefcase, ShoppingBag, Sparkles, Trees, Truck, Shield,
  Church, Wallet, Users,
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

interface BusinessImagePlaceholderProps {
  name: string
  categorySlug?: string | null
  categoryColor?: string | null
  categoryIcon?: string | null
  className?: string
}

/**
 * A simple, honest "no photo yet" placeholder — a category-colored tile with
 * a faint category icon and the business's initials. Used in place of a
 * stock photo so unrelated businesses don't appear to share one storefront.
 */
export default function BusinessImagePlaceholder({
  name,
  categorySlug,
  categoryColor,
  categoryIcon,
  className,
}: BusinessImagePlaceholderProps) {
  const category = categorySlug ? CATEGORIES.find((c) => c.slug === categorySlug) : undefined
  const color = categoryColor ?? category?.color ?? '#1B6B3A'
  const iconName = categoryIcon ?? category?.icon
  const Icon = (iconName && CATEGORY_ICONS[iconName]) || Store

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center overflow-hidden ${className ?? ''}`}
      style={{ backgroundColor: color }}
    >
      <Icon className="absolute text-white/20 w-2/3 h-2/3" strokeWidth={1.5} />
      <span className="relative font-display font-bold text-white text-3xl tracking-wide drop-shadow-sm">
        {getInitials(name)}
      </span>
    </div>
  )
}
