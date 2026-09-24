import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Kevin M.',
    location: '069',
    rating: 5,
    title: 'Bestes Zeug aus der 069',
    body: 'Purple Zkittlez war ein absoluter Banger. Dichte Buds, perfekte Trichomabdeckung und der Geruch – einfach krank. CMT069 liefert immer ab. Respect!',
    product: 'Purple Zkittlez Indoor',
    avatar: 'K',
  },
  {
    id: 2,
    name: 'Leon B.',
    location: 'Berlin',
    rating: 5,
    title: 'Whole Europa ist real',
    body: 'Hab aus Berlin bestellt und innerhalb von 2 Tagen war das Paket da. Diskrete Verpackung, alles safe. Der CMT Grinder ist auch Top-Qualität, benutze ihn täglich.',
    product: 'CMT 4-Part Grinder',
    avatar: 'L',
  },
  {
    id: 3,
    name: 'Marco T.',
    location: 'Amsterdam, NL',
    rating: 5,
    title: 'Gelato #41 ist eine andere Liga',
    body: 'Ich dachte ich kenn gutes Zeug – bis ich das Gelato #41 von CMT probiert habe. Das Terpenprofil ist unreal. Echter Connoisseur-Stoff. Weiter so!',
    product: 'Gelato #41 Indoor',
    avatar: 'M',
  },
]

export function Testimonials() {
  return (
    <section className="section-padding bg-brand-surface" aria-labelledby="testimonials-heading">
      <div className="container-base">
        <div className="text-center mb-12 lg:mb-16">
          <p className="eyebrow mb-3">Community Feedback</p>
          <h2 id="testimonials-heading" className="section-title">Was die Community sagt</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {testimonials.map((t) => (
            <article key={t.id} className="bg-brand-card border border-brand-border p-6 flex flex-col gap-4 hover:border-brand-accent/40 transition-colors">
              <Quote size={22} className="text-brand-accent/30" />

              <div className="flex items-center gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={13} className="fill-brand-accent text-brand-accent" />
                ))}
              </div>

              <div>
                <h3 className="font-bold text-brand-text text-sm mb-2">{t.title}</h3>
                <p className="text-brand-secondary text-sm leading-relaxed">{t.body}</p>
              </div>

              <div className="mt-auto pt-4 border-t border-brand-border flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center text-brand-accent font-black text-sm flex-shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-xs font-bold text-brand-text">{t.name}</p>
                  <p className="text-xs text-brand-secondary">{t.location} · {t.product}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Trust bar */}
        <div className="mt-12 lg:mt-16 py-8 border-t border-b border-brand-border">
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16 text-center">
            {[
              { value: '4.8 / 5', label: 'Durchschnitt' },
              { value: '1.000+', label: 'Follower' },
              { value: '🇪🇺', label: 'Whole Europa' },
              { value: '069', label: 'CMT' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="font-black text-2xl text-brand-accent">{value}</div>
                <div className="text-xs text-brand-secondary mt-1 font-semibold">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
