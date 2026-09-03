import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Dear Doctor — Terms of Service',
  description: 'Terms of service for the Dear Doctor consultation and counselling services.',
  robots: { index: false, follow: true },
}

const TERMS = [
  'Consulting your doctor or hospital is the best approach to health care. This service is for those who are unable to physically visit a doctor for one reason or the other.',
  'In this Dear Doctor service, we work with a professionally qualified and highly experienced medical practitioner. You are guaranteed confidentiality, empathy and care.',
  'The doctor may ask further questions or request to talk to you before prescribing treatment. You can minimise this by giving as many details as possible in your original message.',
  'Service is only possible upon payment of the 1,000 KES consultation fee, or 2,000 KES for counselling services.',
  'Consultation fee is valid for two months as long as it relates to the same condition and symptoms.',
  'This is a long-term and trust-building commitment with our customers. For this, we shall always strive to give the best we can and refer our clients to other service providers when necessary.',
  'We give this service in good faith and without prejudice. However, we take no responsibility for any outcome under whatever circumstances.',
]

export default function DearDoctorTermsPage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="bg-primary py-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-xs font-mono text-white/60 mb-3 flex items-center gap-1.5">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/dear-doctor" className="hover:text-white">Dear Doctor</Link>
            <span>/</span>
            <span className="text-white">Terms of Service</span>
          </nav>
          <h1 className="font-display text-3xl font-bold text-white">Dear Doctor — Terms of Service</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl border border-border p-6 sm:p-8">
          <ol className="space-y-4 list-decimal list-outside pl-5">
            {TERMS.map((term, i) => (
              <li key={i} className="text-sm text-muted-foreground leading-relaxed">
                {term}
              </li>
            ))}
            <li className="text-sm text-muted-foreground leading-relaxed">
              Contact us for any ideas and feedback at{' '}
              <a href="mailto:info@kiamburoad.com" className="text-primary hover:underline">
                info@kiamburoad.com
              </a>
              .
            </li>
          </ol>
        </div>

        <div className="mt-8 text-center">
          <Link href="/dear-doctor" className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4">
            ← Back to Dear Doctor
          </Link>
        </div>
      </div>
    </div>
  )
}
