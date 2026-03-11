import { createClient } from '@/lib/supabase/server'
import JobForm from '@/components/admin/job-form'

async function getAreas() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('areas').select('id, name, slug').order('sort_order')
    return data ?? []
  } catch {
    return []
  }
}

export default async function NewJobPage() {
  const areas = await getAreas()
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Add Job Listing</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Create a new job posting</p>
      </div>
      <JobForm areas={areas} />
    </div>
  )
}
