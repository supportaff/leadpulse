'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/8">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-white" />
          <span className="text-white font-bold text-lg tracking-tight">FinanceAI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <Link href="/#features" className="hover:text-white transition">Features</Link>
          <Link href="/#how" className="hover:text-white transition">How it works</Link>
          <Link href="/#pricing" className="hover:text-white transition">Pricing</Link>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Link href="/sign-in" className="text-sm text-gray-400 hover:text-white transition px-4 py-2">Sign in</Link>
          <Link href="/sign-up" className="text-sm bg-white text-black font-semibold px-4 py-2 rounded-xl hover:bg-gray-100 transition">Get Started Free</Link>
        </div>
        <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/8 bg-black px-5 py-4 space-y-3 text-sm">
          <Link href="/#features" className="block text-gray-400 hover:text-white py-1" onClick={() => setOpen(false)}>Features</Link>
          <Link href="/#how" className="block text-gray-400 hover:text-white py-1" onClick={() => setOpen(false)}>How it works</Link>
          <Link href="/#pricing" className="block text-gray-400 hover:text-white py-1" onClick={() => setOpen(false)}>Pricing</Link>
          <Link href="/sign-up" className="block bg-white text-black font-semibold text-center py-2.5 rounded-xl hover:bg-gray-100 transition" onClick={() => setOpen(false)}>Get Started Free</Link>
        </div>
      )}
    </nav>
  );
}
