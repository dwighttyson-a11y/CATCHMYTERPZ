import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Eye } from 'lucide-react'
import type { Product } from '../../types'
import { formatPrice, formatDiscount } from '../../utils/helpers'
import { useCart } from '../../context/CartContext'
import { StarRating } from './StarRating'
import { Badge } from './Badge'
import { useProductImages } from '../../context/ProductImageContext'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact'
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const { addItem } = useCart()
  const { getProductImage } = useProductImages()
  const [adding, setAdding] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const imageSrc = getProductImage(product.id) ?? product.images[0]

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setAdding(true)
    addItem(product, 1)
    setTimeout(() => setAdding(false), 1000)
  }

  const discount = product.compareAtPrice ? formatDiscount(product.price, product.compareAtPrice) : 0

  return (
    <article className="group flex flex-col bg-brand-card border border-brand-border hover:border-brand-accent/40 transition-all duration-300">
      {/* Image */}
      <Link
        to={`/products/${product.slug}`}
        className="relative block overflow-hidden bg-brand-surface aspect-[3/4]"
        tabIndex={-1}
        aria-hidden="true"
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.badge && <Badge badge={product.badge} />}
          {discount > 0 && (
            <span className="inline-block px-2 py-0.5 text-[10px] font-black tracking-wider uppercase bg-brand-accent text-brand-bg">
              -{discount}%
            </span>
          )}
        </div>

        {/* Quick view */}
        <Link
          to={`/products/${product.slug}`}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-4 py-2 bg-brand-bg/90 backdrop-blur-sm text-brand-text text-xs font-bold tracking-wide uppercase border border-brand-border opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-250 whitespace-nowrap"
        >
          <Eye size={12} />
          Ansehen
        </Link>

        {/* Image */}
        {!imageLoaded && <div className="absolute inset-0 bg-brand-surface animate-pulse" />}
        <img
          src={imageSrc}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 gap-2 p-4">
        {variant === 'default' && (
          <StarRating rating={product.rating} reviewCount={product.reviewCount} size="sm" />
        )}

        <Link
          to={`/products/${product.slug}`}
          className="text-sm font-bold text-brand-text hover:text-brand-accent transition-colors line-clamp-2 leading-snug"
        >
          {product.name}
        </Link>

        {variant === 'default' && (
          <>
            <div className="flex items-center gap-2 mt-auto">
              <span className="text-base font-black text-brand-accent">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-brand-secondary line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
              <span className="ml-auto text-[10px] text-brand-secondary font-semibold">ab 1g</span>
            </div>

            {product.variants && product.variants.length > 0 ? (
              <Link
                to={`/products/${product.slug}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-black tracking-wide uppercase transition-all duration-250 mt-1 bg-brand-surface text-brand-text border border-brand-border hover:bg-brand-accent hover:text-brand-bg hover:border-brand-accent"
              >
                <ShoppingBag size={13} />
                Auswählen
              </Link>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={product.inventory === 0}
                className={`flex items-center justify-center gap-2 w-full py-2.5 text-xs font-black tracking-wide uppercase transition-all duration-250 mt-1 ${
                  product.inventory === 0
                    ? 'bg-brand-border text-brand-secondary cursor-not-allowed'
                    : adding
                    ? 'bg-brand-accent text-brand-bg'
                    : 'bg-brand-surface text-brand-text border border-brand-border hover:bg-brand-accent hover:text-brand-bg hover:border-brand-accent'
                }`}
                aria-label={`${product.name} in den Warenkorb`}
              >
                <ShoppingBag size={13} />
                {product.inventory === 0 ? 'Ausverkauft' : adding ? 'Hinzugefügt ✓' : 'In den Warenkorb'}
              </button>
            )}
          </>
        )}
      </div>
    </article>
  )
}
