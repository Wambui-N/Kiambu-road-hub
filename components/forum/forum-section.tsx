'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { HelpCircle, Lightbulb, Loader2, Send, MessageCircleQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import PostCard from './post-card'
import type { ForumPost, ForumPostType } from '@/types/database'

interface ForumSectionProps {
  initialPosts: ForumPost[]
  isSignedIn: boolean
}

export default function ForumSection({ initialPosts, isSignedIn }: ForumSectionProps) {
  const router = useRouter()
  const [posts, setPosts] = useState<ForumPost[]>(initialPosts)
  const [composerType, setComposerType] = useState<ForumPostType | null>(null)
  const [form, setForm] = useState({ title: '', body: '' })
  const [submitting, setSubmitting] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(initialPosts.length >= 20)

  const openComposer = (type: ForumPostType) => {
    if (!isSignedIn) {
      toast.error('Sign up to post on Ask Kiambu Road.')
      router.push(`/sign-up?next=${encodeURIComponent('/ask-kiambu-road')}`)
      return
    }
    setComposerType(type)
    setForm({ title: '', body: '' })
    requestAnimationFrame(() => {
      document.getElementById('forum-composer')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!composerType) return
    if (!form.title.trim() || !form.body.trim()) {
      toast.error('Please fill in both a title and details.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_type: composerType, title: form.title, body: form.body }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Could not post')
      }
      const data = await res.json()
      setPosts((prev) => [data.post, ...prev])
      setForm({ title: '', body: '' })
      setComposerType(null)
      toast.success(composerType === 'question' ? 'Question posted!' : 'Advice posted!')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not post. Please try again.'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  const loadMore = async () => {
    if (posts.length === 0) return
    setLoadingMore(true)
    try {
      const last = posts[posts.length - 1]
      const res = await fetch(`/api/forum/posts?before=${encodeURIComponent(last.created_at)}`)
      const data = await res.json()
      const newPosts: ForumPost[] = data.posts ?? []
      setPosts((prev) => [...prev, ...newPosts])
      setHasMore(newPosts.length >= 20)
    } catch {
      toast.error('Could not load more posts.')
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Prompt cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <button
          onClick={() => openComposer('question')}
          className="text-left bg-white border border-border rounded-2xl p-6 hover:border-primary hover:shadow-sm transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <HelpCircle className="w-5 h-5 text-blue-700" />
          </div>
          <h3 className="font-display font-semibold text-foreground mb-1.5">
            Any burning question for which you need assistance?
          </h3>
          <p className="text-sm text-muted-foreground">Ask the Kiambu Road community</p>
        </button>

        <button
          onClick={() => openComposer('tip')}
          className="text-left bg-white border border-border rounded-2xl p-6 hover:border-primary hover:shadow-sm transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Lightbulb className="w-5 h-5 text-amber-700" />
          </div>
          <h3 className="font-display font-semibold text-foreground mb-1.5">
            Any important advice or titbits?
          </h3>
          <p className="text-sm text-muted-foreground">Post it here; it may help or encourage somebody</p>
        </button>
      </div>

      {/* Composer */}
      {composerType && (
        <form
          id="forum-composer"
          onSubmit={handleSubmit}
          className="bg-white border-2 border-primary/30 rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
              {composerType === 'question' ? (
                <><HelpCircle className="w-4 h-4 text-blue-700" /> Ask a question</>
              ) : (
                <><Lightbulb className="w-4 h-4 text-amber-700" /> Share advice</>
              )}
            </h3>
            <button
              type="button"
              onClick={() => setComposerType(null)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>

          <Input
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            placeholder={composerType === 'question' ? 'What do you need help with?' : 'Give your tip a short title'}
            maxLength={200}
            required
          />
          <Textarea
            value={form.body}
            onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
            placeholder={
              composerType === 'question'
                ? 'Add any details that will help neighbours answer well...'
                : 'Share the full advice or tidbit...'
            }
            rows={4}
            maxLength={5000}
            required
          />

          <Button type="submit" disabled={submitting} className="bg-primary hover:bg-primary/90">
            {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
            {submitting ? 'Posting...' : composerType === 'question' ? 'Post question' : 'Post advice'}
          </Button>
        </form>
      )}

      {!isSignedIn && (
        <div className="bg-muted/40 border border-border rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm text-muted-foreground">
            Sign up to ask questions, share advice, and reply to your neighbours.
          </p>
          <div className="flex gap-2 shrink-0">
            <Link href="/sign-in?next=%2Fask-kiambu-road">
              <Button variant="outline" size="sm">Sign in</Button>
            </Link>
            <Link href="/sign-up?next=%2Fask-kiambu-road">
              <Button size="sm" className="bg-primary hover:bg-primary/90">Sign up</Button>
            </Link>
          </div>
        </div>
      )}

      {/* Feed */}
      <div className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
          <MessageCircleQuestion className="w-5 h-5 text-primary" />
          Community questions & advice
        </h3>

        {posts.length === 0 ? (
          <div className="bg-white border border-dashed border-border rounded-2xl p-10 text-center">
            <p className="text-sm text-muted-foreground">
              No posts yet — be the first to ask a question or share advice.
            </p>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} isSignedIn={isSignedIn} />
            ))}
            {hasMore && (
              <div className="text-center pt-2">
                <Button variant="outline" onClick={loadMore} disabled={loadingMore}>
                  {loadingMore ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  {loadingMore ? 'Loading...' : 'Load more'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
