import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { TableRow, TableCell } from '@/components/ui/table'
import OutletActionButtons from './outlet-action-buttons'
import type { PriceRow } from './types'

function formatObservedDate(dateStr: string): string {
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

  if (isSameDay(date, today)) return 'Today'
  if (isSameDay(date, yesterday)) return 'Yesterday'
  return date.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })
}

interface RowProps {
  row: PriceRow
  isBestPrice: boolean
  distanceLabel: string | null
  showProduct?: boolean
}

export function OutletTableRow({ row, isBestPrice, distanceLabel, showProduct = true }: RowProps) {
  return (
    <TableRow>
      {showProduct && (
        <TableCell>
          <Link href={`/prices/${row.itemSlug}`} className="font-medium hover:text-primary transition-colors">
            {row.itemName}
          </Link>
          {row.unit && <p className="text-[10px] font-mono text-muted-foreground">per {row.unit}</p>}
        </TableCell>
      )}
      <TableCell>
        <p className="font-medium">{row.storeName}</p>
        {row.areaName && <p className="text-[10px] font-mono text-muted-foreground">{row.areaName}</p>}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="font-bold">{row.currency} {Number(row.amount).toLocaleString()}</span>
          {isBestPrice && (
            <Badge className="bg-green-600 text-white text-[10px]">🟢 Lowest Price</Badge>
          )}
        </div>
      </TableCell>
      <TableCell className="text-xs text-muted-foreground font-mono">{formatObservedDate(row.observedAt)}</TableCell>
      <TableCell className="text-xs text-muted-foreground font-mono">{distanceLabel ?? '—'}</TableCell>
      <TableCell>
        <OutletActionButtons row={row} className="flex gap-1.5" />
      </TableCell>
    </TableRow>
  )
}

export function OutletCard({ row, isBestPrice, distanceLabel, showProduct = true }: RowProps) {
  return (
    <div className="bg-white rounded-2xl border border-border p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          {showProduct && (
            <Link href={`/prices/${row.itemSlug}`} className="font-semibold hover:text-primary transition-colors">
              {row.itemName}
            </Link>
          )}
          <p className="text-sm text-muted-foreground">{row.storeName}</p>
        </div>
        {isBestPrice && <Badge className="bg-green-600 text-white text-[10px] shrink-0">🟢 Lowest Price</Badge>}
      </div>

      <p className="text-xl font-bold text-foreground">
        {row.currency} {Number(row.amount).toLocaleString()}
        {row.unit && <span className="text-xs font-normal text-muted-foreground ml-1">/ {row.unit}</span>}
      </p>

      <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
        <span>{formatObservedDate(row.observedAt)}</span>
        {distanceLabel && <span>· {distanceLabel}</span>}
        {row.areaName && !distanceLabel && <span>· {row.areaName}</span>}
      </div>

      <OutletActionButtons row={row} className="flex gap-2 mt-1" />
    </div>
  )
}
