import Link from 'next/link';

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-5 text-center relative overflow-hidden">
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-pink-500/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 text-xs px-4 py-1.5 rounded-full mb-6">
        🌸 AI-Powered Period & Pregnancy Companion for India
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight max-w-3xl mx-auto">
        Track. Plan. Get Reminded.
        <br />
        <span className="text-gray-400">Right on WhatsApp.</span>
      </h1>
      <p className="mt-5 text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
        MomCare tracks your period cycle and pregnancy week-by-week — then sends you personalised tips, doctor visit reminders, and health guidance directly on WhatsApp.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
        <Link href="/sign-up" className="bg-white text-black font-semibold px-6 py-3 rounded-2xl hover:bg-gray-100 transition text-sm">
          Start Free — ₹10 per AI Plan
        </Link>
        <Link href="/#how" className="text-gray-400 hover:text-white text-sm px-6 py-3 rounded-2xl border border-white/10 hover:border-white/20 transition">
          See how it works
        </Link>
      </div>
      <div className="flex flex-wrap justify-center gap-3 mt-10">
        {['🌸 Period Tracker', '🤰 Pregnancy Planner', '📱 WhatsApp Reminders', '🤖 Gemini AI'].map(f => (
          <div key={f} className="bg-white/[0.03] border border-white/8 text-gray-400 text-xs px-4 py-2 rounded-full">{f}</div>
        ))}
      </div>
    </section>
  );
}
