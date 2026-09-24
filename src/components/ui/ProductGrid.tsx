import type { Product } from '../../types'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: Product[]
  columns?: 2 | 3 | 4
  variant?: 'default' | 'compact'
  emptyMessage?: string
}

const colClasses = {
  2: 'grid-cols-2 md:grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
}

export function ProductGrid({ products, columns = 4, variant = 'default', emptyMessage }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-brand-secondary text-lg">{emptyMessage ?? 'Keine Produkte gefunden.'}</p>
      </div>
    )
  }

  return (
    <div className={`grid ${colClasses[columns]} gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} variant={variant} />
      ))}
    </div>
  )
}
