import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { verifyPaystackTransaction } from '@/lib/paystack'

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get('reference')
  if (!reference) {
    return NextResponse.json({ error: 'Missing reference' }, { status: 400 })
  }

  try {
    const transaction = await verifyPaystackTransaction(reference)
    const metadata = transaction.metadata

    if (!metadata?.record_type || !metadata?.record_id) {
      return NextResponse.json({ error: 'Transaction has no record metadata' }, { status: 400 })
    }

    if (transaction.status !== 'success') {
      return NextResponse.json({ success: false, record_type: metadata.record_type, status: transaction.status })
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

    return NextResponse.json({ success: true, record_type: metadata.record_type, status: 'success' })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
