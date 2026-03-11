import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BusinessForm from '@/components/admin/business-form'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

async function getFormData(businessId: string) {
  const supabase = await createClient()
  const [{ data: business }, { data: categories }, { data: areas }] = await Promise.all([
    supabase.from('businesses').select('*').eq('id', businessId).single(),
    supabase.from('categories').select('id, name, slug, subcategories(id, name, slug)').order('sort_order'),
    supabase.from('areas').select('id, name, slug').order('sort_order'),
  ])
  return { business, categories: categories ?? [], areas: areas ?? [] }
}

export default async function EditBusinessPage({ params }: Props) {
  const { id } = await params
  const { business, categories, areas } = await getFormData(id)

  if (!business) notFound()

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/businesses" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold">Edit Business</h1>
          <p className="text-sm text-muted-foreground mt-0.5 font-mono">{business.slug}</p>
        </div>
      </div>

      <BusinessForm
        categories={categories}
        areas={areas}
        initialData={business as Record<string, unknown>}
      />
    </div>
  )
}
