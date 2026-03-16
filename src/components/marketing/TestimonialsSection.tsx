const testimonials = [
  { name: 'Priya R.', role: 'First-time mom, Chennai', text: '"MomCare tracked my entire pregnancy week by week. The WhatsApp reminders for doctor visits saved me so many times. Best ₹249 I spent."' },
  { name: 'Kavitha M.', role: 'Working professional, Bengaluru', text: '"I always forgot my cycle dates. Now I get a WhatsApp reminder 3 days before — and the AI tips for cramps actually work!"' },
  { name: 'Sneha T.', role: 'New mom, Hyderabad', text: '"The pregnancy planner gave me baby milestones, Indian food tips, and scan reminders. My doctor was impressed I came prepared every visit."' },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 px-5 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white">Loved by Indian moms</h2>
        <p className="text-gray-500 text-sm mt-2">Real stories from real families.</p>
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
