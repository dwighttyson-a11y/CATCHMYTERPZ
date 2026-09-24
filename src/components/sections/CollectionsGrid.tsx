import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { collections } from '../../data/products'
import { CollectionCard } from '../ui/CollectionCard'

export function CollectionsGrid() {
  const [first, ...rest] = collections.slice(0, 5)

  return (
    <section className="section-padding bg-brand-surface" aria-labelledby="collections-heading">
      <div className="container-base">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 lg:mb-14">
          <div>
            <p className="eyebrow mb-3">Unser Sortiment</p>
            <h2 id="collections-heading" className="section-title">Kollektionen</h2>
          </div>
          <Link to="/" className="flex items-center gap-2 text-sm font-bold text-brand-secondary hover:text-brand-accent transition-colors group whitespace-nowrap">
            Alle ansehen <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {first && (
            <div className="col-span-2 lg:col-span-1 lg:row-span-2">
              <CollectionCard collection={first} variant="large" />
            </div>
          )}
          {rest.map((col) => (
            <CollectionCard key={col.id} collection={col} />
          ))}
        </div>
      </div>
    </section>
  )
}
