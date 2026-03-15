import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-20 px-5 bg-white border-t border-gray-100">
      <div className="max-w-2xl mx-auto text-center bg-black rounded-3xl p-10 sm:p-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to find your next customer on Reddit?</h2>
        <p className="text-gray-400 mb-8 text-sm">Join founders already using LeadPulse to turn Reddit conversations into revenue. Starts at &#8377;499/month.</p>
        <Link href="/sign-in" className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-black font-semibold px-7 py-3 rounded-xl transition-colors">
          Start free today <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

export default CTASection;
