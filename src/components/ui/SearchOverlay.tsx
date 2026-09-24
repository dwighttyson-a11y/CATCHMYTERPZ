import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Search, X, ArrowRight, Loader } from 'lucide-react'
import { useSearch } from '../../context/SearchContext'
import { formatPrice } from '../../utils/helpers'

const popularSearches = ['Purple Zkittlez', 'OG Kush', 'Gelato', 'Grinder', 'Pre-Roll', 'Hoodie', 'Terpene']

export function SearchOverlay() {
  const { query, results, isOpen, isLoading, setQuery, closeSearch } = useSearch()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) { setTimeout(() => inputRef.current?.focus(), 100); document.body.style.overflow = 'hidden' }
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeSearch() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [closeSearch])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col animate-fade-in" onClick={(e) => e.target === e.currentTarget && closeSearch()}>
      <div className="bg-brand-surface border-b border-brand-border max-h-[90vh] overflow-hidden flex flex-col">
        <div className="container-base py-5">
          <div className="flex items-center gap-4 border-b-2 border-brand-accent pb-4">
            <Search size={22} className="text-brand-accent flex-shrink-0" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Strains, Accessories, Merch suchen…"
              className="flex-1 text-lg sm:text-xl text-brand-text placeholder:text-brand-secondary bg-transparent outline-none"
              autoComplete="off"
            />
            {isLoading && <Loader size={18} className="text-brand-secondary animate-spin" />}
            <button onClick={closeSearch} className="p-3 -mr-2 text-brand-secondary hover:text-brand-text transition-colors" aria-label="Schließen">
              <X size={22} />
            </button>
          </div>
        </div>

        <div className="container-base pb-8 overflow-y-auto">
          {!query && (
            <div>
              <p className="text-xs font-black tracking-widest uppercase text-brand-secondary mb-4">Beliebte Suchen</p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button key={term} onClick={() => setQuery(term)} className="px-4 py-2 border border-brand-border text-sm text-brand-secondary hover:border-brand-accent hover:text-brand-accent transition-all">
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && results.length === 0 && !isLoading && (
            <div className="py-12 text-center">
              <p className="text-brand-secondary">Keine Ergebnisse für <strong className="text-brand-text">„{query}"</strong></p>
            </div>
          )}

          {results.length > 0 && (
            <div>
              <p className="text-xs font-black tracking-widest uppercase text-brand-secondary mb-4">
                {results.length} Ergebnisse
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.slug}`}
                    onClick={closeSearch}
                    className="flex gap-4 p-3 hover:bg-brand-light transition-colors border border-transparent hover:border-brand-border rounded group"
                  >
                    <div className="w-14 h-14 flex-shrink-0 bg-brand-card overflow-hidden border border-brand-border">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-brand-text group-hover:text-brand-accent transition-colors line-clamp-2">{product.name}</p>
                      <p className="text-sm font-black text-brand-accent mt-1">{formatPrice(product.price)}</p>
                    </div>
                    <ArrowRight size={15} className="text-brand-border flex-shrink-0 self-center opacity-0 group-hover:opacity-100 group-hover:text-brand-accent transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
