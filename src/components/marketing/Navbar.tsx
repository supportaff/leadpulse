'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const links = [
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white tracking-tight">LeadPulse</Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">{l.label}</Link>
          ))}
          <Link href="/sign-in" className="text-sm text-gray-400 hover:text-white transition-colors">Sign in</Link>
          <Link href="/sign-in" className="bg-white hover:bg-gray-100 text-black text-sm font-semibold px-4 py-2 rounded-lg transition-colors">Get started</Link>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(v => !v)} className="md:hidden text-gray-400 hover:text-white p-1">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-black border-t border-white/10 px-5 py-4 flex flex-col gap-4">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="text-sm text-gray-300 hover:text-white transition-colors">{l.label}</Link>
          ))}
          <Link href="/sign-in" onClick={() => setOpen(false)} className="text-sm text-gray-300 hover:text-white transition-colors">Sign in</Link>
          <Link href="/sign-in" onClick={() => setOpen(false)}
            className="bg-white text-black text-sm font-semibold px-4 py-2.5 rounded-xl text-center transition-colors hover:bg-gray-100">Get started free</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
