import { Search, Bot, Bell, BarChart2, Shield, Zap } from 'lucide-react';

const features = [
  { icon: Search, title: 'Reddit scanning', desc: 'Monitors subreddits 24/7 for posts and comments matching your keywords and intent signals. No Twitter/X dependency.' },
  { icon: Bot, title: 'AI intent scoring', desc: 'Every post is scored 0–100 for buying intent, urgency, pain level, and competitor mentions using GPT-4o.' },
  { icon: Bell, title: 'Instant email alerts', desc: 'Get notified the moment a high-intent lead is detected so you can reply before anyone else does.' },
  { icon: MessageSquare, title: 'One-click AI replies', desc: 'Generate personalised, non-spammy Reddit replies based on your product description. Ready to copy and post.' },
  { icon: BarChart2, title: 'Analytics dashboard', desc: 'Track which keywords, subreddits, and campaigns generate the most leads and replies over time.' },
  { icon: Shield, title: 'Competitor monitoring', desc: 'Automatically flag posts mentioning your competitors so you can jump in at the right moment.' },
];

import { MessageSquare } from 'lucide-react';

export function FeaturesSection() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Everything you need to close faster</h2>
          <p className="text-gray-600 max-w-xl mx-auto">Built specifically for Reddit-based outbound sales and lead generation.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-gray-400 transition-colors">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-semibold text-black mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
