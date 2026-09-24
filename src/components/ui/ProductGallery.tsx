import { useCallback, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Play, ZoomIn } from 'lucide-react'

export interface GalleryMediaItem {
  id: string
  type: 'image' | 'video'
  src: string
}

interface ProductGalleryProps {
  media: GalleryMediaItem[]
  productName: string
}

export function ProductGallery({ media, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [zoomed,      setZoomed]      = useState(false)
  const [mousePos,    setMousePos]    = useState({ x: 50, y: 50 })
  const [dragOffset,  setDragOffset]  = useState(0)
  const [dragging,    setDragging]    = useState(false)

  const touchStartX = useRef(0)
  const mouseStartX = useRef(0)
  const hasDragged  = useRef(false)

  const total     = media.length
  const safeIndex = total > 0 ? Math.min(Math.max(activeIndex, 0), total - 1) : 0

  const go = useCallback((i: number) => {
    setActiveIndex(Math.min(Math.max(i, 0), total - 1))
    setZoomed(false)
    setDragOffset(0)
  }, [total])

  const prev = useCallback(() => go((safeIndex - 1 + total) % total), [go, safeIndex, total])
  const next = useCallback(() => go((safeIndex + 1) % total),         [go, safeIndex, total])

  // All hooks must appear before early return
  if (total === 0) return null

  const active  = media[safeIndex]
  const isVideo = active.type === 'video'

  // ── Touch (mobile swipe) ──────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchMove = (e: React.TouchEvent) => {
    const delta = e.touches[0].clientX - touchStartX.current
    setDragOffset(delta)
  }
  const onTouchEnd = () => {
    if      (dragOffset < -50 && safeIndex < total - 1) next()
    else if (dragOffset >  50 && safeIndex > 0)         prev()
    setDragOffset(0)
  }

  // ── Mouse (desktop drag + zoom) ───────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    if (isVideo || zoomed) return
    mouseStartX.current = e.clientX
    hasDragged.current  = false
    setDragging(true)
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (zoomed && !isVideo) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width)  * 100,
        y: ((e.clientY - rect.top)  / rect.height) * 100,
      })
      return
    }
    if (!dragging) return
    const delta = e.clientX - mouseStartX.current
    if (Math.abs(delta) > 4) hasDragged.current = true
    setDragOffset(delta)
  }
  const onMouseUp = (e: React.MouseEvent) => {
    if (!dragging) return
    const delta = e.clientX - mouseStartX.current
    if (hasDragged.current) {
      if      (delta < -50) next()
      else if (delta >  50) prev()
    } else if (!isVideo) {
      setZoomed(z => !z)
    }
    setDragOffset(0)
    setDragging(false)
    hasDragged.current = false
  }
  const onMouseLeave = () => {
    if (dragging) { setDragOffset(0); setDragging(false) }
    setZoomed(false)
  }

  // translateX: percentage is relative to the strip (= total * containerWidth)
  // so -safeIndex/total * 100% shifts by exactly safeIndex container widths
  const translateX = `calc(-${(safeIndex / total) * 100}% + ${dragOffset}px)`

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-4">

      {/* Thumbnail strip */}
      {total > 1 && (
        <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:overflow-x-visible scrollbar-hide">
          {media.map((item, i) => (
            <button
              key={item.id}
              onClick={() => go(i)}
              aria-label={item.type === 'video' ? `Video ${i + 1}` : `Bild ${i + 1}`}
              aria-current={i === safeIndex}
              className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 min-w-[64px] overflow-hidden border-2 transition-all duration-200 ${
                i === safeIndex
                  ? 'border-brand-text'
                  : 'border-brand-border hover:border-brand-secondary'
              }`}
            >
              {item.type === 'video' ? (
                <div className="w-full h-full bg-brand-light flex items-center justify-center">
                  <Play size={18} className="text-brand-secondary" fill="currentColor" />
                </div>
              ) : (
                <img
                  src={item.src}
                  alt={`${productName} ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Main view */}
      <div className="flex-1 relative">
        {/* Swipeable container */}
        <div
          className="relative overflow-hidden bg-brand-light aspect-square select-none"
          style={{
            cursor: isVideo ? 'default' : zoomed ? 'zoom-out' : 'grab',
            touchAction: 'pan-y',
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
        >
          {/* Sliding strip */}
          <div
            style={{
              display: 'flex',
              width: `${total * 100}%`,
              height: '100%',
              transform: `translateX(${translateX})`,
              transition: dragging ? 'none' : 'transform 0.38s cubic-bezier(0.25,0.46,0.45,0.94)',
              willChange: 'transform',
            }}
          >
            {media.map((item, i) => (
              <div
                key={item.id}
                style={{ width: `${100 / total}%`, flexShrink: 0, height: '100%' }}
              >
                {item.type === 'video' ? (
                  <video
                    src={item.src}
                    controls
                    muted
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                    onClick={e => e.stopPropagation()}
                    onMouseDown={e => e.stopPropagation()}
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={`${productName} – ${i + 1}`}
                    className="w-full h-full object-cover"
                    style={
                      i === safeIndex && zoomed
                        ? {
                            transform: 'scale(1.55)',
                            transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                            transition: 'transform 0.2s ease',
                          }
                        : { transition: 'transform 0.2s ease' }
                    }
                    draggable={false}
                    decoding="async"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Counter badge — N / total */}
          {total > 1 && (
            <div
              style={{
                position: 'absolute', bottom: 10, right: 10, zIndex: 5,
                background: 'rgba(12,9,25,0.75)', backdropFilter: 'blur(6px)',
                color: 'rgba(240,235,248,0.9)',
                fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.1em',
                padding: '4px 9px',
                pointerEvents: 'none',
              }}
            >
              {safeIndex + 1} / {total}
            </div>
          )}

          {/* Zoom hint (single image only) */}
          {total === 1 && !isVideo && !zoomed && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-brand-card/90 backdrop-blur-sm px-2.5 py-1.5 text-xs text-brand-secondary pointer-events-none">
              <ZoomIn size={12} />
              Zoom
            </div>
          )}
        </div>

        {/* Nav arrows */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 z-10 flex items-center justify-center bg-brand-card/90 border border-brand-border hover:bg-brand-light transition-colors shadow-sm"
              aria-label="Vorheriges"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 z-10 flex items-center justify-center bg-brand-card/90 border border-brand-border hover:bg-brand-light transition-colors shadow-sm"
              aria-label="Nächstes"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
