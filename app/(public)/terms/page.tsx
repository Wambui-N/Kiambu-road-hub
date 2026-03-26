import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions governing use of the Kiambu Road Explorer website and services.',
  alternates: { canonical: 'https://kiamburoad.com/terms' },
}

const LAST_UPDATED = 'March 2026'

const TERMS = [
  {
    heading: 'Acceptance of Terms',
    body: 'By accessing and using Kiambu Road Explorer (kiamburoad.com), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website.',
  },
  {
    heading: 'Use of the Directory',
    body: 'Kiambu Road Explorer provides a business directory and lifestyle journal for the Kiambu Road corridor. The information provided is for general guidance only. We do not guarantee the accuracy, completeness, or currency of business listings and are not responsible for any decisions made based on this information. You may use the directory for personal, non-commercial purposes. Systematic scraping, reproduction, or redistribution of directory data without our written consent is prohibited.',
  },
  {
    heading: 'Business Listings',
    body: 'Business owners are responsible for the accuracy of information they submit. Kiambu Road Explorer reserves the right to edit, approve, or remove listings at our sole discretion. We make reasonable efforts to verify listings but cannot guarantee that all information is current or accurate.',
  },
  {
    heading: 'Intellectual Property',
    body: 'All content on Kiambu Road Explorer — including text, graphics, logos, and editorial content — is owned by or licensed to Kiambu Road Explorer and is protected by applicable intellectual property laws. Business owners retain ownership of their submitted images and descriptions.',
  },
  {
    heading: 'Limitation of Liability',
    body: 'Kiambu Road Explorer shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the website, reliance on directory listings, or any transactions with listed businesses. Your use of the site is at your sole risk.',
  },
  {
    heading: 'Advertising',
    body: 'We reserve the right to reject any advertisement that flouts our values. The site does not guarantee any business outcome from advertising and takes no responsibility for advertiser claims. Advertising rates are subject to change with prior notice.',
  },
  {
    heading: 'User Submissions',
    body: 'By submitting a business listing, review, price entry, job posting, or any other content, you grant Kiambu Road Explorer a non-exclusive licence to display that content on the platform. We reserve the right to moderate, edit, or remove any submission.',
  },
  {
    heading: 'Privacy',
    body: 'Your use of the site is also governed by our Privacy Policy. Please review it to understand our practices.',
  },
  {
    heading: 'Links to Third-Party Sites',
    body: 'The site may contain links to third-party websites. Kiambu Road Explorer is not responsible for the content, privacy policies, or practices of any third-party sites.',
  },
  {
    heading: 'Community Reviews',
    body: 'Reviews submitted by users are moderated before publication. Kiambu Road Explorer does not endorse any user review and is not responsible for the opinions expressed therein.',
  },
  {
    heading: 'Job Listings',
    body: 'Job listings on our Jobs Board are provided by third parties. Kiambu Road Explorer does not guarantee the availability of any position, the accuracy of job descriptions, or the behaviour of hiring organisations.',
  },
  {
    heading: 'Travel & Bookings',
    body: 'Travel inquiry submissions are handled by our affiliate travel partners. Kiambu Road Explorer acts as an intermediary only and is not a licensed travel agent. Any travel arrangements made through the site are subject to the terms of the relevant service provider.',
  },
  {
    heading: 'Changes to Terms',
    body: 'We reserve the right to update these terms at any time. Continued use of the website after changes constitutes acceptance of the updated terms.',
  },
  {
    heading: 'Governing Law',
    body: 'These terms are governed by and construed in accordance with the laws of the Republic of Kenya.',
  },
]

const DISCLAIMER =
  'Kiambu Road Explorer provides this website and all its content on an "as-is" basis without warranty of any kind, express or implied. While we strive to keep information accurate and up-to-date, we make no representations or warranties of any kind about the completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related graphics contained on the website. All business listings, prices, and contact details should be independently verified before relying on them.'

const FOOTER_LINKS = [
  { label: 'Tours and Travel', href: '/travel' },
  { label: 'Consult a Doctor', href: '/journal/dear-doctor' },
  { label: 'Contact Us', href: '/contact' },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold text-white">Terms &amp; Conditions</h1>
          <p className="text-white/60 text-sm mt-2 font-mono">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="lg:flex lg:gap-10">
          <div className="lg:flex-1 space-y-6">
            {TERMS.map((term, i) => (
              <section key={i} className="bg-white rounded-2xl border border-border p-6">
                <h2 className="font-semibold text-foreground mb-2">
                  {i + 1}. {term.heading}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{term.body}</p>
              </section>
            ))}

            {/* Disclaimer */}
            <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <h2 className="font-semibold text-amber-900 mb-2">Disclaimer</h2>
              <p className="text-sm text-amber-800 leading-relaxed">{DISCLAIMER}</p>
            </section>

            {/* Footer links */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h3 className="font-semibold text-sm text-muted-foreground font-mono mb-3">RELATED PAGES</h3>
              <div className="flex flex-wrap gap-3">
                {FOOTER_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-primary font-semibold hover:underline"
                  >
                    → {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Quick links sidebar */}
          <div className="lg:w-56 mt-8 lg:mt-0">
            <div className="bg-white rounded-2xl border border-border p-5 lg:sticky lg:top-24">
              <h3 className="font-semibold text-xs font-mono text-muted-foreground uppercase mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-foreground hover:text-primary">Home</Link></li>
                <li><Link href="/directory" className="text-foreground hover:text-primary">Directory</Link></li>
                <li><Link href="/privacy" className="text-foreground hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="/contact" className="text-foreground hover:text-primary">Contact Us</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
