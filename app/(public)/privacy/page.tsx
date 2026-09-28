import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how Kiambu Road Explorer collects, uses, and protects your personal information.',
  alternates: { canonical: 'https://kiamburoad.com/privacy' },
}

const EFFECTIVE_DATE = '01/10/2026'
const LAST_UPDATED = '01/10/2026'

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside ml-2">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold text-white">Privacy Policy</h1>
          <p className="text-white/60 text-sm mt-2 font-mono">
            Effective Date: {EFFECTIVE_DATE} · Last Updated: {LAST_UPDATED}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="lg:flex lg:gap-10">
          <div className="lg:flex-1 space-y-6">

            <section className="bg-white rounded-2xl border border-border p-6">
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Kiambu Road Explorer respects your privacy and is committed to protecting the personal information you
                provide when you use our website, services and community features.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                This Privacy Policy explains what personal information we collect, why we collect it, how we use and
                protect it, when it may be shared, and the rights available to you under applicable data-protection law.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Kiambu Road Explorer is a business name registered in Kenya under Business No. BN-RRSKO9LB and is owned
                by Daniel Ndungu Njaga.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-2">1. Who We Are</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Kiambu Road Explorer is a local business and community information platform providing information about
                businesses, services, places, activities and other matters of interest in and around Kiambu Road.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                For purposes of applicable data-protection law, Kiambu Road Explorer is responsible for personal
                information that it collects and determines how to use.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">Contact details:</p>
              <div className="space-y-1 text-sm">
                <div className="font-semibold text-foreground">Kiambu Road Explorer</div>
                <div className="text-muted-foreground">Director: Daniel Ndungu Njaga</div>
                <div>
                  <span className="font-semibold text-foreground">Telephone/WhatsApp: </span>
                  <a href="tel:+254720950500" className="text-primary hover:underline">0720 950 500</a>
                </div>
                <div>
                  <span className="font-semibold text-foreground">Email: </span>
                  <a href="mailto:info@kiamburoad.com" className="text-primary hover:underline">info@kiamburoad.com</a>
                </div>
                <div>
                  <span className="font-semibold text-foreground">Website: </span>
                  <a href="https://www.kiamburoad.com" className="text-primary hover:underline">www.kiamburoad.com</a>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-2">2. Information We Collect</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Depending on how you use our website, we may collect information including:
              </p>

              <h3 className="font-semibold text-sm text-foreground mb-2">Information you provide directly</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">This may include:</p>
              <Bullets
                items={[
                  'your name;',
                  'telephone number;',
                  'email address;',
                  'business or organisation name;',
                  'business or physical address;',
                  'information submitted when creating or updating a business listing;',
                  'information contained in enquiries or messages sent to us;',
                  'questions, comments, ratings, reviews or other contributions submitted through Ask Kiambu Road or other community features;',
                  'information provided when subscribing to our newsletter or other communications;',
                  'information provided when purchasing our products or services; and',
                  'other information that you voluntarily provide to us.',
                ]}
              />

              <h3 className="font-semibold text-sm text-foreground mb-2 mt-5">Technical information</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                When you visit or use our website, certain technical information may also be collected automatically,
                including:
              </p>
              <Bullets
                items={[
                  'IP address;',
                  'browser type;',
                  'device information;',
                  'pages visited;',
                  'date and time of visits;',
                  'referring website or link;',
                  'information about how you interact with our website; and',
                  'information collected through cookies and similar technologies.',
                ]}
              />
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-2">3. How We Use Your Information</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                We may use personal information for purposes including:
              </p>
              <Bullets
                items={[
                  'providing and administering the Kiambu Road Explorer website;',
                  'responding to enquiries;',
                  'creating, maintaining and updating business listings;',
                  'communicating with businesses, customers and website users;',
                  'administering Ask Kiambu Road and other community features;',
                  'processing payments and purchases;',
                  'delivering digital publications and other products or services;',
                  'sending newsletters and other communications where you have requested or permitted us to do so;',
                  'improving our website, content and services;',
                  'understanding how users interact with our website;',
                  'preventing fraud, misuse or abuse of our services;',
                  'maintaining the security of our website and systems;',
                  'complying with legal and regulatory obligations; and',
                  'protecting our legitimate business interests and legal rights.',
                ]}
              />
              <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                We will collect and use personal information only for lawful and legitimate purposes and will seek to
                limit the information collected to what is reasonably necessary for those purposes.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-2">4. Business Listings</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Kiambu Road Explorer publishes information about businesses and organisations to help users discover,
                contact and learn about them.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Business information may be provided directly by the business, obtained from publicly available
                sources, or gathered through our own research and verification activities.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">A business listing may contain information such as:</p>
              <Bullets
                items={[
                  'business name;',
                  'location;',
                  'building and office details;',
                  'telephone number;',
                  'email address;',
                  'website;',
                  'contact person;',
                  'opening hours;',
                  'photographs;',
                  'description of the business; and',
                  'information about products or services.',
                ]}
              />
              <p className="text-sm text-muted-foreground leading-relaxed mt-3 mb-3">
                Where a business provides personal information relating to an individual, such as the name or contact
                details of a business representative, that information will be used in connection with the business
                listing and related communication.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Businesses are responsible for ensuring that they have the appropriate authority to provide personal
                information relating to individuals submitted as part of their listing.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-2">5. Ask Kiambu Road and User Contributions</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Kiambu Road Explorer may provide community features such as{' '}
                <Link href="/ask-kiambu-road" className="text-primary hover:underline">Ask Kiambu Road</Link>, where
                users can submit questions, comments, ratings, reviews or other contributions.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Some contributions may be intended for public display.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Users should therefore consider carefully what personal information they include in material submitted
                for publication.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Where appropriate, a contribution may be published together with the name, username or other
                identifying information supplied by the contributor.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Users should not publish another person&apos;s personal information without appropriate authority or
                consent.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Kiambu Road Explorer may moderate, edit, decline to publish or remove user-submitted material in
                accordance with our applicable{' '}
                <Link href="/terms" className="text-primary hover:underline">Terms and Conditions</Link> and community
                rules.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-2">6. Payments</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Kiambu Road Explorer may use DPO Pay by Network International as its online payment service provider.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                When you make a payment through our website, payment-related information may be processed by the
                payment service provider to authenticate, authorise and complete the transaction.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Kiambu Road Explorer may receive transaction information necessary to administer the purchase, such as:
              </p>
              <Bullets
                items={[
                  'transaction reference;',
                  'amount paid;',
                  'date of payment;',
                  'payment status; and',
                  'information necessary to identify or reconcile the transaction.',
                ]}
              />
              <p className="text-sm text-muted-foreground leading-relaxed mt-3 mb-3">
                We do not intend to store full payment-card details on our own website or systems.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                DPO Pay by Network states that it processes payment and personal information in accordance with
                applicable data-protection requirements and maintains PCI DSS Level 1 compliance. Its published
                privacy notice also explains its processing of payment, technical and other personal information,
                including circumstances involving third-party service providers and international data transfers.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The payment service provider&apos;s own privacy notice and terms may therefore also apply to
                information processed through its payment platform.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-2">7. Cookies and Website Analytics</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">Our website may use cookies and similar technologies to:</p>
              <Bullets
                items={[
                  'enable essential website functions;',
                  'remember preferences;',
                  'improve website performance;',
                  'understand how visitors use the website;',
                  'measure website traffic; and',
                  'improve our content and services.',
                ]}
              />
              <p className="text-sm text-muted-foreground leading-relaxed mt-3 mb-3">
                Some cookies may be provided by third-party services used by Kiambu Road Explorer.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                You may control or disable cookies through your browser settings. Some website functions may not
                operate properly if certain cookies are disabled.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Where required by applicable law, we will seek appropriate consent before using non-essential cookies.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-2">8. Communications and Marketing</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                If you subscribe to the Kiambu Road Explorer newsletter or otherwise request communications from us,
                we may use your contact details to send information relating to:
              </p>
              <Bullets
                items={[
                  'Kiambu Road Explorer;',
                  'new publications;',
                  'events and activities;',
                  'local business and community information;',
                  'promotions and advertising opportunities; and',
                  'other information relevant to our subscribers.',
                ]}
              />
              <p className="text-sm text-muted-foreground leading-relaxed mt-3 mb-3">
                You may unsubscribe from marketing communications at any time by using the unsubscribe facility
                provided or by contacting us.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Unsubscribing from marketing communications will not necessarily prevent us from sending essential
                communications relating to a transaction or service you have requested.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-2">9. Sharing of Personal Information</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                We do not sell personal information to third parties.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                We may share personal information where reasonably necessary with:
              </p>
              <Bullets
                items={[
                  'payment service providers such as DPO Pay by Network;',
                  'website hosting and technology providers;',
                  'email and communication service providers;',
                  'analytics and other technical service providers;',
                  'professional advisers and service providers;',
                  'government agencies, regulators, law-enforcement bodies or courts where required or permitted by law; and',
                  'other persons where you have authorised or requested us to share the information.',
                ]}
              />
              <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                Where third parties process personal information on our behalf, we will take reasonable steps to
                ensure that appropriate confidentiality, security and data-protection measures are in place.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-2">10. Third-Party Websites and Services</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Our website may contain links to third-party websites, social-media platforms, businesses, advertisers
                and other services.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Those third parties may collect and process personal information in accordance with their own privacy
                policies.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Kiambu Road Explorer does not control the privacy practices of third-party websites and encourages
                users to review the applicable privacy policies before providing personal information to them.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-2">11. Data Security</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                We take reasonable technical and organisational measures to protect personal information against
                unauthorised access, loss, misuse, alteration or disclosure.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                However, no method of transmitting or storing information electronically can be guaranteed to be
                completely secure.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We will take reasonable steps to respond appropriately to any suspected or confirmed breach involving
                personal information.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-2">12. Retention of Personal Information</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                We retain personal information only for as long as reasonably necessary for the purposes for which it
                was collected, unless a longer period is required or permitted by law.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">The appropriate retention period may depend on:</p>
              <Bullets
                items={[
                  'the nature of the information;',
                  'the purpose for which it was collected;',
                  'our relationship with the individual or business;',
                  'legal, accounting or regulatory requirements; and',
                  'the need to establish, exercise or defend legal claims.',
                ]}
              />
              <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                When information is no longer required, we will take reasonable steps to delete, anonymise or securely
                dispose of it.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-2">13. Your Data-Protection Rights</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">Subject to applicable law, you may have the right to:</p>
              <Bullets
                items={[
                  'be informed about the processing of your personal information;',
                  'request access to personal information we hold about you;',
                  'request correction of inaccurate or incomplete information;',
                  'request deletion of personal information in circumstances permitted by law;',
                  'object to certain processing of your personal information;',
                  'request restriction of processing in circumstances permitted by law;',
                  'withdraw consent where processing is based on consent; and',
                  'exercise other rights available under applicable data-protection law.',
                ]}
              />
              <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                Some rights may be subject to legal limitations or exceptions.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-2">14. Exercising Your Rights</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                If you wish to exercise a data-protection right or ask a question about how we handle your personal
                information, contact us:
              </p>
              <div className="space-y-1 text-sm mb-3">
                <div>
                  <span className="font-semibold text-foreground">Email: </span>
                  <a href="mailto:info@kiamburoad.com" className="text-primary hover:underline">info@kiamburoad.com</a>
                </div>
                <div>
                  <span className="font-semibold text-foreground">Telephone/WhatsApp: </span>
                  <a href="tel:+254720950500" className="text-primary hover:underline">0720 950 500</a>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Please provide sufficient information for us to understand and respond to your request.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We may need to verify your identity before responding to certain requests.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-2">15. Complaints</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                If you have a concern about the way Kiambu Road Explorer has handled your personal information, please
                contact us first so that we can investigate and attempt to resolve the matter.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You may also have the right to lodge a complaint with the Office of the Data Protection Commissioner
                (ODPC) in accordance with applicable Kenyan law.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-2">16. Children&apos;s Privacy</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Kiambu Road Explorer is intended for a general audience.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                We do not knowingly seek to collect personal information from children for purposes that are not
                permitted by applicable law.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Where information relating to a child is submitted through a website feature, appropriate consent or
                authorisation should be obtained where required by law.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-2">17. International Processing and Transfers</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Some service providers used by Kiambu Road Explorer may process or store information outside Kenya.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Where personal information is transferred outside Kenya, we will take reasonable steps to ensure that
                the transfer and subsequent processing comply with applicable data-protection requirements.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                This may include information processed through payment, hosting, email, analytics or other technology
                providers.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                DPO Pay&apos;s published privacy notice, for example, states that personal information may be
                transferred, stored or processed in countries different from the country where the information was
                collected.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-foreground mb-2">18. Changes to this Privacy Policy</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                We may update this Privacy Policy from time to time to reflect changes in our services, technology,
                legal requirements or data-processing practices.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The updated policy will be published on this page with a revised &ldquo;Last Updated&rdquo; date.
              </p>
            </section>

            {/* Contact about policy */}
            <section className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
              <h2 className="font-semibold text-foreground mb-3">19. Contact Us</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                For questions, requests or concerns relating to this Privacy Policy or the handling of personal
                information, please contact:
              </p>
              <div className="space-y-2 text-sm">
                <div className="font-semibold text-foreground">Kiambu Road Explorer</div>
                <div className="text-muted-foreground">Director: Daniel Ndungu Njaga</div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">Telephone/WhatsApp:</span>
                  <a href="tel:+254720950500" className="text-primary hover:underline">0720 950 500</a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">Email:</span>
                  <a href="mailto:info@kiamburoad.com" className="text-primary hover:underline">info@kiamburoad.com</a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">Website:</span>
                  <a href="https://www.kiamburoad.com" className="text-primary hover:underline">www.kiamburoad.com</a>
                </div>
                <div className="text-muted-foreground">Business Registration No.: BN-RRSKO9LB</div>
              </div>
            </section>

            {/* Footer links */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h3 className="font-semibold text-sm text-muted-foreground font-mono mb-3">RELATED PAGES</h3>
              <div className="flex flex-wrap gap-3">
                <Link href="/travel" className="text-sm text-primary font-semibold hover:underline">→ Tours and Travel</Link>
                <Link href="/terms" className="text-sm text-primary font-semibold hover:underline">→ Terms &amp; Conditions</Link>
                <Link href="/refund-policy" className="text-sm text-primary font-semibold hover:underline">→ Refund Policy</Link>
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
                <li><Link href="/refund-policy" className="text-foreground hover:text-primary">Refund Policy</Link></li>
                <li><Link href="/contact" className="text-foreground hover:text-primary">Contact Us</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
