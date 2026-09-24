import { useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useCatalog } from '../context/CatalogContext'
import { ProductGrid } from '../components/ui/ProductGrid'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'

export function CollectionPage() {
  const { slug } = useParams<{ slug: string }>()
  const { sections, getProductsForSection } = useCatalog()
  const section = slug ? (sections.find(s => s.slug === slug) ?? null) : null
  const sectionProducts = section ? getProductsForSection(section.slug) : []

  useEffect(() => {
    if (section) {
      document.title = `${section.label} – CATCHMYTERPZ 069`
    }
  }, [section])

  if (!section) return <Navigate to="/" replace />

  return (
    <main id="main-content">
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: `${section.colour}18` }}>
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${section.colour}28 0%, transparent 65%)` }}
          aria-hidden="true"
        />
        <div className="container-base relative z-10 py-16 lg:py-24">
          <Breadcrumbs crumbs={[{ label: section.label }]} />
          <div className="mt-6 max-w-xl">
            <div
              className="inline-block px-2 py-0.5 text-xs font-bold uppercase tracking-widest mb-4"
              style={{
                background: section.colour,
                color: section.textDark ? '#0C0919' : '#F0EBF8',
              }}
            >
              {section.label}
            </div>
            <h1 className="font-serif text-4xl lg:text-5xl font-semibold text-brand-text mb-4">
              {section.label}
            </h1>
            <p className="text-brand-secondary text-lg leading-relaxed">{section.desc}</p>
            <p className="text-sm text-brand-secondary mt-4">{sectionProducts.length} Produkte</p>
          </div>
        </div>
      </div>

      <div className="container-base py-12 lg:py-16">
        <ProductGrid
          products={sectionProducts}
          columns={4}
          emptyMessage="Diese Kollektion enthält noch keine Produkte."
        />
      </div>
    </main>
  )
}
