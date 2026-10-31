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

const JOB_TYPES = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
]

interface Props {
  searchParams: Promise<{ type?: string }>
}

async function getJobs(jobType?: string) {
  try {
    const supabase = await createClient()
    let query = supabase
      .from('job_listings')
      .select('*, area:areas(name, slug)')
      .eq('status', 'published')

    if (jobType) query = query.eq('job_type', jobType)

    const { data } = await query.order('published_at', { ascending: false }).limit(60)
    return data ?? []
  } catch {
    return []
  }
}

export default async function JobsPage({ searchParams }: Props) {
  const { type } = await searchParams
  const jobs = await getJobs(type)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <p className="text-white/70 font-mono text-xs uppercase tracking-widest mb-2">Kiambu Road Explorer</p>
          <h1 className="font-display text-4xl font-medium text-white mb-2">Jobs &amp; Careers</h1>
          <p className="text-white/70 text-sm max-w-2xl">
            We bring together job openings and career opportunities to help job seekers discover what is available and
            connect with potential employers.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-10">
        <div className="lg:flex lg:gap-8">
          <div className="lg:flex-1">
            {/* Filter tabs */}
            <div className="flex gap-2 flex-wrap mb-6">
              <Link
                href="/jobs"
                className={`px-4 py-1.5 rounded-md text-xs font-mono font-semibold border transition-colors ${
                  !type ? 'bg-primary text-primary-foreground border-primary' : 'border-border bg-card hover:border-primary hover:text-primary'
                }`}
              >
                All
              </Link>
              {JOB_TYPES.map((t) => (
                <Link
                  key={t.value}
                  href={`/jobs?type=${t.value}`}
                  className={`px-4 py-1.5 rounded-md text-xs font-mono font-semibold border transition-colors ${
                    type === t.value ? 'bg-primary text-primary-foreground border-primary' : 'border-border bg-card hover:border-primary hover:text-primary'
                  }`}
                >
                  {t.label}
                </Link>
              ))}
            </div>

            {jobs.length === 0 ? (
              <div className="text-center py-20">
                <h2 className="font-display text-2xl font-medium mb-3">
                  {type ? 'No listings in this category yet' : 'Job listings coming soon'}
                </h2>
                <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8">
                  {type
                    ? 'Check back soon, or browse all listings.'
                    : 'We are building the jobs board. Check back soon for local employment opportunities.'}
                </p>
                <Link
                  href="/jobs/post"
                  className="inline-flex items-center bg-accent text-accent-foreground px-6 py-3 rounded-md text-sm font-semibold hover:bg-accent/85 transition-colors"
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
                    const jobTypeLabel = JOB_TYPES.find((t) => t.value === job.job_type)?.label ?? job.job_type

                    return (
                      <div key={job.id} className="bg-card rounded-lg border border-border p-6 hover:border-primary transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h2 className="font-display font-medium text-lg text-foreground">{job.title}</h2>
                              {jobTypeLabel && (
                                <Badge variant="outline" className="text-[10px] font-mono">
                                  {jobTypeLabel}
                                </Badge>
                              )}
                              {isExpiring && (
                                <Badge className="text-[10px] font-mono bg-destructive/10 text-destructive border-0">
                                  Closing soon
                                </Badge>
                              )}
                            </div>
                            {job.company && (
                              <p className="text-sm font-semibold text-muted-foreground mb-3">{job.company}</p>
                            )}
                            <div className="flex flex-wrap gap-4 text-xs font-mono text-muted-foreground mb-3">
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
                                className="inline-flex items-center justify-center border border-primary text-primary px-4 py-2 rounded-md text-xs font-semibold hover:bg-sage transition-colors"
                              >
                                Apply
                              </a>
                            )}
                            {job.contact_phone && (
                              <a
                                href={`tel:${job.contact_phone}`}
                                className="inline-flex items-center justify-center border border-border text-foreground px-4 py-2 rounded-md text-xs font-semibold hover:bg-muted transition-colors"
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
            <div className="mt-10 bg-card rounded-lg border border-border p-8">
              <h3 className="font-display text-xl font-medium mb-2">Are you hiring?</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-md">
                Post a job listing and reach qualified candidates along the Kiambu Road corridor.
                Listings are reviewed by our team and published within 1–2 business days.
              </p>
              <Link
                href="/jobs/post"
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-3 rounded-md text-sm font-semibold hover:bg-accent/85 transition-colors"
              >
                Post a Job <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Talent search side panel */}
          <div className="lg:w-80 mt-8 lg:mt-0 space-y-4">
            <div className="bg-card rounded-lg border border-border p-6 lg:sticky lg:top-24">
              <h3 className="font-display text-lg font-medium mb-3">Looking for talent?</h3>
              <p className="text-sm text-muted-foreground mb-5">
                Need to hire? Our Talent Search service connects you directly with skilled candidates in the Kiambu Road area.
              </p>
              <Link
                href="/talent-search"
                className="flex items-center justify-between w-full border border-primary text-primary px-5 py-3 rounded-md text-sm font-semibold hover:bg-sage transition-colors"
              >
                Go to Talent Search <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* For Employers / For Job Seekers */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="font-mono text-xs font-bold text-primary uppercase tracking-widest mb-2">For Employers</h3>
            <p className="font-display text-lg font-medium mb-2">Looking for the right people?</p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Advertise your vacancies, seek recommendations and connect with suitable people.
            </p>
            <p className="text-sm text-muted-foreground">
              Contact us for more information{' '}
              <a href="mailto:info@kiamburoad.com" className="text-primary font-semibold hover:underline">
                info@kiamburoad.com
              </a>
            </p>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="font-mono text-xs font-bold text-primary uppercase tracking-widest mb-2">For Job Seekers</h3>
            <p className="font-display text-lg font-medium mb-2">Please do your due diligence.</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Kiambu Road Explorer shares job opportunities as a service to our readers but does not guarantee the
              authenticity, suitability or terms of any vacancy or employer. Job seekers should independently verify
              employers, job offers and any requests for payments or personal information before proceeding. Explorer
              does not accept responsibility for losses, disputes or other consequences arising from applications or
              employment arrangements made through opportunities featured on this site.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
