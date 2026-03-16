const features = [
  { emoji: '🌸', title: 'Smart Period Tracker', desc: 'Enter your last period date. Instantly see your next cycle, fertile window, and ovulation date on a beautiful colour-coded calendar.', color: 'border-pink-500/20' },
  { emoji: '📅', title: 'Period History Log', desc: 'Track all past periods with flow intensity, pain level, and symptoms. Spot patterns, detect irregularities, and prepare for gynaecologist visits.', color: 'border-purple-500/20' },
  { emoji: '📱', title: 'WhatsApp Reminders', desc: 'Get period alerts 3 days early, ovulation window reminders, and phase-specific wellness tips sent directly on WhatsApp.', color: 'border-green-500/20' },
  { emoji: '📊', title: 'Cycle Phase Insights', desc: 'Know exactly which phase you are in — Menstrual, Follicular, Ovulation, or Luteal — with tailored food, exercise, and self-care tips.', color: 'border-yellow-500/20' },
  { emoji: '⚠️', title: 'Personalised Alerts', desc: 'Log heavy flow, severe pain, or irregular cycles and get specific recommendations. Know when to see a doctor before it becomes serious.', color: 'border-red-500/20' },
  { emoji: '🔒', title: 'Private & Secure', desc: 'Your health data stays private. No ads, no data selling. We built this for Indian women who deserve a safe, honest health companion.', color: 'border-white/10' },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-5 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white">Everything your cycle needs</h2>
        <p className="text-gray-500 text-sm mt-2">Period tracking, history, phases, and WhatsApp reminders — all in one free app.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {features.map(({emoji,title,desc,color})=>(
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
