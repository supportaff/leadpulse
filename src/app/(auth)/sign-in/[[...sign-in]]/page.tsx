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
    // OTPless callback — called after successful auth
    window.otpless = async (otplessUser: OTPlessUser) => {
      if (otplessUser.status !== 'SUCCESS') return;

      const identity = otplessUser.identities?.[0];
      const name = identity?.name || 'User';
      const email = identity?.identityType === 'EMAIL' ? identity.identityValue : '';
      const mobile = identity?.identityType === 'MOBILE' ? identity.identityValue : '';

      // Send token + user info to our backend
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

      if (res.ok) {
        router.push('/dashboard');
      }
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-5">
      {/* OTPless SDK — loaded only on this page */}
      <Script
        id="otpless-sdk"
        src="https://otpless.com/v4/auth.js"
        data-appid={process.env.NEXT_PUBLIC_OTPLESS_APP_ID}
        strategy="afterInteractive"
      />

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-white tracking-tight">LeadPulse</Link>
          <p className="text-gray-500 text-sm mt-2">Reddit Lead Intelligence</p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8">
          <h1 className="text-xl font-bold text-white mb-1">Sign in</h1>
          <p className="text-gray-500 text-sm mb-6">Use WhatsApp, email OTP, or Google to continue.</p>

          {/* OTPless mounts the widget here */}
          <div id="otpless-login-page" />
        </div>

        <p className="text-center text-xs text-gray-700 mt-6">
          By signing in, you agree to our{' '}
          <Link href="/terms" className="text-gray-400 hover:text-white underline underline-offset-2">Terms</Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-gray-400 hover:text-white underline underline-offset-2">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
