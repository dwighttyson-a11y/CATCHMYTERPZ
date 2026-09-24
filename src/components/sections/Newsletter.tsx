import { useState } from 'react'
import { ArrowRight, CheckCircle, Instagram } from 'lucide-react'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setError('Bitte gültige E-Mail eingeben.')
      return
    }
    setError('')
    setSubmitted(true)
  }

  return (
    <section className="section-padding bg-brand-bg relative overflow-hidden" aria-labelledby="newsletter-heading">
      {/* BG effects */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-accent/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-purple/50 to-transparent" />

      <div className="container-base relative z-10">
        <div className="max-w-xl mx-auto text-center">
          <p className="eyebrow mb-4">Bleib auf dem Laufenden</p>
          <h2 id="newsletter-heading" className="font-black text-3xl sm:text-4xl text-brand-text mb-4">
            Werde Teil der <span className="text-gradient">CMT Community</span>
          </h2>
          <p className="text-brand-secondary mb-6 leading-relaxed text-sm">
            Erhalte neue Drops, exklusive Deals und Community-News als erster. No spam, nur 🔥.
          </p>

          {submitted ? (
            <div className="flex items-center justify-center gap-3 py-5 text-brand-accent">
              <CheckCircle size={22} />
              <p className="font-bold">Danke! Wir melden uns bald bei dir.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="flex gap-0 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="deine@email.de"
                  className="flex-1 px-5 py-3.5 bg-brand-surface border border-brand-border text-brand-text placeholder:text-brand-secondary text-sm focus:outline-none focus:border-brand-accent transition-colors"
                  aria-label="E-Mail für Newsletter"
                  required
                />
                <button
                  type="submit"
                  className="px-5 py-3.5 bg-brand-accent text-brand-bg text-sm font-black uppercase tracking-wide hover:bg-brand-accent-hover transition-colors flex items-center gap-2 flex-shrink-0"
                >
                  <span className="hidden sm:inline">Abonnieren</span>
                  <ArrowRight size={16} />
                </button>
              </div>
              {error && <p role="alert" className="text-red-400 text-xs mt-2">{error}</p>}
            </form>
          )}

          {/* Instagram CTA */}
          <div className="mt-8 pt-8 border-t border-brand-border">
            <p className="text-brand-secondary text-sm mb-4">Oder folge uns auf Instagram für tägliche Updates:</p>
            <a
              href="https://www.instagram.com/catchmyterpzz069/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 btn-secondary"
            >
              <Instagram size={16} />
              @catchmyterpzz069
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
