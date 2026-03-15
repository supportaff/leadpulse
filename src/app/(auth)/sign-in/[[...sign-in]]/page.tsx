'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';

declare global {
  interface Window {
    otpless: (otplessUser: OTPlessUser) => void;
  }
}

interface OTPlessUser {
  status: string;
  token: string;
  userId: string;
  timestamp: string;
  identities: {
    identityType: string;
    identityValue: string;
    channel: string;
    methods: string[];
    name?: string;
    verified: boolean;
  }[];
  idToken?: string;
}

export default function SignInPage() {
  const router = useRouter();

  useEffect(() => {
    window.otpless = async (otplessUser: OTPlessUser) => {
      console.log('OTPless callback received:', otplessUser);

      if (otplessUser.status !== 'SUCCESS') {
        console.warn('OTPless status not SUCCESS:', otplessUser.status);
        return;
      }

      const identity = otplessUser.identities?.[0];
      const name = identity?.name || 'User';
      const email = identity?.identityType === 'EMAIL' ? identity.identityValue : '';
      const mobile = identity?.identityType === 'MOBILE' ? identity.identityValue : '';

      try {
        const res = await fetch('/api/auth/otpless', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: otplessUser.token,
            userId: otplessUser.userId,
            name,
            email,
            mobile,
          }),
        });

        const data = await res.json();
        console.log('Auth API response:', res.status, data);

        if (res.ok && data.success) {
          // Small delay to ensure cookie is set before navigation
          await new Promise(r => setTimeout(r, 100));
          router.push('/dashboard');
        } else {
          console.error('Auth failed:', data);
          alert('Sign in failed. Please try again.');
        }
      } catch (err) {
        console.error('Auth fetch error:', err);
        alert('Network error. Please check your connection.');
      }
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-5">
      <Script
        id="otpless-sdk"
        src="https://otpless.com/v4/auth.js"
        data-appid={process.env.NEXT_PUBLIC_OTPLESS_APP_ID}
        strategy="afterInteractive"
      />

      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Link href="/" className="text-2xl font-bold text-white tracking-tight">LeadPulse</Link>
          <p className="text-gray-500 text-sm mt-2">Reddit Lead Intelligence</p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 space-y-6">
          <div>
            <h1 className="text-xl font-bold text-white">Welcome back</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to access your dashboard</p>
          </div>

          <ul className="space-y-2">
            {[
              '📡 Real-time Reddit lead scanning',
              '🤖 AI intent scoring & reply drafts',
              '🔔 Instant high-intent alerts',
            ].map(f => (
              <li key={f} className="text-xs text-gray-500">{f}</li>
            ))}
          </ul>

          {/* OTPless SIDE_CURTAIN trigger */}
          <div id="otpless" data-type="SIDE_CURTAIN">
            <button className="w-full bg-white hover:bg-gray-100 text-black font-semibold text-sm py-3 rounded-xl transition-colors">
              Sign in to LeadPulse
            </button>
          </div>

          <p className="text-center text-xs text-gray-700">
            No password needed &middot; WhatsApp, Email OTP, or Google
          </p>
        </div>

        <p className="text-center text-xs text-gray-700 mt-6">
          By signing in you agree to our{' '}
          <Link href="/terms" className="text-gray-500 hover:text-white underline underline-offset-2">Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-gray-500 hover:text-white underline underline-offset-2">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
