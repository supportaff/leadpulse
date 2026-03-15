'use client';
import { useState } from 'react';
import { ShieldCheck, Loader2, Sparkles, ChevronRight, Wallet } from 'lucide-react';
import Link from 'next/link';

const questions = [
  { key: 'age', label: 'Your age', placeholder: 'e.g. 32', type: 'number' },
  { key: 'dependents', label: 'Number of dependents (spouse, kids, parents)', placeholder: 'e.g. 3', type: 'number' },
  { key: 'income', label: 'Annual income (₹)', placeholder: 'e.g. 900000', type: 'number' },
  { key: 'existing', label: 'Existing insurance (if any)', placeholder: 'e.g. LIC term plan ₹50L, company health ₹5L or None', type: 'text' },
  { key: 'health', label: 'Any pre-existing health conditions?', placeholder: 'e.g. Diabetes, None', type: 'text' },
  { key: 'liabilities', label: 'Total loans / liabilities (₹)', placeholder: 'e.g. 2000000', type: 'number' },
  { key: 'goal', label: 'Primary goal', placeholder: 'e.g. Family protection, retirement, tax saving', type: 'text' },
];

export default function InsurancePlannerPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [aiPlan, setAiPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [credits, setCredits] = useState<number | null>(null);

  const inputClass = 'w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-white/30';

  const generate = async () => {
    const filled = questions.filter(q => answers[q.key]?.trim());
    if (filled.length < 4) { setError('Please answer at least 4 questions for a personalised recommendation.'); return; }
    setLoading(true); setError(''); setAiPlan('');
    try {
      const res = await fetch('/api/ai/insurance-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(res.status === 402 ? 'Insufficient credits. Please top up your wallet.' : (data.error || 'Failed to generate.'));
        return;
      }
      setAiPlan(data.plan);
      setCredits(data.creditsRemaining);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <ShieldCheck className="w-5 h-5 text-green-400" />
          <h1 className="text-2xl font-bold text-white">Insurance Planner</h1>
        </div>
        <p className="text-gray-400 text-sm">Answer a few questions — AI recommends the right insurance coverage for your life stage. <span className="text-white">Costs ₹10 (1 credit).</span></p>
      </div>

      <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 space-y-5">
        <h2 className="text-sm font-semibold text-white">Tell us about yourself</h2>
        {questions.map(q => (
          <div key={q.key}>
            <label className="text-xs text-gray-400 mb-1.5 flex items-center gap-1.5 block">
              <ChevronRight className="w-3 h-3" />{q.label}
            </label>
            <input
              type={q.type}
              value={answers[q.key] || ''}
              onChange={e => setAnswers(a => ({ ...a, [q.key]: e.target.value }))}
              placeholder={q.placeholder}
              className={inputClass}
            />
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          <p className="text-red-400 text-sm flex-1">{error}</p>
          {error.includes('credits') && (
            <Link href="/billing" className="text-xs bg-white text-black font-semibold px-3 py-1.5 rounded-lg shrink-0">Top Up</Link>
          )}
        </div>
      )}

      <button onClick={generate} disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-black font-semibold py-3.5 rounded-2xl transition disabled:opacity-50">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {loading ? 'Generating recommendations...' : 'Get AI Insurance Plan — ₹10'}
      </button>

      {credits !== null && (
        <p className="text-center text-xs text-gray-600"><Wallet className="w-3 h-3 inline mr-1" />Credits remaining: {credits}</p>
      )}

      {aiPlan && (
        <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-green-400" />
            <h2 className="text-sm font-semibold text-white">Your AI Insurance Recommendation</h2>
          </div>
          <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed">
            {aiPlan}
          </div>
        </div>
      )}
    </div>
  );
}
