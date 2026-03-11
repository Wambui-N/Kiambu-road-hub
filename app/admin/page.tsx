import { createClient } from '@/lib/supabase/server'
import { Building2, FileText, Inbox, Briefcase, TrendingUp, AlertCircle } from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  try {
    const supabase = await createClient()
    const [businesses, articles, submissions, jobs] = await Promise.all([
      supabase.from('businesses').select('status', { count: 'exact' }),
      supabase.from('articles').select('status', { count: 'exact' }),
      supabase.from('business_submissions').select('status', { count: 'exact' }).eq('status', 'new'),
      supabase.from('job_listings').select('status', { count: 'exact' }).eq('status', 'published'),
    ])
    return {
      totalBusinesses: businesses.count ?? 0,
      totalArticles: articles.count ?? 0,
      newSubmissions: submissions.count ?? 0,
      activeJobs: jobs.count ?? 0,
    }
  } catch {
    return { totalBusinesses: 0, totalArticles: 0, newSubmissions: 0, activeJobs: 0 }
  }
}

async function getRecentSubmissions() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('business_submissions')
      .select('*')
      .order('submitted_at', { ascending: false })
      .limit(5)
    return data ?? []
  } catch {
    return []
  }
}

export default async function AdminDashboard() {
  const [stats, submissions] = await Promise.all([getStats(), getRecentSubmissions()])

  const cards = [
    {
      label: 'Total Businesses',
      value: stats.totalBusinesses,
      icon: Building2,
      href: '/admin/businesses',
      color: 'text-primary',
    },
    {
      label: 'Articles',
      value: stats.totalArticles,
      icon: FileText,
      href: '/admin/articles',
      color: 'text-blue-600',
    },
    {
      label: 'New Submissions',
      value: stats.newSubmissions,
      icon: Inbox,
      href: '/admin/submissions',
      color: 'text-amber-600',
    },
    {
      label: 'Active Jobs',
      value: stats.activeJobs,
      icon: Briefcase,
      href: '/admin/jobs',
      color: 'text-green-600',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome to the Kiambu Road Hub admin panel</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}>
            <div className="bg-white rounded-xl border border-border p-5 hover:border-primary transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-mono uppercase tracking-wide">
                    {card.label}
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-1">{card.value}</p>
                </div>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl border border-border p-5">
        <h2 className="font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/businesses?new=1"
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            + Add Business
          </Link>
          <Link href="/admin/articles?new=1"
            className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors">
            + Add Article
          </Link>
          <Link href="/admin/jobs?new=1"
            className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors">
            + Post Job
          </Link>
          <Link href="/admin/submissions"
            className="px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors flex items-center gap-1">
            {stats.newSubmissions > 0 && <AlertCircle className="w-3.5 h-3.5" />}
            Review Submissions {stats.newSubmissions > 0 && `(${stats.newSubmissions})`}
          </Link>
        </div>
      </div>

      {/* Recent submissions */}
      {submissions.length > 0 && (
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Submissions</h2>
            <Link href="/admin/submissions" className="text-xs text-primary hover:underline font-mono">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {submissions.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-sm">{sub.business_name}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {sub.category_name} · {new Date(sub.submitted_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                  {sub.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
