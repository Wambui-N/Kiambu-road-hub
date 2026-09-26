'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ShoppingCart, CheckCircle2 } from 'lucide-react'
import { useCart } from '@/lib/hooks/use-cart'
import type { StoreProduct } from '@/types/database'

export default function StoreProductDetail({ product, sectionColor }: { product: StoreProduct; sectionColor: string }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const isEbook = product.product_type === 'ebook'

  const imageUrl = product.image_path
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/store-media/${product.image_path}`
    : null

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      name: product.name,
      price: Number(product.price),
      currency: product.currency,
      product_type: product.product_type,
      image_path: product.image_path,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="relative h-72 bg-muted flex items-center justify-center">
          {imageUrl ? (
            <Image src={imageUrl} alt={product.name} fill className="object-cover" />
          ) : (
            <span className="text-6xl">{isEbook ? '📖' : '🛍️'}</span>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
        <h1 className="font-display text-2xl font-bold">{product.name}</h1>
        <p className="font-mono font-bold text-xl" style={{ color: sectionColor }}>
          {product.currency} {Number(product.price).toLocaleString()}
        </p>
        {product.description && (
          <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line">{product.description}</p>
        )}

        <Button onClick={handleAddToCart} className="w-full bg-primary hover:bg-primary/90 h-12">
          {added ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <ShoppingCart className="w-4 h-4 mr-2" />}
          {added ? 'Added to Cart' : 'Add to Cart'}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          <Link href="/cart" className="font-semibold hover:underline" style={{ color: sectionColor }}>
            View Cart →
          </Link>
        </p>

        {isEbook && (
          <p className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
            Digital delivery — you&apos;ll receive a download link by email once your order is confirmed.
          </p>
        )}
      </div>
    </div>
  )
}
