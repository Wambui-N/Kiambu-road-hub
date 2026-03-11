import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/admin-sidebar'
import AdminHeader from '@/components/admin/admin-header'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  // Check if user has admin role
  const { data: roleData } = await supabase
    .from('admin_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!roleData) redirect('/admin/login')

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
