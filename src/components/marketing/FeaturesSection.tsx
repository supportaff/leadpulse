import { TrendingDown, ShieldCheck, Wallet, Zap, BarChart2, Lock } from 'lucide-react';

const features = [
  { icon: TrendingDown, title: 'Debt Repayment Planner', desc: 'Enter all your loans. AI recommends avalanche or snowball method, calculates exact months to debt-free, and allocates your surplus optimally.', color: 'text-blue-400' },
  { icon: ShieldCheck, title: 'Insurance Planner', desc: 'Answer 7 questions about your age, income, family, and health. AI recommends specific Indian insurers, cover amounts, and estimated annual premiums.', color: 'text-green-400' },
  { icon: Wallet, title: 'Pay-as-you-use Wallet', desc: 'No monthly subscription. Top up with ₹99, ₹199, or ₹499. Spend ₹10 per AI plan. Your credits never expire.', color: 'text-yellow-400' },
  { icon: Zap, title: 'Gemini AI Engine', desc: 'Powered by Google Gemini 1.5 Flash — fast, accurate, and trained on Indian financial regulations and insurance products.', color: 'text-purple-400' },
  { icon: BarChart2, title: 'Multiple Loans Support', desc: 'Add home loan, car loan, personal loan, and credit card dues all at once. AI prioritises which to close first to save maximum interest.', color: 'text-orange-400' },
  { icon: Lock, title: 'Private & Secure', desc: 'Your financial data is never stored or shared. Each request is processed in real-time and discarded after the response.', color: 'text-gray-400' },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-5 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white">Everything you need to take control</h2>
        <p className="text-gray-500 text-sm mt-2">Two powerful tools. One affordable wallet.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {features.map(({ icon: Icon, title, desc, color }) => (
          <div key={title} className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 space-y-3 hover:border-white/15 transition">
            <Icon className={`w-5 h-5 ${color}`} />
            <h3 className="text-white font-semibold text-sm">{title}</h3>
            <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
