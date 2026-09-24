import { useEffect, useState } from 'react'
import { Mail, Clock, Instagram, CheckCircle } from 'lucide-react'

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    document.title = 'Kontakt – CATCHMYTERPZ 069'
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }))

  return (
    <main id="main-content">
      <div className="container-base py-10 lg:py-16">
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <p className="eyebrow mb-3">Kontakt</p>
          <h1 className="section-title mb-4">Wir sind für dich da</h1>
          <p className="text-brand-secondary leading-relaxed">
            Fragen zu Produkten, Bestellungen oder einfach Hallo sagen? Schreib uns – wir antworten schnell.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 max-w-5xl mx-auto">
          {/* Contact info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-semibold text-xl mb-6">Direkt kontaktieren</h2>
              <div className="space-y-5">
                {[
                  { Icon: Instagram, label: 'Instagram', value: '@catchmyterpzz069', link: 'https://www.instagram.com/catchmyterpzz069/' },
                  { Icon: Mail, label: 'E-Mail', value: 'hello@catchmyterpz069.de', link: 'mailto:hello@catchmyterpz069.de' },
                  { Icon: Clock, label: 'Reaktionszeit', value: 'In der Regel innerhalb weniger Stunden', link: null },
                ].map(({ Icon, label, value, link }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 flex items-center justify-center border border-brand-border flex-shrink-0 text-brand-accent">
                      <Icon size={18} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-wider uppercase text-brand-secondary mb-0.5">{label}</p>
                      {link ? (
                        <a href={link} target={link.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="text-sm text-brand-text hover:text-brand-accent transition-colors">{value}</a>
                      ) : (
                        <p className="text-sm text-brand-text">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-brand-light p-6">
              <h3 className="font-semibold mb-3">Am schnellsten erreichst du uns über</h3>
              <div className="space-y-2 text-sm text-brand-secondary">
                <p>📸 Instagram DM: @catchmyterpzz069</p>
                <p>📧 E-Mail: hello@catchmyterpz069.de</p>
                <p>💬 Telegram: Schreib uns direkt</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-12">
                <CheckCircle size={48} className="text-brand-accent" />
                <h3 className="font-semibold text-xl">Nachricht erhalten!</h3>
                <p className="text-brand-secondary leading-relaxed max-w-sm">
                  Danke für deine Nachricht. Wir melden uns so schnell wie möglich – am besten auch direkt via Instagram oder Telegram für eine schnellere Antwort.
                </p>
                <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }} className="btn-secondary mt-2">
                  Weitere Nachricht senden
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="font-semibold text-xl mb-6">Nachricht senden</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium text-brand-text mb-1.5">Name *</label>
                    <input id="name" type="text" value={form.name} onChange={(e) => update('name', e.target.value)} required className="input-base" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-brand-text mb-1.5">E-Mail *</label>
                    <input id="email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required className="input-base" />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs font-medium text-brand-text mb-1.5">Betreff *</label>
                  <select id="subject" value={form.subject} onChange={(e) => update('subject', e.target.value)} required className="input-base">
                    <option value="">Betreff wählen…</option>
                    <option value="order">Frage zur Bestellung</option>
                    <option value="product">Produktfrage</option>
                    <option value="return">Rückgabe / Reklamation</option>
                    <option value="shipping">Versand</option>
                    <option value="other">Sonstiges</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-brand-text mb-1.5">Nachricht *</label>
                  <textarea
                    id="message"
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    required
                    rows={6}
                    className="input-base resize-none"
                    placeholder="Wie können wir dir helfen?"
                  />
                </div>

                <button type="submit" className="btn-primary w-full">
                  Nachricht senden
                </button>

                <p className="text-xs text-brand-secondary">
                  Mit dem Absenden stimmst du unserer{' '}
                  <a href="/privacy" className="underline hover:text-brand-text">Datenschutzerklärung</a> zu.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
