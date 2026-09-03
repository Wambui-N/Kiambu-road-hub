'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import GoogleButton from '@/components/auth/google-button'
import { toast } from 'sonner'
import { Loader2, LogIn } from 'lucide-react'

function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/ask-kiambu-road'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      toast.success('Welcome back!')
      router.push(next)
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign in failed'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
          <LogIn className="w-5 h-5 text-white" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1">Sign in to Ask Kiambu Road</p>
      </div>

      <GoogleButton next={next} />

      <div className="flex items-center gap-3 my-5">
        <div className="h-px bg-border flex-1" />
        <span className="text-xs text-muted-foreground font-mono">or</span>
        <div className="h-px bg-border flex-1" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground text-center mt-6">
        New here?{' '}
        <Link href={`/sign-up?next=${encodeURIComponent(next)}`} className="text-primary hover:underline font-medium">
          Create an account
        </Link>
      </p>
    </div>
  )
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-brand-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Suspense fallback={null}>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  )
}
