import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import StoreProductForm from '@/components/admin/store-product-form'

export default function NewStoreProductPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/store-products" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold">Add Product</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Create a new merchandise or ebook product</p>
        </div>
      </div>
      <StoreProductForm />
    </div>
  )
}
