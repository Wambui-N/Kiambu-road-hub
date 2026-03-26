'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const

export default function AttributionTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    try {
      const hasUtm = UTM_KEYS.some((k) => searchParams.get(k))
      const data = {
        landing_page: pathname,
        referrer: document.referrer,
        ts: new Date().toISOString(),
        ...Object.fromEntries(
          UTM_KEYS.flatMap((k) => {
            const v = searchParams.get(k)
            return v ? [[k, v]] : []
          })
        ),
      }

      // First touch — write only once per browser
      if (!localStorage.getItem('kra_first_touch')) {
        localStorage.setItem('kra_first_touch', JSON.stringify(data))
      }

      // Last touch — update whenever a UTM-bearing visit arrives
      if (hasUtm) {
        localStorage.setItem('kra_last_touch', JSON.stringify(data))
      }
    } catch {
      // Ignore — private browsing or storage quota errors
    }
  }, [pathname, searchParams])

  return null
}
