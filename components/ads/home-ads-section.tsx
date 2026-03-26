import Link from 'next/link'
import Image from 'next/image'
import { Megaphone } from 'lucide-react'
import { buildTrackedUrl } from '@/lib/tracking'
import type { AdSlot as AdSlotType } from '@/types/database'

interface SlotBannerProps {
  slot: AdSlotType | null | undefined
  height: string
  label: string
}

function SlotBanner({ slot, height, label }: SlotBannerProps) {
  const placeholder = (
    <Link
      href="/advertise"
      className={`flex flex-col items-center justify-center gap-2 w-full rounded-2xl border-2 border-dashed border-border bg-muted/30 hover:border-primary hover:bg-primary/5 transition-all group ${height}`}
    >
      <Megaphone className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
      <span className="text-xs font-mono text-muted-foreground group-hover:text-primary transition-colors text-center leading-snug">
        <strong className="block">{label}</strong>
        Click to enquire about this space
      </span>
    </Link>
  )

  if (!slot || !slot.active) return placeholder

  const content = (
    <div className={`relative w-full rounded-2xl overflow-hidden ${height}`}>
      {slot.ad_image_path ? (
        <Image
          src={slot.ad_image_path}
          alt={slot.ad_title ?? 'Advertisement'}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ) : (
        <div className="w-full h-full bg-linear-to-r from-primary to-primary/80 flex items-center justify-center px-6">
          <span className="text-white font-semibold text-sm text-center">
            {slot.ad_title ?? slot.advertiser?.name ?? 'Advertisement'}
          </span>
        </div>
      )}
      <span className="absolute top-2 right-2 bg-black/50 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
        AD
      </span>
    </div>
  )

  if (slot.ad_link_url) {
    return (
      <a
        href={buildTrackedUrl(slot.ad_link_url, { linkType: 'ad', surface: 'home_ads', adSlotId: slot.id })}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block w-full"
      >
        {content}
      </a>
    )
  }

  return content
}

interface HomeAdsSectionProps {
  leaderboard: AdSlotType | null
  sideLeft: AdSlotType | null
  sideRight: AdSlotType | null
}

export default function HomeAdsSection({ leaderboard, sideLeft, sideRight }: HomeAdsSectionProps) {
  return (
    <section className="bg-muted/20 border-y border-border py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            Sponsored
          </span>
          <Link href="/advertise" className="text-[10px] font-mono text-primary hover:underline">
            Advertise with us →
          </Link>
        </div>

        {/* Leaderboard — full width */}
        <SlotBanner
          slot={leaderboard}
          height="h-24 sm:h-32"
          label="Leaderboard Banner (728 × 90)"
        />

        {/* Two secondary slots */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <SlotBanner
            slot={sideLeft}
            height="h-20 sm:h-24"
            label="Half-Page Left (300 × 250)"
          />
          <SlotBanner
            slot={sideRight}
            height="h-20 sm:h-24"
            label="Half-Page Right (300 × 250)"
          />
        </div>
      </div>
    </section>
  )
}
