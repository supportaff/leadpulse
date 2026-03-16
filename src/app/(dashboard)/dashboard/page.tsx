'use client';
import { useEffect, useState } from 'react';
import { Heart, Calendar, BellRing, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

export default function DashboardPage() {
  const { user } = useUser();
  const [_, setBalance] = useState<number | null>(null);
  const name = user?.firstName || user?.fullName || 'there';

  useEffect(() => {
    fetch('/api/wallet/balance').then(r=>r.json()).then(d=>setBalance(d.credits??0)).catch(()=>setBalance(0));
  }, []);

  const cards = [
    {
      href: '/period-tracker',
      icon: Heart,
      title: 'Period Tracker',
      desc: 'Log your last period date. Get your next cycle, ovulation window, and phase-by-phase wellness tips on an interactive calendar.',
      cta: 'Track Period',
      color: 'from-pink-500/10 to-pink-500/5',
      border: 'border-pink-500/20',
      emoji: '🌸',
    },
    {
      href: '/period-history',
      icon: Calendar,
      title: 'Period History',
      desc: 'Log all past periods with flow, pain level, and symptoms. Spot cycle patterns, detect irregularities, and prep for doctor visits.',
      cta: 'View History',
      color: 'from-purple-500/10 to-purple-500/5',
      border: 'border-purple-500/20',
      emoji: '📅',
    },
    {
      href: '/reminders',
      icon: BellRing,
      title: 'WhatsApp Reminders',
      desc: 'Get period alerts 3 days early, ovulation windows, and weekly wellness tips directly on WhatsApp. Activate once, get reminders all month.',
      cta: 'Setup Reminders',
      color: 'from-green-500/10 to-green-500/5',
      border: 'border-green-500/20',
      emoji: '📱',
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome, {name} 🌸</h1>
        <p className="text-gray-400 text-sm mt-1">Your personal period companion. Track, understand, and stay ahead of your cycle.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {cards.map(({href,icon:Icon,title,desc,cta,color,border,emoji})=>(
          <div key={href} className={`bg-gradient-to-br ${color} border ${border} rounded-2xl p-6 space-y-4`}>
            <div className="text-2xl">{emoji}</div>
            <div>
              <h2 className="text-white font-semibold">{title}</h2>
              <p className="text-gray-400 text-sm mt-1">{desc}</p>
            </div>
            <Link href={href} className="inline-flex items-center gap-2 bg-white text-black text-sm font-semibold px-4 py-2 rounded-xl hover:bg-gray-100 transition">
              <Sparkles className="w-3.5 h-3.5"/>{cta}
            </Link>
          </div>
        ))}
      </div>

      <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">How it works</h3>
        <div className="grid grid-cols-3 gap-4 text-sm text-gray-400">
          <div className="flex gap-3"><span className="text-white font-bold text-lg">1</span><p>Enter your last period date and cycle length</p></div>
          <div className="flex gap-3"><span className="text-white font-bold text-lg">2</span><p>See your calendar, phases, predictions, and health tips</p></div>
          <div className="flex gap-3"><span className="text-white font-bold text-lg">3</span><p>Get WhatsApp reminders so you’re never caught off guard</p></div>
        </div>
      </div>
    </div>
  );
}
