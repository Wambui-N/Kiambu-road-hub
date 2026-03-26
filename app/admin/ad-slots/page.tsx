import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

async function getData() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('ad_slots')
      .select('*, advertiser:businesses(id, name, slug)')
      .order('page')
      .order('tier')
      .order('position')
    return data ?? []
  } catch { return [] }
}

const TIER_COLOR: Record<string, string> = {
  primary: 'bg-amber-100 text-amber-700',
  secondary: 'bg-blue-100 text-blue-700',
  tertiary: 'bg-muted text-muted-foreground',
}

export default async function AdSlotsPage() {
  const slots = await getData()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Ad Slots</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{slots.length} slots configured</p>
        </div>
        <p className="text-xs text-muted-foreground">
          Manage via Supabase · <Link href="/advertise" className="text-primary hover:underline">View Advertise page</Link>
        </p>
      </div>
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {slots.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">📋</p>
            <p className="font-semibold mb-1">No ad slots configured</p>
            <p className="text-sm text-muted-foreground">Add rows to the <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">ad_slots</code> table in Supabase to start serving ads.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Page</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Tier</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Title</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Advertiser</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {slots.map((slot) => {
                  const advertiser = slot.advertiser as { name?: string; slug?: string } | null
                  return (
                    <tr key={slot.id} className="hover:bg-muted/20">
                      <td className="px-4 py-3 font-mono text-xs">{slot.page}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${TIER_COLOR[slot.tier] ?? ''}`}>{slot.tier}</span>
                      </td>
                      <td className="px-4 py-3 text-sm">{slot.ad_title ?? '—'}</td>
                      <td className="px-4 py-3 text-sm">
                        {advertiser?.name ? (
                          <Link href={`/directory/business/${advertiser.slug}`} className="text-primary hover:underline" target="_blank">
                            {advertiser.name}
                          </Link>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${slot.active ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                          {slot.active ? 'Active' : 'Inactive'}
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
