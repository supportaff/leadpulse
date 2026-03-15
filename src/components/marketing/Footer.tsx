import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-10 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <span className="text-white font-bold tracking-tight text-lg">LeadPulse</span>
            <p className="text-gray-600 text-xs mt-1">Reddit Lead Intelligence &middot; Made in India &#127470;&#127475;</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Product</p>
              <div className="flex flex-col gap-2">
                <Link href="/#how-it-works" className="text-gray-400 hover:text-white transition-colors">How it works</Link>
                <Link href="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link>
                <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link>
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Account</p>
              <div className="flex flex-col gap-2">
                <Link href="/sign-in" className="text-gray-400 hover:text-white transition-colors">Sign in</Link>
                <Link href="/sign-in" className="text-gray-400 hover:text-white transition-colors">Get started</Link>
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Legal</p>
              <div className="flex flex-col gap-2">
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms &amp; Conditions</Link>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-700">&copy; {new Date().getFullYear()} LeadPulse. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-gray-700">
            <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
            <a href="mailto:support@leadpulse.in" className="hover:text-gray-400 transition-colors">support@leadpulse.in</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
