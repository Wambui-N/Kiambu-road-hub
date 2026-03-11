import { CATEGORIES, AREAS } from '@/data/seed/categories'

export const CATEGORY_OPTIONS = [
  { label: 'All Categories', value: '' },
  ...CATEGORIES.map((c) => ({ label: c.name, value: c.slug })),
] as const

export const AREA_OPTIONS = [
  { label: 'All Areas', value: '' },
  ...AREAS.map((a) => ({ label: a.name, value: a.slug })),
] as const
