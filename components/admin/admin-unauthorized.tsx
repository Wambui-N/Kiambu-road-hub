'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { ShieldX } from 'lucide-react'

interface Props {
  userEmail?: string
}

export default function AdminUnauthorized({ userEmail }: Props) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-brand-surface flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border border-border shadow-sm p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <ShieldX className="w-5 h-5 text-destructive" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          {userEmail && (
            <p className="text-xs text-muted-foreground mb-1 font-mono">{userEmail}</p>
          )}
          <p className="text-sm text-muted-foreground mb-6">
            Your account does not have admin privileges. Contact the site owner to request access.
          </p>
          <div className="flex flex-col gap-2">
            <Button variant="destructive" className="w-full" onClick={handleSignOut}>
              Sign out
            </Button>
            <Button
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={() => router.push('/')}
            >
              Go to homepage
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
