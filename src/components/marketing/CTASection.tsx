import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-blue-600/20 to-violet-600/20 border border-blue-500/20 rounded-3xl p-12">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to find your next customer?</h2>
        <p className="text-gray-400 mb-8">Join founders already using LeadPulse to turn social conversations into revenue.</p>
        <Link href="/sign-up" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
          Start free today <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

export default CTASection;
