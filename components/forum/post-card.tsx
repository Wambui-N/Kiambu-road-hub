'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ThumbsUp, MessageCircle, ChevronDown, ChevronUp, Loader2, Send, HelpCircle, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { timeAgo } from '@/lib/format-time'
import type { ForumPost, ForumReply } from '@/types/database'

interface PostCardProps {
  post: ForumPost
  isSignedIn: boolean
}

export default function PostCard({ post, isSignedIn }: PostCardProps) {
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
  const [replies, setReplies] = useState<ForumReply[] | null>(null)
  const [loadingReplies, setLoadingReplies] = useState(false)
  const [replyBody, setReplyBody] = useState('')
  const [submittingReply, setSubmittingReply] = useState(false)
  const [upvoteCount, setUpvoteCount] = useState(post.upvote_count)
  const [upvoted, setUpvoted] = useState(false)
  const [voting, setVoting] = useState(false)
  const [replyCount, setReplyCount] = useState(post.reply_count)

  const requireSignIn = () => {
    toast.error('Sign in to join the conversation.')
    router.push(`/sign-in?next=${encodeURIComponent('/ask-kiambu-road')}`)
  }

  const toggleExpanded = async () => {
    const next = !expanded
    setExpanded(next)
    if (next && replies === null) {
      setLoadingReplies(true)
      try {
        const res = await fetch(`/api/forum/posts/${post.id}/replies`)
        const data = await res.json()
        setReplies(data.replies ?? [])
      } catch {
        toast.error('Could not load replies.')
        setReplies([])
      } finally {
        setLoadingReplies(false)
      }
    }
  }

  const handleUpvote = async () => {
    if (!isSignedIn) return requireSignIn()
    if (upvoted || voting) return
    setVoting(true)
    setUpvoted(true)
    setUpvoteCount((c) => c + 1)
    try {
      const res = await fetch(`/api/forum/posts/${post.id}/vote`, { method: 'POST' })
      const data = await res.json()
      if (typeof data.upvote_count === 'number') setUpvoteCount(data.upvote_count)
    } catch {
      // keep optimistic state — a failed vote isn't worth surfacing an error for
    } finally {
      setVoting(false)
    }
  }

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSignedIn) return requireSignIn()
    if (!replyBody.trim()) return
    setSubmittingReply(true)
    try {
      const res = await fetch(`/api/forum/posts/${post.id}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: replyBody }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setReplies((prev) => [...(prev ?? []), data.reply])
      setReplyCount((c) => c + 1)
      setReplyBody('')
    } catch {
      toast.error('Could not post your reply. Please try again.')
    } finally {
      setSubmittingReply(false)
    }
  }

  const isTip = post.post_type === 'tip'

  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0 ${
              isTip ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
            }`}
          >
            {isTip ? <Lightbulb className="w-3 h-3" /> : <HelpCircle className="w-3 h-3" />}
            {isTip ? 'Advice' : 'Question'}
          </span>
          <span className="text-xs text-muted-foreground shrink-0">{timeAgo(post.created_at)}</span>
        </div>

        <h3 className="font-display font-semibold text-foreground text-base mb-1.5">{post.title}</h3>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{post.body}</p>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">
            by <span className="font-medium text-foreground">{post.author_name}</span>
          </span>

          <div className="flex items-center gap-4">
            <button
              onClick={handleUpvote}
              disabled={upvoted}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                upvoted ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${upvoted ? 'fill-primary' : ''}`} />
              {upvoteCount}
            </button>

            <button
              onClick={toggleExpanded}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="bg-muted/30 border-t border-border px-5 py-4 space-y-4">
          {loadingReplies ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {replies && replies.length > 0 ? (
                <div className="space-y-3">
                  {replies.map((reply) => (
                    <div key={reply.id} className="bg-white rounded-xl border border-border p-3.5">
                      <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{reply.body}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">{reply.author_name}</span> · {timeAgo(reply.created_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-2">
                  No replies yet — be the first to respond.
                </p>
              )}

              <form onSubmit={handleReplySubmit} className="flex gap-2 items-start">
                <Textarea
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  placeholder={isSignedIn ? 'Write a reply...' : 'Sign in to reply...'}
                  rows={2}
                  className="flex-1 bg-white"
                  onFocus={() => { if (!isSignedIn) requireSignIn() }}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={submittingReply || !replyBody.trim()}
                  className="bg-primary hover:bg-primary/90 shrink-0"
                >
                  {submittingReply ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  )
}
