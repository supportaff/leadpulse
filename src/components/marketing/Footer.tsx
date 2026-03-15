import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-10 px-5">
      <div className="max-w-6xl mx-auto flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="text-white font-bold tracking-tight text-lg">LeadPulse</span>
          <p className="text-gray-600 text-xs mt-1">Reddit Lead Intelligence · Made in India 🇮🇳</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
          <Link href="/#how-it-works" className="hover:text-white transition-colors">How it works</Link>
          <Link href="/features" className="hover:text-white transition-colors">Features</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/sign-in" className="hover:text-white transition-colors">Sign in</Link>
        </div>
        <p className="text-xs text-gray-700">&copy; {new Date().getFullYear()} LeadPulse. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
