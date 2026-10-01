import { useRef, useState } from 'react'
import { Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCatalog } from '../../context/CatalogContext'
import { useProductImages } from '../../context/ProductImageContext'
import { useMediaItems } from '../../context/MediaContext'
import { formatPrice } from '../../utils/helpers'
import type { Product } from '../../types'
import type { CatalogSection } from '../../context/CatalogContext'

function doorTexture(colour: string, side: 'left' | 'right') {
  const shade = side === 'left' ? 'to right' : 'to left'
  return [
    `repeating-linear-gradient(0deg,   transparent 0px, transparent 47px, ${colour}07 47px, ${colour}07 48px)`,
    `repeating-linear-gradient(90deg,  transparent 0px, transparent 47px, ${colour}07 47px, ${colour}07 48px)`,
    `linear-gradient(${shade}, rgba(255,255,255,0.015), rgba(0,0,0,0.28))`,
    `linear-gradient(180deg, rgba(14,10,28,0.99) 0%, rgba(7,4,16,0.99) 100%)`,
  ].join(', ')
}

interface VaultPanelProps {
  product: Product
  section: CatalogSection
  isOpen:  boolean
  onClick: () => void
}

function VaultPanel({ product, section, isOpen, onClick }: VaultPanelProps) {
  const { getProductImage }       = useProductImages()
  const { productOverrides }      = useCatalog()
  const { items: allMedia }       = useMediaItems()
  const options  = product.variants?.[0]?.options ?? []
  const colour   = section.colour
  const textDark = section.textDark

  const [imgIndex,   setImgIndex]   = useState(0)
  const touchStartX                  = useRef(0)

  // Build full image list from gallery (images only), falling back to custom/base
  const galleryIds    = productOverrides[product.id]?.galleryItems ?? []
  const galleryImages = galleryIds
    .map(id => allMedia.find(m => m.id === id && m.type === 'image'))
    .filter((m): m is NonNullable<typeof m> => m !== undefined)
    .map(m => m.url)
  const hasVideo = galleryIds.some(id => allMedia.find(m => m.id === id && m.type === 'video'))
  const fallback   = getProductImage(product.id) ?? product.images[0]
  const images     = galleryImages.length > 0 ? galleryImages : (fallback ? [fallback] : [])
  const total      = images.length
  const safeIndex  = Math.min(imgIndex, Math.max(0, total - 1))
  const currentSrc = images[safeIndex] ?? ''

  const goTo = (i: number, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    setImgIndex(Math.max(0, Math.min(total - 1, i)))
  }

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd   = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (dx >  45 && safeIndex > 0)          setImgIndex(safeIndex - 1)
    if (dx < -45 && safeIndex < total - 1)  setImgIndex(safeIndex + 1)
  }

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative', height: 'clamp(420px, 65vh, 560px)',
        overflow: 'hidden', cursor: 'pointer',
        borderRight: '1px solid rgba(45,37,80,0.45)',
      }}
    >
      {/* Product image + overlays */}
      <div
        style={{ position: 'absolute', inset: 0, touchAction: 'pan-y' }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <img
          key={currentSrc}
          src={currentSrc}
          alt={product.name}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transform: isOpen ? 'scale(1.0)' : 'scale(1.1)',
            transition: 'transform 1s ease, filter 0.9s ease',
            filter: isOpen
              ? 'brightness(0.7) contrast(1.12) saturate(1.1)'
              : 'brightness(0.3) saturate(0.4)',
          }}
        />

        {/* Dot indicators — visible when open */}
        {total > 1 && isOpen && (
          <div style={{
            position: 'absolute', top: 10, left: 0, right: 0,
            display: 'flex', justifyContent: 'center', gap: 5, zIndex: 25,
          }}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={e => goTo(i, e)}
                style={{
                  width: i === safeIndex ? 16 : 6,
                  height: 6, borderRadius: 3,
                  background: i === safeIndex ? colour : 'rgba(240,235,248,0.35)',
                  border: 'none', cursor: 'pointer', padding: 0,
                  transition: 'width 0.25s ease, background 0.25s ease',
                }}
              />
            ))}
          </div>
        )}
        {/* Video indicator badge */}
        {hasVideo && (
          <Link
            to={`/products/${product.slug}`}
            onClick={e => e.stopPropagation()}
            style={{
              position: 'absolute', top: 10, right: 10, zIndex: 25,
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'rgba(12,9,25,0.88)', backdropFilter: 'blur(6px)',
              border: `1px solid ${colour}66`,
              padding: '3px 8px',
              fontSize: '0.5rem', fontWeight: 900, letterSpacing: '0.16em',
              color: colour,
              textDecoration: 'none',
              cursor: 'pointer',
              opacity: isOpen ? 1 : 0.7,
              transition: 'opacity 0.4s ease',
            }}
          >
            ▶ VIDEO
          </Link>
        )}

        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 35%, transparent 25%, rgba(4,2,12,0.75) 100%)',
          opacity: isOpen ? 1 : 0, transition: 'opacity 0.9s ease',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '68%',
          background: 'linear-gradient(to top, rgba(6,4,16,0.98), transparent)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%',
          background: `linear-gradient(to top, ${colour}28, transparent)`,
          opacity: isOpen ? 1 : 0, transition: 'opacity 0.8s ease 0.15s',
        }} />
      </div>

      {/* Product info */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '0 22px 30px', zIndex: 5,
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.55s ease 0.38s, transform 0.55s ease 0.38s',
        pointerEvents: isOpen ? 'auto' : 'none',
      }}>
        <span style={{
          display: 'inline-block',
          fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.18em',
          background: colour, color: textDark ? '#0C0919' : '#fff',
          padding: '3px 10px', marginBottom: 10,
          boxShadow: `0 0 18px ${colour}77`,
        }}>
          {section.label}
        </span>

        <h3 style={{
          fontSize: 'clamp(0.9rem, 2.2vw, 1.2rem)',
          fontWeight: 900, letterSpacing: '0.08em',
          color: '#F0EBF8', textTransform: 'uppercase',
          marginBottom: 6, lineHeight: 1.2,
        }}>
          {product.name}
        </h3>

        <p style={{
          fontSize: '0.65rem', color: 'rgba(144,128,180,0.55)',
          letterSpacing: '0.08em', fontStyle: 'italic', marginBottom: 14,
        }}>
          {section.desc}
        </p>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
          {options.slice(0, 3).map((opt, i) => (
            <div key={opt.id} style={{
              padding: '6px 12px',
              border: `1px solid ${colour}40`,
              background: `${colour}0d`,
              animation: isOpen ? 'stageSlideUp 0.4s ease both' : 'none',
              animationDelay: `${0.42 + i * 0.09}s`,
            }}>
              <div style={{ fontSize: '0.6rem', color: 'rgba(160,140,200,0.55)', fontWeight: 700, letterSpacing: '0.1em' }}>
                {opt.name}
              </div>
              <div style={{ fontSize: '0.9rem', color: colour, fontWeight: 900 }}>
                {formatPrice(opt.priceModifier ?? 0)}
              </div>
            </div>
          ))}
        </div>

        <Link
          to={`/products/${product.slug}`}
          onClick={e => e.stopPropagation()}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.16em', textTransform: 'uppercase',
            color: textDark ? '#0C0919' : '#fff',
            background: `linear-gradient(135deg, ${colour}, ${colour}cc)`,
            padding: '10px 24px',
            boxShadow: `0 0 26px ${colour}66`,
          }}
        >
          PRODUKT ANSEHEN →
        </Link>
      </div>

      {/* Left door */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '50%', height: '100%',
        background: doorTexture(colour, 'left'),
        borderRight: `1px solid ${colour}25`,
        transform: isOpen ? 'translateX(-100%)' : 'translateX(0)',
        transition: 'transform 0.72s cubic-bezier(0.34, 1.08, 0.64, 1)',
        zIndex: 10, willChange: 'transform',
      }} />

      {/* Right door */}
      <div style={{
        position: 'absolute', top: 0, right: 0, width: '50%', height: '100%',
        background: doorTexture(colour, 'right'),
        borderLeft: `1px solid ${colour}25`,
        transform: isOpen ? 'translateX(100%)' : 'translateX(0)',
        transition: 'transform 0.72s cubic-bezier(0.34, 1.08, 0.64, 1)',
        zIndex: 10, willChange: 'transform',
      }} />

      {/* Glowing seam */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', width: 2, height: '100%',
        transform: 'translateX(-50%)',
        background: `linear-gradient(to bottom, transparent 4%, ${colour}44 25%, ${colour}88 50%, ${colour}44 75%, transparent 96%)`,
        zIndex: 11, pointerEvents: 'none',
        opacity: isOpen ? 0 : 1, transition: 'opacity 0.18s ease',
      }} />

      {/* Lock icon + label */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 15,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 16, pointerEvents: 'none',
        opacity: isOpen ? 0 : 1, transition: 'opacity 0.22s ease',
      }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            position: 'absolute', width: 80, height: 80, borderRadius: '50%',
            border: `1px solid ${colour}44`,
            animation: 'ambientPulse 2.8s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', width: 58, height: 58, borderRadius: '50%',
            border: `1px solid ${colour}33`,
            animation: 'ambientPulse 2.8s ease-in-out 0.7s infinite',
          }} />
          <Lock
            size={26}
            strokeWidth={1.5}
            style={{
              color: colour,
              filter: `drop-shadow(0 0 10px ${colour}cc) drop-shadow(0 0 24px ${colour}55)`,
            }}
          />
        </div>

        <span style={{
          fontSize: '0.62rem', fontWeight: 900, letterSpacing: '0.3em',
          color: colour, textTransform: 'uppercase',
          textShadow: `0 0 18px ${colour}99`,
        }}>
          {section.label}
        </span>

        <p style={{
          fontSize: '0.6rem', letterSpacing: '0.2em',
          color: 'rgba(144,128,180,0.45)', fontWeight: 700, textTransform: 'uppercase',
        }}>
          Zum Öffnen tippen
        </p>
      </div>

      {/* Panel border overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none',
        border: `1px solid ${colour}${isOpen ? '50' : '18'}`,
        boxShadow: isOpen ? `inset 0 0 55px ${colour}18` : 'none',
        transition: 'border-color 0.5s ease, box-shadow 0.5s ease',
      }} />
    </div>
  )
}

const DEFAULT_SECTION: CatalogSection = {
  id: 'premium-default', slug: 'premium', label: 'PREMIUM',
  colour: '#F59E0B', textDark: false, desc: 'Premium Selection', order: 0,
}

export function ProductCarousel() {
  const { sections, resolvedProducts, premiumSlots } = useCatalog()
  const [openIndex, setOpenIndex]                    = useState<number | null>(null)

  const toggle = (idx: number) =>
    setOpenIndex(prev => prev === idx ? null : idx)

  // Build panels from the 3 independent premium slots
  const items = ([1, 2, 3] as const)
    .map(slot => {
      const productId = premiumSlots[`slot${slot}` as keyof typeof premiumSlots]
      if (!productId) return null
      const product = resolvedProducts.find(p => p.id === productId)
      if (!product) return null
      const section = sections.find(s => s.slug === product.collection) ?? DEFAULT_SECTION
      return { product, section }
    })
    .filter((x): x is { product: Product; section: CatalogSection } => x != null)

  if (items.length === 0) return null

  return (
    <section style={{ background: '#060410' }}>
      {/* Top rule */}
      <div style={{ height: 2, background: 'linear-gradient(to right, transparent, #7C3AED, #A8CE2C, #C0567A, transparent)' }} />

      {/* Heading */}
      <div className="text-center pt-10 pb-8 px-4">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div style={{ flex: 1, maxWidth: 80, height: 1, background: 'linear-gradient(to right, transparent, rgba(124,58,237,0.55))' }} />
          <span style={{ fontSize: '0.55rem', letterSpacing: '0.35em', color: 'rgba(144,128,180,0.6)', fontWeight: 900 }}>✦ CMT 069 ✦</span>
          <div style={{ flex: 1, maxWidth: 80, height: 1, background: 'linear-gradient(to left, transparent, rgba(124,58,237,0.55))' }} />
        </div>
        <img
          src="/premium-selection.png"
          alt="Premium Selection"
          draggable={false}
          style={{
            width: '100%', maxWidth: 280, height: 'auto',
            mixBlendMode: 'screen',
            filter: 'brightness(1.05) contrast(1.05) saturate(1.05)',
            userSelect: 'none', display: 'block', margin: '0 auto 0.25rem',
          }}
        />
        <p style={{ fontSize: '0.55rem', letterSpacing: '0.28em', color: 'rgba(144,128,180,0.38)', fontWeight: 700, marginTop: '-4px' }}>
          KOLLEKTION ENTDECKEN
        </p>
      </div>

      {/* Vault panels */}
      <div className={`grid grid-cols-1 ${Math.min(items.length, 3) >= 2 ? 'sm:grid-cols-2' : ''} ${Math.min(items.length, 3) >= 3 ? 'lg:grid-cols-3' : ''}`}>
        {items.map(({ product, section }, idx) => (
          <VaultPanel
            key={idx}
            product={product}
            section={section}
            isOpen={openIndex === idx}
            onClick={() => toggle(idx)}
          />
        ))}
      </div>

      {/* Bottom rule */}
      <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(124,58,237,0.38), transparent)' }} />
    </section>
  )
}
