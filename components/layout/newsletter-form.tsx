'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('Failed to subscribe')
      toast.success('Subscribed! Welcome to the Kiambu Road Explorer community.')
      setEmail('')
    } catch {
      toast.error('Could not subscribe. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white min-w-[240px]"
        required
      />
      <Button
        type="submit"
        disabled={loading}
        className="bg-accent hover:bg-amber-500 text-black font-semibold whitespace-nowrap disabled:opacity-60"
      >
        {loading ? 'Subscribing...' : 'Subscribe'}
      </Button>
    </form>
  )
}
