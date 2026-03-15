import { Navbar } from '@/components/marketing/Navbar';
import { PricingSection } from '@/components/marketing/PricingSection';
import { CTASection } from '@/components/marketing/CTASection';
import { Footer } from '@/components/marketing/Footer';

export const metadata = { title: 'Pricing — LeadPulse' };

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="pt-24 pb-12 text-center">
        <h1 className="text-5xl font-extrabold text-white">Simple, Transparent Pricing</h1>
        <p className="text-gray-400 text-lg mt-4 max-w-xl mx-auto">
          Start free. Upgrade when you&apos;re ready to scale your lead generation.
        </p>
      </div>
      <PricingSection />
      <CTASection />
      <Footer />
    </main>
  );
}
