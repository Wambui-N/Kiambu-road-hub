'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const AREAS = [
  { label: 'All Areas', value: '' },
  { label: 'Ridgeways', value: 'ridgeways' },
  { label: 'Thindigua', value: 'thindigua' },
  { label: 'Runda', value: 'runda' },
  { label: 'Ruaka', value: 'ruaka' },
  { label: 'Kasarini', value: 'kasarini' },
  { label: 'Kitisuru', value: 'kitisuru' },
  { label: 'Kiambu Town', value: 'kiambu-town' },
]

const CATEGORIES = [
  { label: 'All Categories', value: '' },
  { label: 'Eat, Drink & Stay', value: 'eat-drink-stay' },
  { label: 'Health & Wellness', value: 'health-wellness' },
  { label: 'Education & Childcare', value: 'education-childcare' },
  { label: 'Retail & Shopping', value: 'retail-shopping' },
  { label: 'Professional Services', value: 'professional-services' },
  { label: 'Property & Construction', value: 'property-construction' },
  { label: 'Automotive', value: 'automotive' },
]

interface SearchFiltersProps {
  currentQuery?: string
  currentCategory?: string
  currentArea?: string
}

export default function SearchFilters({ currentQuery = '', currentCategory = '', currentArea = '' }: SearchFiltersProps) {
  const router = useRouter()
  const [query, setQuery] = useState(currentQuery)

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams()
    const merged = { q: query, category: currentCategory, area: currentArea, ...updates }
    Object.entries(merged).forEach(([k, v]) => { if (v) params.set(k, v) })
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-2xl border border-border p-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <form
          onSubmit={(e) => { e.preventDefault(); updateParams({}) }}
          className="flex gap-2 flex-1"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search businesses..."
              className="pl-9"
            />
          </div>
          <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90">
            Search
          </Button>
        </form>

        {/* Category filter */}
        <select
          value={currentCategory}
          onChange={(e) => updateParams({ category: e.target.value })}
          className="px-3 py-2 rounded-lg border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>

        {/* Area filter */}
        <select
          value={currentArea}
          onChange={(e) => updateParams({ area: e.target.value })}
          className="px-3 py-2 rounded-lg border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {AREAS.map((area) => (
            <option key={area.value} value={area.value}>{area.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
