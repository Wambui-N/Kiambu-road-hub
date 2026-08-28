'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const CATEGORY_OPTIONS = [
  { value: '', label: 'All Categories' },
  { value: 'groceries', label: '🛒 Groceries' },
  { value: 'fuel', label: '⛽ Fuel' },
  { value: 'medical', label: '💊 Medical' },
  { value: 'dining', label: '🍽️ Dining' },
]

const SORT_OPTIONS = [
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'distance', label: 'Nearest First' },
  { value: 'recent', label: 'Recently Updated' },
]

interface PriceFiltersProps {
  currentCategory?: string
  currentSearch?: string
  currentMin?: string
  currentMax?: string
  currentOutlet?: string
  currentSort?: string
}

export default function PriceFilters({
  currentCategory = '',
  currentSearch = '',
  currentMin = '',
  currentMax = '',
  currentOutlet = '',
  currentSort = 'price-asc',
}: PriceFiltersProps) {
  const router = useRouter()
  const [search, setSearch] = useState(currentSearch)
  const [min, setMin] = useState(currentMin)
  const [max, setMax] = useState(currentMax)
  const [outlet, setOutlet] = useState(currentOutlet)

  const selectClass =
    'px-3 py-2 rounded-lg border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary'

  const updateParams = (updates: Record<string, string>) => {
    const merged = {
      category: currentCategory,
      q: search,
      min,
      max,
      outlet,
      sort: currentSort,
      ...updates,
    }
    const params = new URLSearchParams()
    Object.entries(merged).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })
    router.push(`/prices?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-2xl border border-border p-4 space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <form
          onSubmit={(e) => { e.preventDefault(); updateParams({}) }}
          className="flex gap-2 flex-1"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products (e.g. Milk, Petrol)..."
              className="pl-9"
            />
          </div>
          <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90">
            Search
          </Button>
        </form>

        <select
          value={currentCategory}
          onChange={(e) => updateParams({ category: e.target.value })}
          className={selectClass}
        >
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        <select
          value={currentSort}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className={selectClass}
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          value={min}
          onChange={(e) => setMin(e.target.value)}
          onBlur={() => updateParams({})}
          type="number"
          min="0"
          placeholder="Min price (KES)"
          className="sm:w-40"
        />
        <Input
          value={max}
          onChange={(e) => setMax(e.target.value)}
          onBlur={() => updateParams({})}
          type="number"
          min="0"
          placeholder="Max price (KES)"
          className="sm:w-40"
        />
        <Input
          value={outlet}
          onChange={(e) => setOutlet(e.target.value)}
          onBlur={() => updateParams({})}
          placeholder="Filter by outlet (e.g. Quickmart)"
          className="sm:flex-1"
        />
      </div>
    </div>
  )
}
