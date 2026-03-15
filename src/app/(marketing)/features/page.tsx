import { Navbar } from '@/components/marketing/Navbar';
import { FeaturesSection } from '@/components/marketing/FeaturesSection';
import { CTASection } from '@/components/marketing/CTASection';
import { Footer } from '@/components/marketing/Footer';

export const metadata = { title: 'Features — LeadPulse' };

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="pt-24 pb-12 text-center">
        <h1 className="text-5xl font-extrabold text-white">Everything You Need to Convert Leads</h1>
        <p className="text-gray-400 text-lg mt-4 max-w-xl mx-auto">
          LeadPulse combines real-time social scanning, AI intent scoring, and automated reply generation — all in one platform.
        </p>
      </div>
      <FeaturesSection />
      <CTASection />
      <Footer />
    </main>
  );
}
