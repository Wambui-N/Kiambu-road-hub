import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { verifyPaystackWebhookSignature, type PaystackMetadata } from '@/lib/paystack'

/**
 * Server-to-server webhook from Paystack — the authoritative source of truth
 * for payment status, since it fires even if the customer closes the tab
 * before the /payment-complete redirect completes. Signature verification is
 * the gate here, not IP rate-limiting (Paystack's callback IPs aren't
 * end-user traffic).
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-paystack-signature')

  if (!verifyPaystackWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  let event: { event: string; data: { reference: string; status: string; metadata: PaystackMetadata | null } }
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  if (event.event !== 'charge.success') {
    return NextResponse.json({ received: true })
  }

  const { reference, metadata } = event.data
  if (!metadata?.record_type || !metadata?.record_id) {
    return NextResponse.json({ received: true })
  }

  const supabase = await createAdminClient()

  if (metadata.record_type === 'store_order') {
    await supabase
      .from('store_orders')
      .update({ status: 'paid', paid_at: new Date().toISOString(), payment_reference: reference })
      .eq('id', metadata.record_id)
      .neq('status', 'paid')
  } else if (metadata.record_type === 'donation_pledge') {
    await supabase
      .from('donation_pledges')
      .update({ status: 'received', paid_at: new Date().toISOString(), payment_reference: reference })
      .eq('id', metadata.record_id)
      .neq('status', 'received')
  }

  return NextResponse.json({ received: true })
}
