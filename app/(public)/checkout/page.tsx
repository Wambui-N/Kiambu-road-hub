'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { useCart } from '@/lib/hooks/use-cart'

export default function CheckoutPage() {
  const { items, subtotal, hasMerchandise, clearCart } = useCart()
  const [form, setForm] = useState({ customer_name: '', email: '', phone: '', delivery_address: '' })
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  const set = (key: keyof typeof form, value: string) => setForm((p) => ({ ...p, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.customer_name || !form.email || !form.phone) {
      toast.error('Name, email, and phone are required.')
      return
    }
    if (hasMerchandise && !form.delivery_address) {
      toast.error('Delivery address is required for physical items.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/store-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          cart: items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Checkout failed')
      setOrderId(json.order_id)
      clearCart()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Could not place your order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (orderId) {
    return (
      <div className="min-h-screen bg-brand-surface flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl border border-border p-10 text-center max-w-md w-full"
        >
          <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-3">Order Received!</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-2">
            Order reference: <span className="font-mono font-semibold">{orderId.slice(0, 8)}</span>
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            We&apos;ll contact you shortly to arrange payment{hasMerchandise ? ' and delivery' : ''}.
          </p>
          <Link href="/journal">
            <Button className="bg-primary hover:bg-primary/90">Back to Journal</Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-surface flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="font-display text-2xl font-bold mb-3">Your cart is empty</h1>
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
        <h1 className="font-display text-2xl font-bold mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-6 space-y-5">
            <div className="space-y-1.5">
              <Label>Full Name *</Label>
              <Input value={form.customer_name} onChange={(e) => set('customer_name', e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>Email *</Label>
              <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>Phone *</Label>
              <Input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} required />
            </div>
            {hasMerchandise && (
              <div className="space-y-1.5">
                <Label>Delivery Address *</Label>
                <Input value={form.delivery_address} onChange={(e) => set('delivery_address', e.target.value)} required />
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              No online payment yet — we&apos;ll reach out to arrange payment{hasMerchandise ? ' and delivery' : ''} once your order is placed.
            </p>
            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 h-12">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {loading ? 'Placing Order...' : 'Place Order'}
            </Button>
          </form>

          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="font-display text-lg font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.product_id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                  <span className="font-mono">{item.currency} {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-border flex items-center justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-display text-xl font-bold">KES {subtotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
