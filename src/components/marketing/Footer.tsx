import Link from 'next/link'
import { Zap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t bg-white py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-blue-600">
            <Zap className="h-5 w-5" />
            LeadPulse
          </Link>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/features" className="hover:text-gray-900">Features</Link>
            <Link href="/pricing" className="hover:text-gray-900">Pricing</Link>
            <Link href="/sign-in" className="hover:text-gray-900">Sign In</Link>
          </div>
          <p className="text-sm text-gray-400">© 2026 LeadPulse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
