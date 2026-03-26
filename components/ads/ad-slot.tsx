import Link from 'next/link'
import Image from 'next/image'
import type { AdSlot as AdSlotType } from '@/types/database'

interface AdSlotProps {
  slot: AdSlotType | null | undefined
  tier: 'primary' | 'secondary' | 'tertiary'
  className?: string
}

export default function AdSlot({ slot, tier, className = '' }: AdSlotProps) {
  const sizeClass = {
    primary: 'h-28 text-base',
    secondary: 'h-20 text-sm',
    tertiary: 'h-16 text-xs',
  }[tier]

  if (!slot || !slot.active) {
    return (
      <Link
        href="/advertise"
        className={`flex items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/40 hover:border-primary hover:bg-primary/5 transition-colors group ${sizeClass} ${className}`}
      >
        <span className="text-muted-foreground group-hover:text-primary transition-colors text-xs font-mono">
          📢 Advertise here — <strong>Contact us</strong>
        </span>
      </Link>
    )
  }

  const content = (
    <div className={`relative rounded-xl overflow-hidden ${sizeClass} ${className}`}>
      {slot.ad_image_path ? (
        <Image
          src={slot.ad_image_path}
          alt={slot.ad_title ?? 'Advertisement'}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ) : (
        <div className="w-full h-full bg-linear-to-r from-primary to-primary/80 flex items-center justify-center">
          <span className="text-white font-semibold text-sm">{slot.ad_title ?? slot.advertiser?.name ?? 'Advertisement'}</span>
        </div>
      )}
    </div>
  )

  if (slot.ad_link_url) {
    return (
      <a href={slot.ad_link_url} target="_blank" rel="noopener noreferrer sponsored">
        {content}
      </a>
    )
  }

  return content
}
