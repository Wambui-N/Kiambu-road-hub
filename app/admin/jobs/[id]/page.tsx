import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import JobForm from '@/components/admin/job-form'

interface Props {
  params: Promise<{ id: string }>
}

async function getFormData(jobId: string) {
  const supabase = await createClient()
  const [{ data: job }, { data: areas }] = await Promise.all([
    supabase.from('job_listings').select('*').eq('id', jobId).single(),
    supabase.from('areas').select('id, name, slug').order('sort_order'),
  ])
  return { job, areas: areas ?? [] }
}

export default async function EditJobPage({ params }: Props) {
  const { id } = await params
  const { job, areas } = await getFormData(id)
  if (!job) notFound()

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/jobs" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-display text-xl font-bold">Edit Job Listing</h1>
          <p className="text-xs text-muted-foreground font-mono">{job.title}</p>
        </div>
      </div>
      <JobForm areas={areas} initialData={job} />
    </div>
  )
}
