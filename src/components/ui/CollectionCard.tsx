import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Collection } from '../../types'

export function CollectionCard({ collection, variant = 'default' }: { collection: Collection; variant?: 'default' | 'large' }) {
  return (
    <Link
      to={`/collections/${collection.slug}`}
      className="group relative block overflow-hidden bg-brand-surface border border-brand-border hover:border-brand-accent/40 transition-all duration-300"
      aria-label={`Kollektion: ${collection.name}`}
    >
      <div className={`relative ${variant === 'large' ? 'aspect-[4/3]' : 'aspect-square'} overflow-hidden`}>
        <img
          src={collection.image}
          alt={collection.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-80"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/90 via-brand-bg/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="font-black text-lg text-brand-text mb-1 group-hover:text-brand-accent transition-colors">
            {collection.name}
          </h3>
          {collection.productCount && (
            <p className="text-brand-secondary text-xs mb-3 font-semibold">{collection.productCount} Produkte</p>
          )}
          <span className="inline-flex items-center gap-1.5 text-xs font-black tracking-widest uppercase text-brand-accent group-hover:gap-2.5 transition-all">
            Entdecken <ArrowRight size={11} />
          </span>
        </div>
      </div>
    </Link>
  )
}
