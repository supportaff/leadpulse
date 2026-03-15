'use client';
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function SettingsPage() {
  const { user } = useUser();
  const [productDesc, setProductDesc] = useState('');
  const [saved, setSaved] = useState(false);

  const save = async () => {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_description: productDesc }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your LeadPulse account preferences</p>
      </div>

      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white">Account</h2>
        <div className="flex items-center gap-4">
          {user?.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.imageUrl} alt="Avatar" className="w-12 h-12 rounded-full" />
          )}
          <div>
            <p className="text-white font-medium">{user?.fullName}</p>
            <p className="text-gray-400 text-sm">{user?.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white">AI Personalization</h2>
        <p className="text-gray-400 text-sm">Describe your product so LeadPulse generates more personalized AI replies.</p>
        <textarea
          value={productDesc}
          onChange={e => setProductDesc(e.target.value)}
          rows={4}
          placeholder="e.g. We build a lightweight CRM designed for freelancers and small agencies. Our core differentiators are..."
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
        />
        <button onClick={save}
          className="px-5 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition">
          {saved ? '✅ Saved!' : 'Save Settings'}
        </button>
      </div>

      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white">Notifications</h2>
        <div className="space-y-3">
          {[
            { key: 'email_high_intent', label: 'Email me when a high-intent lead is detected' },
            { key: 'email_competitor', label: 'Email me on competitor mentions' },
            { key: 'email_digest', label: 'Daily digest email (every morning)' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-purple-500" />
              <span className="text-sm text-gray-300">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
