import { useEffect } from 'react'
import { Hero } from '../components/sections/Hero'
import { ProductCarousel } from '../components/sections/ProductCarousel'
import { ProductCatalog } from '../components/sections/ProductCatalog'
export function HomePage() {
  useEffect(() => {
    document.title = 'CatchMyTerpz 069 – Premium Cannabis'
  }, [])

  return (
    <main id="main-content">
      <Hero />
      <ProductCarousel />
      <ProductCatalog />
    </main>
  )
}
