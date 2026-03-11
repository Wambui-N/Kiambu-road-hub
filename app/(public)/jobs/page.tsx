import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { MapPin, Clock, Briefcase } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Jobs Board — Kiambu Road Hub',
  description: 'Find local jobs and career opportunities along the Kiambu Road corridor, Nairobi.',
}

export const revalidate = 1800

async function getJobs() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('job_listings')
      .select('*, area:areas(name, slug)')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(50)
    return data ?? []
  } catch {
    return []
  }
}

const JOB_TYPE_LABEL: Record<string, string> = {
  full_time: 'Full Time',
  part_time: 'Part Time',
  contract: 'Contract',
  internship: 'Internship',
}

export default async function JobsPage() {
  const jobs = await getJobs()

  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-accent font-mono text-xs uppercase tracking-widest mb-2">Kiambu Road Hub</p>
          <h1 className="font-display text-4xl font-bold text-white mb-2">Jobs Board</h1>
          <p className="text-white/70 text-sm">
            Local employment opportunities along the Kiambu Road corridor
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {jobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-5">💼</div>
            <h2 className="font-display text-2xl font-semibold mb-3">Job listings coming soon</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8">
              We are building the jobs board. Check back soon for local employment opportunities.
            </p>
            <p className="text-sm text-muted-foreground">
              Are you hiring?{' '}
              <Link href="/contact" className="text-primary hover:underline font-semibold">
                Contact us
              </Link>{' '}
              to post a job listing.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground font-mono mb-6">
              {jobs.length} {jobs.length === 1 ? 'listing' : 'listings'} available
            </p>

            <div className="space-y-4">
              {jobs.map((job) => {
                const area = job.area as { name?: string; slug?: string } | null
                const isExpiring = job.deadline
                  ? new Date(job.deadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                  : false

                return (
                  <div key={job.id} className="bg-white rounded-2xl border border-border p-6 hover:shadow-sm transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <h2 className="font-display font-semibold text-lg text-foreground">{job.title}</h2>
                          <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {JOB_TYPE_LABEL[job.job_type] ?? job.job_type}
                          </span>
                          {isExpiring && (
                            <span className="text-xs font-mono bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                              Closing soon
                            </span>
                          )}
                        </div>

                        <p className="text-sm font-semibold text-muted-foreground mb-3">{job.company}</p>

                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-3">
                          {(area?.name ?? job.location_text) && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {area?.name ?? job.location_text}
                            </span>
                          )}
                          {job.salary_text && (
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              {job.salary_text}
                            </span>
                          )}
                          {job.deadline && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Deadline: {new Date(job.deadline).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        {job.description && (
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                            {job.description}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 shrink-0">
                        {job.contact_email && (
                          <a
                            href={`mailto:${job.contact_email}`}
                            className="inline-flex items-center justify-center bg-primary text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors"
                          >
                            Apply
                          </a>
                        )}
                        {job.contact_phone && (
                          <a
                            href={`tel:${job.contact_phone}`}
                            className="inline-flex items-center justify-center border border-border text-foreground px-4 py-2 rounded-lg text-xs font-semibold hover:bg-muted transition-colors"
                          >
                            Call
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Post a job CTA */}
        <div className="mt-12 bg-white rounded-2xl border border-border p-8 text-center">
          <h3 className="font-display text-xl font-bold mb-2">Are you hiring?</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
            Post a job listing and reach qualified candidates along the Kiambu Road corridor.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-primary text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Post a Job
          </Link>
        </div>
      </div>
    </div>
  )
}
