import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/helpers'

type Step = 'info' | 'shipping' | 'payment'

interface FormData {
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  zip: string
  country: string
  phone: string
  shippingMethod: 'standard' | 'express'
  cardNumber: string
  cardExpiry: string
  cardCvc: string
  cardName: string
  saveInfo: boolean
}

export function CheckoutPage() {
  const { state, subtotal, discountAmount, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<Step>('info')
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderNumber] = useState(() => `CMT-${Date.now().toString().slice(-6)}`)
  const [summaryOpen, setSummaryOpen] = useState(false)

  const [form, setForm] = useState<FormData>({
    email: '', firstName: '', lastName: '', address: '', city: '', zip: '',
    country: 'DE', phone: '', shippingMethod: 'standard',
    cardNumber: '', cardExpiry: '', cardCvc: '', cardName: '', saveInfo: false,
  })

  useEffect(() => {
    document.title = 'Kasse – CATCHMYTERPZ 069'
    if (state.items.length === 0 && !orderComplete) {
      navigate('/cart')
    }
  }, [state.items.length, navigate, orderComplete])

  const shippingCost = form.shippingMethod === 'express' ? 9.95 : subtotal >= 49 ? 0 : 4.95
  const grandTotal = total + shippingCost

  const updateForm = (key: keyof FormData, value: string | boolean) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const handlePlaceOrder = () => {
    if (!form.cardNumber.trim() || !form.cardExpiry || !form.cardCvc || !form.cardName) return
    setOrderComplete(true)
    clearCart()
  }

  const steps: { key: Step; label: string; num: number }[] = [
    { key: 'info', label: 'Informationen', num: 1 },
    { key: 'shipping', label: 'Versand', num: 2 },
    { key: 'payment', label: 'Zahlung', num: 3 },
  ]

  const InputField = ({
    label, id, type = 'text', value, onChange, placeholder, required = false,
    half = false, ariaLabel,
  }: {
    label: string; id: string; type?: string; value: string; onChange: (v: string) => void;
    placeholder?: string; required?: boolean; half?: boolean; ariaLabel?: string
  }) => (
    <div className={half ? '' : 'col-span-2 sm:col-span-2'}>
      <label htmlFor={id} className="block text-xs font-medium text-brand-text mb-1.5">
        {label}{required && <span className="text-brand-accent ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="input-base"
        aria-label={ariaLabel ?? label}
        autoComplete={id}
      />
    </div>
  )

  if (orderComplete) {
    return (
      <main id="main-content">
        <div className="container-base py-16 lg:py-24 max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-brand-accent/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-brand-accent" />
          </div>
          <h1 className="font-serif text-3xl lg:text-4xl font-semibold mb-4">Bestellung bestätigt!</h1>
          <p className="text-brand-secondary text-lg mb-2">Bestellnummer: <strong className="text-brand-text">{orderNumber}</strong></p>
          <p className="text-brand-secondary mb-8 leading-relaxed">
            Vielen Dank für Ihre Bestellung. Sie erhalten in Kürze eine Bestätigungs-E-Mail an <strong>{form.email || 'Ihre E-Mail-Adresse'}</strong>.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/" className="btn-primary">Weiter einkaufen</Link>
            <Link to="/" className="btn-secondary">Zur Startseite</Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main id="main-content">
      <div className="container-base py-6 lg:py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="font-serif text-2xl font-bold text-brand-text">CATCHMYTERPZ 069</Link>
          <div className="flex items-center gap-2 text-xs text-brand-secondary">
            <Lock size={12} />
            Sichere Zahlung
          </div>
        </div>

        {/* Mobile order summary toggle */}
        <button
          onClick={() => setSummaryOpen((o) => !o)}
          className="flex items-center justify-between w-full py-4 border-b border-brand-border mb-6 lg:hidden"
        >
          <span className="text-sm font-medium text-brand-text flex items-center gap-2">
            Bestellzusammenfassung {summaryOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </span>
          <span className="font-semibold text-brand-text">{formatPrice(grandTotal)}</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">
          {/* Main form */}
          <div className="flex-1">
            {/* Steps */}
            <nav className="flex items-center gap-4 mb-8" aria-label="Bestellschritte">
              {steps.map(({ key, label, num }, i) => {
                const completed = steps.findIndex((s) => s.key === currentStep) > i
                const active = key === currentStep
                return (
                  <div key={key} className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 flex items-center justify-center text-xs font-semibold border transition-colors ${
                        completed
                          ? 'bg-brand-accent border-brand-accent text-brand-bg'
                          : active
                          ? 'bg-brand-text border-brand-text text-white'
                          : 'border-brand-border text-brand-secondary'
                      }`}
                    >
                      {completed ? '✓' : num}
                    </div>
                    <span
                      className={`text-sm font-medium hidden sm:block ${
                        active ? 'text-brand-text' : completed ? 'text-brand-secondary' : 'text-brand-secondary'
                      }`}
                    >
                      {label}
                    </span>
                    {i < steps.length - 1 && <div className="w-8 h-px bg-brand-border mx-1" />}
                  </div>
                )
              })}
            </nav>

            {/* Step content */}
            {currentStep === 'info' && (
              <div>
                <h2 className="font-semibold text-lg mb-6">Kontaktinformationen</h2>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <InputField label="E-Mail" id="email" type="email" value={form.email} onChange={(v) => updateForm('email', v)} placeholder="ihre@email.de" required />
                </div>

                <h2 className="font-semibold text-lg mb-6">Lieferadresse</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-xs font-medium text-brand-text mb-1.5">Vorname *</label>
                    <input id="firstName" type="text" value={form.firstName} onChange={(e) => updateForm('firstName', e.target.value)} className="input-base" required />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-xs font-medium text-brand-text mb-1.5">Nachname *</label>
                    <input id="lastName" type="text" value={form.lastName} onChange={(e) => updateForm('lastName', e.target.value)} className="input-base" required />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="address" className="block text-xs font-medium text-brand-text mb-1.5">Straße und Hausnummer *</label>
                    <input id="address" type="text" value={form.address} onChange={(e) => updateForm('address', e.target.value)} className="input-base" required />
                  </div>
                  <div>
                    <label htmlFor="zip" className="block text-xs font-medium text-brand-text mb-1.5">PLZ *</label>
                    <input id="zip" type="text" value={form.zip} onChange={(e) => updateForm('zip', e.target.value)} className="input-base" required />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-xs font-medium text-brand-text mb-1.5">Stadt *</label>
                    <input id="city" type="text" value={form.city} onChange={(e) => updateForm('city', e.target.value)} className="input-base" required />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="country" className="block text-xs font-medium text-brand-text mb-1.5">Land</label>
                    <select id="country" value={form.country} onChange={(e) => updateForm('country', e.target.value)} className="input-base">
                      <option value="DE">Deutschland</option>
                      <option value="AT">Österreich</option>
                      <option value="CH">Schweiz</option>
                    </select>
                  </div>
                  <InputField label="Telefon (optional)" id="phone" type="tel" value={form.phone} onChange={(v) => updateForm('phone', v)} half />
                </div>

                <button
                  onClick={() => setCurrentStep('shipping')}
                  className="btn-primary w-full mt-8"
                  disabled={!form.email || !form.firstName || !form.lastName || !form.address || !form.city || !form.zip}
                >
                  Weiter zum Versand
                </button>
              </div>
            )}

            {currentStep === 'shipping' && (
              <div>
                <button onClick={() => setCurrentStep('info')} className="text-sm text-brand-secondary hover:text-brand-text mb-6 flex items-center gap-1">
                  ← Zurück
                </button>
                <h2 className="font-semibold text-lg mb-6">Versandmethode</h2>

                <div className="space-y-3">
                  {[
                    { value: 'standard', label: 'Standardversand', duration: '1–3 Werktage', price: subtotal >= 49 ? 'Kostenlos' : '4,95 €' },
                    { value: 'express', label: 'Expressversand', duration: '1 Werktag', price: '9,95 €' },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${
                        form.shippingMethod === method.value ? 'border-brand-text bg-brand-light' : 'border-brand-border hover:border-brand-secondary'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={method.value}
                        checked={form.shippingMethod === method.value}
                        onChange={() => updateForm('shippingMethod', method.value)}
                        className="accent-brand-accent"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-brand-text">{method.label}</p>
                        <p className="text-xs text-brand-secondary">{method.duration}</p>
                      </div>
                      <span className="text-sm font-semibold text-brand-text">{method.price}</span>
                    </label>
                  ))}
                </div>

                <button onClick={() => setCurrentStep('payment')} className="btn-primary w-full mt-8">
                  Weiter zur Zahlung
                </button>
              </div>
            )}

            {currentStep === 'payment' && (
              <div>
                <button onClick={() => setCurrentStep('shipping')} className="text-sm text-brand-secondary hover:text-brand-text mb-6 flex items-center gap-1">
                  ← Zurück
                </button>
                <h2 className="font-semibold text-lg mb-2">Zahlungsinformationen</h2>
                <div className="flex items-center gap-2 text-xs text-brand-secondary mb-6 bg-brand-surface border border-brand-border px-3 py-2">
                  <Lock size={12} />
                  <span><strong>Demo:</strong> Zahlung ist nicht live. Keine echten Kartendaten eingeben.</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label htmlFor="cardNumber" className="block text-xs font-medium text-brand-text mb-1.5">Kartennummer</label>
                    <input
                      id="cardNumber"
                      type="text"
                      value={form.cardNumber}
                      onChange={(e) => updateForm('cardNumber', e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19))}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="input-base"
                      autoComplete="cc-number"
                    />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="cardName" className="block text-xs font-medium text-brand-text mb-1.5">Name auf der Karte</label>
                    <input id="cardName" type="text" value={form.cardName} onChange={(e) => updateForm('cardName', e.target.value)} className="input-base" autoComplete="cc-name" />
                  </div>
                  <div>
                    <label htmlFor="cardExpiry" className="block text-xs font-medium text-brand-text mb-1.5">Ablaufdatum</label>
                    <input
                      id="cardExpiry"
                      type="text"
                      value={form.cardExpiry}
                      onChange={(e) => updateForm('cardExpiry', e.target.value.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1/$2').slice(0, 5))}
                      placeholder="MM/JJ"
                      maxLength={5}
                      className="input-base"
                      autoComplete="cc-exp"
                    />
                  </div>
                  <div>
                    <label htmlFor="cardCvc" className="block text-xs font-medium text-brand-text mb-1.5">CVC</label>
                    <input id="cardCvc" type="text" value={form.cardCvc} onChange={(e) => updateForm('cardCvc', e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="123" maxLength={4} className="input-base" autoComplete="cc-csc" />
                  </div>
                </div>

                <label className="flex items-center gap-3 mt-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.saveInfo}
                    onChange={(e) => updateForm('saveInfo', e.target.checked)}
                    className="w-4 h-4 accent-brand-accent"
                  />
                  <span className="text-sm text-brand-secondary">Informationen für zukünftige Bestellungen speichern</span>
                </label>

                <button onClick={handlePlaceOrder} disabled={!form.cardNumber.trim() || !form.cardExpiry || !form.cardCvc || !form.cardName} className="btn-primary w-full mt-8 text-lg py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  <Lock size={16} />
                  Jetzt kostenpflichtig bestellen · {formatPrice(grandTotal)}
                </button>

                <p className="text-xs text-brand-secondary text-center mt-3">
                  Mit Ihrer Bestellung stimmen Sie unseren{' '}
                  <Link to="/terms" className="underline hover:text-brand-text">AGB</Link> und{' '}
                  <Link to="/privacy" className="underline hover:text-brand-text">Datenschutzbestimmungen</Link> zu.
                </p>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className={`lg:w-80 xl:w-96 flex-shrink-0 ${summaryOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-brand-light p-6 lg:sticky lg:top-24">
              <h2 className="font-semibold mb-6">Bestellübersicht</h2>
              <ul className="divide-y divide-brand-border mb-4">
                {state.items.map((item) => (
                  <li key={item.product.id} className="py-3 flex gap-3">
                    <div className="relative w-14 h-14 flex-shrink-0">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover bg-brand-card" />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-brand-secondary text-white text-[10px] flex items-center justify-center rounded-full">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-brand-text line-clamp-2 leading-snug">{item.product.name}</p>
                    </div>
                    <span className="text-xs font-semibold text-brand-text flex-shrink-0">
                      {formatPrice((item.resolvedPrice ?? item.product.price) * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="space-y-2 text-sm border-t border-brand-border pt-4">
                <div className="flex justify-between"><span className="text-brand-secondary">Zwischensumme</span><span>{formatPrice(subtotal)}</span></div>
                {discountAmount > 0 && <div className="flex justify-between text-brand-accent"><span>Rabatt</span><span>−{formatPrice(discountAmount)}</span></div>}
                <div className="flex justify-between"><span className="text-brand-secondary">Versand</span><span className={shippingCost === 0 ? 'text-brand-accent' : ''}>{shippingCost === 0 ? 'Kostenlos' : formatPrice(shippingCost)}</span></div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t border-brand-border">
                  <span>Gesamt</span><span>{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
