import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, BadgeCheck, Crown, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

async function getBusinesses() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('businesses')
      .select('*, category:categories(name, slug), area:areas(name)')
      .order('created_at', { ascending: false })
      .limit(100)
    return data ?? []
  } catch {
    return []
  }
}

const STATUS_COLOR: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  review: 'bg-amber-100 text-amber-700',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-red-100 text-red-700',
}

export default async function AdminBusinessesPage() {
  const businesses = await getBusinesses()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Businesses</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{businesses.length} total listings</p>
        </div>
        <Link href="/admin/businesses/new">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-1" /> Add Business
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {businesses.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">🏢</p>
            <h3 className="font-semibold mb-2">No businesses yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Start by adding your first business listing.</p>
            <Link href="/admin/businesses/new">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-1" /> Add Business
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Business</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Category</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Area</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Flags</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {businesses.map((b) => (
                  <tr key={b.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium truncate max-w-[180px]">{b.name}</p>
                      <p className="text-[10px] font-mono text-muted-foreground">{b.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {(b.category as { name?: string })?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {(b.area as { name?: string })?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${STATUS_COLOR[b.status] ?? ''}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {b.verified && <span title="Verified"><BadgeCheck className="w-3.5 h-3.5 text-primary" /></span>}
                        {b.is_sponsor && <span title="Featured"><Crown className="w-3.5 h-3.5 text-amber-500" /></span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/admin/businesses/${b.id}`}
                          className="text-xs text-primary hover:underline">Edit</Link>
                        <Link href={`/directory/business/${b.slug}`} target="_blank"
                          className="text-xs text-muted-foreground hover:text-foreground">
                          <Eye className="w-3 h-3" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
