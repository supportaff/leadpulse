'use client';
import { useState } from 'react';
import { Bell, User, Cpu, Save } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const [productDesc, setProductDesc] = useState('LeadPulse is a Reddit lead intelligence tool that monitors subreddits for buyer-intent posts and generates AI replies.');
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({ high_intent: true, competitor: true, digest: false });

  const name  = user?.fullName || user?.firstName || 'User';
  const email = user?.primaryEmailAddress?.emailAddress || '';
  const joined = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '';
  const initial = name.charAt(0).toUpperCase();

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const inputClass = 'w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-white/30';

  if (!isLoaded) return <div className="text-gray-500 text-sm p-6">Loading...</div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your account and preferences</p>
      </div>

      {/* Account */}
      <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <User className="w-4 h-4 text-gray-500" />
          <h2 className="text-sm font-semibold text-white">Account</h2>
        </div>
        <div className="flex items-center gap-4">
          {user?.imageUrl
            ? <img src={user.imageUrl} className="w-12 h-12 rounded-full object-cover" alt={name} />
            : <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black font-bold text-lg shrink-0">{initial}</div>
          }
          <div>
            <p className="text-white font-medium">{name}</p>
            <p className="text-gray-400 text-sm">{email}</p>
            {joined && <span className="text-xs text-gray-600">Joined {joined}</span>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Full name</label>
            <input defaultValue={name} className={inputClass} disabled />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Email</label>
            <input defaultValue={email} className={inputClass} disabled />
          </div>
        </div>
        <p className="text-xs text-gray-600">Name and email are managed via your Clerk account.</p>
      </div>

      {/* AI Personalization */}
      <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Cpu className="w-4 h-4 text-gray-500" />
          <h2 className="text-sm font-semibold text-white">AI Personalization</h2>
        </div>
        <p className="text-gray-500 text-xs">Describe your product so LeadPulse generates personalised, context-aware Reddit replies.</p>
        <textarea
          value={productDesc}
          onChange={e => setProductDesc(e.target.value)}
          rows={4}
          className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-white/30 resize-none"
        />
        <button onClick={save}
          className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black text-sm font-semibold px-5 py-2.5 rounded-xl transition">
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>

      {/* Notifications */}
      <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Bell className="w-4 h-4 text-gray-500" />
          <h2 className="text-sm font-semibold text-white">Notifications</h2>
        </div>
        <div className="space-y-3">
          {[
            { key: 'high_intent' as const, label: 'Email me when a high-intent lead is detected' },
            { key: 'competitor' as const, label: 'Email me on competitor mentions' },
            { key: 'digest' as const, label: 'Daily digest email every morning' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm text-gray-300 group-hover:text-white transition">{label}</span>
              <button
                onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))}
                className={`w-10 h-5 rounded-full transition-colors relative ${
                  notifications[key] ? 'bg-white' : 'bg-white/10'
                }`}>
                <span className={`absolute top-0.5 w-4 h-4 bg-black rounded-full transition-all ${
                  notifications[key] ? 'left-5' : 'left-0.5'
                }`} />
              </button>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white/[0.02] border border-red-500/10 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-red-400 mb-3">Danger zone</h2>
        <p className="text-xs text-gray-500 mb-4">Permanently delete your account and all data. This cannot be undone.</p>
        <button className="text-xs text-red-500 border border-red-500/30 hover:bg-red-500/10 px-4 py-2 rounded-lg transition">Delete account</button>
      </div>
    </div>
  );
}
