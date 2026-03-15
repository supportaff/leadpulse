'use client';
import { useEffect, useState } from 'react';
import { TrendingDown, ShieldCheck, Wallet, Zap } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

export default function DashboardPage() {
  const { user } = useUser();
  const [balance, setBalance] = useState<number | null>(null);
  const name = user?.firstName || user?.fullName || 'there';

  useEffect(() => {
    fetch('/api/wallet/balance').then(r => r.json()).then(d => setBalance(d.credits ?? 0)).catch(() => setBalance(0));
  }, []);

  const cards = [
    {
      href: '/debt-planner',
      icon: TrendingDown,
      title: 'Debt Planner',
      desc: 'Enter your loans, income and expenses. AI builds a practical repayment plan tailored to you.',
      cta: 'Start Planning',
      color: 'from-blue-500/10 to-blue-500/5',
      border: 'border-blue-500/20',
    },
    {
      href: '/insurance-planner',
      icon: ShieldCheck,
      title: 'Insurance Planner',
      desc: 'Answer a few questions about your life and income. AI recommends the right insurance coverage.',
      cta: 'Get Recommendations',
      color: 'from-green-500/10 to-green-500/5',
      border: 'border-green-500/20',
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome back, {name} 👋</h1>
        <p className="text-gray-400 text-sm mt-1">Your AI-powered personal finance advisor. Each AI response costs ₹10 (1 credit).</p>
      </div>

      {/* Wallet strip */}
      <div className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4">
        <div className="flex items-center gap-3">
          <Wallet className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Wallet balance</p>
            <p className="text-white font-bold text-lg">
              {balance === null ? '...' : `₹${balance * 10}`}
              <span className="text-gray-500 text-sm font-normal ml-1">({balance ?? '...'} credits)</span>
            </p>
          </div>
        </div>
        <Link href="/billing" className="text-xs bg-white text-black font-semibold px-4 py-2 rounded-xl hover:bg-gray-100 transition">Top Up</Link>
      </div>

      {/* Feature cards */}
      <div className="grid md:grid-cols-2 gap-5">
        {cards.map(({ href, icon: Icon, title, desc, cta, color, border }) => (
          <div key={href} className={`bg-gradient-to-br ${color} border ${border} rounded-2xl p-6 space-y-4`}>
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold">{title}</h2>
              <p className="text-gray-400 text-sm mt-1">{desc}</p>
            </div>
            <Link href={href} className="inline-flex items-center gap-2 bg-white text-black text-sm font-semibold px-4 py-2 rounded-xl hover:bg-gray-100 transition">
              <Zap className="w-3.5 h-3.5" />{cta}
            </Link>
          </div>
        ))}
      </div>

      <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">How it works</h3>
        <div className="grid grid-cols-3 gap-4 text-sm text-gray-400">
          <div className="flex gap-3"><span className="text-white font-bold text-lg">1</span><p>Top up your wallet (₹10 per AI response)</p></div>
          <div className="flex gap-3"><span className="text-white font-bold text-lg">2</span><p>Enter your financial data — income, loans, expenses</p></div>
          <div className="flex gap-3"><span className="text-white font-bold text-lg">3</span><p>AI gives you a personalised action plan instantly</p></div>
        </div>
      </div>
    </div>
  );
}
