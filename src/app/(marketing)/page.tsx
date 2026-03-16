import { Navbar } from '@/components/marketing/Navbar';
import { Hero } from '@/components/marketing/Hero';
import { FeaturesSection } from '@/components/marketing/FeaturesSection';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { TestimonialsSection } from '@/components/marketing/TestimonialsSection';
import { CTASection } from '@/components/marketing/CTASection';
import { Footer } from '@/components/marketing/Footer';

export default function HomePage() {
  return (
    <main className="bg-black min-h-screen">
      <Navbar />
      <Hero />
      <FeaturesSection />
      <HowItWorks />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
