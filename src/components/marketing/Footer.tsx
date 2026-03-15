import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-white font-bold tracking-tight">LeadPulse</span>
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <Link href="/#how-it-works" className="hover:text-white transition-colors">How it works</Link>
          <Link href="/features" className="hover:text-white transition-colors">Features</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/sign-in" className="hover:text-white transition-colors">Sign in</Link>
        </div>
        <p className="text-xs text-gray-700">&copy; {new Date().getFullYear()} LeadPulse. Made in India 🇮🇳</p>
      </div>
    </footer>
  );
}

export default Footer;
