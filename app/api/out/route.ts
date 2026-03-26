import { type NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { appendUtms } from '@/lib/utils'

const ALLOWED_PROTOCOLS = new Set(['https:', 'http:', 'tel:', 'mailto:'])

function isAllowedUrl(raw: string): boolean {
  // tel: / mailto: — valid by default
  if (raw.startsWith('tel:') || raw.startsWith('mailto:')) return true
  try {
    const u = new URL(raw)
    if (!ALLOWED_PROTOCOLS.has(u.protocol)) return false
    // Block localhost and private IP ranges
    const h = u.hostname
    if (['localhost', '127.0.0.1', '0.0.0.0', '::1'].includes(h)) return false
    if (/^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/.test(h)) return false
    return true
  } catch {
    return false
  }
}

function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip + 'kra-click').digest('hex').slice(0, 12)
}

async function logClick(data: {
  destination_url: string
  link_type: string
  surface: string
  business_id: string | null
  ad_slot_id: string | null
  business_slug: string | null
  category_slug: string | null
  page_path: string | null
  referrer: string | null
  user_agent: string | null
  ip_hash: string | null
}) {
  try {
    const supabase = await createClient()
    await supabase.from('outbound_clicks').insert(data)
  } catch {
    // Logging must never block the redirect
  }
}

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams
  const rawUrl       = sp.get('url')   ?? ''
  const linkType     = sp.get('type')  ?? 'website'
  const surface      = sp.get('surface') ?? 'unknown'
  const businessId   = sp.get('bid')   ?? null
  const adSlotId     = sp.get('sid')   ?? null
  const businessSlug = sp.get('bslug') ?? null
  const categorySlug = sp.get('cat')   ?? null
  const pagePath     = sp.get('path')  ?? null

  if (!rawUrl || !isAllowedUrl(rawUrl)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? ''

  // Fire-and-forget — do NOT await so the redirect is instant
  logClick({
    destination_url: rawUrl,
    link_type: linkType,
    surface,
    business_id: businessId,
    ad_slot_id: adSlotId,
    business_slug: businessSlug,
    category_slug: categorySlug,
    page_path: pagePath,
    referrer: request.headers.get('referer') ?? null,
    user_agent: request.headers.get('user-agent') ?? null,
    ip_hash: ip ? hashIp(ip) : null,
  })

  // Append UTMs for website click-throughs only
  let finalUrl = rawUrl
  if (linkType === 'website') {
    finalUrl = appendUtms(rawUrl, {
      utm_source: 'kiamburoadexplorer',
      utm_medium: surface.replace(/_/g, '-'),
      utm_campaign: 'directory',
      utm_content: businessSlug ?? 'listing',
    })
  }

  return NextResponse.redirect(finalUrl)
}
