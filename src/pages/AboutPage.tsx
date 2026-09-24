import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Zap, Shield, Users } from 'lucide-react'
import { Newsletter } from '../components/sections/Newsletter'

export function AboutPage() {
  useEffect(() => {
    document.title = 'Über uns – CATCHMYTERPZ 069'
  }, [])

  return (
    <main id="main-content">
      {/* Hero */}
      <section className="relative bg-brand-light overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="container-base relative z-10 text-center max-w-3xl mx-auto">
          <p className="eyebrow mb-4">Über CATCHMYTERPZ 069</p>
          <h1 className="section-title mb-6">
            Premium Cannabis Konzentrate aus Frankfurt
          </h1>
          <p className="text-brand-secondary text-lg leading-relaxed">
            CMT steht für Qualität, Community und die reinsten Terpene. Wir kuratieren ausschließlich Spitzenprodukte – handverlesen, geprüft und direkt zu dir.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding">
        <div className="container-base">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="eyebrow mb-4">Unsere Mission</p>
              <h2 className="section-title mb-6">Qualität, die du schmeckst</h2>
              <div className="space-y-4 text-brand-secondary leading-relaxed">
                <p>
                  In einer Welt voller Mittelmaß haben wir entschieden, einen anderen Weg zu gehen. Bei CatchMyTerpz 069 gibt es keine Kompromisse – jedes Produkt, das in unseren Shop kommt, durchläuft eine strenge Auswahl nach Reinheit, Profil und Qualität.
                </p>
                <p>
                  069 steht für Frankfurt – unsere Heimat. Wir sind Teil der Community, kennen die Szene und wissen, was echte Qualität bedeutet. Keine Werbeblasen, keine aufgeblasenen Versprechen. Nur ehrliche Produkte, die für sich selbst sprechen.
                </p>
                <p>
                  Von Static Hash über WPFF bis hin zu Bubble Hash – unser Sortiment deckt die gesamte Breite des Premium-Segments ab, immer mit dem Fokus auf außergewöhnliche Terpene und saubere Extraktion.
                </p>
              </div>
            </div>
            <div className="bg-brand-card border border-brand-border p-10 flex items-center justify-center aspect-square">
              <img
                src="/logo-design.png"
                alt="CatchMyTerpz 069"
                className="w-full h-auto max-w-xs"
                style={{ mixBlendMode: 'screen', filter: 'brightness(1.1)' }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-brand-light">
        <div className="container-base">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">Was uns ausmacht</p>
            <h2 className="section-title">Unsere Werte</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { Icon: Star, title: 'Premium Qualität', desc: 'Wir führen ausschließlich Produkte, die unsere eigenen Standards erfüllen. Kein Produkt kommt in den Shop, das wir nicht selbst überzeugt.' },
              { Icon: Zap, title: 'Terpene First', desc: 'Terpene sind der Fingerabdruck eines Produkts. Wir suchen gezielt nach Profilen mit außergewöhnlichem Duft, Geschmack und Wirkung.' },
              { Icon: Shield, title: 'Diskretion & Sicherheit', desc: 'Deine Privatsphäre ist uns wichtig. Diskrete Verpackung, sichere Abwicklung und kein unnötiger Datenaustausch.' },
              { Icon: Users, title: 'Community', desc: 'CMT ist mehr als ein Shop. Wir sind Teil der Frankfurter Community und pflegen echte Beziehungen zu unseren Kunden.' },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="bg-brand-card p-7 text-center">
                <div className="w-12 h-12 flex items-center justify-center border border-brand-border mx-auto mb-4 text-brand-accent">
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold text-brand-text mb-3">{title}</h3>
                <p className="text-sm text-brand-secondary leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-brand-surface">
        <div className="container-base text-center max-w-xl">
          <h2 className="font-serif text-3xl lg:text-4xl font-semibold mb-4">
            Überzeug dich selbst
          </h2>
          <p className="text-brand-secondary mb-8 leading-relaxed">
            Entdecke unser kuratiertes Sortiment und erlebe den Unterschied, den echte Qualität macht.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 btn-primary">
            Zum Shop
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Newsletter />
    </main>
  )
}
