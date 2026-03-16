'use client';
import { useState } from 'react';
import { Baby, Loader2, Sparkles, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function PregnancyPlannerPage() {
  const [lmp, setLmp] = useState('');
  const [edd, setEdd] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [firstPregnancy, setFirstPregnancy] = useState('yes');
  const [concerns, setConcerns] = useState('');
  const [aiPlan, setAiPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [credits, setCredits] = useState<number | null>(null);

  const inputClass = 'w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-white/30';
  const selectClass = 'w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-white/30';

  // Auto-calc EDD from LMP
  const handleLmpChange = (val: string) => {
    setLmp(val);
    if (val) {
      const d = new Date(val);
      d.setDate(d.getDate() + 280);
      setEdd(d.toISOString().split('T')[0]);
    }
  };

  // Calc current week
  const currentWeek = lmp ? Math.floor((Date.now() - new Date(lmp).getTime()) / (7 * 24 * 60 * 60 * 1000)) : null;

  const generate = async () => {
    if (!lmp) { setError('Please enter your last menstrual period date.'); return; }
    setLoading(true); setError(''); setAiPlan('');
    try {
      const res = await fetch('/api/ai/pregnancy-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lmp, edd, name, age, firstPregnancy, concerns }),
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
          <span className="text-2xl">🤰</span>
          <h1 className="text-2xl font-bold text-white">Pregnancy Planner</h1>
        </div>
        <p className="text-gray-400 text-sm">Enter your pregnancy dates — AI gives you a week-by-week plan, doctor schedule, and daily tips. <span className="text-white">₹10 (1 credit).</span></p>
      </div>

      <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 space-y-5">
        <h2 className="text-sm font-semibold text-white">Pregnancy Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Last Menstrual Period (LMP)</label>
            <input type="date" value={lmp} onChange={e => handleLmpChange(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Expected Delivery Date (EDD)</label>
            <input type="date" value={edd} onChange={e => setEdd(e.target.value)} className={inputClass} />
          </div>
        </div>
        {currentWeek !== null && currentWeek > 0 && currentWeek <= 42 && (
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl px-4 py-3">
            <p className="text-purple-300 text-sm">🤰 You are currently <strong>Week {currentWeek}</strong> pregnant · {currentWeek <= 12 ? '1st' : currentWeek <= 27 ? '2nd' : '3rd'} Trimester</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Your name (optional)</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Priya" className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Your age</label>
            <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 28" className={inputClass} />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1.5 block">First pregnancy?</label>
          <select value={firstPregnancy} onChange={e => setFirstPregnancy(e.target.value)} className={selectClass}>
            <option value="yes">Yes — first time</option>
            <option value="no">No — had previous pregnancies</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1.5 block">Any concerns or health conditions? (optional)</label>
          <input value={concerns} onChange={e => setConcerns(e.target.value)}
            placeholder="e.g. thyroid, gestational diabetes, anxiety" className={inputClass} />
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
        {loading ? 'Building your plan...' : 'Get AI Pregnancy Plan — ₹10'}
      </button>

      {credits !== null && (
        <p className="text-center text-xs text-gray-600"><Wallet className="w-3 h-3 inline mr-1" />Credits remaining: {credits}</p>
      )}

      {aiPlan && (
        <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Baby className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-semibold text-white">Your Pregnancy Roadmap</h2>
          </div>
          <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed">{aiPlan}</div>
        </div>
      )}
    </div>
  );
}
