import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react'
import { products as BASE_PRODUCTS } from '../data/products'
import type { Product } from '../types'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CatalogSection {
  id: string
  slug: string
  label: string
  colour: string
  textDark: boolean
  desc: string
  order: number
}

export interface GramTier {
  grams: number
  price: number
}

export interface PremiumSlots {
  slot1: string | null
  slot2: string | null
  slot3: string | null
}

export interface ProductOverride {
  productId: string
  name?: string
  shortDescription?: string
  description?: string
  sectionSlug?: string
  order?: number
  badge?: string
  isPremium?: boolean
  price?: number
  compareAtPrice?: number | null  // null = explicitly cleared
  inventory?: number
  gramTiers?: GramTier[]
  galleryItems?: string[]  // ordered media IDs from the global library
}

interface CatalogContextValue {
  // Sections (sorted by order)
  sections: CatalogSection[]
  addSection: (s: Omit<CatalogSection, 'id' | 'order'>) => void
  updateSection: (id: string, patch: Partial<Omit<CatalogSection, 'id'>>) => void
  deleteSection: (id: string) => void
  moveSectionUp: (id: string) => void
  moveSectionDown: (id: string) => void

  // Product overrides
  productOverrides: Record<string, ProductOverride>
  setProductOverride: (productId: string, patch: Partial<Omit<ProductOverride, 'productId'>>) => void
  clearProductOverride: (productId: string) => void

  // Resolved data (base + overrides merged)
  resolvedProducts: Product[]
  getProductsForSection: (slug: string) => Product[]

  // Premium Selection slots (3 independent slots)
  premiumSlots: PremiumSlots
  setPremiumSlot: (slot: 1 | 2 | 3, productId: string | null) => void
  premiumProducts: Product[]  // ordered slot1→slot2→slot3, nulls omitted
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_SECTIONS: CatalogSection[] = [
  {
    id: 's-static-hash',
    slug: 'static-hash',
    label: 'STATIC HASH',
    colour: '#7C3AED',
    textDark: false,
    desc: 'Pressed pollen perfection',
    order: 0,
  },
  {
    id: 's-wpff',
    slug: 'wpff',
    label: 'WPFF',
    colour: '#A8CE2C',
    textDark: true,
    desc: 'Full-flavour flower power',
    order: 1,
  },
  {
    id: 's-bubble-hash',
    slug: 'bubble-hash',
    label: 'BUBBLE HASH',
    colour: '#C0567A',
    textDark: false,
    desc: 'Ice-water extracted purity',
    order: 2,
  },
]

// ─── Storage helpers ──────────────────────────────────────────────────────────

const SECTIONS_KEY = 'cmt_catalog_sections'

function loadSections(): CatalogSection[] {
  try {
    const raw = localStorage.getItem(SECTIONS_KEY)
    if (raw) return JSON.parse(raw) as CatalogSection[]
  } catch { /* ignore */ }
  return DEFAULT_SECTIONS
}

function saveSections(s: CatalogSection[]): void {
  localStorage.setItem(SECTIONS_KEY, JSON.stringify(s))
}

const PREMIUM_SLOTS_KEY = 'cmt_premium_slots'
const DEFAULT_SLOTS: PremiumSlots = { slot1: null, slot2: null, slot3: null }

function loadPremiumSlots(): PremiumSlots {
  try {
    const raw = localStorage.getItem(PREMIUM_SLOTS_KEY)
    if (raw) return { ...DEFAULT_SLOTS, ...JSON.parse(raw) as PremiumSlots }
  } catch { /* ignore */ }
  return DEFAULT_SLOTS
}

function savePremiumSlots(s: PremiumSlots): void {
  localStorage.setItem(PREMIUM_SLOTS_KEY, JSON.stringify(s))
}

async function persistOverrides(o: Record<string, ProductOverride>): Promise<void> {
  if (import.meta.env.PROD) return
  try {
    await fetch('/api/catalog/overrides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(o),
    })
  } catch { /* ignore */ }
}

function persistSections(s: CatalogSection[]): void {
  if (import.meta.env.PROD) return
  fetch('/api/catalog/sections', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(s),
  }).catch(() => { /* ignore */ })
}

function persistPremiumSlots(s: PremiumSlots): void {
  if (import.meta.env.PROD) return
  fetch('/api/catalog/premium-slots', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(s),
  }).catch(() => { /* ignore */ })
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CatalogContext = createContext<CatalogContextValue | null>(null)

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [sections,     setSections]     = useState<CatalogSection[]>(loadSections)
  const [overrides,    setOverrides]    = useState<Record<string, ProductOverride>>({})
  const [premiumSlots, setPremiumSlots] = useState<PremiumSlots>(loadPremiumSlots)

  // Always-current snapshot of overrides — lets callbacks persist without stale closure issues.
  const overridesRef    = useRef<Record<string, ProductOverride>>({})
  overridesRef.current  = overrides

  // After a local write, ignore incoming poll/SSE results for 15 s so they
  // don't overwrite state before the server has flushed the file.
  const ignorePollUntil = useRef(0)

  useEffect(() => {
    if (import.meta.env.PROD) {
      // Production: read everything from the committed static file — no server needed
      fetch('/catalog-config.json', { cache: 'no-store' })
        .then(r => r.ok ? r.json() : null)
        .then((data: { overrides?: Record<string, ProductOverride>; sections?: CatalogSection[]; premiumSlots?: PremiumSlots } | null) => {
          if (!data) return
          if (data.overrides)               setOverrides(data.overrides)
          if (data.sections?.length)        setSections(data.sections)
          if (data.premiumSlots) {
            setPremiumSlots(prev => ({
              slot1: data.premiumSlots!.slot1 ?? prev.slot1,
              slot2: data.premiumSlots!.slot2 ?? prev.slot2,
              slot3: data.premiumSlots!.slot3 ?? prev.slot3,
            }))
          }
        })
        .catch(() => { /* ignore — serve from localStorage defaults */ })
      return
    }

    // Dev: API endpoints backed by the Vite dev server
    let source: EventSource | null = null

    const reloadOverrides = () => {
      fetch('/api/catalog/overrides', { cache: 'no-store' })
        .then(r => r.ok ? r.json() : {})
        .then((data: Record<string, ProductOverride>) => {
          if (Date.now() < ignorePollUntil.current) return   // local save in flight — skip
          setOverrides(data)
        })
        .catch(() => { /* ignore */ })
    }

    // On mount: load full config so sections + premiumSlots reflect server state
    fetch('/api/catalog/config', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then((data: { overrides?: Record<string, ProductOverride>; sections?: CatalogSection[]; premiumSlots?: PremiumSlots } | null) => {
        if (!data) return
        if (data.overrides)        setOverrides(data.overrides)
        if (data.sections?.length) setSections(data.sections)
        if (data.premiumSlots) {
          setPremiumSlots(prev => ({
            slot1: data.premiumSlots!.slot1 ?? prev.slot1,
            slot2: data.premiumSlots!.slot2 ?? prev.slot2,
            slot3: data.premiumSlots!.slot3 ?? prev.slot3,
          }))
        }
      })
      .catch(() => { /* ignore — falls back to localStorage */ })

    // Always-on polling every 8 s — guarantees freshness on all devices
    const pollTimer = window.setInterval(reloadOverrides, 8_000)

    // SSE for instant updates (bonus on top of polling)
    try {
      source = new EventSource('/api/catalog/events')
      source.addEventListener('update', reloadOverrides)
    } catch { /* SSE not available — polling covers it */ }

    return () => {
      source?.close()
      window.clearInterval(pollTimer)
    }
  }, [])

  useEffect(() => { saveSections(sections); persistSections(sections) }, [sections])
  useEffect(() => { savePremiumSlots(premiumSlots); persistPremiumSlots(premiumSlots) }, [premiumSlots])

  // Sorted sections
  const sortedSections = useMemo(
    () => [...sections].sort((a, b) => a.order - b.order),
    [sections],
  )

  // Merge base product with any override.
  // gramTiers from the admin are the ONLY source of variant/pricing options —
  // base product variants are always cleared so nothing hardcoded can surface.
  const resolvedProducts = useMemo<Product[]>(() => {
    return BASE_PRODUCTS.map(p => {
      const ov = overrides[p.id]
      const resolved: Product = {
        ...p,
        ...(ov?.name             !== undefined && { name: ov.name }),
        ...(ov?.shortDescription !== undefined && { shortDescription: ov.shortDescription }),
        ...(ov?.description      !== undefined && { description: ov.description }),
        ...(ov?.sectionSlug      !== undefined && { collection: ov.sectionSlug }),
        ...(ov?.badge            !== undefined && { badge: ov.badge as Product['badge'] }),
        ...(ov?.price            !== undefined && { price: ov.price }),
        ...(ov?.compareAtPrice   !== undefined && { compareAtPrice: ov.compareAtPrice ?? undefined }),
        ...(ov?.inventory        !== undefined && { inventory: ov.inventory }),
      }

      // Build variants exclusively from admin-entered gramTiers.
      // If no gramTiers are saved, variants is empty — nothing is shown.
      const tiers = ov?.gramTiers ?? []
      resolved.variants = tiers.length > 0
        ? [{
            name: 'Menge',
            type: 'size' as const,
            options: tiers.map((tier, i) => ({
              id: `${p.id}-tier-${i}`,
              name: `${tier.grams}g`,
              value: `${tier.grams}g`,
              available: true,
              priceModifier: tier.price,
            })),
          }]
        : []

      return resolved
    })
  }, [overrides])

  const getProductsForSection = useCallback((slug: string): Product[] => {
    const inSection = resolvedProducts.filter(p => p.collection === slug)
    // Sort by override order if set, else by original index
    return [...inSection].sort((a, b) => {
      const oa = overrides[a.id]?.order ?? 9999
      const ob = overrides[b.id]?.order ?? 9999
      if (oa !== ob) return oa - ob
      return resolvedProducts.indexOf(a) - resolvedProducts.indexOf(b)
    })
  }, [resolvedProducts, overrides])

  const premiumProducts = useMemo<Product[]>(() => {
    return [premiumSlots.slot1, premiumSlots.slot2, premiumSlots.slot3]
      .map(id => id ? resolvedProducts.find(p => p.id === id) : undefined)
      .filter((p): p is Product => p != null)
  }, [resolvedProducts, premiumSlots])

  // ── Section CRUD ──

  const addSection = useCallback((s: Omit<CatalogSection, 'id' | 'order'>) => {
    setSections(prev => {
      const maxOrder = prev.reduce((m, x) => Math.max(m, x.order), -1)
      return [...prev, { ...s, id: `s-${Date.now()}`, order: maxOrder + 1 }]
    })
  }, [])

  const updateSection = useCallback((id: string, patch: Partial<Omit<CatalogSection, 'id'>>) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))
  }, [])

  const deleteSection = useCallback((id: string) => {
    setSections(prev => prev.filter(s => s.id !== id))
  }, [])

  const moveSectionUp = useCallback((id: string) => {
    setSections(prev => {
      const sorted = [...prev].sort((a, b) => a.order - b.order)
      const idx = sorted.findIndex(s => s.id === id)
      if (idx <= 0) return prev
      const next = sorted.map((s, i) => {
        if (i === idx - 1) return { ...s, order: idx }
        if (i === idx)     return { ...s, order: idx - 1 }
        return s
      })
      return next
    })
  }, [])

  const moveSectionDown = useCallback((id: string) => {
    setSections(prev => {
      const sorted = [...prev].sort((a, b) => a.order - b.order)
      const idx = sorted.findIndex(s => s.id === id)
      if (idx < 0 || idx >= sorted.length - 1) return prev
      const next = sorted.map((s, i) => {
        if (i === idx)     return { ...s, order: idx + 1 }
        if (i === idx + 1) return { ...s, order: idx }
        return s
      })
      return next
    })
  }, [])

  // ── Product overrides ──
  // Both functions compute the new overrides synchronously from the ref (always
  // current), update React state, and immediately POST to the server.  This
  // avoids the effect-based save which could be skipped when skipNextSave was
  // set by an incoming SSE/poll right before the effect ran.

  const setProductOverride = useCallback((productId: string, patch: Partial<Omit<ProductOverride, 'productId'>>) => {
    const next = {
      ...overridesRef.current,
      [productId]: { ...overridesRef.current[productId], productId, ...patch },
    }
    ignorePollUntil.current = Date.now() + 15_000
    overridesRef.current = next
    setOverrides(next)
    persistOverrides(next)
  }, [])

  const clearProductOverride = useCallback((productId: string) => {
    const next = { ...overridesRef.current }
    delete next[productId]
    ignorePollUntil.current = Date.now() + 15_000
    overridesRef.current = next
    setOverrides(next)
    persistOverrides(next)
  }, [])

  const setPremiumSlot = useCallback((slot: 1 | 2 | 3, productId: string | null) => {
    setPremiumSlots(prev => ({ ...prev, [`slot${slot}`]: productId }))
  }, [])

  return (
    <CatalogContext.Provider value={{
      sections: sortedSections,
      addSection, updateSection, deleteSection, moveSectionUp, moveSectionDown,
      productOverrides: overrides,
      setProductOverride, clearProductOverride,
      resolvedProducts,
      getProductsForSection,
      premiumSlots,
      setPremiumSlot,
      premiumProducts,
    }}>
      {children}
    </CatalogContext.Provider>
  )
}

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be inside CatalogProvider')
  return ctx
}
