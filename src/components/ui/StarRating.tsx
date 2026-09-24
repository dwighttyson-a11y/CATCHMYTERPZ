import { Star } from 'lucide-react'
import { getStarArray } from '../../utils/helpers'

interface StarRatingProps {
  rating: number
  reviewCount?: number
  size?: 'sm' | 'md'
  showCount?: boolean
}

export function StarRating({ rating, reviewCount, size = 'sm', showCount = true }: StarRatingProps) {
  const stars = getStarArray(rating)
  const px = size === 'sm' ? 11 : 14

  return (
    <div className="flex items-center gap-1.5" aria-label={`${rating} von 5 Sternen`}>
      <div className="flex items-center gap-0.5">
        {stars.map((type, i) => (
          <Star
            key={i}
            size={px}
            className={
              type === 'full' ? 'fill-brand-accent text-brand-accent'
              : type === 'half' ? 'fill-brand-accent/40 text-brand-accent'
              : 'fill-transparent text-brand-border'
            }
          />
        ))}
      </div>
      {showCount && reviewCount !== undefined && (
        <span className={`text-brand-secondary ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          ({reviewCount.toLocaleString('de-DE')})
        </span>
      )}
    </div>
  )
}
