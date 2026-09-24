import { createContext, useContext, useRef, useState, useCallback, type ReactNode } from 'react'
import type { Product } from '../types'
import { debounce } from '../utils/helpers'
import { useCatalog } from './CatalogContext'

interface SearchContextValue {
  query: string
  results: Product[]
  isOpen: boolean
  isLoading: boolean
  setQuery: (q: string) => void
  openSearch: () => void
  closeSearch: () => void
  clearSearch: () => void
}

const SearchContext = createContext<SearchContextValue | null>(null)

export function SearchProvider({ children }: { children: ReactNode }) {
  const { resolvedProducts } = useCatalog()
  const resolvedProductsRef = useRef(resolvedProducts)
  resolvedProductsRef.current = resolvedProducts

  const [query, setQueryState] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const search = useCallback(
    debounce((q: string) => {
      if (!q.trim()) {
        setResults([])
        setIsLoading(false)
        return
      }
      const lower = q.toLowerCase()
      const found = resolvedProductsRef.current.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.shortDescription.toLowerCase().includes(lower) ||
          p.tags?.some((t) => t.includes(lower)) ||
          p.category.includes(lower)
      )
      setResults(found.slice(0, 8))
      setIsLoading(false)
    }, 250),
    []
  )

  const setQuery = (q: string) => {
    setQueryState(q)
    if (q.trim()) setIsLoading(true)
    else setIsLoading(false)
    search(q)
  }

  return (
    <SearchContext.Provider
      value={{
        query,
        results,
        isOpen,
        isLoading,
        setQuery,
        openSearch: () => setIsOpen(true),
        closeSearch: () => {
          setIsOpen(false)
          setQueryState('')
          setResults([])
        },
        clearSearch: () => {
          setQueryState('')
          setResults([])
        },
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const ctx = useContext(SearchContext)
  if (!ctx) throw new Error('useSearch must be used within SearchProvider')
  return ctx
}
