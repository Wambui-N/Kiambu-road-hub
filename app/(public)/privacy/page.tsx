import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — Kiambu Road Hub',
  description: 'Privacy policy for Kiambu Road Hub. Learn how we collect, use, and protect your personal information.',
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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-8">

          <section>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">1. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
              <li><strong>Contact information</strong> — name, email, phone number, when you contact us or submit a listing.</li>
              <li><strong>Business submission data</strong> — business name, location, description, and contact details when you submit a listing.</li>
              <li><strong>Newsletter subscriptions</strong> — your email address when you subscribe.</li>
              <li><strong>Usage data</strong> — pages visited, search queries, and general interaction data collected anonymously for site improvement.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">2. How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
              <li>Process and display business listings in the directory.</li>
              <li>Respond to your messages and enquiries.</li>
              <li>Send newsletter updates, if you have subscribed.</li>
              <li>Improve the website and user experience.</li>
              <li>Prevent spam and maintain site security.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">3. Data Storage</h2>
            <p>
              Your data is stored securely using Supabase, a cloud database provider. We use industry-standard security
              practices including encrypted connections and restricted access controls.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">4. Data Sharing</h2>
            <p>
              We do not sell your personal information. We may share data with trusted third-party service providers
              necessary to operate the site (such as hosting and email services). Business listing information is
              publicly displayed on the directory as submitted.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">5. Cookies</h2>
            <p>
              We use minimal cookies necessary for the website to function, including session cookies for logged-in
              admin users. We may use analytics cookies to understand site usage anonymously.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">6. Your Rights</h2>
            <p>
              You may request access to, correction of, or deletion of personal data we hold about you by{' '}
              <Link href="/contact" className="text-primary hover:underline">contacting us</Link>. Newsletter
              subscribers can unsubscribe at any time using the link in any email we send.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground mb-3">7. Contact</h2>
            <p>
              If you have any questions about this privacy policy or how we handle your data, please{' '}
              <Link href="/contact" className="text-primary hover:underline">contact us</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
