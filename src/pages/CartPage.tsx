import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Tag, X } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/helpers'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'

export function CartPage() {
  const { state, removeItem, updateQuantity, applyCoupon, removeCoupon, itemCount, subtotal, discountAmount, total } = useCart()
  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState(false)

  useEffect(() => {
    document.title = 'Warenkorb – CATCHMYTERPZ 069'
  }, [])

  const shipping = subtotal >= 49 ? 0 : 4.95

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return
    const ok = applyCoupon(couponInput.trim())
    if (ok) {
      setCouponError('')
      setCouponSuccess(true)
      setCouponInput('')
      setTimeout(() => setCouponSuccess(false), 4000)
    } else {
      setCouponError('Ungültiger oder abgelaufener Gutscheincode')
    }
  }

  if (state.items.length === 0) {
    return (
      <main id="main-content">
        <div className="container-base py-10">
          <Breadcrumbs crumbs={[{ label: 'Warenkorb' }]} />
          <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
            <ShoppingBag size={56} className="text-brand-border" />
            <div>
              <h1 className="font-serif text-3xl font-semibold mb-3">Ihr Warenkorb ist leer</h1>
              <p className="text-brand-secondary max-w-sm mx-auto leading-relaxed">
                Sie haben noch keine Produkte in Ihrem Warenkorb. Entdecken Sie unsere Produkte und fügen Sie Ihre Favoriten hinzu.
              </p>
            </div>
            <Link to="/" className="btn-primary">
              Weiter einkaufen
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main id="main-content">
      <div className="container-base py-6 lg:py-10">
        <Breadcrumbs crumbs={[{ label: 'Warenkorb' }]} />

        <h1 className="font-serif text-3xl lg:text-4xl font-semibold mt-6 mb-8">
          Warenkorb <span className="text-brand-secondary font-normal text-2xl">({itemCount})</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">
          {/* Items */}
          <div className="flex-1">
            <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 pb-3 border-b border-brand-border text-xs font-semibold tracking-widest uppercase text-brand-secondary">
              <span>Produkt</span>
              <span className="text-center">Preis</span>
              <span className="text-center">Menge</span>
              <span className="text-center">Gesamt</span>
              <span />
            </div>

            <ul className="divide-y divide-brand-border" aria-label="Warenkorb-Artikel">
              {state.items.map((item) => (
                <li
                  key={`${item.product.id}-${JSON.stringify(item.selectedVariants)}`}
                  className="py-6"
                >
                  <div className="flex flex-col sm:grid sm:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-start sm:items-center">
                    {/* Product */}
                    <div className="flex gap-4 items-start">
                      <Link to={`/products/${item.product.slug}`} className="flex-shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover bg-brand-light hover:opacity-90 transition-opacity"
                        />
                      </Link>
                      <div>
                        <Link
                          to={`/products/${item.product.slug}`}
                          className="text-sm font-medium text-brand-text hover:text-brand-accent transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                          <p className="text-xs text-brand-secondary mt-1">
                            {Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(' / ')}
                          </p>
                        )}
                        {/* Mobile price */}
                        <p className="text-sm font-semibold text-brand-text mt-2 sm:hidden">
                          {formatPrice(item.resolvedPrice ?? item.product.price)}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="hidden sm:block text-sm text-brand-text text-center">
                      {formatPrice(item.resolvedPrice ?? item.product.price)}
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center border border-brand-border w-fit sm:mx-auto">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedVariants)}
                        className="w-11 h-11 flex items-center justify-center text-brand-secondary hover:text-brand-text hover:bg-brand-light transition-colors"
                        aria-label="Menge verringern"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-9 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariants)}
                        className="w-11 h-11 flex items-center justify-center text-brand-secondary hover:text-brand-text hover:bg-brand-light transition-colors"
                        aria-label="Menge erhöhen"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Total */}
                    <div className="hidden sm:block text-sm font-semibold text-brand-text text-center">
                      {formatPrice((item.resolvedPrice ?? item.product.price) * item.quantity)}
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.product.id, item.selectedVariants)}
                      className="p-2 -mr-2 text-brand-secondary hover:text-brand-accent transition-colors self-start sm:self-auto"
                      aria-label={`${item.product.name} entfernen`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-6 border-t border-brand-border">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-brand-text hover:text-brand-accent transition-colors"
              >
                <ArrowLeft size={15} />
                Weiter einkaufen
              </Link>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:w-80 xl:w-96 flex-shrink-0">
            <div className="bg-brand-light p-6 lg:sticky lg:top-24">
              <h2 className="font-semibold text-lg mb-6">Bestellübersicht</h2>

              {/* Coupon */}
              {!state.couponCode ? (
                <div className="mb-5">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-secondary" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => {setCouponInput(e.target.value); setCouponError('')}}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        placeholder="Gutscheincode"
                        className="input-base pl-9 py-2 text-sm"
                        aria-label="Gutscheincode eingeben"
                        id="cart-coupon-input"
                      />
                    </div>
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-brand-text text-white text-sm font-medium hover:bg-brand-accent transition-colors"
                    >
                      Einlösen
                    </button>
                  </div>
                  {couponError && <p className="text-xs text-red-600 mt-1.5">{couponError}</p>}
                  {couponSuccess && <p className="text-xs text-brand-accent mt-1.5">✓ Gutschein erfolgreich eingelöst!</p>}
                  <p className="text-xs text-brand-secondary mt-1.5">Probieren Sie: CMT10, TERPZ15, WELCOME20</p>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-brand-accent/10 border border-brand-accent/30 px-3 py-2 mb-5">
                  <div className="flex items-center gap-2 text-sm text-brand-accent">
                    <Tag size={13} />
                    <span className="font-medium">{state.couponCode}</span>
                    <span>–{state.discount}%</span>
                  </div>
                  <button onClick={removeCoupon} className="text-brand-accent hover:text-brand-text transition-colors" aria-label="Gutschein entfernen">
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Totals */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-brand-secondary">Zwischensumme</span>
                  <span className="text-brand-text">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-brand-accent">
                    <span>Gutschein-Rabatt</span>
                    <span>−{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-brand-secondary">Versand</span>
                  <span className={shipping === 0 ? 'text-brand-accent' : 'text-brand-text'}>
                    {shipping === 0 ? 'Kostenlos' : formatPrice(shipping)}
                  </span>
                </div>

                {subtotal < 49 && subtotal > 0 && (
                  <p className="text-xs text-brand-secondary bg-brand-surface rounded px-3 py-2 border border-brand-border">
                    Noch <strong>{formatPrice(49 - subtotal)}</strong> bis zum kostenlosen Versand
                  </p>
                )}

                <div className="border-t border-brand-border pt-3 flex justify-between font-semibold text-base">
                  <span>Gesamtbetrag</span>
                  <span>{formatPrice(total + shipping)}</span>
                </div>
                <p className="text-xs text-brand-secondary">Inkl. MwSt.</p>
              </div>

              <p className="text-center text-sm text-brand-secondary mt-6 leading-relaxed">
                Kontaktiere uns über die Produktseite, um deine Bestellung aufzugeben.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
