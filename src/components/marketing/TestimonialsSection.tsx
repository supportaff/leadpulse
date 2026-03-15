const testimonials = [
  { name: 'Arjun M.', role: 'Software Engineer, Bengaluru', text: '"I had 4 loans and no idea where to start. FinanceAI told me exactly which to close first and I saved ₹45,000 in interest. Worth every rupee."' },
  { name: 'Priya S.', role: 'Teacher, Chennai', text: '"The insurance planner recommended a ₹1 Cr term plan I never knew I needed. Setup cost me ₹10. My family is now protected for ₹12,000/year."' },
  { name: 'Rohit K.', role: 'Small Business Owner, Pune', text: '"Clear, practical advice without the jargon. The debt-free timeline it gave me was realistic and I am actually sticking to it. Brilliant tool."' },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 px-5 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white">Loved by Indian families</h2>
        <p className="text-gray-500 text-sm mt-2">Real advice. Real results.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {testimonials.map(({ name, role, text }) => (
          <div key={name} className="bg-white/[0.02] border border-white/8 rounded-2xl p-6 space-y-4">
            <p className="text-gray-300 text-sm leading-relaxed italic">{text}</p>
            <div>
              <p className="text-white text-sm font-semibold">{name}</p>
              <p className="text-gray-500 text-xs">{role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
