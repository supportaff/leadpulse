import Link from 'next/link';
import { Check } from 'lucide-react';

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 px-5 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white">Simple & honest</h2>
        <p className="text-gray-500 text-sm mt-2">All core features are free. WhatsApp reminders are a small monthly subscription.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Free</p>
            <p className="text-4xl font-bold text-white mt-1">₹0</p>
            <p className="text-sm text-gray-400 mt-0.5">Forever free</p>
          </div>
          <ul className="space-y-2">
            {['Period tracker & calendar','6-month cycle predictions','Flow, pain & symptom logging','Period history with analytics','Phase-specific health tips','Cycle irregularity alerts'].map(f=>(
              <li key={f} className="flex items-start gap-2 text-xs text-gray-400"><Check className="w-3.5 h-3.5 shrink-0 mt-0.5"/>{f}</li>
            ))}
          </ul>
          <Link href="/sign-up" className="block text-center text-sm font-semibold py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/15 transition">Get Started Free</Link>
        </div>
        <div className="bg-white text-black rounded-2xl p-6 space-y-5 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black border border-white/20 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">⭐ Most Popular</div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">WhatsApp Plan</p>
            <p className="text-4xl font-bold text-black mt-1">₹50<span className="text-lg font-normal text-gray-500">/mo</span></p>
            <p className="text-sm text-gray-500 mt-0.5">Everything free, plus reminders</p>
          </div>
          <ul className="space-y-2">
            {['Everything in Free','Period alert 3 days before start','Ovulation window reminder','Weekly phase wellness tips on WhatsApp','PMS self-care tips','Doctor visit reminders'].map(f=>(
              <li key={f} className="flex items-start gap-2 text-xs text-gray-700"><Check className="w-3.5 h-3.5 shrink-0 mt-0.5"/>{f}</li>
            ))}
          </ul>
          <Link href="/sign-up" className="block text-center text-sm font-semibold py-2.5 rounded-xl bg-black text-white hover:bg-gray-800 transition">Get WhatsApp Reminders</Link>
        </div>
      </div>
      <p className="text-center text-gray-600 text-xs mt-6">Payments secured by PayU · Cancel anytime · 💚 Supports menstrual health NGOs in India</p>
    </section>
  );
}
