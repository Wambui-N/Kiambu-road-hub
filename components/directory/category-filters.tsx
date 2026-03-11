'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

interface CategoryFiltersProps {
  categorySlug: string
}

export default function CategoryFilters({ categorySlug }: CategoryFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/directory/${categorySlug}?${params.toString()}`)
  }, [categorySlug, router, searchParams])

  return null // Filter UI is rendered inline on the parent page
}
