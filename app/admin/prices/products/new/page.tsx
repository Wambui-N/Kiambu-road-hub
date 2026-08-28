import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import PriceItemForm from '@/components/admin/price-item-form'

export default function NewPriceItemPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/prices/products" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold">Add Product</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Create a new trackable price item</p>
        </div>
      </div>
      <PriceItemForm />
    </div>
  )
}
