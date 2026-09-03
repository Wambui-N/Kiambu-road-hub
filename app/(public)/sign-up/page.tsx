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
import { Loader2, UserPlus, CheckCircle2 } from 'lucide-react'

function SignUpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/ask-kiambu-road'

  const [form, setForm] = useState({ full_name: '', email: '', phone_number: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.full_name,
            phone_number: form.phone_number || null,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      })
      if (error) throw error

      if (data.session) {
        // Email confirmation is off — signed in immediately.
        toast.success('Welcome to Ask Kiambu Road!')
        router.push(next)
        router.refresh()
      } else {
        // Email confirmation required before the account can sign in.
        setSubmitted(true)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign up failed'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-border shadow-sm p-8 text-center">
        <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="font-display text-xl font-bold text-foreground mb-2">Check your email</h1>
        <p className="text-sm text-muted-foreground">
          We&rsquo;ve sent a confirmation link to <strong>{form.email}</strong>. Click it to activate your account, then come back and sign in.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-5 h-5 text-white" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground">Join the community</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sign up to ask questions and share advice on Ask Kiambu Road
        </p>
      </div>

      <GoogleButton next={next} />

      <div className="flex items-center gap-3 my-5">
        <div className="h-px bg-border flex-1" />
        <span className="text-xs text-muted-foreground font-mono">or</span>
        <div className="h-px bg-border flex-1" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="full_name">Full name</Label>
          <Input
            id="full_name"
            value={form.full_name}
            onChange={(e) => set('full_name', e.target.value)}
            placeholder="Jane Wanjiru"
            required
            autoComplete="name"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone_number">Phone number <span className="text-muted-foreground font-normal">(optional)</span></Label>
          <Input
            id="phone_number"
            type="tel"
            value={form.phone_number}
            onChange={(e) => set('phone_number', e.target.value)}
            placeholder="+254 7XX XXX XXX"
            autoComplete="tel"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
            placeholder="At least 8 characters"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground text-center mt-6">
        Already have an account?{' '}
        <Link href={`/sign-in?next=${encodeURIComponent(next)}`} className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-brand-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Suspense fallback={null}>
          <SignUpForm />
        </Suspense>
      </div>
    </div>
  )
}
