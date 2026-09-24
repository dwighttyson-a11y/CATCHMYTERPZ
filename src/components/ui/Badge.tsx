import type { ProductBadge } from '../../types'

const badgeStyles: Record<ProductBadge, string> = {
  'Bestseller': 'bg-brand-accent text-brand-bg',
  'Neu': 'bg-brand-purple text-white',
  'Sale': 'bg-brand-accent text-brand-bg',
  'Limitiert': 'bg-orange-500 text-white',
  'Empfohlen': 'bg-brand-purple-light text-white',
  'Premium': 'bg-yellow-600 text-white',
  'Rarität': 'bg-brand-accent text-brand-bg',
}

export function Badge({ badge, className = '' }: { badge: ProductBadge; className?: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 text-[10px] font-black tracking-wider uppercase ${badgeStyles[badge]} ${className}`}>
      {badge}
    </span>
  )
}
