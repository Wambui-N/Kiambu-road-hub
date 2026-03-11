import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms & Conditions — Kiambu Road Hub',
  description: 'Terms and conditions governing the use of the Kiambu Road Hub website and services.',
}

const LAST_UPDATED = 'March 2026'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold text-white">Terms &amp; Conditions</h1>
          <p className="text-white/60 text-sm mt-2 font-mono">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-8">

          <section>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Kiambu Road Hub (<strong>kiamburoad-hub.com</strong>), you accept and agree to be
              bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">2. Use of the Directory</h2>
            <p>
              Kiambu Road Hub provides a business directory and lifestyle journal for the Kiambu Road corridor. The
              information provided is for general guidance only. We do not guarantee the accuracy, completeness, or
              currency of business listings and are not responsible for any decisions made based on this information.
            </p>
            <p className="mt-3">
              You may use the directory for personal, non-commercial purposes. Systematic scraping, reproduction, or
              redistribution of directory data without our written consent is prohibited.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">3. Business Listings</h2>
            <p>
              Business owners are responsible for the accuracy of information they submit. Kiambu Road Hub reserves the
              right to edit, approve, or remove listings at our sole discretion. We make reasonable efforts to verify
              listings but cannot guarantee that all information is current or accurate.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">4. Intellectual Property</h2>
            <p>
              All content on Kiambu Road Hub — including text, graphics, logos, and editorial content — is owned by or
              licensed to Kiambu Road Hub and is protected by applicable intellectual property laws. Business owners
              retain ownership of their submitted images and descriptions.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">5. Limitation of Liability</h2>
            <p>
              Kiambu Road Hub shall not be liable for any direct, indirect, incidental, or consequential damages arising
              from your use of the website, reliance on directory listings, or any transactions with listed businesses.
              Your use of the site is at your sole risk.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">6. Changes to Terms</h2>
            <p>
              We reserve the right to update these terms at any time. Continued use of the website after changes
              constitutes acceptance of the updated terms. We will update the &ldquo;Last updated&rdquo; date above when
              changes are made.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">7. Contact</h2>
            <p>
              If you have questions about these terms, please{' '}
              <Link href="/contact" className="text-primary hover:underline">contact us</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
