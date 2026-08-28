import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import PriceItemForm from '@/components/admin/price-item-form'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditPriceItemPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: item } = await supabase.from('price_items').select('*').eq('id', id).single()

  if (!item) notFound()

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/prices/products" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold">Edit Product</h1>
          <p className="text-sm text-muted-foreground mt-0.5 font-mono">{item.slug}</p>
        </div>
      </div>
      <PriceItemForm initialData={item as Record<string, unknown>} />
    </div>
  )
}
