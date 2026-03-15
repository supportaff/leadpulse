'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy credentials — change as needed
    if (email === 'admin@leadpulse.io' && password === 'leadpulse123') {
      await fetch('/api/auth/login', { method: 'POST' });
      const redirect = searchParams.get('redirect') ?? '/dashboard';
      router.push(redirect);
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Sign in to LeadPulse</h1>
          <p className="text-sm text-gray-400 mt-1">Preview mode — dummy auth enabled</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@leadpulse.io"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition text-sm">
            Sign In
          </button>
        </form>
        <p className="text-xs text-gray-600 text-center">Email: admin@leadpulse.io · Password: leadpulse123</p>
      </div>
    </div>
  );
}
