const features = [
  { emoji: '🌸', title: 'Period Tracker', desc: 'Log your last period. AI predicts your next cycle, fertile window, ovulation date, and gives personalised wellness tips.', color: 'border-pink-500/20' },
  { emoji: '🤰', title: 'Pregnancy Planner', desc: 'Enter LMP date. AI creates a 40-week plan with baby milestones, Indian doctor visit schedule, and diet tips.', color: 'border-purple-500/20' },
  { emoji: '📱', title: 'WhatsApp Reminders', desc: 'Receive weekly pregnancy updates, period alerts, ovulation windows, and doctor reminders directly on WhatsApp.', color: 'border-green-500/20' },
  { emoji: '💊', title: 'India-Specific Advice', desc: 'Supplement schedules, Indian foods (dal, spinach, milk), local hospital visit timelines — advice that fits your life.', color: 'border-orange-500/20' },
  { emoji: '💳', title: 'Pay-as-you-use Wallet', desc: 'No monthly lock-in. Top up ₹99 for 10 AI plans. Credits never expire. WhatsApp reminders always free.', color: 'border-yellow-500/20' },
  { emoji: '🔒', title: 'Private & Safe', desc: 'Your health data is never stored or shared. Processed in real-time and discarded. Your privacy matters.', color: 'border-white/10' },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-5 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white">Everything for your health journey</h2>
        <p className="text-gray-500 text-sm mt-2">Period tracking, pregnancy planning, and WhatsApp reminders — all in one place.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {features.map(({ emoji, title, desc, color }) => (
          <div key={title} className={`bg-white/[0.02] border ${color} rounded-2xl p-6 space-y-3 hover:border-white/20 transition`}>
            <span className="text-2xl">{emoji}</span>
            <h3 className="text-white font-semibold text-sm">{title}</h3>
            <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
