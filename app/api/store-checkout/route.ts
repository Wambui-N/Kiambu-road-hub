import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'
import type { StoreOrderItem } from '@/types/database'

interface CartLine {
  product_id: string
  quantity: number
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const rl = checkRateLimit(`store-checkout:${ip}`, { limit: 5, windowSeconds: 3600 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })
    }

    const body = await req.json()
    const { customer_name, email, phone, delivery_address, cart } = body as {
      customer_name?: string
      email?: string
      phone?: string
      delivery_address?: string
      cart?: CartLine[]
    }

    if (!customer_name?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: 'All required fields must be filled.' }, { status: 400 })
    }
    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 })
    }

    const supabase = await createAdminClient()

    const ids = cart.map((line) => line.product_id)
    const { data: products, error: fetchError } = await supabase
      .from('store_products')
      .select('id, name, price, product_type, status')
      .in('id', ids)

    if (fetchError) throw fetchError

    const items: StoreOrderItem[] = []
    let needsDelivery = false

    for (const line of cart) {
      const product = products?.find((p) => p.id === line.product_id)
      if (!product || product.status !== 'published') continue
      const quantity = Math.max(1, Math.floor(Number(line.quantity) || 1))
      items.push({
        product_id: product.id,
        name: product.name,
        price: Number(product.price),
        quantity,
        product_type: product.product_type,
      })
      if (product.product_type === 'merchandise') needsDelivery = true
    }

    if (items.length === 0) {
      return NextResponse.json({ error: 'None of the items in your cart are available anymore.' }, { status: 400 })
    }
    if (needsDelivery && !delivery_address?.trim()) {
      return NextResponse.json({ error: 'Delivery address is required for physical items.' }, { status: 400 })
    }

    const total_amount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const { data: order, error: insertError } = await supabase
      .from('store_orders')
      .insert({
        customer_name: customer_name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        delivery_address: delivery_address?.trim() || null,
        items,
        total_amount,
        currency: 'KES',
        status: 'pending_payment',
      })
      .select('id')
      .single()

    if (insertError) throw insertError

    try {
      const resendKey = process.env.RESEND_API_KEY
      if (resendKey) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Kiambu Road Explorer <noreply@kiamburoad.com>',
            to: email,
            subject: 'We received your order — Kiambu Road Explorer',
            html: `
              <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px">
                <h1 style="color:#1B6B3A;font-size:22px;margin-bottom:8px">Thanks, ${customer_name}!</h1>
                <p style="color:#555;font-size:15px;line-height:1.6">We've received your order (Ref: ${order.id.slice(0, 8)}) for a total of KES ${total_amount.toLocaleString()}.</p>
                <p style="color:#555;font-size:15px;line-height:1.6">We'll contact you shortly to arrange payment${needsDelivery ? ' and delivery' : ''}.</p>
              </div>
            `,
          }),
        })
      }
    } catch {
      // Email failure should not break the order
    }

    return NextResponse.json({ success: true, order_id: order.id })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
