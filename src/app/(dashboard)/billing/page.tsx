'use client';
import { useState, useEffect } from 'react';
import { Wallet, Zap, ExternalLink, CheckCircle } from 'lucide-react';
import { TOPUP_PACKS, LEAD_COST_INR } from '@/lib/wallet';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useUser } from '@clerk/nextjs';

function BillingContent() {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get('status');
  const creditsParam = searchParams.get('credits');
  const [loading, setLoading] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const { user } = useUser();

  // Fetch real wallet balance
  useEffect(() => {
    if (!user) return;
    fetch('/api/wallet/balance')
      .then(r => r.json())
      .then(d => setBalance(d.credits ?? 0))
      .catch(() => setBalance(0));
  }, [user, statusParam]); // refetch after payment return

  const handleTopup = async (packId: string) => {
    if (!user) return;
    setLoading(packId);
    try {
      const res = await fetch('/api/billing/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packId,
          userId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          name: user.fullName || user.firstName || 'User',
        }),
      });
      const data = await res.json();
      if (data.error) { alert(data.error); return; }

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.action;
      Object.entries(data.fields as Record<string, string>).forEach(([k, v]) => {
        const input = document.createElement('input');
        input.type = 'hidden'; input.name = k; input.value = v;
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      alert('Failed to initiate payment. Please try again.');
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  const isLow = balance !== null && balance <= 5;

  return (
    <div className="space-y-8">
      {statusParam === 'success' && (
        <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-green-400 text-sm">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>Payment successful! {creditsParam ? <><strong>{creditsParam} leads</strong> added to your wallet.</> : 'Wallet topped up.'}</span>
        </div>
      )}
      {statusParam === 'failed' && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
          Payment failed or was cancelled. Please try again.
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-white">Wallet &amp; Billing</h1>
        <p className="text-gray-400 text-sm mt-1">Top up your wallet and unlock leads at ₹{LEAD_COST_INR} per lead.</p>
      </div>

      {/* Wallet balance */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Wallet balance</p>
            {balance === null
              ? <p className="text-3xl font-bold text-white animate-pulse">...</p>
              : <p className="text-3xl font-bold text-white">{balance} <span className="text-base font-normal text-gray-400">leads</span></p>
            }
            {balance !== null && <p className="text-xs text-gray-600 mt-0.5">₹{balance * LEAD_COST_INR} equivalent</p>}
          </div>
        </div>
        {isLow && (
          <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full">⚠ Low balance</span>
        )}
      </div>

      {/* How it works */}
      <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Zap className="w-4 h-4" /> How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-400">
          <div className="flex gap-3"><span className="text-white font-bold text-lg">1</span><p>Top up your wallet with any amount below</p></div>
          <div className="flex gap-3"><span className="text-white font-bold text-lg">2</span><p>Browse leads — contact details are hidden by default</p></div>
          <div className="flex gap-3"><span className="text-white font-bold text-lg">3</span><p>Click <strong className="text-white">Unlock Lead</strong> to reveal details — costs ₹{LEAD_COST_INR} per lead</p></div>
        </div>
      </div>

      {/* Top-up packs */}
      <div>
        <h2 className="text-sm font-semibold text-white mb-4">Top-up packs</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TOPUP_PACKS.map(pack => (
            <div key={pack.id} className={`relative rounded-2xl border p-5 flex flex-col gap-3 transition ${
              'popular' in pack && pack.popular ? 'bg-white border-white'
              : 'best' in pack && pack.best ? 'bg-white/[0.04] border-white/30 hover:border-white/50'
              : 'bg-white/[0.02] border-white/10 hover:border-white/25'
            }`}>
              {'popular' in pack && pack.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20 whitespace-nowrap">Popular</span>
              )}
              {'best' in pack && pack.best && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">Best value</span>
              )}
              <div>
                <p className={`text-2xl font-bold ${'popular' in pack && pack.popular ? 'text-black' : 'text-white'}`}>{pack.label}</p>
                <p className={`text-sm mt-0.5 ${'popular' in pack && pack.popular ? 'text-gray-600' : 'text-gray-400'}`}>{pack.sublabel}</p>
                <p className={`text-xs mt-1 ${'popular' in pack && pack.popular ? 'text-gray-500' : 'text-gray-600'}`}>₹{LEAD_COST_INR}/lead</p>
              </div>
              <button
                onClick={() => handleTopup(pack.id)}
                disabled={loading === pack.id}
                className={`w-full py-2 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-1.5 disabled:opacity-50 ${
                  'popular' in pack && pack.popular ? 'bg-black text-white hover:bg-gray-900'
                  : 'border border-white/20 text-white hover:bg-white/5'
                }`}>
                {loading === pack.id ? 'Redirecting...' : <><ExternalLink className="w-3.5 h-3.5" />Pay now</>}
              </button>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-gray-700">Payments secured by PayU · No recurring charges · Use credits anytime</p>
    </div>
  );
}

export default function BillingPage() {
  return <Suspense><BillingContent /></Suspense>;
}
