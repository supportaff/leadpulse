import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-gray-800 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-white font-bold">LeadPulse</span>
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <Link href="/features" className="hover:text-white transition-colors">Features</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/sign-in" className="hover:text-white transition-colors">Sign in</Link>
        </div>
        <p className="text-xs text-gray-600">&copy; {new Date().getFullYear()} LeadPulse. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
