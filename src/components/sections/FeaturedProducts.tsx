import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { getFeaturedProducts } from '../../data/products'
import { ProductGrid } from '../ui/ProductGrid'

export function FeaturedProducts() {
  const featured = getFeaturedProducts().slice(0, 4)

  return (
    <section className="section-padding" aria-labelledby="featured-heading">
      <div className="container-base">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 lg:mb-14">
          <div>
            <p className="eyebrow mb-3">🔥 Aktuelle Drops</p>
            <h2 id="featured-heading" className="section-title">
              Neue Drops
            </h2>
          </div>
          <Link to="/" className="flex items-center gap-2 text-sm font-bold text-brand-secondary hover:text-brand-accent transition-colors group whitespace-nowrap">
            Alle Produkte
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <ProductGrid products={featured} columns={4} />
      </div>
    </section>
  )
}
