'use client'

import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'

export interface PickerBusiness {
  id: string
  name: string
  slug: string
  area?: string | null
}

interface BusinessPickerProps {
  businesses: PickerBusiness[]
  value: string | null
  onChange: (businessId: string | null, business: PickerBusiness | null) => void
}

export default function BusinessPicker({ businesses, value, onChange }: BusinessPickerProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const selected = businesses.find((b) => b.id === value) ?? null

  const filtered = useMemo(() => {
    if (!query.trim()) return businesses.slice(0, 20)
    const q = query.trim().toLowerCase()
    return businesses.filter((b) => b.name.toLowerCase().includes(q)).slice(0, 20)
  }, [businesses, query])

  return (
    <div className="relative">
      <Input
        value={open ? query : (selected?.name ?? query)}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => { setOpen(true); setQuery('') }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Search a business to link..."
      />
      {open && (
        <ul className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto rounded-lg border border-border bg-white shadow-lg text-sm">
          <li>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => { onChange(null, null); setQuery(''); setOpen(false) }}
              className="w-full text-left px-3 py-2 hover:bg-muted transition-colors text-muted-foreground"
            >
              None — use freeform store name
            </button>
          </li>
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-muted-foreground text-xs">No businesses match</li>
          ) : (
            filtered.map((b) => (
              <li key={b.id}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { onChange(b.id, b); setQuery(''); setOpen(false) }}
                  className="w-full text-left px-3 py-2 hover:bg-muted transition-colors"
                >
                  <span className="font-medium">{b.name}</span>
                  {b.area && <span className="text-[10px] font-mono text-muted-foreground ml-2">{b.area}</span>}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
