const testimonials = [
  {
    quote: 'LeadPulse helped us find 3 enterprise leads in the first week just by monitoring r/entrepreneur and r/SaaS. The AI replies are surprisingly good.',
    name: 'Rahul M.',
    role: 'Founder, B2B SaaS startup',
  },
  {
    quote: 'I was manually reading Reddit for hours every day. Now LeadPulse does it automatically and alerts me only when someone is actually looking to buy.',
    name: 'Priya S.',
    role: 'Growth Lead, Chennai-based agency',
  },
  {
    quote: 'The competitor monitoring feature alone is worth the subscription. We caught two prospects evaluating our competition and converted both.',
    name: 'Arjun K.',
    role: 'Sales Manager, EdTech company',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 px-6 bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-black mb-4">Loved by founders &amp; sales teams</h2>
          <p className="text-gray-500">Real results from real users.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(({ quote, name, role }) => (
            <div key={name} className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <p className="text-gray-700 text-sm leading-relaxed mb-6">&ldquo;{quote}&rdquo;</p>
              <div>
                <p className="text-black font-semibold text-sm">{name}</p>
                <p className="text-gray-400 text-xs mt-0.5">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
