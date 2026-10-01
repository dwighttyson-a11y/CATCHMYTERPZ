import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCatalog } from '../../context/CatalogContext'
import { useProductImages } from '../../context/ProductImageContext'
import { useMediaItems } from '../../context/MediaContext'
import { useMobileSettings } from '../../context/MobileSettingsContext'
import { formatPrice } from '../../utils/helpers'
import type { Product } from '../../types'

const ALL_META = { colour: '#9080B4', onActive: '#fff', glow: 'rgba(144,128,180,0.45)' }

function ProductCard({ product }: { product: Product }) {
  const { getProductImage }            = useProductImages()
  const { sections, productOverrides } = useCatalog()
  const { items: allMedia }            = useMediaItems()

  const [imgIndex,   setImgIndex]   = useState(0)
  const [showArrows, setShowArrows] = useState(false)
  const touchStartX = useRef(0)

  const sec     = sections.find(s => s.slug === product.collection)
  const colour  = sec?.colour  ?? '#7C3AED'
  const label   = sec?.label   ?? product.collection
  const txtDark = sec?.textDark ?? false
  const glow    = `${colour}55`
  const bg      = `linear-gradient(135deg, ${colour}, ${colour}bb)`
  const text    = txtDark ? '#0C0919' : '#fff'

  const options = product.variants?.[0]?.options ?? []

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
      className="group flex flex-col relative"
      style={{
        background: 'linear-gradient(160deg,#131024 0%,#0C0919 100%)',
        border: '1px solid rgba(124,58,237,0.45)',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = colour
        e.currentTarget.style.boxShadow   = `0 0 22px ${glow}, inset 0 0 16px rgba(0,0,0,0.2)`
        setShowArrows(true)
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(124,58,237,0.45)'
        e.currentTarget.style.boxShadow   = 'none'
        setShowArrows(false)
      }}
    >
      {/* Image area */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: '1/1', touchAction: 'pan-y' }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <img
          key={currentSrc}
          src={currentSrc}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-500"
          style={{ filter: 'brightness(0.88)' }}
          loading="lazy"
          decoding="async"
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'linear-gradient(to top, rgba(12,9,25,0.82) 0%, transparent 52%)' }}
        />

        {/* Video indicator badge */}
        {hasVideo && (
          <Link
            to={`/products/${product.slug}`}
            onClick={e => e.stopPropagation()}
            style={{
              position: 'absolute', top: 8, right: 8, zIndex: 11,
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'rgba(12,9,25,0.88)', backdropFilter: 'blur(6px)',
              border: `1px solid ${colour}66`,
              padding: '3px 8px',
              fontSize: '0.5rem', fontWeight: 900, letterSpacing: '0.16em',
              color: colour,
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            ▶ VIDEO
          </Link>
        )}

        {/* Prev arrow */}
        {total > 1 && safeIndex > 0 && showArrows && (
          <button
            onClick={e => goTo(safeIndex - 1, e)}
            style={{
              position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)',
              width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(12,9,25,0.75)', border: '1px solid rgba(124,58,237,0.4)',
              color: '#F0EBF8', cursor: 'pointer', zIndex: 10,
            }}
          >
            <ChevronLeft size={14} strokeWidth={2.5} />
          </button>
        )}

        {/* Next arrow */}
        {total > 1 && safeIndex < total - 1 && showArrows && (
          <button
            onClick={e => goTo(safeIndex + 1, e)}
            style={{
              position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)',
              width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(12,9,25,0.75)', border: '1px solid rgba(124,58,237,0.4)',
              color: '#F0EBF8', cursor: 'pointer', zIndex: 10,
            }}
          >
            <ChevronRight size={14} strokeWidth={2.5} />
          </button>
        )}

        {/* Dot indicators */}
        {total > 1 && (
          <div style={{
            position: 'absolute', top: 6, left: 0, right: 0,
            display: 'flex', justifyContent: 'center', gap: 4, zIndex: 10,
          }}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={e => goTo(i, e)}
                style={{
                  width: i === safeIndex ? 14 : 5,
                  height: 5,
                  borderRadius: 3,
                  background: i === safeIndex ? colour : 'rgba(240,235,248,0.35)',
                  border: 'none', cursor: 'pointer', padding: 0,
                  transition: 'width 0.25s ease, background 0.25s ease',
                }}
              />
            ))}
          </div>
        )}

        {/* VIEW button */}
        <div
          className="absolute bottom-0 left-0 right-0 flex items-center justify-center py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
          style={{ background: 'rgba(12,9,25,0.92)', borderTop: `1px solid ${glow}` }}
        >
          <Link
            to={`/products/${product.slug}`}
            className="font-black uppercase"
            style={{
              fontSize: '0.65rem', letterSpacing: '0.16em',
              background: bg, color: text,
              padding: '5px 14px',
              boxShadow: `0 0 8px ${glow}`,
            }}
            onClick={e => e.stopPropagation()}
          >
            VIEW →
          </Link>
        </div>
      </div>

      {/* Info panel */}
      <div className="flex flex-col px-2.5 pt-2 pb-3 flex-1">
        {/* Labels row — below image, never overlaps */}
        <div className="flex items-center gap-1 flex-wrap mb-1.5">
          <span
            className="text-[10px] font-black uppercase px-1.5 py-0.5"
            style={{ background: bg, color: text, letterSpacing: '0.08em' }}
          >
            {label}
          </span>
          {product.badge && (
            <span
              className="text-[10px] font-black tracking-[0.1em] uppercase px-1.5 py-0.5"
              style={{ background: '#A8CE2C', color: '#0C0919' }}
            >
              {product.badge}
            </span>
          )}
        </div>

        <p
          className="font-black uppercase leading-tight mb-2"
          style={{ color: '#F0EBF8', fontSize: '0.72rem', letterSpacing: '0.04em' }}
        >
          {product.name}
        </p>

        <div
          className="mb-1.5"
          style={{ height: 1, background: `linear-gradient(to right, ${glow}, rgba(124,58,237,0.2), transparent)` }}
        />

        {options.length > 0 && (
          <>
            <p className="mb-1" style={{ fontSize: '0.6rem', letterSpacing: '0.18em', color: 'rgba(144,128,180,0.5)', fontWeight: 800 }}>
              AB
            </p>
            <div className="space-y-1">
              {options.slice(0, 3).map(opt => (
                <div key={opt.id} className="flex items-center justify-between">
                  <span style={{ fontSize: '0.65rem', color: 'rgba(160,140,200,0.75)', fontWeight: 700, letterSpacing: '0.06em' }}>
                    {opt.name}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#A8CE2C', fontWeight: 900, letterSpacing: '0.02em' }}>
                    {formatPrice(opt.priceModifier ?? 0)}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export function ProductCatalog() {
  const { sections, getProductsForSection } = useCatalog()
  const { mobileSettings } = useMobileSettings()
  const [active, setActive] = useState(sections[0]?.slug ?? '')

  const tabs = sections.map(s => ({
    label: s.label,
    value: s.slug,
    meta:  { colour: s.colour, onActive: s.textDark ? '#0C0919' : '#fff', glow: `${s.colour}55` },
  }))

  const displayProducts: Product[] = getProductsForSection(active)

  const activeMeta = tabs.find(t => t.value === active)?.meta ?? ALL_META

  return (
    <section id="catalog" className="min-h-screen" style={{ background: '#0C0919' }}>

      {/* Filter tabs */}
      <div
        className="sticky top-0 z-20 backdrop-blur-md overflow-x-auto scrollbar-hide"
        style={{
          background: 'rgba(9,6,20,0.97)',
          borderBottom: `1px solid ${activeMeta.colour}50`,
          boxShadow: '0 4px 28px rgba(0,0,0,0.5)',
          transition: 'border-color 0.4s ease',
        }}
      >
        <div className="flex items-center gap-2 px-5 py-3 min-w-max">
          {tabs.map(({ label, value, meta }) => {
            const isActive = active === value
            const count = getProductsForSection(value).length
            return (
              <button
                key={value}
                onClick={() => setActive(value)}
                className="flex items-center gap-2 whitespace-nowrap"
                style={{
                  padding: '8px 16px',
                  fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.15em',
                  borderRadius: 2, cursor: 'pointer',
                  border:     isActive ? `1px solid ${meta.colour}` : `1px solid ${meta.colour}28`,
                  background: isActive
                    ? (meta.onActive === '#0C0919' ? meta.colour : `linear-gradient(135deg, ${meta.colour}ee, ${meta.colour}99)`)
                    : `${meta.colour}0a`,
                  color:     isActive ? meta.onActive : `${meta.colour}70`,
                  boxShadow: isActive ? `0 0 18px ${meta.glow}, 0 2px 8px rgba(0,0,0,0.4)` : 'none',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.borderColor = `${meta.colour}55`
                    el.style.color       = `${meta.colour}bb`
                    el.style.background  = `${meta.colour}15`
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.borderColor = `${meta.colour}28`
                    el.style.color       = `${meta.colour}70`
                    el.style.background  = `${meta.colour}0a`
                  }
                }}
              >
                <span style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: isActive ? meta.onActive : meta.colour,
                  flexShrink: 0, display: 'inline-block',
                }} />
                {label}
                <span style={{
                  fontSize: '0.6rem', fontWeight: 900, letterSpacing: '0.04em',
                  padding: '1px 6px', borderRadius: 2,
                  background: isActive ? 'rgba(0,0,0,0.2)' : `${meta.colour}15`,
                  color: isActive
                    ? (meta.onActive === '#0C0919' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.75)')
                    : `${meta.colour}88`,
                  marginLeft: 2,
                }}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Product grid */}
      <div className={`grid ${mobileSettings.productGridCols === 2 ? 'grid-cols-2' : 'grid-cols-3'} sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3 p-3`}>
        {displayProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {displayProducts.length === 0 && (
        <div className="py-24 text-center" style={{ color: 'rgba(144,128,180,0.6)' }}>
          Keine Produkte in dieser Kategorie.
        </div>
      )}
    </section>
  )
}
