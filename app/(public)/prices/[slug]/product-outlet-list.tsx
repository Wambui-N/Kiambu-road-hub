'use client'

import { useMemo } from 'react'
import { LocateFixed } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableBody, TableRow, TableHead } from '@/components/ui/table'
import { OutletTableRow, OutletCard } from '@/components/prices/outlet-row'
import { useGeolocation } from '@/lib/hooks/use-geolocation'
import { haversineDistanceKm, formatDistance } from '@/lib/geo'
import type { PriceRow } from '@/components/prices/types'

interface ProductOutletListProps {
  rows: PriceRow[]
}

export default function ProductOutletList({ rows }: ProductOutletListProps) {
  const { status, coords, request } = useGeolocation()

  const withDistance = useMemo(() => {
    return rows.map((row) => {
      const distanceKm =
        coords && row.lat !== null && row.lng !== null
          ? haversineDistanceKm(coords.lat, coords.lng, row.lat, row.lng)
          : null
      return { row, distanceKm }
    })
  }, [rows, coords])

  const cheapestAmount = rows.length ? Math.min(...rows.map((r) => r.amount)) : null

  return (
    <div>
      <div className="flex justify-end mb-3">
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

      <div className="hidden md:block bg-white rounded-2xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Outlet</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Distance</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {withDistance.map(({ row, distanceKm }) => (
              <OutletTableRow
                key={row.id}
                row={row}
                showProduct={false}
                isBestPrice={row.amount === cheapestAmount}
                distanceLabel={distanceKm !== null ? formatDistance(distanceKm) : row.areaName}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden grid grid-cols-1 gap-3">
        {withDistance.map(({ row, distanceKm }) => (
          <OutletCard
            key={row.id}
            row={row}
            showProduct={false}
            isBestPrice={row.amount === cheapestAmount}
            distanceLabel={distanceKm !== null ? formatDistance(distanceKm) : null}
          />
        ))}
      </div>
    </div>
  )
}
