import { Search, Bot, Bell, BarChart2 } from 'lucide-react';

const features = [
  { icon: Search, title: 'Real-time scanning', desc: 'Monitors Reddit and X 24/7 for posts matching your keywords and intent signals.' },
  { icon: Bot, title: 'AI intent scoring', desc: 'Every post is scored high / medium / low based on buying intent, urgency, and context.' },
  { icon: Bell, title: 'Instant alerts', desc: 'Get an email the moment a high-intent lead is detected, so you can reply first.' },
  { icon: BarChart2, title: 'Analytics', desc: 'Track keyword performance, platform split, and reply rates from one dashboard.' },
];

export function FeaturesSection() {
  return (
    <section className="py-20 px-6 bg-gray-900/50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Everything you need to close faster</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
