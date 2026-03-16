import Link from 'next/link';

export function CTASection() {
  return (
    <section className="py-20 px-5">
      <div className="max-w-2xl mx-auto text-center bg-white/[0.03] border border-white/10 rounded-3xl p-12 space-y-5">
        <span className="text-4xl">🌸</span>
        <h2 className="text-3xl font-bold text-white">Your health journey starts at ₹10</h2>
        <p className="text-gray-400 text-sm">No subscription. No lock-in. Get your first AI pregnancy or period plan for the cost of a chai. WhatsApp reminders always free.</p>
        <Link href="/sign-up" className="inline-block bg-white text-black font-semibold px-8 py-3.5 rounded-2xl hover:bg-gray-100 transition text-sm">
          Start Free →
        </Link>
        <p className="text-gray-600 text-xs">₹99 for 10 credits · WhatsApp reminders free · Credits never expire</p>
      </div>
    </section>
  );
}
