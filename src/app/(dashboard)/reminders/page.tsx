'use client';
import { useState } from 'react';
import { BellRing, Phone, CheckCircle2, Loader2 } from 'lucide-react';

export default function RemindersPage() {
  const [phone, setPhone] = useState('');
  const [type, setType] = useState('pregnancy');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const inputClass = 'w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-white/30';
  const selectClass = 'w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-white/30';

  const save = async () => {
    if (!phone || phone.length < 10) { setError('Please enter a valid WhatsApp number.'); return; }
    setSaving(true); setError('');
    try {
      const res = await fetch('/api/reminders/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, type }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to save.'); return; }
      setSaved(true);
    } catch { setError('Network error. Try again.'); }
    finally { setSaving(false); }
  };

  const reminderTypes = [
    { value: 'pregnancy', emoji: '🤰', label: 'Pregnancy — weekly tips + doctor visit alerts' },
    { value: 'period', emoji: '🌸', label: 'Period — next cycle + ovulation reminders' },
    { value: 'both', emoji: '💕', label: 'Both — full care package' },
  ];

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <BellRing className="w-5 h-5 text-green-400" />
          <h1 className="text-2xl font-bold text-white">WhatsApp Reminders</h1>
        </div>
        <p className="text-gray-400 text-sm">Get weekly pregnancy tips, period alerts, and doctor visit reminders directly on WhatsApp. <span className="text-white">Included with every AI plan.</span></p>
      </div>

      {saved ? (
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto" />
          <h2 className="text-white font-semibold">WhatsApp reminders activated! 🎉</h2>
          <p className="text-gray-400 text-sm">You will receive a confirmation message on +{phone} shortly.</p>
          <p className="text-gray-500 text-xs mt-2">Tip: Save our number so messages don't go to spam.</p>
        </div>
      ) : (
        <>
          <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 space-y-5">
            <h2 className="text-sm font-semibold text-white">Setup your reminders</h2>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">WhatsApp number (with country code)</label>
              <div className="flex gap-2">
                <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 text-gray-400 text-sm shrink-0"><Phone className="w-3.5 h-3.5 mr-1" />+91</div>
                <input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210" className={inputClass} type="tel" maxLength={10} />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">What reminders do you need?</label>
              <select value={type} onChange={e => setType(e.target.value)} className={selectClass}>
                {reminderTypes.map(r => (
                  <option key={r.value} value={r.value}>{r.emoji} {r.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-gray-500 font-medium">What you will receive:</p>
              {type === 'pregnancy' || type === 'both' ? (
                <ul className="space-y-1 text-xs text-gray-400">
                  <li>🤰 Weekly pregnancy milestone update</li>
                  <li>👩‍⚕️ Doctor visit reminder (1 week before)</li>
                  <li>💊 Daily supplement reminder</li>
                  <li>🍎 Weekly diet & nutrition tip</li>
                </ul>
              ) : null}
              {type === 'period' || type === 'both' ? (
                <ul className="space-y-1 text-xs text-gray-400">
                  <li>🌸 Period start reminder (3 days before)</li>
                  <li>🥚 Ovulation window alert</li>
                  <li>💆 PMS self-care tips</li>
                </ul>
              ) : null}
            </div>
          </div>

          {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}

          <button onClick={save} disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-black font-semibold py-3.5 rounded-2xl transition disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <BellRing className="w-4 h-4" />}
            {saving ? 'Activating...' : 'Activate WhatsApp Reminders — Free'}
          </button>
        </>
      )}
    </div>
  );
}
