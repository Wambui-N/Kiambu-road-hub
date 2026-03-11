/**
 * Simple in-memory rate limiter for API routes.
 * Resets on server restart. Suitable for low-traffic forms and submissions.
 * For higher traffic, replace with Redis or Upstash.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

interface RateLimitOptions {
  /** Maximum requests in the window */
  limit: number
  /** Window duration in seconds */
  windowSeconds: number
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

export function checkRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now()
  const windowMs = options.windowSeconds * 1000

  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs
    store.set(key, { count: 1, resetAt })
    return { allowed: true, remaining: options.limit - 1, resetAt }
  }

  if (entry.count >= options.limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { allowed: true, remaining: options.limit - entry.count, resetAt: entry.resetAt }
}

/** Clean up expired entries to prevent memory growth */
export function pruneRateLimitStore(): void {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) store.delete(key)
  }
}
