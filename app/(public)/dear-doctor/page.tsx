import { Metadata } from 'next'
import { Stethoscope, HeartHandshake } from 'lucide-react'
import DoctorRequestForm from '@/components/dear-doctor/doctor-request-form'
import { breadcrumbJsonLd, buildCanonical } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Dear Doctor — Online Doctor & Counselling Consultations',
  description:
    'Consult a real doctor online for 1,000 KES, or a professional counsellor for 2,000 KES. Get a response within 12 hours from the comfort of your desk.',
  alternates: { canonical: buildCanonical('/dear-doctor') },
  openGraph: {
    title: 'Dear Doctor — Online Doctor & Counselling Consultations',
    description: 'Consult a real doctor or counsellor online, from the comfort of your desk.',
    url: buildCanonical('/dear-doctor'),
  },
}

export default function DearDoctorPage() {
  const jsonLd = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Dear Doctor', path: '/dear-doctor' },
  ])

  return (
    <div className="min-h-screen bg-brand-surface">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <div className="bg-primary py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-accent font-mono text-xs uppercase tracking-widest mb-2">
            Dear Doctor
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
            Consult a real doctor or counsellor online
          </h1>
          <p className="text-white/70 text-base max-w-2xl">
            Get professional medical or counselling guidance from the comfort of your desk — no appointment needed.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Dear Doctor */}
        <section id="consultation">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
              <Stethoscope className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-1.5">Dear Doctor</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Consult your online doctor for only <strong className="text-foreground">1,000 KES</strong>. For best assistance, give as many details as possible, with special focus on:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside mt-2 space-y-0.5">
                <li>History of the symptoms</li>
                <li>Any important family history</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                Our doctor will respond within <strong className="text-foreground">12 hours</strong>.
              </p>
            </div>
          </div>

          <DoctorRequestForm
            serviceType="consultation"
            salutation="Hello Doctor"
            submitLabel="Send to the Doctor"
            bodyPlaceholder="Describe how you're feeling, when it started, and anything else the doctor should know..."
          />
        </section>

        {/* Counselling Services */}
        <section id="counselling">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-1.5">Counselling Services</h2>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-mono mb-2">
                Relationships · Marriage · Work · Career · Life
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Receive professional counselling from our expert life coach at the comfort of your desk. We work with expert counsellors to get you the best advice and ideas about life and living for only{' '}
                <strong className="text-foreground">2,000 KES</strong>.
              </p>
            </div>
          </div>

          <DoctorRequestForm
            serviceType="counselling"
            salutation="Dear Counsellor"
            submitLabel="Send to the Counsellor"
            bodyPlaceholder="Please share your story here..."
          />
        </section>
      </div>
    </div>
  )
}
