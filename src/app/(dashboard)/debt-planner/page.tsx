'use client';
import { useState } from 'react';
import { TrendingDown, Plus, Trash2, Loader2, Sparkles, Wallet } from 'lucide-react';
import Link from 'next/link';

interface Loan {
  id: string;
  name: string;
  balance: string;
  emi: string;
  rate: string;
  tenure: string;
}

const emptyLoan = (): Loan => ({ id: Date.now().toString(), name: '', balance: '', emi: '', rate: '', tenure: '' });

export default function DebtPlannerPage() {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [loans, setLoans] = useState<Loan[]>([emptyLoan()]);
  const [aiPlan, setAiPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [credits, setCredits] = useState<number | null>(null);

  const addLoan = () => setLoans(l => [...l, emptyLoan()]);
  const removeLoan = (id: string) => setLoans(l => l.filter(x => x.id !== id));
  const updateLoan = (id: string, field: keyof Loan, val: string) =>
    setLoans(l => l.map(x => x.id === id ? { ...x, [field]: val } : x));

  const inputClass = 'w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-white/30';

  const generate = async () => {
    if (!income || !expenses || loans.some(l => !l.name || !l.balance)) {
      setError('Please fill in income, expenses and at least one loan.');
      return;
    }
    setLoading(true); setError(''); setAiPlan('');
    try {
      const res = await fetch('/api/ai/debt-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ income, expenses, loans }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 402) {
          setError('Insufficient credits. Please top up your wallet.');
        } else {
          setError(data.error || 'Failed to generate plan.');
        }
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
          <TrendingDown className="w-5 h-5 text-blue-400" />
          <h1 className="text-2xl font-bold text-white">Debt Repayment Planner</h1>
        </div>
        <p className="text-gray-400 text-sm">Enter your financial details — AI will generate a personalised debt-free roadmap. <span className="text-white">Costs ₹10 (1 credit) per plan.</span></p>
      </div>

      {/* Income & Expenses */}
      <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white">Monthly Financials</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Monthly Income (₹)</label>
            <input value={income} onChange={e => setIncome(e.target.value)} placeholder="e.g. 75000" className={inputClass} type="number" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Monthly Expenses (₹) — excluding EMIs</label>
            <input value={expenses} onChange={e => setExpenses(e.target.value)} placeholder="e.g. 35000" className={inputClass} type="number" />
          </div>
        </div>
      </div>

      {/* Loans */}
      <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Loans / EMIs</h2>
          <button onClick={addLoan} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition">
            <Plus className="w-3.5 h-3.5" /> Add Loan
          </button>
        </div>
        {loans.map((loan, i) => (
          <div key={loan.id} className="bg-white/[0.02] border border-white/8 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">Loan {i + 1}</span>
              {loans.length > 1 && (
                <button onClick={() => removeLoan(loan.id)} className="text-gray-600 hover:text-red-400 transition">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Loan name</label>
                <input value={loan.name} onChange={e => updateLoan(loan.id, 'name', e.target.value)}
                  placeholder="e.g. Home Loan, Car Loan" className={inputClass} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Outstanding balance (₹)</label>
                <input value={loan.balance} onChange={e => updateLoan(loan.id, 'balance', e.target.value)}
                  placeholder="e.g. 500000" className={inputClass} type="number" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Monthly EMI (₹)</label>
                <input value={loan.emi} onChange={e => updateLoan(loan.id, 'emi', e.target.value)}
                  placeholder="e.g. 12000" className={inputClass} type="number" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Interest rate (% p.a.)</label>
                <input value={loan.rate} onChange={e => updateLoan(loan.id, 'rate', e.target.value)}
                  placeholder="e.g. 12" className={inputClass} type="number" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          <p className="text-red-400 text-sm flex-1">{error}</p>
          {error.includes('credits') && (
            <Link href="/billing" className="text-xs bg-white text-black font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100 transition shrink-0">Top Up</Link>
          )}
        </div>
      )}

      <button onClick={generate} disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-black font-semibold py-3.5 rounded-2xl transition disabled:opacity-50">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {loading ? 'Generating your plan...' : 'Generate AI Debt Plan — ₹10'}
      </button>

      {credits !== null && (
        <p className="text-center text-xs text-gray-600"><Wallet className="w-3 h-3 inline mr-1" />Credits remaining: {credits}</p>
      )}

      {aiPlan && (
        <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-white">Your AI Debt-Free Roadmap</h2>
          </div>
          <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed">
            {aiPlan}
          </div>
        </div>
      )}
    </div>
  );
}
