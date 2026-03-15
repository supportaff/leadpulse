import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = { title: 'Terms & Conditions – LeadPulse' };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-5 py-16 sm:py-24">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-10 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Terms &amp; Conditions</h1>
        <p className="text-gray-500 text-sm mb-10">Last updated: March 15, 2026</p>

        <div className="space-y-10 text-gray-300 text-sm sm:text-base leading-relaxed">

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using LeadPulse (&quot;the Service&quot;), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the Service. These terms apply to all visitors, users, and others who access or use the Service.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">2. Description of Service</h2>
            <p>LeadPulse is a Reddit lead intelligence platform that monitors public Reddit posts and comments for buyer-intent signals matching your defined keywords. The Service provides AI-generated intent scoring, lead summaries, and draft replies to help users engage with potential customers. LeadPulse only accesses publicly available Reddit content via the official Reddit API.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">3. User Accounts</h2>
            <ul className="space-y-2 list-disc list-inside text-gray-400">
              <li>You must provide accurate and complete information when creating an account.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You must notify us immediately of any unauthorised use of your account.</li>
              <li>One account per user. Creating multiple accounts to circumvent plan limits is prohibited.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">4. Acceptable Use</h2>
            <p className="mb-3">You agree not to use LeadPulse to:</p>
            <ul className="space-y-2 list-disc list-inside text-gray-400">
              <li>Send spam, unsolicited messages, or harass Reddit users</li>
              <li>Violate Reddit&apos;s Terms of Service or community guidelines</li>
              <li>Scrape, resell, or redistribute lead data to third parties</li>
              <li>Reverse engineer or attempt to extract the underlying AI models</li>
              <li>Use the Service for any unlawful purpose or in violation of any regulations</li>
              <li>Impersonate any person or entity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">5. Subscription &amp; Billing</h2>
            <ul className="space-y-2 list-disc list-inside text-gray-400">
              <li>Subscriptions are billed monthly in advance in Indian Rupees (INR).</li>
              <li>Plans auto-renew unless cancelled before the renewal date.</li>
              <li>Payments are processed securely via PayU. GST is applicable as per Indian tax regulations.</li>
              <li>No refunds are provided for partial months. You may cancel at any time and retain access until the end of the billing period.</li>
              <li>We reserve the right to change pricing with 30 days&apos; notice.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">6. Plan Limits</h2>
            <p>Each plan has defined limits on campaigns, leads per month, and AI replies per month. Exceeding plan limits will result in features being paused until the next billing cycle or until you upgrade your plan. Unused limits do not roll over to the next month.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">7. Intellectual Property</h2>
            <p>LeadPulse and its original content, features, and functionality are and will remain the exclusive property of LeadPulse and its operators. The Service is protected by copyright, trademark, and other laws. You may not copy, modify, distribute, sell, or lease any part of the Service without written permission.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">8. Third-Party Services</h2>
            <p>LeadPulse integrates with Reddit API, AI providers, and PayU. Your use of these integrations is also subject to their respective terms of service. We are not responsible for the availability, accuracy, or actions of third-party services.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">9. Disclaimer of Warranties</h2>
            <p>The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind. We do not guarantee that the Service will be uninterrupted, error-free, or that leads generated will result in sales. AI-generated replies are suggestions only — you are responsible for reviewing them before use.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">10. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, LeadPulse shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service. Our total liability shall not exceed the amount you paid in the last 3 months.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">11. Termination</h2>
            <p>We reserve the right to suspend or terminate your account at any time if you violate these Terms. You may terminate your account at any time by contacting us. Upon termination, your data will be deleted within 30 days.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">12. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Chennai, Tamil Nadu, India.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">13. Changes to Terms</h2>
            <p>We may update these Terms at any time. We will notify you of significant changes via email or an in-app notice. Continued use of the Service after changes constitutes acceptance of the new Terms.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">14. Contact</h2>
            <p>For any questions about these Terms, please contact us at <a href="mailto:support@leadpulse.in" className="text-white underline underline-offset-2 hover:text-gray-300">support@leadpulse.in</a></p>
          </section>

        </div>
      </div>
    </div>
  );
}
