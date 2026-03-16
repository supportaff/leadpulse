import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-white/8 py-10 px-5">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="text-lg">🌸</span>
          <span className="text-white font-bold text-sm">MomCare</span>
          <span className="text-gray-600 text-xs ml-2">Period & Pregnancy AI Companion</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-gray-500">
          <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
          <a href="mailto:support@momcare.in" className="hover:text-white transition">Support</a>
        </div>
        <p className="text-gray-600 text-xs">© 2026 MomCare. Made with 💕 for India.</p>
      </div>
    </footer>
  );
}
