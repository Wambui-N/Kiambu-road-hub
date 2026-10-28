import { createHmac, timingSafeEqual } from 'crypto'

const PAYSTACK_BASE_URL = 'https://api.paystack.co'

export type PaymentRecordType = 'store_order' | 'donation_pledge'

export interface PaystackMetadata {
  record_type: PaymentRecordType
  record_id: string
}

interface InitializeTransactionParams {
  email: string
  amountKes: number
  reference: string
  callbackUrl: string
  metadata: PaystackMetadata
}

interface InitializeTransactionResult {
  authorization_url: string
  access_code: string
  reference: string
}

interface VerifyTransactionResult {
  status: 'success' | 'failed' | 'abandoned' | string
  reference: string
  amount: number
  currency: string
  metadata: PaystackMetadata | null
}

/** Whether a PAYSTACK_SECRET_KEY is configured — payment routes fall back to
 * today's "pending, we'll contact you" behaviour when this is false, so the
 * site keeps working exactly as before until real keys are added. */
export function isPaystackConfigured(): boolean {
  return Boolean(process.env.PAYSTACK_SECRET_KEY)
}

function getSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY
  if (!key) throw new Error('PAYSTACK_SECRET_KEY is not set')
  return key
}

export async function initializePaystackTransaction({
  email,
  amountKes,
  reference,
  callbackUrl,
  metadata,
}: InitializeTransactionParams): Promise<InitializeTransactionResult> {
  const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount: Math.round(amountKes * 100), // Paystack takes the smallest currency unit
      currency: 'KES',
      reference,
      callback_url: callbackUrl,
      channels: ['card', 'mobile_money'],
      metadata,
    }),
  })

  const json = await res.json()
  if (!res.ok || !json.status) {
    throw new Error(json.message ?? 'Failed to initialize Paystack transaction')
  }

  return {
    authorization_url: json.data.authorization_url,
    access_code: json.data.access_code,
    reference: json.data.reference,
  }
}

export async function verifyPaystackTransaction(reference: string): Promise<VerifyTransactionResult> {
  const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${getSecretKey()}` },
  })

  const json = await res.json()
  if (!res.ok || !json.status) {
    throw new Error(json.message ?? 'Failed to verify Paystack transaction')
  }

  return {
    status: json.data.status,
    reference: json.data.reference,
    amount: json.data.amount,
    currency: json.data.currency,
    metadata: json.data.metadata ?? null,
  }
}

/** Verifies the `x-paystack-signature` header against the raw request body.
 * Must be called with the raw (un-parsed) body — Paystack signs the exact
 * bytes it sent. */
export function verifyPaystackWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
  if (!signatureHeader) return false
  const expected = createHmac('sha512', getSecretKey()).update(rawBody).digest('hex')
  const expectedBuf = Buffer.from(expected, 'utf8')
  const actualBuf = Buffer.from(signatureHeader, 'utf8')
  if (expectedBuf.length !== actualBuf.length) return false
  return timingSafeEqual(expectedBuf, actualBuf)
}
