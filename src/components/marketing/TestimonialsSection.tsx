const testimonials = [
  {
    quote: 'LeadPulse found 47 people asking for exactly our product in the first week. We closed 3 of them.',
    name: 'Rohan Mehta',
    role: 'Founder, SyncDesk',
    avatar: 'RM',
  },
  {
    quote: 'The AI replies are shockingly natural. Our reply rate jumped from 2% to 18% immediately.',
    name: 'Priya Sharma',
    role: 'Growth Lead, FlowHQ',
    avatar: 'PS',
  },
  {
    quote: "We monitor 20+ competitor mentions daily. It's like having a sales spy working 24/7.",
    name: 'Alex Torres',
    role: 'CEO, LaunchKit',
    avatar: 'AT',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Loved by Founders</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl border border-gray-100 p-8 shadow-sm">
              <p className="text-gray-700 mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">{t.avatar}</div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
