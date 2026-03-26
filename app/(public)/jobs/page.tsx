import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { MapPin, Clock, Briefcase, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Jobs Board',
  description: 'Find local jobs and career opportunities along the Kiambu Road corridor, Nairobi.',
  alternates: { canonical: 'https://kiamburoad.com/jobs' },
}

export const revalidate = 1800

const JOB_TYPE_LABEL: Record<string, string> = {
  full_time: 'Full Time',
  part_time: 'Part Time',
  contract: 'Contract',
  internship: 'Internship',
}

const JOB_TYPE_COLOR: Record<string, string> = {
  full_time: 'bg-primary/10 text-primary',
  part_time: 'bg-blue-100 text-blue-700',
  contract: 'bg-amber-100 text-amber-700',
  internship: 'bg-purple-100 text-purple-700',
}

async function getJobs() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('job_listings')
      .select('*, area:areas(name, slug)')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(60)
    return data ?? []
  } catch {
    return []
  }
}

export default async function JobsPage() {
  const jobs = await getJobs()

  const allTypes = ['All', 'Full Time', 'Part Time', 'Contract', 'Internship']

  return (
    <div className="min-h-screen bg-brand-surface">
      {/* Header */}
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-accent font-mono text-xs uppercase tracking-widest mb-2">Kiambu Road Explorer</p>
          <h1 className="font-display text-4xl font-bold text-white mb-2">Jobs Board</h1>
          <p className="text-white/70 text-sm">
            Local employment opportunities along the Kiambu Road corridor
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="lg:flex lg:gap-8">
          <div className="lg:flex-1">
            {/* Filter tabs */}
            <div className="flex gap-2 flex-wrap mb-6">
              {allTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  className="px-4 py-1.5 rounded-full text-xs font-mono font-semibold border border-border bg-white hover:border-primary hover:text-primary transition-colors"
                >
                  {type}
                </button>
              ))}
            </div>

            {jobs.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-5">💼</div>
                <h2 className="font-display text-2xl font-semibold mb-3">Job listings coming soon</h2>
                <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8">
                  We are building the jobs board. Check back soon for local employment opportunities.
                </p>
                <Link
                  href="/jobs/post"
                  className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Post a Job
                </Link>
              </div>
            ) : (
              <>
                <p className="text-xs font-mono text-muted-foreground mb-5">
                  {jobs.length} {jobs.length === 1 ? 'listing' : 'listings'} available
                </p>

                <div className="space-y-4">
                  {jobs.map((job) => {
                    const area = job.area as { name?: string; slug?: string } | null
                    const isExpiring = job.deadline
                      ? new Date(job.deadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                      : false
                    const typeClass = job.job_type ? JOB_TYPE_COLOR[job.job_type] ?? 'bg-muted text-foreground' : 'bg-muted text-foreground'

                    return (
                      <div key={job.id} className="bg-white rounded-2xl border border-border p-6 hover:shadow-sm transition-all">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h2 className="font-display font-semibold text-lg text-foreground">{job.title}</h2>
                              {job.job_type && (
                                <Badge className={`text-[10px] font-mono border-0 ${typeClass}`}>
                                  {JOB_TYPE_LABEL[job.job_type] ?? job.job_type}
                                </Badge>
                              )}
                              {isExpiring && (
                                <Badge className="text-[10px] font-mono bg-red-100 text-red-700 border-0">
                                  Closing soon
                                </Badge>
                              )}
                            </div>
                            {job.company && (
                              <p className="text-sm font-semibold text-muted-foreground mb-3">{job.company}</p>
                            )}
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
                                  Deadline: {new Date(job.deadline).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
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
            <div className="mt-10 bg-white rounded-2xl border border-border p-8">
              <h3 className="font-display text-xl font-bold mb-2">Are you hiring?</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-md">
                Post a job listing and reach qualified candidates along the Kiambu Road corridor.
                Listings are reviewed by our team and published within 1–2 business days.
              </p>
              <Link
                href="/jobs/post"
                className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Post a Job <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Talent search side panel */}
          <div className="lg:w-80 mt-8 lg:mt-0 space-y-4">
            <div className="bg-white rounded-2xl border border-border p-6 lg:sticky lg:top-24">
              <h3 className="font-display text-lg font-bold mb-3">Looking for talent?</h3>
              <p className="text-sm text-muted-foreground mb-5">
                Need to hire? Our Talent Search service connects you directly with skilled candidates in the Kiambu Road area.
              </p>
              <Link
                href="/talent-search"
                className="flex items-center justify-between w-full bg-primary/10 text-primary px-5 py-3 rounded-xl text-sm font-semibold hover:bg-primary hover:text-white transition-colors"
              >
                Go to Talent Search <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
