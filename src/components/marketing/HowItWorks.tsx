export function HowItWorks() {
  const steps = [
    { num: '01', emoji: '📝', title: 'Enter your dates', desc: 'Add your last period date or pregnancy LMP. Takes 30 seconds.' },
    { num: '02', emoji: '🤖', title: 'AI builds your plan', desc: 'Gemini AI generates your personalised cycle insights or week-by-week pregnancy roadmap.' },
    { num: '03', emoji: '📱', title: 'Get WhatsApp reminders', desc: 'Enter your number once. Get weekly tips, doctor alerts, and health guidance on WhatsApp.' },
    { num: '04', emoji: '💕', title: 'Stay on track', desc: 'Never miss a doctor visit, ovulation window, or important milestone again.' },
  ];
  return (
    <section id="how" className="py-20 px-5 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white">How MomCare works</h2>
        <p className="text-gray-500 text-sm mt-2">From signup to your first WhatsApp reminder in under 2 minutes</p>
      </div>
      <div className="grid md:grid-cols-4 gap-6">
        {steps.map(({ num, emoji, title, desc }) => (
          <div key={num} className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-white/10">{num}</span>
              <span className="text-2xl">{emoji}</span>
            </div>
            <h3 className="text-white font-semibold text-sm">{title}</h3>
            <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
