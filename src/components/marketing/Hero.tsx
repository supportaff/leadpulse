import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 text-center bg-black">
      <div className="max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-white/60 mb-8">
          <Zap className="w-3.5 h-3.5" />
          AI-powered Reddit lead intelligence
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
          Find buyers on Reddit{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            before your competitors do
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          LeadPulse monitors Reddit 24/7 for people actively asking about problems you solve.
          AI scores their intent and generates a reply you can send in one click.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/sign-in" className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black font-semibold px-6 py-3 rounded-xl transition-colors">
            Get started free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="#how-it-works" className="text-gray-400 hover:text-white font-medium px-6 py-3 rounded-xl border border-white/10 hover:border-white/30 transition-colors">
            See how it works
          </Link>
        </div>
        <p className="text-xs text-gray-600 mt-6">No credit card required &middot; Reddit scanning only &middot; Cancel anytime</p>
      </div>
    </section>
  );
}

export default Hero;
