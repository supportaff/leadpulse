import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-sm text-blue-400 mb-8">
          <Zap className="w-3.5 h-3.5" />
          AI-powered lead intelligence
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
          Catch buyers{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
            before your competitors
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          LeadPulse scans Reddit and X in real-time, finds people actively looking for what you sell, and generates AI replies you can send in one click.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/sign-up" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            Start free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/features" className="text-gray-400 hover:text-white font-medium px-6 py-3 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors">
            See how it works
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
