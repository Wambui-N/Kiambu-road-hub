import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how Kiambu Road Hub collects, uses, and protects your personal information.',
  alternates: { canonical: 'https://kiamburoad-hub.com/privacy' },
}

const LAST_UPDATED = 'March 2026'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold text-white">Privacy Policy</h1>
          <p className="text-white/60 text-sm mt-2 font-mono">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="lg:flex lg:gap-10">
          <div className="lg:flex-1 space-y-6">

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-3">Introduction</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Kiambu Road Hub (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is committed to protecting and respecting your privacy.
                This policy explains how we collect, use, and safeguard your personal information when you use our website at
                kiamburoad-hub.com. By using our site you agree to the terms of this policy.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-3">Our Privacy Principles</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[
                  'We collect only the personal data we need.',
                  'We will not sell or share your personal data with third parties for marketing.',
                  'We keep your data secure and restrict access appropriately.',
                  'You may request access to, correction of, or deletion of your data at any time.',
                ].map((p, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-primary font-bold shrink-0">✓</span> {p}
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-3">Information We Collect</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">We may collect the following types of information:</p>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside ml-2">
                <li><strong>Contact information</strong> — name, email, phone number when you contact us or submit a listing.</li>
                <li><strong>Business submission data</strong> — business name, location, description, and contact details when you submit a listing via our <Link href="/list-your-business" className="text-primary hover:underline">List Your Business</Link> form.</li>
                <li><strong>Newsletter subscription</strong> — your email address when you subscribe.</li>
                <li><strong>Reviews and comments</strong> — your name and feedback when you submit a review or comment.</li>
                <li><strong>Travel inquiries</strong> — name, contact, and travel details submitted via our <Link href="/travel" className="text-primary hover:underline">travel booking form</Link>.</li>
                <li><strong>Usage data</strong> — pages visited, search queries, and general interaction data collected anonymously for site improvement.</li>
              </ul>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-3">Use of Personal Information</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">We use collected information to:</p>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside ml-2">
                <li>Process and display business listings in the <Link href="/directory" className="text-primary hover:underline">directory</Link>.</li>
                <li>Respond to your messages and enquiries.</li>
                <li>Send newsletter updates if you have subscribed.</li>
                <li>Improve the website and user experience.</li>
                <li>Moderate and approve community reviews and comments.</li>
                <li>Prevent spam and maintain site security.</li>
              </ul>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-3">Third-Party Websites</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our site may contain links to third-party websites. We are not responsible for the privacy practices
                or content of those sites. We encourage you to review their privacy policies before submitting any personal data.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-3">Marketing Communications</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If you subscribe to our newsletter, we will send you periodic updates about local businesses, events, and content.
                You may unsubscribe at any time using the unsubscribe link in any email we send, or by contacting us directly.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-3">Information Safety</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your data is stored securely using Supabase, a cloud database provider with industry-standard encryption
                and access controls. We restrict access to your personal data to authorised staff only.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-3">Information from Minors</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our site is not directed at children under the age of 13. We do not knowingly collect personal
                information from minors. If you believe we have inadvertently collected such information, please contact us immediately.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-3">Your Privacy Rights</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You may request access to, correction of, or deletion of personal data we hold about you by
                contacting us at the details below. Newsletter subscribers can unsubscribe at any time.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-3">Modifications / Amendments</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We may update this policy from time to time. Changes will be posted on this page with an updated &ldquo;Last updated&rdquo; date.
                Continued use of the site after any changes constitutes your acceptance of the revised policy.
              </p>
            </section>

            {/* Contact about policy */}
            <section className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
              <h2 className="font-semibold text-foreground mb-3">Contact Us About This Policy</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                If you have questions or concerns about this privacy policy or how we handle your data, please contact us:
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">Phone:</span>
                  <a href="tel:+254720950500" className="text-primary hover:underline">0720-950-500</a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">Email:</span>
                  <a href="mailto:info@kiambu-road.com" className="text-primary hover:underline">info@kiambu-road.com</a>
                </div>
                <div className="flex items-center gap-2 mt-3 bg-green-50 border border-green-200 rounded-lg p-2.5">
                  <span className="text-xs font-mono text-green-700 font-semibold">
                    ✓ Emails will always be responded to within 4 hours
                  </span>
                </div>
              </div>
            </section>

            {/* Footer links */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h3 className="font-semibold text-sm text-muted-foreground font-mono mb-3">RELATED PAGES</h3>
              <div className="flex flex-wrap gap-3">
                <Link href="/travel" className="text-sm text-primary font-semibold hover:underline">→ Tours and Travel</Link>
                <Link href="/journal/dear-doctor" className="text-sm text-primary font-semibold hover:underline">→ Consult a Doctor</Link>
                <Link href="/terms" className="text-sm text-primary font-semibold hover:underline">→ Terms &amp; Conditions</Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-56 mt-8 lg:mt-0">
            <div className="bg-white rounded-2xl border border-border p-5 lg:sticky lg:top-24">
              <h3 className="font-semibold text-xs font-mono text-muted-foreground uppercase mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-foreground hover:text-primary">Home</Link></li>
                <li><Link href="/directory" className="text-foreground hover:text-primary">Directory</Link></li>
                <li><Link href="/journal" className="text-foreground hover:text-primary">Journal</Link></li>
                <li><Link href="/terms" className="text-foreground hover:text-primary">Terms &amp; Conditions</Link></li>
                <li><Link href="/contact" className="text-foreground hover:text-primary">Contact Us</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
