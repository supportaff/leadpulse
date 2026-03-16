'use client';
import { useState } from 'react';
import { Heart, Loader2, Sparkles, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function PeriodTrackerPage() {
  const [lastPeriod, setLastPeriod] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [periodLength, setPeriodLength] = useState('5');
  const [symptoms, setSymptoms] = useState('');
  const [aiPlan, setAiPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [credits, setCredits] = useState<number | null>(null);

  const inputClass = 'w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-white/30';

  const generate = async () => {
    if (!lastPeriod) { setError('Please enter your last period date.'); return; }
    setLoading(true); setError(''); setAiPlan('');
    try {
      const res = await fetch('/api/ai/period-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lastPeriod, cycleLength, periodLength, symptoms }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(res.status === 402 ? 'Insufficient credits. Please top up.' : (data.error || 'Failed to generate.'));
        return;
      }
      setAiPlan(data.plan);
      setCredits(data.creditsRemaining);
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">🌸</span>
          <h1 className="text-2xl font-bold text-white">Period Tracker</h1>
        </div>
        <p className="text-gray-400 text-sm">Enter your cycle details — AI predicts your next period, ovulation, and gives personalised tips. <span className="text-white">₹10 (1 credit).</span></p>
      </div>

      <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 space-y-5">
        <h2 className="text-sm font-semibold text-white">Your Cycle Details</h2>
        <div>
          <label className="text-xs text-gray-500 mb-1.5 block">Last period start date</label>
          <input type="date" value={lastPeriod} onChange={e => setLastPeriod(e.target.value)} className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Average cycle length (days)</label>
            <input type="number" value={cycleLength} onChange={e => setCycleLength(e.target.value)} placeholder="28" className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Period duration (days)</label>
            <input type="number" value={periodLength} onChange={e => setPeriodLength(e.target.value)} placeholder="5" className={inputClass} />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1.5 block">Symptoms (optional)</label>
          <input value={symptoms} onChange={e => setSymptoms(e.target.value)}
            placeholder="e.g. cramps, mood swings, bloating" className={inputClass} />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          <p className="text-red-400 text-sm flex-1">{error}</p>
          {error.includes('credits') && <Link href="/billing" className="text-xs bg-white text-black font-semibold px-3 py-1.5 rounded-lg shrink-0">Top Up</Link>}
        </div>
      )}

      <button onClick={generate} disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-black font-semibold py-3.5 rounded-2xl transition disabled:opacity-50">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {loading ? 'Analysing your cycle...' : 'Get AI Period Insights — ₹10'}
      </button>

      {credits !== null && (
        <p className="text-center text-xs text-gray-600"><Wallet className="w-3 h-3 inline mr-1" />Credits remaining: {credits}</p>
      )}

      {aiPlan && (
        <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌸</span>
            <h2 className="text-sm font-semibold text-white">Your Cycle Insights</h2>
          </div>
          <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed">{aiPlan}</div>
        </div>
      )}
    </div>
  );
}
