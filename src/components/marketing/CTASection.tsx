import Link from 'next/link';

export function CTASection() {
  return (
    <section className="py-20 px-5">
      <div className="max-w-2xl mx-auto text-center bg-white/[0.03] border border-white/10 rounded-3xl p-12 space-y-5">
        <span className="text-4xl">🌸</span>
        <h2 className="text-3xl font-bold text-white">Start tracking your cycle today</h2>
        <p className="text-gray-400 text-sm">Free period tracking, colour-coded calendar, phase insights, and WhatsApp reminders. Built for Indian women.</p>
        <Link href="/sign-up" className="inline-block bg-white text-black font-semibold px-8 py-3.5 rounded-2xl hover:bg-gray-100 transition text-sm">
          Start Free →
        </Link>
        <p className="text-gray-600 text-xs">💚 A portion of every subscription supports menstrual health NGOs in India</p>
      </div>
    </section>
  );
}
