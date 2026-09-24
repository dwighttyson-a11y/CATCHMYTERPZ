import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { X, ShoppingBag, Minus, Plus, Trash2, Tag } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/helpers'

export function CartDrawer() {
  const { state, closeCart, removeItem, updateQuantity, applyCoupon, removeCoupon, itemCount, subtotal, discountAmount, total } = useCart()
  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart() }
    if (state.isOpen) {
      document.addEventListener('keydown', handler)
      document.body.style.overflow = 'hidden'
    }
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = '' }
  }, [state.isOpen, closeCart])

  useEffect(() => { if (state.isOpen) drawerRef.current?.focus() }, [state.isOpen])

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return
    const ok = applyCoupon(couponInput.trim())
    if (ok) { setCouponError(''); setCouponSuccess(true); setTimeout(() => setCouponSuccess(false), 3000) }
    else { setCouponError('Ungültiger Code'); setTimeout(() => setCouponError(''), 3000) }
  }

  const shipping = subtotal >= 49 ? 0 : 4.95
  const freeRemaining = Math.max(0, 49 - subtotal)

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300 ${state.isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeCart}
        aria-hidden="true"
      />

      <aside
        ref={drawerRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Warenkorb"
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-brand-surface border-l border-brand-border z-50 flex flex-col transition-transform duration-350 ease-out outline-none overflow-x-hidden ${state.isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border">
          <div className="flex items-center gap-2">
            <ShoppingBag size={19} className="text-brand-accent" />
            <h2 className="font-black text-base text-brand-text">
              Warenkorb <span className="text-brand-secondary font-normal">({itemCount})</span>
            </h2>
          </div>
          <button onClick={closeCart} className="p-2 -mr-2 text-brand-secondary hover:text-brand-text transition-colors" aria-label="Schließen">
            <X size={20} />
          </button>
        </div>

        {/* Free shipping bar */}
        {freeRemaining > 0 && (
          <div className="px-6 py-3 bg-brand-light border-b border-brand-border">
            <p className="text-xs text-brand-secondary mb-2">
              Noch <strong className="text-brand-accent">{formatPrice(freeRemaining)}</strong> bis zum kostenlosen Versand
            </p>
            <div className="w-full bg-brand-border h-1 rounded-full overflow-hidden">
              <div className="h-full bg-brand-accent rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (subtotal / 49) * 100)}%` }} />
            </div>
          </div>
        )}
        {freeRemaining === 0 && subtotal > 0 && (
          <div className="px-6 py-2 bg-brand-accent/10 border-b border-brand-accent/20">
            <p className="text-xs text-brand-accent font-bold">✓ Kostenloser Versand inklusive</p>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
              <ShoppingBag size={48} className="text-brand-border" />
              <div>
                <p className="text-brand-text font-bold mb-1">Dein Warenkorb ist leer</p>
                <p className="text-sm text-brand-secondary">Entdecke unsere Drops und füge etwas hinzu.</p>
              </div>
              <button onClick={closeCart} className="btn-primary mt-2">Weiter einkaufen</button>
            </div>
          ) : (
            <ul className="divide-y divide-brand-border">
              {state.items.map((item) => (
                <li key={`${item.product.id}-${JSON.stringify(item.selectedVariants)}`} className="px-6 py-4">
                  <div className="flex gap-4">
                    <Link to={`/products/${item.product.slug}`} onClick={closeCart} className="w-20 h-20 flex-shrink-0 bg-brand-card overflow-hidden border border-brand-border">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${item.product.slug}`} onClick={closeCart} className="text-sm font-bold text-brand-text hover:text-brand-accent transition-colors line-clamp-2">
                        {item.product.name}
                      </Link>
                      {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                        <p className="text-xs text-brand-secondary mt-1">
                          {Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-brand-border">
                          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedVariants)} className="w-11 h-11 flex items-center justify-center text-brand-secondary hover:text-brand-accent hover:bg-brand-light transition-colors" aria-label="Weniger">
                            <Minus size={13} />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-brand-text">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariants)} className="w-11 h-11 flex items-center justify-center text-brand-secondary hover:text-brand-accent hover:bg-brand-light transition-colors" aria-label="Mehr">
                            <Plus size={13} />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-black text-brand-accent">{formatPrice((item.resolvedPrice ?? item.product.price) * item.quantity)}</span>
                          <button onClick={() => removeItem(item.product.id, item.selectedVariants)} className="p-2 -mr-1 text-brand-secondary hover:text-red-400 transition-colors" aria-label="Entfernen">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="border-t border-brand-border px-6 py-5 space-y-4">
            {/* Coupon */}
            {!state.couponCode ? (
              <div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-secondary" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      placeholder="Gutscheincode"
                      className="input-base pl-9 py-2 text-sm"
                    />
                  </div>
                  <button onClick={handleApplyCoupon} className="px-4 py-2 bg-brand-accent text-brand-bg text-sm font-black hover:bg-brand-accent-hover transition-colors">
                    Einlösen
                  </button>
                </div>
                <div aria-live="polite" aria-atomic="true">
                  {couponError && <p className="text-xs text-red-400 mt-1">{couponError}</p>}
                  {couponSuccess && <p className="text-xs text-brand-accent mt-1">✓ Code eingelöst!</p>}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-brand-accent/10 border border-brand-accent/30 px-3 py-2 rounded">
                <div className="flex items-center gap-2 text-sm text-brand-accent font-bold">
                  <Tag size={12} />
                  {state.couponCode} · -{state.discount}%
                </div>
                <button onClick={removeCoupon} className="text-brand-secondary hover:text-brand-text transition-colors"><X size={13} /></button>
              </div>
            )}

            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-brand-secondary"><span>Zwischensumme</span><span>{formatPrice(subtotal)}</span></div>
              {discountAmount > 0 && <div className="flex justify-between text-brand-accent"><span>Rabatt</span><span>−{formatPrice(discountAmount)}</span></div>}
              <div className="flex justify-between text-brand-secondary"><span>Versand</span><span className={shipping === 0 ? 'text-brand-accent' : ''}>{shipping === 0 ? 'Kostenlos' : formatPrice(shipping)}</span></div>
              <div className="flex justify-between font-black text-base pt-2 border-t border-brand-border text-brand-text">
                <span>Gesamt</span><span className="text-brand-accent">{formatPrice(total + shipping)}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <Link to="/cart" onClick={closeCart} className="btn-primary w-full text-center shadow-glow-green">Warenkorb anzeigen</Link>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
