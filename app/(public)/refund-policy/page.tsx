import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy',
  description: 'Learn about the circumstances under which payments made through Kiambu Road Explorer may be cancelled or refunded.',
  alternates: { canonical: 'https://kiamburoad.com/refund-policy' },
}

const EFFECTIVE_DATE = '01/10/2026'

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside ml-2">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold text-white">Refund &amp; Cancellation Policy</h1>
          <p className="text-white/60 text-sm mt-2 font-mono">Effective Date: {EFFECTIVE_DATE}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="lg:flex lg:gap-10">
          <div className="lg:flex-1 space-y-6">

            <section className="bg-white rounded-2xl border border-border p-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Kiambu Road Explorer is committed to providing reliable information, useful publications and advertising and
                promotional services to our customers. This Refund and Cancellation Policy explains the circumstances under
                which payments made through the Kiambu Road Explorer website may be cancelled or refunded.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                By making a payment through our website, you acknowledge and agree to this policy.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-2">1. Services Covered</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                This policy applies to payments made through the Kiambu Road Explorer website for services and products
                including, but not limited to:
              </p>
              <Bullets
                items={[
                  'Premium, Featured or other paid business listings;',
                  'Website advertising and promotional placements;',
                  'Digital publications, e-books and other downloadable products;',
                  'Events, promotional campaigns or other services offered directly by Kiambu Road Explorer; and',
                  'Any other products or services for which payment is made directly to Kiambu Road Explorer.',
                ]}
              />
              <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                Where a product or service is provided by a third party, the third party&apos;s own terms and refund policy may
                apply. Kiambu Road Explorer will make this clear before payment where reasonably possible.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-2">2. Digital Products and E-books</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Payments for digital products, including e-books and downloadable publications, are generally non-refundable
                once the product has been delivered or made available for download.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                However, a refund or replacement may be considered where:
              </p>
              <Bullets
                items={[
                  'the customer was charged but did not receive the digital product;',
                  'the file supplied is materially defective or inaccessible;',
                  'the wrong product was supplied; or',
                  'a duplicate payment was made for the same product.',
                ]}
              />
              <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                Where a technical problem prevents access to a purchased digital product, we will first make reasonable
                efforts to provide a replacement copy or otherwise resolve the problem.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-2">3. Paid Business Listings</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                A business that purchases a paid listing may request cancellation before the listing has been published or
                the agreed promotional service has commenced.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Once a listing has been published or the agreed service has commenced, payments are generally non-refundable.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                If Kiambu Road Explorer is unable to publish or provide the paid listing or promotional service for reasons
                within our control, the customer may be offered:
              </p>
              <Bullets
                items={[
                  'an alternative publication date;',
                  'an equivalent period of service; or',
                  'a full or partial refund, depending on the circumstances.',
                ]}
              />
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-2">4. Advertising and Promotional Services</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Payments for advertising, sponsored content, banners, featured placements or other promotional services may
                be cancelled before the agreed campaign or placement begins.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Once an advertising campaign or promotional placement has commenced, payments are generally non-refundable.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Where Kiambu Road Explorer is unable to deliver a paid advertising service substantially as agreed, we may,
                at our discretion, provide an alternative placement, extend the campaign period, or issue an appropriate
                partial or full refund.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-2">5. Incorrect or Duplicate Payments</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                If you believe that you have been charged incorrectly or have made a duplicate payment, please contact us
                as soon as possible.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Where our records confirm that a duplicate or erroneous payment was made, we will arrange an appropriate
                refund.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-2">6. Failed Transactions and Reversed Payments</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                A payment may appear to have been deducted from a customer&apos;s account even though the transaction has not
                been successfully completed.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Where this occurs, the customer should first allow the payment system or financial institution to complete
                its normal reversal process. If the amount is not automatically reversed within a reasonable period, the
                customer may contact us with the transaction details so that we can investigate.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-2">7. Refund Method</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Where a refund is approved, it will normally be processed through the original payment method used for the
                transaction, where technically and reasonably possible.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                The time taken for the funds to appear in the customer&apos;s account may depend on the payment provider,
                bank, mobile-money service or other financial institution involved.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Kiambu Road Explorer does not control the processing time of third-party financial institutions.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-2">8. Non-Refundable Situations</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">A refund will generally not be available where:</p>
              <Bullets
                items={[
                  'the customer has changed their mind after receiving a digital product;',
                  'a digital product has already been downloaded or made available, except where the product is defective or was supplied incorrectly;',
                  'a paid listing or advertising service has already been published or commenced;',
                  'the customer has provided incorrect information and the service has been delivered based on that information;',
                  'the customer has failed to provide information, materials or approvals required for delivery of the service; or',
                  'the customer has violated the applicable terms and conditions of the service.',
                ]}
              />
              <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                Nothing in this policy is intended to exclude any rights that a customer may have under applicable law.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-2">9. Requests for Refunds or Cancellations</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Refund or cancellation requests should be submitted through:
              </p>
              <div className="space-y-1 text-sm mb-3">
                <div>
                  <span className="font-semibold text-foreground">Email: </span>
                  <a href="mailto:info@kiamburoad.com" className="text-primary hover:underline">info@kiamburoad.com</a>
                </div>
                <div>
                  <span className="font-semibold text-foreground">Telephone/WhatsApp: </span>
                  <a href="tel:+254720950500" className="text-primary hover:underline">0720950500</a>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">Please include:</p>
              <Bullets
                items={[
                  'your name or business name;',
                  'the product or service purchased;',
                  'transaction/reference number;',
                  'date of payment; and',
                  'a brief explanation of the reason for the request.',
                ]}
              />
              <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                We will review the request and communicate our decision within a reasonable period.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-2">10. Changes to a Paid Service</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Where a customer requests a change to a paid listing, advertisement or other service after payment, we will
                make reasonable efforts to accommodate the request.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Additional charges may apply where the requested change involves substantially more work or a different
                service from the one originally purchased.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-2">11. Third-Party Services</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Kiambu Road Explorer may provide information about, refer customers to, or facilitate access to products and
                services offered by independent third parties.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Unless expressly stated otherwise, Kiambu Road Explorer is not the provider of those third-party products or
                services and is not responsible for the third party&apos;s cancellation or refund policy.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Customers should review the relevant third party&apos;s terms before making a payment.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-2">12. Fraudulent or Unauthorised Transactions</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                If you believe that a transaction was made without your authorisation, please notify us immediately and,
                where appropriate, contact your bank, mobile-money provider or payment service provider.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We may request transaction information reasonably necessary to investigate the matter.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-2">13. Policy Changes</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Kiambu Road Explorer may update this Refund and Cancellation Policy from time to time to reflect changes in
                our products, services, payment arrangements or applicable requirements.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The current version published on our website will apply to payments made after the effective date shown
                above.
              </p>
            </section>

            {/* Contact about policy */}
            <section className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
              <h2 className="font-semibold text-foreground mb-3">14. Contact Us</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                For questions concerning this policy or a refund or cancellation request, please contact:
              </p>
              <div className="space-y-2 text-sm">
                <div className="font-semibold text-foreground">Kiambu Road Explorer</div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">Email:</span>
                  <a href="mailto:info@kiamburoad.com" className="text-primary hover:underline">info@kiamburoad.com</a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">Telephone/WhatsApp:</span>
                  <a href="tel:+254720950500" className="text-primary hover:underline">0720950500</a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">Website:</span>
                  <a href="https://www.kiamburoad.com" className="text-primary hover:underline">www.kiamburoad.com</a>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pt-2">
                  We will endeavour to handle all refund and cancellation requests fairly, transparently and within a
                  reasonable period.
                </p>
              </div>
            </section>

            {/* Footer links */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h3 className="font-semibold text-sm text-muted-foreground font-mono mb-3">RELATED PAGES</h3>
              <div className="flex flex-wrap gap-3">
                <Link href="/terms" className="text-sm text-primary font-semibold hover:underline">→ Terms &amp; Conditions</Link>
                <Link href="/privacy" className="text-sm text-primary font-semibold hover:underline">→ Privacy Policy</Link>
                <Link href="/advertise" className="text-sm text-primary font-semibold hover:underline">→ Advertise With Us</Link>
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
                <li><Link href="/terms" className="text-foreground hover:text-primary">Terms &amp; Conditions</Link></li>
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
