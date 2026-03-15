import { Search, Cpu, MessageSquare, TrendingUp } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: Search,
    title: 'You define your keywords',
    desc: 'Tell LeadPulse what your product does and which subreddits your customers hang out in. Set keywords like "looking for CRM", "need accounting software", or your competitor names.',
  },
  {
    step: '02',
    icon: Cpu,
    title: 'We scan Reddit 24/7',
    desc: 'Our engine continuously monitors Reddit posts and comments matching your keywords. Every match is sent to our AI which scores the post 0–100 based on buying intent, urgency, and context.',
  },
  {
    step: '03',
    icon: MessageSquare,
    title: 'AI drafts your reply',
    desc: 'High-intent leads are surfaced in your dashboard. Click "Generate Reply" and our AI writes a personalised, non-spammy response based on your product description — ready to post.',
  },
  {
    step: '04',
    icon: TrendingUp,
    title: 'You close the deal',
    desc: 'Copy the reply, post it on Reddit, and start a real conversation. Track which keywords and subreddits convert best from your analytics dashboard.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-black border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How LeadPulse works</h2>
          <p className="text-gray-400 max-w-xl mx-auto">From keyword to closed deal in four steps.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {steps.map(({ step, icon: Icon, title, desc }) => (
            <div key={step} className="flex gap-5 p-6 bg-white/[0.02] border border-white/8 rounded-2xl hover:border-white/20 transition-colors">
              <div className="shrink-0">
                <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <span className="text-xs font-mono text-gray-600 mb-1 block">{step}</span>
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
