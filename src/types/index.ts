export interface ProductVariant {
  id: string
  name: string
  value: string
  available: boolean
  priceModifier?: number
}

export interface ProductVariantGroup {
  name: string
  type: 'size' | 'color' | 'flavor' | 'strength'
  options: ProductVariant[]
}

export interface Product {
  id: string
  slug: string
  name: string
  shortDescription: string
  description: string
  specifications: Record<string, string>
  price: number
  compareAtPrice?: number
  images: string[]
  video?: string
  category: ProductCategory
  collection: string
  variants?: ProductVariantGroup[]
  inventory: number
  rating: number
  reviewCount: number
  badge?: ProductBadge
  featured: boolean
  bestSeller: boolean
  new?: boolean
  tags?: string[]
}

export type ProductCategory =
  | 'supplements'
  | 'vitamins'
  | 'skincare'
  | 'wellness'
  | 'nutrition'
  | 'sport'
  | 'minerals'

export type ProductBadge =
  | 'Neu'
  | 'Bestseller'
  | 'Sale'
  | 'Limitiert'
  | 'Empfohlen'
  | 'Premium'
  | 'Rarität'

export interface Collection {
  id: string
  slug: string
  name: string
  description: string
  image: string
  productCount?: number
}

export interface CartItem {
  product: Product
  quantity: number
  selectedVariants?: Record<string, string>
  resolvedPrice?: number
}

export interface Review {
  id: string
  author: string
  rating: number
  date: string
  title: string
  body: string
  verified: boolean
}

export interface FilterState {
  categories: ProductCategory[]
  collections: string[]
  priceRange: [number, number]
  availability: 'all' | 'in-stock'
}

export type SortOption =
  | 'featured'
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'best-selling'
  | 'rating'
