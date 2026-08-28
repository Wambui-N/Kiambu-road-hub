'use client'

import { useMemo } from 'react'
import { LocateFixed } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableBody, TableRow, TableHead } from '@/components/ui/table'
import { OutletTableRow, OutletCard } from '@/components/prices/outlet-row'
import { useGeolocation } from '@/lib/hooks/use-geolocation'
import { haversineDistanceKm, formatDistance } from '@/lib/geo'
import type { PriceRow } from '@/components/prices/types'

interface PriceComparisonListProps {
  rows: PriceRow[]
  min?: string
  max?: string
  outlet?: string
  sort?: string
}

export default function PriceComparisonList({ rows, min, max, outlet, sort = 'price-asc' }: PriceComparisonListProps) {
  const { status, coords, request } = useGeolocation()

  const filtered = useMemo(() => {
    const minVal = min ? Number(min) : null
    const maxVal = max ? Number(max) : null
    const outletQuery = outlet?.trim().toLowerCase()

    return rows.filter((row) => {
      if (minVal !== null && row.amount < minVal) return false
      if (maxVal !== null && row.amount > maxVal) return false
      if (outletQuery && !row.storeName.toLowerCase().includes(outletQuery)) return false
      return true
    })
  }, [rows, min, max, outlet])

  const withDistance = useMemo(() => {
    return filtered.map((row) => {
      const distanceKm =
        coords && row.lat !== null && row.lng !== null
          ? haversineDistanceKm(coords.lat, coords.lng, row.lat, row.lng)
          : null
      return { row, distanceKm }
    })
  }, [filtered, coords])

  const sorted = useMemo(() => {
    const list = [...withDistance]
    switch (sort) {
      case 'price-desc':
        list.sort((a, b) => b.row.amount - a.row.amount)
        break
      case 'distance':
        list.sort((a, b) => {
          if (a.distanceKm === null && b.distanceKm === null) return 0
          if (a.distanceKm === null) return 1
          if (b.distanceKm === null) return -1
          return a.distanceKm - b.distanceKm
        })
        break
      case 'recent':
        list.sort((a, b) => new Date(b.row.observedAt).getTime() - new Date(a.row.observedAt).getTime())
        break
      case 'price-asc':
      default:
        list.sort((a, b) => a.row.amount - b.row.amount)
    }
    return list
  }, [withDistance, sort])

  const bestPriceByItem = useMemo(() => {
    const best = new Map<string, number>()
    for (const row of filtered) {
      const current = best.get(row.itemId)
      if (current === undefined || row.amount < current) best.set(row.itemId, row.amount)
    }
    return best
  }, [filtered])

  if (sorted.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-border">
        <div className="text-5xl mb-4">🔍</div>
        <p className="font-semibold mb-1">No prices match your filters</p>
        <p className="text-sm text-muted-foreground">Try widening your price range or clearing the outlet filter.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-muted-foreground font-mono">{sorted.length} result{sorted.length === 1 ? '' : 's'}</p>
        {status !== 'granted' && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={request}
            disabled={status === 'loading'}
            className="text-xs gap-1.5"
          >
            <LocateFixed className="w-3.5 h-3.5" />
            {status === 'loading' ? 'Locating…' : status === 'denied' ? 'Location denied' : status === 'unsupported' ? 'Location unavailable' : 'Use my location'}
          </Button>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-2xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Outlet</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Distance</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map(({ row, distanceKm }) => (
              <OutletTableRow
                key={row.id}
                row={row}
                isBestPrice={bestPriceByItem.get(row.itemId) === row.amount}
                distanceLabel={distanceKm !== null ? formatDistance(distanceKm) : row.areaName}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden grid grid-cols-1 gap-3">
        {sorted.map(({ row, distanceKm }) => (
          <OutletCard
            key={row.id}
            row={row}
            isBestPrice={bestPriceByItem.get(row.itemId) === row.amount}
            distanceLabel={distanceKm !== null ? formatDistance(distanceKm) : null}
          />
        ))}
      </div>
    </div>
  )
}
