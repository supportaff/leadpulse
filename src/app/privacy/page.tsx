import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = { title: 'Privacy Policy – LeadPulse' };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-5 py-16 sm:py-24">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-10 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-10">Last updated: March 15, 2026</p>

        <div className="space-y-10 text-gray-300 text-sm sm:text-base leading-relaxed">

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">1. Introduction</h2>
            <p>LeadPulse (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service. Please read it carefully. By using LeadPulse, you consent to the practices described in this policy.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">2. Information We Collect</h2>
            <p className="mb-3 font-medium text-white/70">Information you provide directly:</p>
            <ul className="space-y-2 list-disc list-inside text-gray-400 mb-5">
              <li>Name and email address (on sign-up)</li>
              <li>Product description (for AI personalisation)</li>
              <li>Campaign keywords and subreddit preferences</li>
              <li>Payment information (processed by PayU — we do not store card data)</li>
              <li>Communication with our support team</li>
            </ul>
            <p className="mb-3 font-medium text-white/70">Information collected automatically:</p>
            <ul className="space-y-2 list-disc list-inside text-gray-400">
              <li>Log data: IP address, browser type, pages visited, timestamps</li>
              <li>Device information: operating system, screen size, device type</li>
              <li>Usage data: features used, leads viewed, replies generated</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">3. How We Use Your Information</h2>
            <ul className="space-y-2 list-disc list-inside text-gray-400">
              <li>To provide, operate, and improve the Service</li>
              <li>To personalise AI-generated replies using your product description</li>
              <li>To process payments and manage your subscription</li>
              <li>To send email alerts for high-intent leads (if enabled)</li>
              <li>To send transactional emails (invoices, plan changes, alerts)</li>
              <li>To detect and prevent fraud or abuse</li>
              <li>To comply with legal obligations</li>
              <li>To respond to your support requests</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">4. Reddit Data</h2>
            <p>LeadPulse accesses only <strong className="text-white">publicly available</strong> Reddit posts and comments via the official Reddit API. We do not access private messages, user account details, or any non-public Reddit data. Reddit data displayed in your dashboard is cached temporarily for performance and is not sold or shared with third parties.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">5. Cookies</h2>
            <p className="mb-3">We use cookies to:</p>
            <ul className="space-y-2 list-disc list-inside text-gray-400">
              <li>Keep you logged in (session cookies)</li>
              <li>Remember your preferences</li>
              <li>Analyse usage patterns (analytics cookies)</li>
            </ul>
            <p className="mt-3">You can disable cookies in your browser settings, though this may affect some features of the Service.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">6. Data Sharing &amp; Disclosure</h2>
            <p className="mb-3">We do not sell your personal data. We may share your information with:</p>
            <ul className="space-y-2 list-disc list-inside text-gray-400">
              <li><strong className="text-white">PayU</strong> — to process payments securely</li>
              <li><strong className="text-white">AI providers (Gemini / OpenAI)</strong> — to generate intent scores and replies (only post content + your product description is shared)</li>
              <li><strong className="text-white">Email providers (Resend / SendGrid)</strong> — to deliver alerts and notifications</li>
              <li><strong className="text-white">Hosting (Vercel)</strong> — infrastructure and deployment</li>
              <li><strong className="text-white">Law enforcement</strong> — if required by law or to protect our rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">7. Data Retention</h2>
            <p>We retain your account data for as long as your account is active. Lead data is retained for up to 90 days and then automatically deleted. If you delete your account, all your data is permanently removed within 30 days. Payment records are retained for 7 years as required by Indian tax law.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">8. Data Security</h2>
            <p>We implement industry-standard security measures including HTTPS encryption, hashed passwords, and access controls. However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security and encourage you to use a strong, unique password.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">9. Your Rights</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="space-y-2 list-disc list-inside text-gray-400">
              <li><strong className="text-white">Access</strong> — request a copy of your personal data</li>
              <li><strong className="text-white">Correction</strong> — update inaccurate or incomplete data</li>
              <li><strong className="text-white">Deletion</strong> — request deletion of your account and data</li>
              <li><strong className="text-white">Portability</strong> — receive your data in a machine-readable format</li>
              <li><strong className="text-white">Opt-out</strong> — unsubscribe from marketing emails at any time</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, email us at <a href="mailto:privacy@leadpulse.in" className="text-white underline underline-offset-2 hover:text-gray-300">privacy@leadpulse.in</a></p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">10. Children&apos;s Privacy</h2>
            <p>LeadPulse is not intended for users under the age of 18. We do not knowingly collect personal information from minors. If we become aware that a minor has provided us with personal information, we will delete it immediately.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">11. International Transfers</h2>
            <p>Your data may be processed on servers located outside India (e.g. Vercel&apos;s global CDN, OpenAI&apos;s servers in the US). By using the Service, you consent to this transfer. We ensure all third-party processors maintain adequate data protection standards.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">12. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of material changes via email or an in-app banner. The &quot;Last updated&quot; date at the top reflects the latest revision. Continued use of the Service after changes constitutes your acceptance.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">13. Contact Us</h2>
            <p>If you have any questions or concerns about this Privacy Policy, please contact:</p>
            <div className="mt-3 text-gray-400">
              <p className="text-white font-medium">LeadPulse</p>
              <p>Chennai, Tamil Nadu, India</p>
              <p>Email: <a href="mailto:privacy@leadpulse.in" className="text-white underline underline-offset-2 hover:text-gray-300">privacy@leadpulse.in</a></p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
