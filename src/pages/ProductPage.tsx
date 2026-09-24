import { useEffect, useMemo, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { Instagram, MessageCircle } from 'lucide-react'
import { getRelatedProducts } from '../data/products'
import { useProductImages } from '../context/ProductImageContext'
import { useMediaItems } from '../context/MediaContext'
import { useCatalog } from '../context/CatalogContext'
import { ProductGallery } from '../components/ui/ProductGallery'
import type { GalleryMediaItem } from '../components/ui/ProductGallery'
import { VariantSelector } from '../components/ui/VariantSelector'
import { Badge } from '../components/ui/Badge'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { ProductGrid } from '../components/ui/ProductGrid'

const SOCIAL_LINKS = [
  {
    href:    'https://www.instagram.com/catchmyterpzz069/',
    label:   'INSTAGRAM',
    sub:     'Schreib uns auf Instagram',
    colour:  '#C0567A',
    icon: (
      <Instagram size={20} strokeWidth={1.5} />
    ),
  },
  {
    href:   'https://signal.me/#eu/lpp-wWDSP4uEHHRKPyYm8zopk8v_T4uJN98SZEdBZOaBtr5i4oZM9IvBeebjau_4',
    label:  'SIGNAL',
    sub:    'Schreib uns auf Signal',
    colour: '#A8CE2C',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 6.628 5.374 12 12 12 6.628 0 12-5.372 12-12 0-6.627-5.372-12-12-12zm5.92 8.549l-1.978 9.32c-.147.658-.53.818-1.074.508l-2.977-2.193-1.437 1.382c-.159.159-.292.292-.598.292l.213-3.028 5.506-4.975c.239-.213-.053-.331-.372-.118L6.55 14.617l-2.932-.916c-.638-.199-.65-.638.133-.945l11.555-4.455c.531-.192.996.13.614.248z"/>
      </svg>
    ),
  },
  {
    href:   'https://invite.viber.com/?g2=AQAdw%2FOf21o71Vbfv9ERSMyDYQEPc0rHaRsu0bJc8KFyj%2BG6acK9tMbJVuP78nh8',
    label:  'VIBER',
    sub:    'Schreib uns auf Viber',
    colour: '#7360f2',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.4 0C6.392.026 2.978 1.79 2.978 1.79S-.573 4.017.08 10.188c.357 3.39 1.555 9.64 7.367 11.15v2.562s-.04.988.614 1.188c.79.246 1.254-.51 2.009-1.327l1.38-1.597c3.796.319 6.712-.41 7.042-.517.767-.247 5.105-.804 5.812-6.55C25.044 8.5 23.76 2.64 11.4 0zm.2 20.36s0 0 0 0l-1.565 1.74-.484.538s-.118.13-.22.086c-.066-.028-.083-.113-.083-.113l.003-3.325s-4.917-1.17-5.186-6.913c-.268-5.741 3.618-9.04 9.14-9.384.194-.012.39-.018.59-.018 7.165 0 9.756 4.023 9.756 4.023s2.634 5.338-.742 9.764c-.47.614-1.538 1.59-4.04 1.983-2.505.394-5.077.102-7.17-.38zm4.79-9.59c.017.363-.543.388-.56.024-.063-1.348-.946-2.127-2.293-2.173-.362-.013-.347-.573.016-.56 1.666.057 2.77 1.034 2.837 2.71zm1.273.52c-.007.356-.549.348-.542-.008.04-2.167-1.32-3.7-3.734-3.872-.36-.026-.33-.587.03-.561 2.698.19 4.282 1.965 4.246 4.44zm1.347.506c.003.362-.555.37-.558.007-.056-3.09-1.95-5.05-5.208-5.285-.36-.025-.332-.587.028-.562 3.578.25 5.686 2.455 5.738 5.84zM13.74 13.69c.26.167.278.432.052.655 0 0-.504.548-1.073.748-.006.002-.01.004-.016.006-.278.092-.635.046-.947-.178 0 0-1.16-.875-1.996-1.71-.498-.499-1.18-1.354-1.588-1.91l-.003-.005c-.224-.312-.27-.67-.178-.948.002-.006.004-.01.006-.016.2-.569.748-1.073.748-1.073.223-.226.488-.208.655.052.371.578.766 1.107 1.18 1.583l.002.002c.367.422.754.8 1.163 1.135.437.36.978.717 1.995 1.659z"/>
      </svg>
    ),
  },
  {
    href:   'https://threema.id/AB5B4S6T',
    label:  'THREEMA',
    sub:    'Schreib uns auf Threema',
    colour: '#3BC371',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm-1 8.5h2v1.25a2.5 2.5 0 0 1 2.5 2.5v.25h-7v-.25a2.5 2.5 0 0 1 2.5-2.5V12.5zm-5 2.5h2v.5a5 5 0 0 0-.38 1H6v-.5a2 2 0 0 1 0-1zm12 0a2 2 0 0 1 0 1v.5h-2.62a5 5 0 0 0-.38-1v-.5h3z"/>
      </svg>
    ),
  },
]

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const { getProductImage }  = useProductImages()
  const { items: mediaItems } = useMediaItems()
  const { resolvedProducts, sections, productOverrides } = useCatalog()
  const product   = slug ? (resolvedProducts.find(p => p.slug === slug) ?? null) : null
  const productId = product?.id ?? ''

  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [enquiryOpen,      setEnquiryOpen]      = useState(false)

  useEffect(() => {
    if (product) {
      document.title = `${product.name} – CATCHMYTERPZ 069`
      if (product.variants) {
        const defaults: Record<string, string> = {}
        product.variants.forEach((group) => {
          const available = group.options.find((o) => o.available)
          if (available) defaults[group.name] = available.value
        })
        setSelectedVariants(defaults)
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [product])

  // Build the gallery: gallery items take priority, fall back to single custom image
  const resolvedGallery = useMemo((): GalleryMediaItem[] => {
    const galleryIds = productOverrides[productId]?.galleryItems ?? []
    if (galleryIds.length > 0) {
      return galleryIds
        .map(id => mediaItems.find(m => m.id === id))
        .filter((m): m is NonNullable<typeof m> => m !== undefined)
        .map(m => ({ id: m.id, type: m.type as 'image' | 'video', src: m.url }))
    }
    if (!productId) return []
    const customImage = getProductImage(productId)
    if (customImage) return [{ id: productId, type: 'image' as const, src: customImage }]
    return []
  }, [productOverrides, productId, mediaItems, getProductImage])

  if (!product) return <Navigate to="/" replace />

  const related    = getRelatedProducts(product, 4)
  const collection = sections.find(s => s.slug === product.collection) ?? null

  const handleVariantChange = (groupName: string, value: string) => {
    setSelectedVariants((prev) => ({ ...prev, [groupName]: value }))
  }

  return (
    <main id="main-content">
      <div className="container-base py-6 lg:py-10">
        <Breadcrumbs
          crumbs={[
            ...(collection ? [{ label: collection.label, to: `/collections/${collection.slug}` }] : []),
            { label: product.name },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 mt-8">
          {/* Gallery — left */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <ProductGallery media={resolvedGallery} productName={product.name} />
          </div>

          {/* Product info — right */}
          <div className="flex flex-col gap-5">
            {/* Badge only (no rating) */}
            {product.badge && (
              <div>
                <Badge badge={product.badge} />
              </div>
            )}

            {/* Name */}
            <h1 className="font-serif text-3xl lg:text-4xl font-semibold text-brand-text leading-tight">
              {product.name}
            </h1>

            {/* Short description */}
            {product.shortDescription && (
              <p className="text-brand-secondary leading-relaxed">{product.shortDescription}</p>
            )}

            {/* Variants (gram tiers with admin-entered pricing) */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4 pt-2">
                {product.variants.map((group) => (
                  <VariantSelector
                    key={group.name}
                    variantGroup={group}
                    selectedValue={selectedVariants[group.name] ?? group.options[0]?.value ?? ''}
                    onChange={handleVariantChange}
                  />
                ))}
              </div>
            )}

            {/* ── Enquiry section ── */}
            <div className="pt-2 flex flex-col gap-3">
              {/* Enquire button */}
              <button
                onClick={() => setEnquiryOpen(o => !o)}
                style={{
                  width: '100%',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  padding: '14px 24px',
                  fontSize: '0.7rem', letterSpacing: '0.22em', fontWeight: 900, textTransform: 'uppercase',
                  background: enquiryOpen
                    ? 'linear-gradient(135deg, #5B21B6, #7C3AED)'
                    : 'linear-gradient(135deg, #7C3AED, #5B21B6)',
                  color: '#fff',
                  border: '1px solid rgba(168,206,44,0.25)',
                  boxShadow: '0 0 32px rgba(124,58,237,0.4), 0 4px 16px rgba(0,0,0,0.4)',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.3s ease, transform 0.2s ease',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.boxShadow = '0 0 50px rgba(124,58,237,0.65), 0 4px 24px rgba(0,0,0,0.5)'
                  el.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.boxShadow = '0 0 32px rgba(124,58,237,0.4), 0 4px 16px rgba(0,0,0,0.4)'
                  el.style.transform = 'translateY(0)'
                }}
              >
                <MessageCircle size={16} strokeWidth={1.5} />
                {enquiryOpen ? 'SCHLIESSEN' : 'JETZT ANFRAGEN'}
                <span style={{ fontSize: '1rem', marginLeft: 2 }}>{enquiryOpen ? '↑' : '↓'}</span>
              </button>

              {/* Social link panel */}
              <div style={{
                display: 'grid',
                gridTemplateRows: enquiryOpen ? '1fr' : '0fr',
                transition: 'grid-template-rows 0.35s ease',
              }}>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{
                    border: '1px solid rgba(124,58,237,0.28)',
                    background: 'rgba(26,22,40,0.85)',
                    backdropFilter: 'blur(14px)',
                    padding: '16px',
                    display: 'flex', flexDirection: 'column', gap: 10,
                  }}>
                    <p style={{
                      fontSize: '0.48rem', fontWeight: 700,
                      letterSpacing: '0.3em', textAlign: 'center',
                      color: 'rgba(144,128,180,0.55)',
                      marginBottom: 4,
                    }}>
                      KONTAKTIERE UNS
                    </p>

                    {SOCIAL_LINKS.map(s => (
                      <a
                        key={s.label}
                        href={s.href}
                        target={s.href !== '#' ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex', alignItems: 'center', gap: 14,
                          padding: '12px 16px',
                          background: `${s.colour}0d`,
                          border: `1px solid ${s.colour}33`,
                          color: '#F0EBF8',
                          textDecoration: 'none',
                          transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
                        }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLAnchorElement
                          el.style.background    = `${s.colour}1a`
                          el.style.borderColor   = `${s.colour}66`
                          el.style.boxShadow     = `0 0 18px ${s.colour}22`
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLAnchorElement
                          el.style.background    = `${s.colour}0d`
                          el.style.borderColor   = `${s.colour}33`
                          el.style.boxShadow     = 'none'
                        }}
                      >
                        <span style={{
                          color: s.colour, display: 'flex', flexShrink: 0,
                          filter: `drop-shadow(0 0 5px ${s.colour}88)`,
                        }}>
                          {s.icon}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: '0.58rem', fontWeight: 900,
                            letterSpacing: '0.2em', color: s.colour,
                            marginBottom: 2,
                          }}>
                            {s.label}
                          </div>
                          <div style={{
                            fontSize: '0.48rem',
                            color: 'rgba(144,128,180,0.6)',
                            letterSpacing: '0.06em',
                          }}>
                            {s.sub}
                          </div>
                        </div>
                        <span style={{ color: s.colour, opacity: 0.6, fontSize: '1rem' }}>→</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-20 lg:mt-28">
            <h2 className="font-serif text-2xl lg:text-3xl font-semibold mb-8">Das könnte dir auch gefallen</h2>
            <ProductGrid products={related} columns={4} variant="compact" />
          </div>
        )}
      </div>
    </main>
  )
}
