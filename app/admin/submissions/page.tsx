import { createClient } from '@/lib/supabase/server'
import SubmissionActions from '@/components/admin/submission-actions'

async function getSubmissions() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('business_submissions')
      .select('*')
      .order('submitted_at', { ascending: false })
    return data ?? []
  } catch {
    return []
  }
}

const STATUS_COLOR: Record<string, string> = {
  new: 'bg-amber-100 text-amber-700',
  in_review: 'bg-blue-100 text-blue-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

export default async function SubmissionsPage() {
  const submissions = await getSubmissions()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Business Submissions</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Listings submitted via the public form — review before publishing
        </p>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {submissions.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">📭</p>
            <h3 className="font-semibold mb-1">No submissions yet</h3>
            <p className="text-sm text-muted-foreground">
              Listings submitted through &ldquo;List Your Business&rdquo; will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Business Name</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Category</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Contact</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Submitted</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium">{sub.business_name}</p>
                      <p className="text-[10px] font-mono text-muted-foreground">{sub.location_text}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{sub.category_name}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs">{sub.phone}</p>
                      <p className="text-[10px] text-muted-foreground">{sub.email}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                      {new Date(sub.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${STATUS_COLOR[sub.status] ?? ''}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <SubmissionActions id={sub.id} status={sub.status} />
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
