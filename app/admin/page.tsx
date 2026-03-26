import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  Building2, FileText, Inbox, Briefcase,
  Star, Mail, MessageSquare, Megaphone, Users, DollarSign,
} from 'lucide-react'

async function getStats() {
  try {
    const supabase = await createClient()
    const results = await Promise.allSettled([
      supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('articles').select('id', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('business_submissions').select('id', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('job_listings').select('id', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('ad_inquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('talent_inquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('travel_inquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('feedback').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    ])

    const get = (i: number) =>
      results[i].status === 'fulfilled' ? (results[i].value as { count: number | null }).count ?? 0 : 0

    return {
      businesses: get(0),
      articles: get(1),
      newSubmissions: get(2),
      activeJobs: get(3),
      pendingReviews: get(4),
      subscribers: get(5),
      newAdInquiries: get(6),
      newTalent: get(7),
      newTravel: get(8),
      newFeedback: get(9),
    }
  } catch {
    return {
      businesses: 0, articles: 0, newSubmissions: 0, activeJobs: 0,
      pendingReviews: 0, subscribers: 0, newAdInquiries: 0, newTalent: 0, newTravel: 0, newFeedback: 0,
    }
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
  } catch { return [] }
}

export default async function AdminDashboard() {
  const [stats, recentSubmissions] = await Promise.all([getStats(), getRecentSubmissions()])

  const primaryStats = [
    { label: 'Businesses Published', value: stats.businesses, icon: Building2, href: '/admin/businesses', color: 'text-primary' },
    { label: 'Articles Published', value: stats.articles, icon: FileText, href: '/admin/articles', color: 'text-blue-600' },
    { label: 'New Submissions', value: stats.newSubmissions, icon: Inbox, href: '/admin/submissions', color: 'text-amber-600', highlight: stats.newSubmissions > 0 },
    { label: 'Active Jobs', value: stats.activeJobs, icon: Briefcase, href: '/admin/jobs', color: 'text-purple-600' },
  ]

  const modStats = [
    { label: 'Pending Reviews', value: stats.pendingReviews, icon: Star, href: '/admin/reviews', highlight: stats.pendingReviews > 0 },
    { label: 'Subscribers', value: stats.subscribers, icon: Mail, href: '/admin/subscribers' },
    { label: 'Ad Inquiries', value: stats.newAdInquiries, icon: Megaphone, href: '/admin/ad-inquiries', highlight: stats.newAdInquiries > 0 },
    { label: 'Talent Inquiries', value: stats.newTalent, icon: Users, href: '/admin/talent-inquiries', highlight: stats.newTalent > 0 },
    { label: 'Travel Inquiries', value: stats.newTravel, icon: DollarSign, href: '/admin/travel-inquiries', highlight: stats.newTravel > 0 },
    { label: 'New Feedback', value: stats.newFeedback, icon: MessageSquare, href: '/admin/feedback', highlight: stats.newFeedback > 0 },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Welcome back — here&apos;s what&apos;s happening on Kiambu Road Hub</p>
      </div>

      {/* Primary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {primaryStats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`bg-white rounded-xl border p-5 hover:shadow-sm transition-all ${stat.highlight ? 'border-amber-300 bg-amber-50' : 'border-border'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color ?? 'text-muted-foreground'}`} />
              {stat.highlight && <span className="w-2 h-2 rounded-full bg-amber-500" />}
            </div>
            <p className="font-display text-3xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Moderation stats */}
      <div>
        <p className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest mb-3">Moderation & Inquiries</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {modStats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className={`bg-white rounded-xl border p-4 hover:shadow-sm transition-all text-center ${stat.highlight ? 'border-primary/40 bg-primary/5' : 'border-border'}`}
            >
              <stat.icon className={`w-4 h-4 mx-auto mb-2 ${stat.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
              <p className={`font-display text-2xl font-bold ${stat.highlight ? 'text-primary' : ''}`}>{stat.value}</p>
              <p className="text-[10px] text-muted-foreground font-mono mt-0.5 leading-tight">{stat.label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent submissions */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-sm">Recent Business Submissions</h2>
          <Link href="/admin/submissions" className="text-xs text-primary hover:underline font-mono">
            View all →
          </Link>
        </div>
        {recentSubmissions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-10">No recent submissions</p>
        ) : (
          <div className="divide-y divide-border">
            {recentSubmissions.map((sub) => (
              <div key={sub.id} className="px-5 py-3 hover:bg-muted/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{sub.business_name}</p>
                    <p className="text-xs text-muted-foreground">{sub.category_name} · {sub.phone}</p>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${sub.status === 'new' ? 'bg-amber-100 text-amber-700' : 'bg-muted text-muted-foreground'}`}>
                    {sub.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div>
        <p className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest mb-3">Quick Actions</p>
        <div className="flex flex-wrap gap-3">
          {[
            { label: '+ New Business', href: '/admin/businesses/new' },
            { label: '+ Write Article', href: '/admin/articles/new' },
            { label: '+ Post Job', href: '/admin/jobs/new' },
            { label: 'View Live Site ↗', href: '/', external: true },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              target={a.external ? '_blank' : undefined}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
