export function HowItWorks() {
  const steps = [
    { num: '01', title: 'Top up your wallet', desc: 'Add credits starting at ₹99. Each AI-generated plan costs just ₹10 (1 credit).' },
    { num: '02', title: 'Enter your financial data', desc: 'Tell us your monthly income, expenses, and all your loans — home, car, personal, credit card.' },
    { num: '03', title: 'AI builds your plan', desc: 'Gemini AI analyses your data and gives a step-by-step debt repayment roadmap with exact rupee amounts.' },
    { num: '04', title: 'Get insured right', desc: 'Answer 7 quick questions and AI recommends the exact term, health, and critical illness cover — with provider names and premiums.' },
  ];
  return (
    <section id="how" className="py-20 px-5 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white">How it works</h2>
        <p className="text-gray-500 text-sm mt-2">From data to actionable plan in under 30 seconds</p>
      </div>
      <div className="grid md:grid-cols-4 gap-6">
        {steps.map(({ num, title, desc }) => (
          <div key={num} className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 space-y-3">
            <span className="text-4xl font-bold text-white/10">{num}</span>
            <h3 className="text-white font-semibold text-sm">{title}</h3>
            <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
