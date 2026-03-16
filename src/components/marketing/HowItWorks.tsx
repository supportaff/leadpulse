export function HowItWorks() {
  const steps = [
    { num:'01', emoji:'📅', title:'Enter your last period', desc:'Takes 10 seconds. Just pick a date and set your cycle length.' },
    { num:'02', emoji:'🗺️', title:'See your full calendar', desc:'Your next period, fertile window, and ovulation are colour-coded on an interactive calendar.' },
    { num:'03', emoji:'📝', title:'Log symptoms daily', desc:'Tap any day to log flow, pain level, and symptoms. Get personalised recommendations instantly.' },
    { num:'04', emoji:'📱', title:'Get WhatsApp reminders', desc:'Enter your number once. Get alerts before your period, during ovulation, and weekly wellness tips.' },
  ];
  return (
    <section id="how" className="py-20 px-5 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white">How MomCare works</h2>
        <p className="text-gray-500 text-sm mt-2">From signup to your first reminder in under 2 minutes</p>
      </div>
      <div className="grid md:grid-cols-4 gap-6">
        {steps.map(({num,emoji,title,desc})=>(
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
