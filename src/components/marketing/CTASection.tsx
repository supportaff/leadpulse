import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-20 px-5">
      <div className="max-w-2xl mx-auto text-center bg-white/[0.03] border border-white/10 rounded-3xl p-12 space-y-5">
        <Sparkles className="w-8 h-8 text-white mx-auto" />
        <h2 className="text-3xl font-bold text-white">Your debt-free journey starts at ₹10</h2>
        <p className="text-gray-400 text-sm">No subscription. No lock-in. Get your first AI financial plan for the cost of a chai.</p>
        <Link href="/sign-up" className="inline-block bg-white text-black font-semibold px-8 py-3.5 rounded-2xl hover:bg-gray-100 transition text-sm">
          Get Started Free →
        </Link>
        <p className="text-gray-600 text-xs">Top up ₹99 · Get 10 credits · Each plan = ₹10</p>
      </div>
    </section>
  );
}
