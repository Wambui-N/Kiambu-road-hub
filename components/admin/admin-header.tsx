'use client'

import { useRouter } from 'next/navigation'
import { LogOut, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface AdminHeaderProps {
  user: SupabaseUser
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Signed out')
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="bg-white border-b border-border px-6 py-3 flex items-center justify-between shrink-0">
      <div />
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="w-4 h-4" />
          <span className="hidden sm:block">{user.email}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="text-muted-foreground hover:text-destructive"
        >
          <LogOut className="w-4 h-4 mr-1" /> Sign out
        </Button>
      </div>
    </header>
  )
}
