import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('254')) return `+${cleaned}`
  if (cleaned.startsWith('0')) return `+254${cleaned.slice(1)}`
  return `+254${cleaned}`
}

export function getWhatsAppUrl(number: string, message?: string): string {
  const cleaned = number.replace(/\D/g, '')
  const normalized = cleaned.startsWith('254') ? cleaned : `254${cleaned.replace(/^0/, '')}`
  const text = message ?? "Hi, I found your business on Kiambu Road Hub. I'd like to inquire about your services."
  return `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`
}

export function getPriceRangeLabel(range: string | null): string {
  switch (range) {
    case '$': return 'Under KES 500'
    case '$$': return 'KES 500–1,500'
    case '$$$': return 'KES 1,500–3,500'
    case '$$$$': return 'Above KES 3,500'
    default: return 'Price not listed'
  }
}

export function renderStars(rating: number | null): string {
  if (!rating) return ''
  return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating))
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Intl.DateTimeFormat('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr))
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}

export function getImageUrl(path: string | null | undefined, bucket = 'business-media'): string {
  if (!path) return '/placeholder-business.svg'
  if (path.startsWith('http')) return path
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) return '/placeholder-business.svg'
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
}
