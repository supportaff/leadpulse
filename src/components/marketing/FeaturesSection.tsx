import { Search, Bot, Bell, BarChart2, Shield, MessageSquare } from 'lucide-react';

const features = [
  { icon: Search, title: 'Reddit scanning', desc: 'Monitors subreddits 24/7 for posts and comments matching your keywords and intent signals.' },
  { icon: Bot, title: 'AI intent scoring', desc: 'Every post is scored 0–100 for buying intent, urgency, pain level, and competitor mentions.' },
  { icon: Bell, title: 'Instant email alerts', desc: 'Get notified the moment a high-intent lead is detected so you can reply before anyone else.' },
  { icon: MessageSquare, title: 'One-click AI replies', desc: 'Generate personalised, non-spammy Reddit replies based on your product description.' },
  { icon: BarChart2, title: 'Analytics dashboard', desc: 'Track which keywords, subreddits, and campaigns generate the most leads over time.' },
  { icon: Shield, title: 'Competitor monitoring', desc: 'Automatically flag posts mentioning your competitors so you can jump in at the right moment.' },
];

export function FeaturesSection() {
  return (
    <section className="py-20 px-5 bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">Everything you need to close faster</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base">Built specifically for Reddit-based outbound sales and lead generation.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6 hover:border-gray-400 transition-colors">
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
