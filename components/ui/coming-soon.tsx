import Link from 'next/link'

interface ComingSoonProps {
  title: string
  description: string
  icon: string
  features?: string[]
  ctaLabel?: string
  ctaHref?: string
}

export default function ComingSoon({
  title,
  description,
  icon,
  features = [],
  ctaLabel = 'Back to Directory',
  ctaHref = '/directory',
}: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-brand-surface flex flex-col">
      {/* Header bar */}
      <div className="bg-primary py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-white/60 font-mono text-xs uppercase tracking-widest mb-2">Coming Soon</p>
          <h1 className="font-display text-3xl font-bold text-white">{title}</h1>
          <p className="text-white/70 text-sm mt-2">{description}</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-md">
          <div className="text-7xl mb-6">{icon}</div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">
            We&rsquo;re working on it
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            This section is being built. Check back soon — it will be worth the wait.
          </p>

          {features.length > 0 && (
            <ul className="text-left bg-white rounded-2xl border border-border p-6 mb-8 space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary font-bold mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center bg-primary text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              {ctaLabel}
            </Link>
            <Link
              href="/list-your-business"
              className="inline-flex items-center justify-center bg-white border border-border text-foreground px-6 py-3 rounded-xl text-sm font-semibold hover:bg-muted transition-colors"
            >
              List Your Business
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
