import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { MousePointerClick, Globe, Phone, MessageCircle, Mail, MapPin, Megaphone, TrendingUp } from 'lucide-react'
import type { OutboundClick } from '@/types/database'

const SURFACE_LABELS: Record<string, string> = {
  business_card:    'Directory Card',
  featured_banner:  'Featured Banner',
  business_profile: 'Business Profile',
  home_ads:         'Homepage Ads',
  category_ads:     'Category Ads',
}

const LINK_TYPE_ICONS: Record<string, React.ElementType> = {
  website:  Globe,
  whatsapp: MessageCircle,
  phone:    Phone,
  email:    Mail,
  maps:     MapPin,
  ad:       Megaphone,
}

const LINK_TYPE_COLORS: Record<string, string> = {
  website:  'bg-blue-100 text-blue-700',
  whatsapp: 'bg-green-100 text-green-700',
  phone:    'bg-primary/10 text-primary',
  email:    'bg-purple-100 text-purple-700',
  maps:     'bg-orange-100 text-orange-700',
  ad:       'bg-yellow-100 text-yellow-700',
}

async function getClickData() {
  try {
    const supabase = await createClient()
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

    const { data } = await supabase
      .from('outbound_clicks')
      .select('*')
      .gte('created_at', thirtyDaysAgo)
      .order('created_at', { ascending: false })
      .limit(2000)

    return (data ?? []) as OutboundClick[]
  } catch {
    return []
  }
}

function groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const k = key(item)
    acc[k] = acc[k] ?? []
    acc[k].push(item)
    return acc
  }, {} as Record<string, T[]>)
}

export default async function ClickStatsPage() {
  const clicks = await getClickData()

  const total = clicks.length
  const bySurface = groupBy(clicks, (c) => c.surface)
  const byType    = groupBy(clicks, (c) => c.link_type)
  const byBiz     = groupBy(clicks.filter((c) => c.business_slug), (c) => c.business_slug!)

  const topBusinesses = Object.entries(byBiz)
    .map(([slug, rows]) => ({ slug, count: rows.length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  const recent = clicks.slice(0, 50)

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          Click Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Outbound clicks logged in the last 30 days across all directory surfaces.
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-border p-5 text-center">
          <p className="text-3xl font-bold font-mono text-primary">{total.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1 font-mono uppercase tracking-wide">Total Clicks</p>
        </div>
        <div className="bg-white rounded-2xl border border-border p-5 text-center">
          <p className="text-3xl font-bold font-mono text-primary">
            {Object.keys(byBiz).length}
          </p>
          <p className="text-xs text-muted-foreground mt-1 font-mono uppercase tracking-wide">Businesses Clicked</p>
        </div>
        <div className="bg-white rounded-2xl border border-border p-5 text-center">
          <p className="text-3xl font-bold font-mono text-primary">
            {(byType['website']?.length ?? 0).toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-1 font-mono uppercase tracking-wide">Website Click-throughs</p>
        </div>
        <div className="bg-white rounded-2xl border border-border p-5 text-center">
          <p className="text-3xl font-bold font-mono text-primary">
            {(byType['whatsapp']?.length ?? 0).toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-1 font-mono uppercase tracking-wide">WhatsApp Taps</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Clicks by link type */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2 className="font-semibold mb-4 text-sm">By Link Type</h2>
          <div className="space-y-2">
            {Object.entries(byType)
              .sort((a, b) => b[1].length - a[1].length)
              .map(([type, rows]) => {
                const Icon = LINK_TYPE_ICONS[type] ?? MousePointerClick
                const pct = total ? Math.round((rows.length / total) * 100) : 0
                return (
                  <div key={type} className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-full ${LINK_TYPE_COLORS[type] ?? 'bg-muted text-foreground'}`}>
                      <Icon className="w-3 h-3" />
                      {type}
                    </span>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground w-10 text-right">
                      {rows.length}
                    </span>
                  </div>
                )
              })}
          </div>
        </div>

        {/* Clicks by surface */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2 className="font-semibold mb-4 text-sm">By Surface</h2>
          <div className="space-y-2">
            {Object.entries(bySurface)
              .sort((a, b) => b[1].length - a[1].length)
              .map(([surface, rows]) => {
                const pct = total ? Math.round((rows.length / total) * 100) : 0
                return (
                  <div key={surface} className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted-foreground w-36 shrink-0 truncate">
                      {SURFACE_LABELS[surface] ?? surface}
                    </span>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary/70 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground w-10 text-right">
                      {rows.length}
                    </span>
                  </div>
                )
              })}
          </div>
        </div>

        {/* Top businesses */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2 className="font-semibold mb-4 text-sm">Top Businesses</h2>
          {topBusinesses.length === 0 ? (
            <p className="text-xs text-muted-foreground">No data yet.</p>
          ) : (
            <ol className="space-y-2">
              {topBusinesses.map(({ slug, count }, i) => (
                <li key={slug} className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground w-5 shrink-0">{i + 1}.</span>
                  <Link
                    href={`/directory/business/${slug}`}
                    target="_blank"
                    className="text-xs text-primary hover:underline flex-1 truncate font-medium"
                  >
                    {slug}
                  </Link>
                  <span className="text-xs font-mono text-muted-foreground">{count}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      {/* Recent clicks table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-sm">Recent Clicks</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Last 50 outbound events</p>
        </div>
        {recent.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No clicks recorded yet. They will appear here once users start clicking through to businesses.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-2.5 text-left font-mono text-muted-foreground uppercase tracking-wide">Time</th>
                  <th className="px-4 py-2.5 text-left font-mono text-muted-foreground uppercase tracking-wide">Business</th>
                  <th className="px-4 py-2.5 text-left font-mono text-muted-foreground uppercase tracking-wide">Type</th>
                  <th className="px-4 py-2.5 text-left font-mono text-muted-foreground uppercase tracking-wide">Surface</th>
                  <th className="px-4 py-2.5 text-left font-mono text-muted-foreground uppercase tracking-wide">Destination</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((click) => {
                  const Icon = LINK_TYPE_ICONS[click.link_type] ?? MousePointerClick
                  return (
                    <tr key={click.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-2.5 font-mono text-muted-foreground whitespace-nowrap">
                        {new Date(click.created_at).toLocaleString('en-KE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-2.5">
                        {click.business_slug ? (
                          <Link
                            href={`/directory/business/${click.business_slug}`}
                            target="_blank"
                            className="text-primary hover:underline font-medium truncate max-w-[140px] inline-block"
                          >
                            {click.business_slug}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full font-mono ${LINK_TYPE_COLORS[click.link_type] ?? 'bg-muted'}`}>
                          <Icon className="w-3 h-3" />
                          {click.link_type}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground font-mono">
                        {SURFACE_LABELS[click.surface] ?? click.surface}
                      </td>
                      <td className="px-4 py-2.5 max-w-[200px]">
                        <span className="truncate text-muted-foreground inline-block max-w-full" title={click.destination_url}>
                          {click.destination_url.replace(/^https?:\/\//, '').slice(0, 50)}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
