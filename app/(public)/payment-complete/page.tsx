'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { useCart } from '@/lib/hooks/use-cart'

type VerifyState = 'checking' | 'success' | 'failed'

function PaymentCompleteContent() {
  const searchParams = useSearchParams()
  const reference = searchParams.get('reference') ?? searchParams.get('trxref')
  const { clearCart } = useCart()

  const [state, setState] = useState<VerifyState>('checking')
  const [recordType, setRecordType] = useState<'store_order' | 'donation_pledge' | null>(null)

  useEffect(() => {
    if (!reference) {
      setState('failed')
      return
    }
    let cancelled = false
    fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return
        if (json.success) {
          setRecordType(json.record_type)
          setState('success')
          if (json.record_type === 'store_order') clearCart()
        } else {
          setState('failed')
        }
      })
      .catch(() => {
        if (!cancelled) setState('failed')
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference])

  return (
    <div className="min-h-screen bg-brand-surface flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl border border-border p-10 text-center max-w-md w-full"
      >
        {state === 'checking' && (
          <>
            <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
            <h2 className="font-display text-2xl font-bold mb-3">Confirming Payment...</h2>
            <p className="text-muted-foreground text-sm">Please wait while we confirm your payment with Paystack.</p>
          </>
        )}

        {state === 'success' && (
          <>
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold mb-3">Payment Successful!</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {recordType === 'donation_pledge'
                ? 'Thank you for your donation — your payment has been received.'
                : "Thank you for your order — we've received your payment and will be in touch about next steps."}
            </p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90">Back to Home</Button>
            </Link>
          </>
        )}

        {state === 'failed' && (
          <>
            <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold mb-3">We Couldn&apos;t Confirm That Payment</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              If you completed payment, don&apos;t worry — contact us with your reference and we&apos;ll sort it out.
              {reference && (
                <>
                  {' '}Reference: <span className="font-mono font-semibold">{reference}</span>
                </>
              )}
            </p>
            <Link href="/contact">
              <Button className="bg-primary hover:bg-primary/90">Contact Us</Button>
            </Link>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default function PaymentCompletePage() {
  return (
    <Suspense fallback={null}>
      <PaymentCompleteContent />
    </Suspense>
  )
}
