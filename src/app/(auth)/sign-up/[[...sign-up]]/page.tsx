'use client';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-6 text-center">
        <h1 className="text-2xl font-bold text-white">Sign Up</h1>
        <p className="text-gray-400 text-sm">Registration is currently in preview mode.</p>
        <p className="text-gray-400 text-sm">Use the demo account to explore LeadPulse.</p>
        <Link href="/sign-in"
          className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition text-sm">
          Go to Sign In
        </Link>
      </div>
    </div>
  );
}
