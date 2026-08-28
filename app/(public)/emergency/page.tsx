import { Metadata } from 'next'
import { Phone, AlertTriangle } from 'lucide-react'
import { EMERGENCY_CONTACTS } from '@/data/emergency-contacts'

export const metadata: Metadata = {
  title: 'Emergency Contacts',
  description: 'Critical emergency contacts for Kiambu Road and surrounding areas in Nairobi.',
}

export default function EmergencyPage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      {/* Header */}
      <div className="bg-red-600 py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <AlertTriangle className="w-10 h-10 text-white mx-auto mb-4" />
          <h1 className="font-display text-4xl font-bold text-white mb-2">Emergency Contacts</h1>
          <p className="text-white/80">
            Critical contacts for Kiambu Road and surrounding areas.
            Save these numbers in your phone now.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        {/* 999 call out */}
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
          <p className="text-red-700 font-bold text-2xl font-mono">999 / 112</p>
          <p className="text-red-600 font-semibold">National Emergency Line — Police, Fire, Ambulance</p>
          <a href="tel:999">
            <button className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors flex items-center gap-2 mx-auto">
              <Phone className="w-4 h-4" /> Call 999 Now
            </button>
          </a>
        </div>

        {EMERGENCY_CONTACTS.map((section) => (
          <div key={section.category} className="bg-white rounded-2xl border border-border overflow-hidden">
            <div
              className="px-6 py-4 flex items-center gap-2"
              style={{ backgroundColor: section.color + '15', borderBottom: `2px solid ${section.color}30` }}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: section.color }} />
              <h2 className="font-semibold text-foreground">{section.category}</h2>
            </div>
            <div className="divide-y divide-border">
              {section.contacts.map((contact) => (
                <div key={contact.name} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-sm">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">{contact.note}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-semibold">{contact.number}</span>
                    {!contact.number.includes('confirm') && (
                      <a
                        href={`tel:${contact.number.replace(/\s/g, '')}`}
                        className="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors shrink-0"
                        aria-label={`Call ${contact.name}`}
                      >
                        <Phone className="w-3.5 h-3.5 text-white" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <p className="text-xs text-center text-muted-foreground">
          Numbers marked &ldquo;To be confirmed&rdquo; will be verified and updated before launch.
          To report an incorrect number, email{' '}
          <a href="mailto:info@kiamburoad.com" className="text-primary hover:underline">
            info@kiamburoad.com
          </a>
        </p>
      </div>
    </div>
  )
}
