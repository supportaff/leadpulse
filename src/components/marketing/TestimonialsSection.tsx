const testimonials = [
  { name: 'Arjun M.', role: 'SaaS founder', quote: 'LeadPulse helped me close 3 deals in the first week. The AI replies are spot-on.' },
  { name: 'Priya S.', role: 'Marketing consultant', quote: 'I used to spend hours searching Reddit manually. Now it just shows up in my inbox.' },
  { name: 'David K.', role: 'Agency owner', quote: 'We white-label LeadPulse for 12 clients. Absolute game-changer for outreach.' },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Loved by founders &amp; marketers</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(({ name, role, quote }) => (
            <div key={name} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <p className="text-gray-300 text-sm leading-relaxed mb-4">&ldquo;{quote}&rdquo;</p>
              <div>
                <p className="text-white font-semibold text-sm">{name}</p>
                <p className="text-gray-500 text-xs">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
