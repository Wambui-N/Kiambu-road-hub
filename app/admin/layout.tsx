import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/admin-sidebar'
import AdminHeader from '@/components/admin/admin-header'
import AdminUnauthorized from '@/components/admin/admin-unauthorized'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // No user — render children directly (only reachable via /admin/login because
  // middleware redirects all other unauthenticated /admin/* requests to /admin/login).
  if (!user) {
    return <>{children}</>
  }

  // Authenticated but no admin_roles row → show access-denied UI inline.
  // Redirecting to a page under /admin would re-enter this layout and loop.
  const { data: roleData } = await supabase
    .from('admin_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!roleData) {
    return <AdminUnauthorized userEmail={user.email} />
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader user={user} />
        <main className="flex-1 overflow-y-auto bg-brand-surface p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
