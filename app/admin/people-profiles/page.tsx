import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import DeleteRecordButton from '@/components/admin/delete-record-button'

async function getProfiles() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('people_profiles').select('*').order('sort_order').order('name')
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

export default async function AdminPeopleProfilesPage() {
  const profiles = await getProfiles()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">People Profiles</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{profiles.length} profiles</p>
        </div>
        <Link href="/admin/people-profiles/new">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-1" /> Add Profile
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {profiles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">🧑‍🤝‍🧑</p>
            <h3 className="font-semibold mb-2">No profiles yet</h3>
            <Link href="/admin/people-profiles/new">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-1" /> Add Profile
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Role / Connection</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {profiles.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-[10px] font-mono text-muted-foreground">{item.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{item.role_connection ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${STATUS_COLOR[item.status] ?? ''}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3 items-center">
                        <Link href={`/admin/people-profiles/${item.id}`} className="text-xs text-primary hover:underline">Edit</Link>
                        <DeleteRecordButton table="people_profiles" id={item.id} name={item.name} />
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
