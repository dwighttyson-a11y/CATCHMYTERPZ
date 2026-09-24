import { useEffect } from 'react'
import { Link } from 'react-router-dom'

function StaticLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main id="main-content" className="container-base py-10 lg:py-16 max-w-4xl">
      <nav className="mb-6">
        <Link to="/" className="text-sm text-brand-secondary hover:text-brand-text transition-colors">← Startseite</Link>
      </nav>
      <h1 className="font-serif text-3xl lg:text-4xl font-semibold mb-8">{title}</h1>
      <div className="prose prose-sm max-w-none text-brand-secondary leading-relaxed space-y-6">
        {children}
      </div>
    </main>
  )
}

export function PrivacyPage() {
  useEffect(() => { document.title = 'Datenschutz – CATCHMYTERPZ 069' }, [])
  return (
    <StaticLayout title="Datenschutzerklärung">
      <p className="text-xs text-brand-secondary">Zuletzt aktualisiert: September 2026</p>
      <section>
        <h2 className="font-semibold text-brand-text text-lg">1. Verantwortliche Stelle</h2>
        <p>CATCHMYTERPZ 069, Frankfurt am Main, Deutschland. E-Mail: datenschutz@catchmyterpz069.de</p>
      </section>
      <section>
        <h2 className="font-semibold text-brand-text text-lg">2. Erhebung und Verwendung von Daten</h2>
        <p>Wir erheben personenbezogene Daten nur, soweit dies zur Vertragserfüllung, zur Verarbeitung Ihrer Bestellungen oder aufgrund Ihrer Einwilligung erforderlich ist. Dazu gehören Name, E-Mail-Adresse, Lieferadresse und Zahlungsdaten.</p>
      </section>
      <section>
        <h2 className="font-semibold text-brand-text text-lg">3. Weitergabe an Dritte</h2>
        <p>Ihre Daten werden nur an Dienstleister weitergegeben, die für die Auftragsabwicklung erforderlich sind (z.B. Versanddienstleister, Zahlungsanbieter). Eine Weitergabe an Dritte zu Werbezwecken erfolgt nicht ohne Ihre Einwilligung.</p>
      </section>
      <section>
        <h2 className="font-semibold text-brand-text text-lg">4. Cookies</h2>
        <p>Unsere Website verwendet technisch notwendige Cookies für den Betrieb des Shops sowie optionale Analyse-Cookies zur Verbesserung unseres Angebots. Sie können der Verwendung optionaler Cookies widersprechen.</p>
      </section>
      <section>
        <h2 className="font-semibold text-brand-text text-lg">5. Ihre Rechte</h2>
        <p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer Daten sowie ein Widerspruchsrecht. Wenden Sie sich dazu an datenschutz@catchmyterpz069.de.</p>
      </section>
    </StaticLayout>
  )
}

export function TermsPage() {
  useEffect(() => { document.title = 'AGB – CATCHMYTERPZ 069' }, [])
  return (
    <StaticLayout title="Allgemeine Geschäftsbedingungen">
      <p className="text-xs text-brand-secondary">Stand: September 2026</p>
      <section>
        <h2 className="font-semibold text-brand-text text-lg">§1 Geltungsbereich</h2>
        <p>Diese AGB gelten für alle Bestellungen über catchmyterpz069.de zwischen CATCHMYTERPZ 069 und Verbrauchern sowie Unternehmern (Kunden).</p>
      </section>
      <section>
        <h2 className="font-semibold text-brand-text text-lg">§2 Vertragsschluss</h2>
        <p>Durch das Klicken auf „Jetzt kostenpflichtig bestellen" geben Sie eine verbindliche Bestellung auf. Der Kaufvertrag kommt mit unserer Auftragsbestätigung per E-Mail zustande.</p>
      </section>
      <section>
        <h2 className="font-semibold text-brand-text text-lg">§3 Preise und Zahlung</h2>
        <p>Alle Preise verstehen sich in Euro inkl. gesetzlicher MwSt. Wir akzeptieren Kreditkarte, PayPal, Klarna und Sofortüberweisung.</p>
      </section>
      <section>
        <h2 className="font-semibold text-brand-text text-lg">§4 Lieferung</h2>
        <p>Wir liefern innerhalb Deutschlands standardmäßig in 1–3 Werktagen. Kostenloser Versand ab 49 €.</p>
      </section>
      <section>
        <h2 className="font-semibold text-brand-text text-lg">§5 Widerrufsrecht</h2>
        <p>Als Verbraucher haben Sie das Recht, den Vertrag innerhalb von 14 Tagen ohne Angabe von Gründen zu widerrufen. Kontakt: hello@catchmyterpz069.de.</p>
      </section>
    </StaticLayout>
  )
}

export function ShippingPage() {
  useEffect(() => { document.title = 'Versand & Lieferung – CATCHMYTERPZ 069' }, [])
  return (
    <StaticLayout title="Versand & Lieferung">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 not-prose mb-8">
        {[
          { title: 'Standardversand', duration: '1–3 Werktage', price: '4,95 €', note: 'Kostenlos ab 49 €' },
          { title: 'Expressversand', duration: '1 Werktag', price: '9,95 €', note: 'Bestellung bis 14:00 Uhr' },
          { title: 'Gratis Versand', duration: '1–3 Werktage', price: 'Kostenlos', note: 'Ab 49 € Bestellwert' },
        ].map((m) => (
          <div key={m.title} className="bg-brand-light p-5 text-center">
            <h3 className="font-semibold text-brand-text mb-2">{m.title}</h3>
            <p className="text-2xl font-bold text-brand-accent mb-1">{m.price}</p>
            <p className="text-sm text-brand-secondary">{m.duration}</p>
            <p className="text-xs text-brand-secondary mt-1">{m.note}</p>
          </div>
        ))}
      </div>
      <section>
        <h2 className="font-semibold text-brand-text text-lg">Liefergebiete</h2>
        <p>Wir liefern nach Deutschland, Österreich, Schweiz und in alle EU-Länder. Für Lieferungen außerhalb Deutschlands können abweichende Versandkosten und Lieferzeiten gelten.</p>
      </section>
      <section>
        <h2 className="font-semibold text-brand-text text-lg">Sendungsverfolgung</h2>
        <p>Nach dem Versand erhalten Sie eine E-Mail mit Ihrer Sendungsnummer. Sie können Ihre Sendung damit jederzeit online verfolgen.</p>
      </section>
    </StaticLayout>
  )
}

export function ReturnsPage() {
  useEffect(() => { document.title = 'Rückgabe & Erstattung – CATCHMYTERPZ 069' }, [])
  return (
    <StaticLayout title="Rückgabe & Erstattung">
      <div className="bg-brand-accent/10 border border-brand-accent/30 p-5 not-prose mb-8">
        <p className="font-semibold text-brand-accent text-lg mb-1">Zufriedenheitsgarantie</p>
        <p className="text-brand-secondary text-sm">Nicht zufrieden? Kontaktiere uns innerhalb von 14 Tagen nach Erhalt – wir finden gemeinsam eine Lösung.</p>
      </div>
      <section>
        <h2 className="font-semibold text-brand-text text-lg">So funktioniert die Rückgabe</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Senden Sie uns eine E-Mail an hello@catchmyterpz069.de mit Ihrer Bestellnummer</li>
          <li>Wir melden uns innerhalb von 24 Stunden bei Ihnen</li>
          <li>Bei berechtigten Reklamationen erstatten wir den Betrag innerhalb von 3–5 Werktagen</li>
        </ol>
      </section>
      <section>
        <h2 className="font-semibold text-brand-text text-lg">Ausnahmen</h2>
        <p>Aus hygienischen und rechtlichen Gründen sind bestimmte Produkte von der Rückgabe ausgeschlossen. Bitte nehmen Sie vor dem Kauf Kontakt mit uns auf, wenn Sie Fragen haben.</p>
      </section>
      <section>
        <h2 className="font-semibold text-brand-text text-lg">Reklamationen</h2>
        <p>Bei beschädigten oder falschen Produkten nehmen Sie bitte innerhalb von 48 Stunden nach Lieferung Kontakt auf. Fügen Sie bitte Fotos bei. Wir kümmern uns sofort um eine Lösung.</p>
      </section>
    </StaticLayout>
  )
}

export function ImprintPage() {
  useEffect(() => { document.title = 'Impressum – CATCHMYTERPZ 069' }, [])
  return (
    <StaticLayout title="Impressum">
      <section>
        <h2 className="font-semibold text-brand-text text-lg">Angaben gemäß § 5 TMG</h2>
        <p>CATCHMYTERPZ 069<br />Frankfurt am Main<br />Deutschland</p>
      </section>
      <section>
        <h2 className="font-semibold text-brand-text text-lg">Kontakt</h2>
        <p>E-Mail: hello@catchmyterpz069.de</p>
      </section>
      <section>
        <h2 className="font-semibold text-brand-text text-lg">Hinweis</h2>
        <p>Dieses Impressum ist ein Platzhalterdokument. Bitte ersetzen Sie diese Angaben durch die vollständigen und rechtlich korrekten Pflichtangaben gemäß § 5 TMG.</p>
      </section>
    </StaticLayout>
  )
}
