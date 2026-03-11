import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CATEGORIES } from '@/data/seed/categories'
import {
  UtensilsCrossed, Building2, Briefcase, ShoppingBag, Truck, Shield,
  Heart, Home, Car, GraduationCap, Church, Trees, Wallet, Users,
} from 'lucide-react'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Business Directory',
  description: 'Browse all 14 categories of local businesses and services along Kiambu Road, Nairobi.',
}

const iconMap: Record<string, React.ElementType> = {
  UtensilsCrossed, Building2, Briefcase, ShoppingBag, Truck, Shield,
  Heart, Home, Car, GraduationCap, Church, Trees, Wallet, Users,
}

async function getCategoriesWithCounts() {
  try {
    const supabase = await createClient()
    const { data: categories } = await supabase
      .from('categories')
      .select('*, subcategories(*)')
      .eq('status', 'published')
      .order('sort_order')

    if (categories?.length) {
      const { data: counts } = await supabase
        .from('businesses')
        .select('category_id')
        .eq('status', 'published')
      const countMap: Record<string, number> = {}
      counts?.forEach((b) => {
        if (b.category_id) countMap[b.category_id] = (countMap[b.category_id] ?? 0) + 1
      })
      return categories.map((cat) => ({ ...cat, count: countMap[cat.id] ?? 0 }))
    }
    return null
  } catch {
    return null
  }
}

export default async function DirectoryPage() {
  const dbCategories = await getCategoriesWithCounts()

  const displayCategories = dbCategories ?? CATEGORIES.map((cat, i) => ({
    id: `seed-${i}`,
    name: cat.name,
    slug: cat.slug,
    icon: cat.icon,
    color: cat.color,
    description: cat.description,
    subcategories: cat.subcategories,
    count: 0,
  }))

  return (
    <div className="min-h-screen bg-brand-surface">
      {/* Header */}
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl font-bold text-white mb-3">Business Directory</h1>
          <p className="text-white/70">
            Explore {displayCategories.length} categories of local businesses along Kiambu Road
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCategories.map((category) => {
            const Icon = iconMap[category.icon ?? ''] ?? ShoppingBag
            return (
              <Link key={category.id} href={`/directory/${category.slug}`}>
                <div className="group bg-white rounded-2xl border border-border p-6 hover:border-primary transition-all hover:shadow-md">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: (category.color ?? '#1B6B3A') + '20' }}
                    >
                      <Icon
                        className="w-7 h-7"
                        style={{ color: category.color ?? '#1B6B3A' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {category.name}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {category.description}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded-full shrink-0">
                      {(category as { count?: number }).count ?? 0}
                    </span>
                  </div>

                  {category.subcategories?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {(category.subcategories as { name: string; slug: string }[]).slice(0, 4).map((sub) => (
                        <span
                          key={sub.slug}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                        >
                          {sub.name}
                        </span>
                      ))}
                      {category.subcategories.length > 4 && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          +{category.subcategories.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
