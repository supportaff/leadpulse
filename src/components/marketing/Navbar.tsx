'use client';
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white tracking-tight">LeadPulse</Link>
        <div className="flex items-center gap-6">
          <Link href="/#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors hidden md:block">How it works</Link>
          <Link href="/features" className="text-sm text-gray-400 hover:text-white transition-colors hidden md:block">Features</Link>
          <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors hidden md:block">Pricing</Link>
          <Link href="/sign-in" className="text-sm text-gray-400 hover:text-white transition-colors">Sign in</Link>
          <Link href="/sign-in" className="bg-white hover:bg-gray-100 text-black text-sm font-semibold px-4 py-2 rounded-lg transition-colors">Get started</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
