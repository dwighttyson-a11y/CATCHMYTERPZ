import { useRef, useEffect, useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '../../context/CartContext'

export function CartPill() {
  const { itemCount, openCart } = useCart()
  const [pulse, setPulse] = useState(false)
  const prevCount = useRef(itemCount)

  useEffect(() => {
    if (itemCount > prevCount.current) {
      setPulse(true)
      const t = setTimeout(() => setPulse(false), 700)
      return () => clearTimeout(t)
    }
    prevCount.current = itemCount
  }, [itemCount])

  if (itemCount === 0) return null

  return (
    <>
      <style>{`
        @keyframes cart-ping {
          0%   { transform: scale(1);    box-shadow: 0 0 32px rgba(124,58,237,0.5), 0 4px 20px rgba(0,0,0,0.4); }
          35%  { transform: scale(1.13); box-shadow: 0 0 55px rgba(168,206,44,0.8), 0 4px 28px rgba(0,0,0,0.5); }
          100% { transform: scale(1);    box-shadow: 0 0 32px rgba(124,58,237,0.5), 0 4px 20px rgba(0,0,0,0.4); }
        }
        .cart-pill-ping { animation: cart-ping 0.7s ease-out !important; }
      `}</style>
      <button
        onClick={openCart}
        className={pulse ? 'cart-pill-ping' : ''}
        aria-label={`Warenkorb – ${itemCount} Artikel`}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '14px 24px',
          background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
          border: '1px solid rgba(168,206,44,0.3)',
          color: '#fff',
          fontWeight: 900,
          fontSize: '0.75rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          boxShadow: '0 0 32px rgba(124,58,237,0.5), 0 4px 20px rgba(0,0,0,0.4)',
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLButtonElement
          el.style.transform = 'translateY(-2px)'
          el.style.boxShadow = '0 0 50px rgba(124,58,237,0.7), 0 6px 28px rgba(0,0,0,0.5)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLButtonElement
          el.style.transform = 'translateY(0)'
          el.style.boxShadow = '0 0 32px rgba(124,58,237,0.5), 0 4px 20px rgba(0,0,0,0.4)'
        }}
      >
        <ShoppingBag size={15} />
        {itemCount} ART.
      </button>
    </>
  )
}
