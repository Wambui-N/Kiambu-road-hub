import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

async function getJobs() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('job_listings')
      .select('*, area:areas(name)')
      .order('created_at', { ascending: false })
      .limit(100)
    return data ?? []
  } catch {
    return []
  }
}

const STATUS_COLOR: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-red-100 text-red-700',
}

export default async function AdminJobsPage() {
  const jobs = await getJobs()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Jobs Board</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{jobs.length} listings</p>
        </div>
        <Link href="/admin/jobs/new">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-1" /> Add Job
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {jobs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">💼</p>
            <h3 className="font-semibold mb-2">No job listings yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Add the first job posting.</p>
            <Link href="/admin/jobs/new">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-1" /> Add Job
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Job Title</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Company</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Type</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Deadline</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium truncate max-w-[200px]">{job.title}</p>
                      <p className="text-[10px] font-mono text-muted-foreground">{(job.area as { name?: string })?.name ?? job.location_text ?? '—'}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{job.company}</td>
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{job.job_type?.replace('_', ' ')}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                      {job.deadline ? new Date(job.deadline).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${STATUS_COLOR[job.status] ?? ''}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/jobs/${job.id}`} className="text-xs text-primary hover:underline">Edit</Link>
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
