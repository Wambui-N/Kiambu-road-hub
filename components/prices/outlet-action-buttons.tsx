import { Phone, MessageCircle, Navigation } from 'lucide-react'
import { getWhatsAppUrl } from '@/lib/utils'
import { buildTrackedUrl } from '@/lib/tracking'
import type { PriceRow } from './types'

interface OutletActionButtonsProps {
  row: PriceRow
  className?: string
}

export default function OutletActionButtons({ row, className }: OutletActionButtonsProps) {
  const whatsappUrl = row.whatsapp ? getWhatsAppUrl(row.whatsapp) : null
  const trackedCtx = { surface: 'price_comparison' as const, businessId: row.businessId, businessSlug: row.businessSlug }

  if (!row.phone && !whatsappUrl && !row.googleMapsUrl && !row.businessSlug) {
    return null
  }

  return (
    <div className={className ?? 'flex gap-2'}>
      {row.phone && (
        <a
          href={buildTrackedUrl(`tel:${row.phone}`, { ...trackedCtx, linkType: 'phone' })}
          className="flex-1 flex items-center justify-center gap-1 text-xs h-8 rounded-md border border-border bg-background hover:bg-muted transition-colors font-medium"
        >
          <Phone className="w-3 h-3" /> Call
        </a>
      )}
      {whatsappUrl && (
        <a
          href={buildTrackedUrl(whatsappUrl, { ...trackedCtx, linkType: 'whatsapp' })}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1 text-xs h-8 rounded-md border border-green-500 text-green-700 hover:bg-green-50 transition-colors font-medium"
        >
          <MessageCircle className="w-3 h-3" /> WhatsApp
        </a>
      )}
      {row.googleMapsUrl && (
        <a
          href={buildTrackedUrl(row.googleMapsUrl, { ...trackedCtx, linkType: 'maps' })}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1 text-xs h-8 rounded-md border border-border bg-background hover:bg-muted transition-colors font-medium"
        >
          <Navigation className="w-3 h-3" /> Directions
        </a>
      )}
      {row.businessSlug && (
        <a
          href={`/directory/business/${row.businessSlug}`}
          className="flex-1 flex items-center justify-center text-xs h-8 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
        >
          View
        </a>
      )}
    </div>
  )
}
