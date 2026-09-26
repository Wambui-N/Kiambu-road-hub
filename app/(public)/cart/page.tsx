'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/hooks/use-cart'

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-surface flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <ShoppingCart className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold mb-3">Your cart is empty</h1>
          <p className="text-muted-foreground text-sm mb-8">
            Browse Explorer Merchandise or Explorer Publications to add something.
          </p>
          <Link href="/journal" className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
            ← Back to Journal
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display text-2xl font-bold mb-6">Your Cart</h1>

        <div className="bg-white rounded-2xl border border-border divide-y divide-border mb-6">
          {items.map((item) => {
            const imageUrl = item.image_path
              ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/store-media/${item.image_path}`
              : null
            return (
              <div key={item.product_id} className="flex items-center gap-4 p-4">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0 flex items-center justify-center">
                  {imageUrl ? (
                    <Image src={imageUrl} alt={item.name} fill className="object-cover" />
                  ) : (
                    <span className="text-2xl">{item.product_type === 'ebook' ? '📖' : '🛍️'}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{item.currency} {item.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-muted"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center text-sm font-mono">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-muted"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <p className="font-mono font-semibold text-sm w-24 text-right shrink-0">
                  {item.currency} {(item.price * item.quantity).toLocaleString()}
                </p>
                <button
                  type="button"
                  onClick={() => removeItem(item.product_id)}
                  className="p-1.5 rounded-md hover:bg-muted text-muted-foreground shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )
          })}
        </div>

        <div className="bg-white rounded-2xl border border-border p-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">Subtotal</p>
            <p className="font-display text-2xl font-bold">KES {subtotal.toLocaleString()}</p>
          </div>
          <Link href="/checkout">
            <Button className="bg-primary hover:bg-primary/90 h-12 px-8">Checkout →</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
