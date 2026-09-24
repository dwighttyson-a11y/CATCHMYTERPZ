import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Link } from 'react-router-dom'

interface FAQItem {
  q: string
  a: string
  category: string
}

const faqs: FAQItem[] = [
  // Bestellungen
  { category: 'Bestellungen', q: 'Wie kann ich eine Bestellung aufgeben?', a: 'Leg Produkte direkt in deinen Warenkorb und geh zur Kasse. Wir akzeptieren Kreditkarten, PayPal, Klarna und Sofortüberweisung. Bei Fragen kannst du uns auch direkt über Telegram oder Instagram erreichen.' },
  { category: 'Bestellungen', q: 'Kann ich meine Bestellung ändern oder stornieren?', a: 'Bestellungen können bis kurz nach der Aufgabe storniert oder geändert werden. Bitte kontaktiere uns umgehend über hello@catchmyterpz069.de oder über Telegram mit deiner Bestellnummer.' },
  { category: 'Bestellungen', q: 'Gibt es Rabattcodes?', a: 'Ja! Nutze CMT10 für 10% Rabatt, TERPZ15 für 15% oder WELCOME20 für 20% auf deine erste Bestellung. Weitere Aktionen gibt es regelmäßig auf unseren Social-Media-Kanälen.' },
  // Versand
  { category: 'Versand', q: 'Wie lange dauert die Lieferung?', a: 'Standardversand dauert 1–3 Werktage (4,95 €). Expressversand ist am nächsten Werktag verfügbar (9,95 €). Bestellungen bis 14:00 Uhr werden noch am selben Tag verschickt.' },
  { category: 'Versand', q: 'Ab wann ist der Versand kostenlos?', a: 'Wir bieten kostenlosen Versand auf alle Bestellungen ab 49 €. Der Gratisversand gilt automatisch – kein Code erforderlich.' },
  { category: 'Versand', q: 'Liefert ihr auch ins Ausland?', a: 'Wir liefern derzeit primär innerhalb Deutschlands sowie in ausgewählte EU-Länder. Kontaktiere uns für Details zu internationalen Bestellungen.' },
  // Produkte
  { category: 'Produkte', q: 'Was ist der Unterschied zwischen Static Hash, WPFF und Bubble Hash?', a: 'Static Hash wird durch elektrostatische Trennung gewonnen – sehr sauber, klares Profil. WPFF (Wet Process Full Flower) ist eine nassextrahierte Variante mit intensivem Terpengehalt. Bubble Hash entsteht durch Eiswasserextraktion und gilt als eine der reinsten Methoden.' },
  { category: 'Produkte', q: 'Was bedeuten die Gramm-Stufen bei den Produkten?', a: 'Viele unserer Produkte gibt es in verschiedenen Größen (z.B. 1g, 3g, 5g, 10g). Der Preis pro Gramm sinkt bei größeren Mengen. Wähle auf der Produktseite die passende Menge aus.' },
  { category: 'Produkte', q: 'Sind eure Produkte legal?', a: 'Ja. Wir verkaufen ausschließlich legale Produkte im Rahmen der geltenden deutschen und europäischen Gesetzgebung. Unser Sortiment umfasst legale Cannabis-Konzentrate. Bei Fragen zur Legalität in deinem Land empfehlen wir, die lokalen Vorschriften zu prüfen.' },
  // Rückgabe
  { category: 'Rückgabe', q: 'Was ist eure Rückgaberichtlinie?', a: 'Wenn du mit deiner Bestellung nicht zufrieden bist, melde dich innerhalb von 14 Tagen nach Erhalt bei uns. Wir prüfen jeden Fall individuell und finden gemeinsam eine Lösung.' },
  { category: 'Rückgabe', q: 'Wie nehme ich Kontakt für eine Rückgabe auf?', a: 'Schick uns eine E-Mail an hello@catchmyterpz069.de oder schreib uns direkt auf Telegram oder Instagram. Gib deine Bestellnummer und eine kurze Beschreibung des Problems an.' },
  // Kontakt
  { category: 'Kontakt', q: 'Wie erreiche ich euch am schnellsten?', a: 'Am schnellsten erreichst du uns über Instagram (@catchmyterpzz069) oder Telegram. Für formelle Anfragen steht auch hello@catchmyterpz069.de zur Verfügung.' },
  { category: 'Kontakt', q: 'Gibt es einen physischen Store?', a: 'Wir sind primär online aktiv und versenden deutschlandweit. Für persönliche Abholung oder weitere Infos melde dich vorab bei uns.' },
]

const categories = [...new Set(faqs.map((f) => f.category))]

export function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState('Alle')

  useEffect(() => {
    document.title = 'FAQ – CATCHMYTERPZ 069'
  }, [])

  const filtered = activeCategory === 'Alle' ? faqs : faqs.filter((f) => f.category === activeCategory)

  return (
    <main id="main-content">
      <div className="container-base py-10 lg:py-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <p className="eyebrow mb-3">Support</p>
          <h1 className="section-title mb-4">Häufig gestellte Fragen</h1>
          <p className="text-brand-secondary leading-relaxed">
            Hier findest du Antworten auf die häufigsten Fragen. Nichts dabei?{' '}
            <Link to="/contact" className="text-brand-accent hover:underline">Schreib uns direkt</Link>.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {['Alle', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setOpenIndex(null) }}
              className={`px-5 py-2 text-sm border transition-all ${
                activeCategory === cat
                  ? 'bg-brand-text text-white border-brand-text'
                  : 'border-brand-border text-brand-text hover:border-brand-text'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          {filtered.map((item, i) => (
            <div key={i} className="border-b border-brand-border">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left gap-4"
                aria-expanded={openIndex === i}
                aria-controls={`faq-${i}`}
              >
                <span className="text-sm font-medium text-brand-text leading-snug">{item.q}</span>
                {openIndex === i
                  ? <ChevronUp size={18} className="text-brand-secondary flex-shrink-0" />
                  : <ChevronDown size={18} className="text-brand-secondary flex-shrink-0" />
                }
              </button>
              <div
                id={`faq-${i}`}
                role="region"
                className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-96 pb-5' : 'max-h-0'}`}
              >
                <p className="text-sm text-brand-secondary leading-relaxed">{item.a}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 lg:mt-20 bg-brand-light p-8 lg:p-12 text-center max-w-2xl mx-auto">
          <h2 className="font-semibold text-xl mb-3">Noch Fragen?</h2>
          <p className="text-brand-secondary mb-6 text-sm leading-relaxed">
            Unser Team ist über Instagram und Telegram erreichbar und antwortet in der Regel sehr schnell.
          </p>
          <Link to="/contact" className="btn-primary">
            Kontakt aufnehmen
          </Link>
        </div>
      </div>
    </main>
  )
}
