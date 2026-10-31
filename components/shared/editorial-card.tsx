import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface EditorialCardProps {
  href: string
  imageUrl?: string | null
  imageAlt: string
  /** Shown in place of a photo when imageUrl is absent */
  fallbackEmoji?: string
  title: string
  description?: string | null
  /** The card's one mono fact row — date note, price, schedule, featured month, etc. */
  meta?: string | null
  metaColor?: string
  /** Renders the meta line muted instead of the primary/metaColor tint, e.g. "Not yet available" */
  metaMuted?: boolean
  /** Small label overlaid on the photo, e.g. "Coming Soon" */
  badge?: string | null
  imageHeight?: string
  className?: string
}

export default function EditorialCard({
  href,
  imageUrl,
  imageAlt,
  fallbackEmoji,
  title,
  description,
  meta,
  metaColor,
  metaMuted,
  badge,
  imageHeight = 'h-44',
  className,
}: EditorialCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group bg-card rounded-lg border border-border overflow-hidden hover:border-primary transition-colors flex flex-col',
        className,
      )}
    >
      <div className={cn('relative overflow-hidden bg-muted shrink-0 flex items-center justify-center', imageHeight)}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover muted-photo scale-100 group-hover:scale-[1.03] transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <span className="text-4xl">{fallbackEmoji}</span>
        )}
        {badge && (
          <span className="absolute top-3 left-3 text-[10px] font-mono font-bold bg-foreground/80 text-background px-2 py-0.5 rounded-md">
            {badge}
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors leading-snug mb-1.5">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-2">{description}</p>
        )}
        {meta && (
          <p
            className={cn('text-xs font-mono mt-auto pt-2', metaMuted ? 'text-muted-foreground' : !metaColor && 'text-primary')}
            style={!metaMuted && metaColor ? { color: metaColor } : undefined}
          >
            {meta}
          </p>
        )}
      </div>
    </Link>
  )
}
