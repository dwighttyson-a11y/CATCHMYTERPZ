import { useCallback, useMemo, useRef, useState } from 'react'
import {
  X, CheckCircle, AlertCircle,
  Search, Edit2, Star, ChevronDown, Images, Plus, Minus,
  GripVertical, Trash2, Film, Upload, ArrowUp, ArrowDown,
} from 'lucide-react'
import { products as BASE_PRODUCTS } from '../../data/products'
import { useProductImages } from '../../context/ProductImageContext'
import { useMediaUpload } from '../../context/MediaContext'
import { useCatalog } from '../../context/CatalogContext'
import { useMediaLibrary } from '../../context/MediaLibraryContext'
import { useToast } from '../components/Toast'
import type { Product } from '../../types'
import type { ProductOverride, GramTier } from '../../context/CatalogContext'
import type { MediaItem } from '../../context/MediaLibraryContext'
import type { MediaEntry } from '../../context/MediaContext'

// ─── Image compression ────────────────────────────────────────────────────────
async function compressImage(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      const img = new Image()
      img.onload = () => {
        const MAX = 800
        let { width: w, height: h } = img
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h * MAX / w); w = MAX }
          else        { w = Math.round(w * MAX / h); h = MAX }
        }
        const canvas = document.createElement('canvas')
        canvas.width = w; canvas.height = h
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', 0.82))
      }
      img.onerror = reject
      img.src = e.target!.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

const ACCEPTED_IMAGE = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const ACCEPTED_VIDEO = ['video/mp4', 'video/webm', 'video/quicktime']
const MAX_IMG_MB = 10
const MAX_VID_MB = 200

type EditTab = 'gallery' | 'details'

interface EditState {
  product: Product
  tab: EditTab
  // Gallery
  galleryItemIds:    string[]
  galleryUploading:  boolean
  galleryUploadError: string
  // Details
  name: string
  shortDescription: string
  sectionSlug: string
  badge: string
  gramTiers: GramTier[]
  detailsDirty: boolean
}

function initEditState(product: Product, override: ProductOverride | undefined): EditState {
  return {
    product,
    tab: 'gallery',
    galleryItemIds:    override?.galleryItems ? [...override.galleryItems] : [],
    galleryUploading:  false,
    galleryUploadError: '',
    name:             override?.name ?? product.name,
    shortDescription: override?.shortDescription ?? product.shortDescription,
    sectionSlug:      override?.sectionSlug ?? product.collection,
    badge:            override?.badge ?? product.badge ?? '',
    gramTiers:        override?.gramTiers ? [...override.gramTiers] : [],
    detailsDirty:     false,
  }
}

const BADGE_OPTIONS = ['', 'Bestseller', 'Neu', 'Sale', 'Limitiert', 'Empfohlen', 'Premium', 'Rarität']

export function AdminProducts() {
  const { getProductImage }                                  = useProductImages()
  const { uploadFromDataUrl, uploadBinary }                  = useMediaUpload()
  const { sections, productOverrides, setProductOverride, clearProductOverride, premiumSlots, setPremiumSlot, resolvedProducts, customProducts, addCustomProduct, deleteCustomProduct } = useCatalog()
  const { media, isLoading: libLoading }                     = useMediaLibrary()
  const toast                                                = useToast()

  const [query,         setQuery]         = useState('')
  const [sectionFilter, setSectionFilter] = useState('all')
  const [edit,          setEdit]          = useState<EditState | null>(null)
  const [inputError,    setInputError]    = useState('')
  const [successId,     setSuccessId]     = useState<string | null>(null)
  const [libraryOpen,   setLibraryOpen]   = useState(false)
  const [createOpen,    setCreateOpen]    = useState(false)
  const [createName,    setCreateName]    = useState('')
  const [createDesc,    setCreateDesc]    = useState('')
  const [createSection, setCreateSection] = useState('')
  const [createError,   setCreateError]   = useState('')

  const imgInputRef  = useRef<HTMLInputElement>(null)
  const vidInputRef  = useRef<HTMLInputElement>(null)
  const dragItemRef  = useRef<number | null>(null)
  const dragOverRef  = useRef<number | null>(null)

  // ── Filtered product list ──────────────────────────────────────────────────

  const customProductIds = useMemo(() => new Set(customProducts.map(c => c.id)), [customProducts])

  const filtered = resolvedProducts.filter(p => {
    const matchQuery   = p.name.toLowerCase().includes(query.toLowerCase())
    const matchSection = sectionFilter === 'all' || p.collection === sectionFilter
    return matchQuery && matchSection
  })

  // ── Helpers ────────────────────────────────────────────────────────────────

  const effectiveName = (p: Product) => p.name
  const effectiveSec  = (p: Product) => p.collection

  const currentImgSrc = (p: Product) => {
    const galleryIds = productOverrides[p.id]?.galleryItems ?? []
    if (galleryIds.length > 0) {
      const first = media.find(m => m.id === galleryIds[0] && m.type === 'image')
      if (first) return first.objectUrl
    }
    return getProductImage(p.id) ?? p.images[0]
  }

  // ── Open/close modal ───────────────────────────────────────────────────────

  const openEdit = useCallback((product: Product, tab: EditTab = 'gallery') => {
    const ov = productOverrides[product.id]
    setEdit({ ...initEditState(product, ov), tab })
    setInputError('')
  }, [productOverrides])

  const closeEdit = () => { setEdit(null); setInputError('') }

  // ── Apply gallery change (save immediately) ────────────────────────────────

  const applyGallery = useCallback((newIds: string[]) => {
    if (!edit) return
    setEdit(prev => prev ? { ...prev, galleryItemIds: newIds, galleryUploading: false, galleryUploadError: '' } : prev)
    setProductOverride(edit.product.id, { galleryItems: newIds })
    setSuccessId(edit.product.id)
    setTimeout(() => setSuccessId(null), 2000)
    toast.show('Gallery saved')
  }, [edit, setProductOverride, toast])

  // ── Gallery upload: image ──────────────────────────────────────────────────

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !edit) return
    if (!ACCEPTED_IMAGE.includes(file.type)) {
      setInputError('Unsupported type. Use JPG, PNG or WebP.')
      return
    }
    if (file.size > MAX_IMG_MB * 1024 * 1024) {
      setInputError(`Image too large (max ${MAX_IMG_MB} MB).`)
      return
    }
    setInputError('')
    setEdit(prev => prev ? { ...prev, galleryUploading: true, galleryUploadError: '' } : prev)
    try {
      const id     = `prod_${edit.product.id}_img_${Date.now()}`
      const dataUrl = await compressImage(file)
      const entry  = await uploadFromDataUrl(id, dataUrl) as MediaEntry
      applyGallery([...edit.galleryItemIds, entry.id])
    } catch {
      setEdit(prev => prev ? { ...prev, galleryUploading: false, galleryUploadError: 'Upload failed. Try again.' } : prev)
    }
  }

  // ── Gallery upload: video ──────────────────────────────────────────────────

  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !edit) return
    if (!ACCEPTED_VIDEO.includes(file.type)) {
      setInputError('Unsupported video format. Use MP4, WebM or MOV.')
      return
    }
    if (file.size > MAX_VID_MB * 1024 * 1024) {
      setInputError(`Video too large (max ${MAX_VID_MB} MB).`)
      return
    }
    setInputError('')
    setEdit(prev => prev ? { ...prev, galleryUploading: true, galleryUploadError: '' } : prev)
    try {
      const id    = `prod_${edit.product.id}_vid_${Date.now()}`
      const entry = await uploadBinary(id, file) as MediaEntry
      applyGallery([...edit.galleryItemIds, entry.id])
    } catch {
      setEdit(prev => prev ? { ...prev, galleryUploading: false, galleryUploadError: 'Video upload failed. Try again.' } : prev)
    }
  }

  // ── Gallery: remove item ───────────────────────────────────────────────────

  const removeGalleryItem = useCallback((idToRemove: string) => {
    if (!edit) return
    applyGallery(edit.galleryItemIds.filter(id => id !== idToRemove))
  }, [edit, applyGallery])

  // ── Gallery: reorder (drag-and-drop) ──────────────────────────────────────

  const onDragStart = (idx: number) => { dragItemRef.current = idx }
  const onDragOver  = (e: React.DragEvent, idx: number) => { e.preventDefault(); dragOverRef.current = idx }
  const onDrop      = () => {
    if (!edit || dragItemRef.current === null || dragOverRef.current === null) return
    if (dragItemRef.current === dragOverRef.current) { dragItemRef.current = dragOverRef.current = null; return }
    const newIds = [...edit.galleryItemIds]
    const [moved] = newIds.splice(dragItemRef.current, 1)
    newIds.splice(dragOverRef.current, 0, moved)
    dragItemRef.current = dragOverRef.current = null
    applyGallery(newIds)
  }

  // ── Gallery: move up/down (mobile-friendly) ───────────────────────────────

  const moveItem = useCallback((fromIdx: number, dir: -1 | 1) => {
    if (!edit) return
    const toIdx = fromIdx + dir
    if (toIdx < 0 || toIdx >= edit.galleryItemIds.length) return
    const newIds = [...edit.galleryItemIds]
    const [moved] = newIds.splice(fromIdx, 1)
    newIds.splice(toIdx, 0, moved)
    applyGallery(newIds)
  }, [edit, applyGallery])

  // ── Library picker select ─────────────────────────────────────────────────

  const handleLibrarySelect = useCallback((item: MediaItem) => {
    if (!edit) return
    if (edit.galleryItemIds.includes(item.id)) { setLibraryOpen(false); return }
    setLibraryOpen(false)
    applyGallery([...edit.galleryItemIds, item.id])
  }, [edit, applyGallery])

  // ── Details save ──────────────────────────────────────────────────────────

  const saveDetails = () => {
    if (!edit) return
    const p = edit.product
    const patch: Partial<Omit<ProductOverride, 'productId'>> = {}
    if (edit.name.trim() !== p.name)                              patch.name             = edit.name.trim()
    if (edit.shortDescription.trim() !== p.shortDescription)      patch.shortDescription = edit.shortDescription.trim()
    if (edit.sectionSlug !== p.collection)                        patch.sectionSlug      = edit.sectionSlug
    if (edit.badge !== (p.badge ?? ''))                           patch.badge            = edit.badge

    const validTiers  = edit.gramTiers.filter(t => t.grams > 0 && t.price > 0).sort((a, b) => a.grams - b.grams)
    const currentTiers = productOverrides[p.id]?.gramTiers ?? []
    if (JSON.stringify(validTiers) !== JSON.stringify(currentTiers)) patch.gramTiers = validTiers

    if (Object.keys(patch).length === 0) {
      const existing = productOverrides[p.id]
      if (existing && Object.keys(existing).filter(k => k !== 'productId' && k !== 'galleryItems').length === 0) {
        clearProductOverride(p.id)
      }
    } else {
      setProductOverride(p.id, patch)
    }

    setSuccessId(p.id)
    setTimeout(() => setSuccessId(null), 3000)
    setEdit(prev => prev ? { ...prev, detailsDirty: false } : prev)
    toast.show('Product saved')
  }

  // ── Create product ────────────────────────────────────────────────────────

  const handleCreate = () => {
    if (!createName.trim()) { setCreateError('Product name is required'); return }
    const slug = createSection || sections[0]?.slug
    if (!slug) { setCreateError('Please create a category first'); return }
    addCustomProduct({ name: createName.trim(), shortDescription: createDesc.trim(), collection: slug })
    setCreateOpen(false)
    setCreateName('')
    setCreateDesc('')
    setCreateSection('')
    setCreateError('')
    toast.show('Product created')
  }

  // ── Styles ────────────────────────────────────────────────────────────────

  const s = {
    label: {
      display: 'block', fontSize: '0.58rem', fontWeight: 800,
      letterSpacing: '0.18em', textTransform: 'uppercase' as const,
      color: '#9080B4', marginBottom: 6,
    } as React.CSSProperties,
    input: {
      width: '100%', padding: '10px 12px',
      background: '#0C0919', border: '1px solid #2D2550',
      color: '#F0EBF8', fontSize: '0.85rem', outline: 'none',
      fontFamily: 'inherit', boxSizing: 'border-box' as const,
      borderRadius: 2, transition: 'border-color 0.2s',
    } as React.CSSProperties,
    textarea: {
      width: '100%', padding: '10px 12px',
      background: '#0C0919', border: '1px solid #2D2550',
      color: '#F0EBF8', fontSize: '0.82rem', outline: 'none',
      fontFamily: 'inherit', boxSizing: 'border-box' as const,
      borderRadius: 2, resize: 'vertical' as const,
      minHeight: 90, transition: 'border-color 0.2s',
    } as React.CSSProperties,
    select: {
      width: '100%', padding: '10px 12px',
      background: '#0C0919', border: '1px solid #2D2550',
      color: '#F0EBF8', fontSize: '0.85rem', outline: 'none',
      fontFamily: 'inherit', boxSizing: 'border-box' as const,
      borderRadius: 2, cursor: 'pointer',
      appearance: 'none' as const,
    } as React.CSSProperties,
  }

  const focusBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = 'rgba(124,58,237,0.6)')
  const blurBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = '#2D2550')

  const withGallery = Object.values(productOverrides).filter(ov => (ov.galleryItems?.length ?? 0) > 0).length

  return (
    <div style={{ padding: '24px 16px', maxWidth: 900, margin: '0 auto' }}>
      {/* Hidden file inputs */}
      <input ref={imgInputRef} type="file" accept=".jpg,.jpeg,.png,.webp" style={{ display: 'none' }} onChange={handleImageFileChange} />
      <input ref={vidInputRef} type="file" accept=".mp4,.webm,.mov" style={{ display: 'none' }} onChange={handleVideoFileChange} />

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.25em', color: '#A8CE2C', textTransform: 'uppercase', marginBottom: 4 }}>
          Product Management
        </div>
        <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', fontWeight: 700, color: '#F0EBF8', margin: '0 0 4px' }}>
          Products
        </h1>
        <p style={{ color: '#9080B4', fontSize: '0.8rem', margin: 0 }}>
          {BASE_PRODUCTS.length + customProducts.length} products · {withGallery} with gallery media ·{' '}
          {Object.keys(productOverrides).length} with overrides
        </p>
      </div>

      {/* Add Product */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => { setCreateSection(sections[0]?.slug ?? ''); setCreateOpen(true) }}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', background: 'linear-gradient(135deg, #7C3AED, #5B21B6)', border: '1px solid rgba(124,58,237,0.4)', color: '#fff', fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          <Plus size={13} /> Add New Product
        </button>
      </div>

      {/* Premium Selection Management */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
          <Star size={12} color="#F59E0B" />
          <span style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.25em', color: '#F59E0B', textTransform: 'uppercase' }}>
            Premium Selection
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {([1, 2, 3] as const).map(slot => {
            const slotKey   = `slot${slot}` as keyof typeof premiumSlots
            const productId = premiumSlots[slotKey]
            const product   = productId ? resolvedProducts.find(p => p.id === productId) : null
            const name      = product ? (productOverrides[product.id]?.name ?? product.name) : null
            return (
              <div key={slot} style={{ background: '#1A1628', border: '1px solid rgba(245,158,11,0.2)', padding: '10px 10px 12px' }}>
                <div style={{ fontSize: '0.48rem', fontWeight: 900, letterSpacing: '0.22em', color: '#F59E0B', textTransform: 'uppercase', marginBottom: 8 }}>
                  Section {slot}
                </div>

                {product ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                    <div style={{ width: 34, height: 34, flexShrink: 0, background: '#0C0919', overflow: 'hidden' }}>
                      <img src={currentImgSrc(product)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span style={{ fontSize: '0.58rem', fontWeight: 700, color: '#F0EBF8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                      {name}
                    </span>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.6rem', color: 'rgba(144,128,180,0.4)', fontStyle: 'italic', marginBottom: 8, padding: '4px 0' }}>
                    No product set
                  </div>
                )}

                <div style={{ position: 'relative' }}>
                  <select
                    value={productId ?? ''}
                    onChange={e => setPremiumSlot(slot, e.target.value || null)}
                    style={{ ...s.select, fontSize: '0.62rem', padding: '6px 26px 6px 8px' }}
                    onFocus={focusBorder} onBlur={blurBorder}
                  >
                    <option value="">— None —</option>
                    {resolvedProducts.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={12} color="#9080B4" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, marginBottom: 16 }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} color="#9080B4" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="search" placeholder="Search products…" value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ ...s.input, paddingLeft: 36 }}
            onFocus={focusBorder} onBlur={blurBorder}
          />
        </div>
        <div style={{ position: 'relative', minWidth: 140 }}>
          <select value={sectionFilter} onChange={e => setSectionFilter(e.target.value)} style={s.select} onFocus={focusBorder} onBlur={blurBorder}>
            <option value="all">All Sections</option>
            {sections.map(sec => <option key={sec.id} value={sec.slug}>{sec.label}</option>)}
          </select>
          <ChevronDown size={13} color="#9080B4" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        </div>
      </div>

      {inputError && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', marginBottom: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5', fontSize: '0.8rem' }}>
          <AlertCircle size={14} />
          {inputError}
          <button onClick={() => setInputError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#FCA5A5', display: 'flex' }}>
            <X size={13} />
          </button>
        </div>
      )}

      {/* Product list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(product => {
          const hasGallery  = (productOverrides[product.id]?.galleryItems?.length ?? 0) > 0
          const hasOverride = !!productOverrides[product.id]
          const isSuccess   = successId === product.id
          const secSlug     = effectiveSec(product)
          const sec         = sections.find(s => s.slug === secSlug)

          return (
            <div
              key={product.id}
              style={{
                background: '#1A1628',
                border: `1px solid ${isSuccess ? 'rgba(168,206,44,0.4)' : '#2D2550'}`,
                padding: '12px 14px',
                display: 'flex', alignItems: 'center', gap: 12,
                transition: 'border-color 0.3s',
              }}
            >
              {/* Thumbnail */}
              <div style={{ width: 56, height: 56, flexShrink: 0, background: '#1E1A2E', overflow: 'hidden', position: 'relative' }}>
                <img src={currentImgSrc(product)} alt={effectiveName(product)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {hasGallery && (
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'rgba(168,206,44,0.9)',
                    fontSize: '0.4rem', fontWeight: 900, textAlign: 'center',
                    color: '#0C0919', padding: '1px 0', textTransform: 'uppercase',
                  }}>
                    {productOverrides[product.id]!.galleryItems!.length} items
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#F0EBF8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 3 }}>
                  {isSuccess && <CheckCircle size={12} color="#A8CE2C" style={{ marginRight: 5, display: 'inline', verticalAlign: 'middle' }} />}
                  {effectiveName(product)}
                </div>

                {/* Price tiers */}
                {(() => {
                  const tiers = productOverrides[product.id]?.gramTiers ?? []
                  if (tiers.length > 0) return (
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 4 }}>
                      {tiers.map((t, i) => (
                        <span key={i} style={{ fontSize: '0.52rem', fontWeight: 800, color: '#A8CE2C', background: 'rgba(168,206,44,0.08)', border: '1px solid rgba(168,206,44,0.18)', padding: '1px 6px', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                          {t.grams}g · €{t.price.toFixed(2)}
                        </span>
                      ))}
                    </div>
                  )
                  return (
                    <div style={{ fontSize: '0.5rem', fontWeight: 700, color: 'rgba(144,128,180,0.38)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
                      No price set
                    </div>
                  )
                })()}

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  {sec && (
                    <span style={{ fontSize: '0.52rem', fontWeight: 800, letterSpacing: '0.12em', color: sec.colour, background: `${sec.colour}18`, border: `1px solid ${sec.colour}30`, padding: '1px 6px', textTransform: 'uppercase' }}>
                      {sec.label}
                    </span>
                  )}
                  {hasGallery && (
                    <span style={{ fontSize: '0.5rem', fontWeight: 800, letterSpacing: '0.1em', color: '#A8CE2C', background: 'rgba(168,206,44,0.08)', border: '1px solid rgba(168,206,44,0.2)', padding: '1px 6px' }}>
                      Gallery
                    </span>
                  )}
                  {hasOverride && (
                    <span style={{ fontSize: '0.5rem', fontWeight: 800, letterSpacing: '0.1em', color: '#7C3AED', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', padding: '1px 6px' }}>
                      Edited
                    </span>
                  )}
                  {customProductIds.has(product.id) && (
                    <span style={{ fontSize: '0.5rem', fontWeight: 800, letterSpacing: '0.1em', color: '#06B6D4', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', padding: '1px 6px' }}>
                      Custom
                    </span>
                  )}
                  {[premiumSlots.slot1, premiumSlots.slot2, premiumSlots.slot3].includes(product.id) && (
                    <span style={{ fontSize: '0.5rem', fontWeight: 800, letterSpacing: '0.1em', color: '#F59E0B', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', padding: '1px 6px' }}>
                      <Star size={9} style={{ display: 'inline', marginRight: 2 }} />Premium
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0 }}>
                <button
                  onClick={() => openEdit(product, 'details')}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', color: '#C4B5FD', fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
                >
                  <Edit2 size={11} /> Edit
                </button>
                <button
                  onClick={() => openEdit(product, 'gallery')}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', background: 'rgba(168,206,44,0.08)', border: '1px solid rgba(168,206,44,0.2)', color: '#A8CE2C', fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
                >
                  <Images size={11} /> Gallery
                </button>
                {customProductIds.has(product.id) && (
                  <button
                    onClick={() => { deleteCustomProduct(product.id); toast.show('Product deleted') }}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: 'rgba(239,68,68,0.7)', fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
                  >
                    <Trash2 size={11} /> Delete
                  </button>
                )}
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div style={{ padding: '32px 20px', textAlign: 'center', background: '#1A1628', border: '1px solid #2D2550', color: '#9080B4', fontSize: '0.85rem' }}>
            No products match your search.
          </div>
        )}
      </div>

      {/* ── Edit Modal ── */}
      {edit && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(12,9,25,0.9)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-end', zIndex: 200 }}
          onClick={e => { if (e.target === e.currentTarget) closeEdit() }}
        >
          <div style={{ width: '100%', maxWidth: 560, margin: '0 auto', background: '#1A1628', border: '1px solid rgba(124,58,237,0.3)', boxShadow: '0 -20px 60px rgba(0,0,0,0.5)', borderRadius: '4px 4px 0 0', overflow: 'hidden', maxHeight: '90dvh', display: 'flex', flexDirection: 'column' }}>

            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #2D2550', flexShrink: 0 }}>
              <div>
                <div style={{ fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.2em', color: '#A8CE2C', textTransform: 'uppercase', marginBottom: 2 }}>Edit Product</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#F0EBF8', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {edit.product.name}
                </div>
              </div>
              <button onClick={closeEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9080B4', display: 'flex', padding: 4 }}>
                <X size={19} />
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #2D2550', flexShrink: 0 }}>
              {(['gallery', 'details'] as EditTab[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setEdit(prev => prev ? { ...prev, tab } : prev)}
                  style={{ flex: 1, padding: '10px 14px', background: edit.tab === tab ? 'rgba(124,58,237,0.1)' : 'transparent', border: 'none', borderBottom: edit.tab === tab ? '2px solid #7C3AED' : '2px solid transparent', color: edit.tab === tab ? '#C4B5FD' : '#9080B4', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
                >
                  {tab === 'gallery' ? '🖼 Gallery' : '✏️ Details'}
                </button>
              ))}
            </div>

            {/* Modal body */}
            <div style={{ flex: 1, overflowY: 'auto' }}>

              {/* ── Gallery tab ── */}
              {edit.tab === 'gallery' && (
                <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>

                  {/* Upload buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    <button
                      disabled={edit.galleryUploading}
                      onClick={() => imgInputRef.current?.click()}
                      style={{ padding: '11px 8px', background: 'rgba(124,58,237,0.1)', border: '2px dashed rgba(124,58,237,0.35)', color: edit.galleryUploading ? 'rgba(196,181,253,0.4)' : '#C4B5FD', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: edit.galleryUploading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                    >
                      <Upload size={14} />
                      Photo
                    </button>
                    <button
                      disabled={edit.galleryUploading}
                      onClick={() => vidInputRef.current?.click()}
                      style={{ padding: '11px 8px', background: 'rgba(124,58,237,0.1)', border: '2px dashed rgba(124,58,237,0.35)', color: edit.galleryUploading ? 'rgba(196,181,253,0.4)' : '#C4B5FD', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: edit.galleryUploading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                    >
                      <Film size={14} />
                      Video
                    </button>
                    <button
                      disabled={edit.galleryUploading}
                      onClick={() => setLibraryOpen(true)}
                      style={{ padding: '11px 8px', background: 'rgba(168,206,44,0.06)', border: '1px solid rgba(168,206,44,0.25)', color: '#A8CE2C', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                    >
                      <Images size={14} />
                      Library
                    </button>
                  </div>

                  {/* Upload progress */}
                  {edit.galleryUploading && (
                    <div style={{ padding: '10px 12px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.25)', color: '#C4B5FD', fontSize: '0.72rem', textAlign: 'center' }}>
                      Uploading…
                    </div>
                  )}
                  {edit.galleryUploadError && (
                    <div style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5', fontSize: '0.75rem' }}>
                      {edit.galleryUploadError}
                    </div>
                  )}

                  {/* Gallery items */}
                  {edit.galleryItemIds.length === 0 ? (
                    <div style={{ padding: '32px 20px', textAlign: 'center', background: 'rgba(12,9,25,0.4)', border: '1px dashed rgba(45,37,80,0.6)' }}>
                      <Images size={28} color="#2D2550" style={{ marginBottom: 10 }} />
                      <div style={{ fontSize: '0.78rem', color: '#9080B4', marginBottom: 4 }}>No media assigned</div>
                      <div style={{ fontSize: '0.65rem', color: 'rgba(144,128,180,0.45)' }}>
                        Upload photos or videos, or pick from the library
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.2em', color: '#9080B4', textTransform: 'uppercase', marginBottom: 2 }}>
                        {edit.galleryItemIds.length} item{edit.galleryItemIds.length !== 1 ? 's' : ''} — drag to reorder
                      </div>
                      {edit.galleryItemIds.map((mediaId, idx) => {
                        const item = media.find(m => m.id === mediaId)
                        return (
                          <div
                            key={mediaId}
                            draggable
                            onDragStart={() => onDragStart(idx)}
                            onDragOver={e => onDragOver(e, idx)}
                            onDrop={onDrop}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 10,
                              padding: '8px 10px',
                              background: '#0C0919', border: '1px solid #2D2550',
                              cursor: 'grab', userSelect: 'none',
                              transition: 'border-color 0.15s',
                            }}
                            onDragEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.5)')}
                            onDragLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = '#2D2550')}
                          >
                            {/* Drag handle */}
                            <GripVertical size={14} color="#4A3F70" style={{ flexShrink: 0 }} />

                            {/* Thumbnail */}
                            <div style={{ width: 44, height: 44, flexShrink: 0, background: '#1E1A2E', overflow: 'hidden', position: 'relative' }}>
                              {!item ? (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <AlertCircle size={16} color="#9080B4" />
                                </div>
                              ) : item.type === 'video' ? (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1A1628' }}>
                                  <Film size={16} color="#7C3AED" />
                                </div>
                              ) : (
                                <img src={item.objectUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              )}
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#F0EBF8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {item ? item.filename : 'Missing media'}
                              </div>
                              {item && (
                                <div style={{ fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: item.type === 'video' ? '#7C3AED' : '#A8CE2C', marginTop: 2 }}>
                                  {item.type}
                                  {idx === 0 && (
                                    <span style={{ marginLeft: 6, color: '#F59E0B' }}>★ First</span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Up/Down arrows (mobile-friendly reorder) */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                              <button
                                onClick={() => moveItem(idx, -1)}
                                disabled={idx === 0}
                                style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid rgba(45,37,80,0.6)', color: idx === 0 ? 'rgba(74,63,112,0.3)' : '#9080B4', cursor: idx === 0 ? 'not-allowed' : 'pointer' }}
                              >
                                <ArrowUp size={10} />
                              </button>
                              <button
                                onClick={() => moveItem(idx, 1)}
                                disabled={idx === edit.galleryItemIds.length - 1}
                                style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid rgba(45,37,80,0.6)', color: idx === edit.galleryItemIds.length - 1 ? 'rgba(74,63,112,0.3)' : '#9080B4', cursor: idx === edit.galleryItemIds.length - 1 ? 'not-allowed' : 'pointer' }}
                              >
                                <ArrowDown size={10} />
                              </button>
                            </div>

                            {/* Remove */}
                            <button
                              onClick={() => removeGalleryItem(mediaId)}
                              style={{ width: 30, height: 30, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: 'rgba(239,68,68,0.7)', cursor: 'pointer' }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  <div style={{ fontSize: '0.58rem', color: 'rgba(144,128,180,0.35)', letterSpacing: '0.04em', marginTop: 4 }}>
                    The first item in the list appears first in the customer gallery.
                    Changes save automatically.
                  </div>
                </div>
              )}

              {/* ── Details tab ── */}
              {edit.tab === 'details' && (
                <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>

                  <div>
                    <label style={s.label}>Product Name</label>
                    <input type="text" value={edit.name} onChange={e => setEdit(p => p ? { ...p, name: e.target.value, detailsDirty: true } : p)} style={s.input} onFocus={focusBorder} onBlur={blurBorder} />
                  </div>

                  <div>
                    <label style={s.label}>Short Description</label>
                    <textarea value={edit.shortDescription} onChange={e => setEdit(p => p ? { ...p, shortDescription: e.target.value, detailsDirty: true } : p)} style={{ ...s.textarea, minHeight: 60 }} onFocus={focusBorder} onBlur={blurBorder} />
                  </div>

                  <div>
                    <label style={s.label}>Section / Category</label>
                    <div style={{ position: 'relative' }}>
                      <select value={edit.sectionSlug} onChange={e => setEdit(p => p ? { ...p, sectionSlug: e.target.value, detailsDirty: true } : p)} style={s.select} onFocus={focusBorder} onBlur={blurBorder}>
                        {sections.map(sec => <option key={sec.id} value={sec.slug}>{sec.label}</option>)}
                      </select>
                      <ChevronDown size={13} color="#9080B4" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                  </div>

                  {/* Price & Gram tiers */}
                  <div style={{ background: 'rgba(12,9,25,0.4)', border: '1px solid rgba(45,37,80,0.6)', padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.2em', color: '#A8CE2C', textTransform: 'uppercase' }}>Price &amp; Gram</div>
                      <button
                        type="button"
                        onClick={() => {
                          const last = edit.gramTiers.length > 0 ? edit.gramTiers[edit.gramTiers.length - 1].grams : 0
                          setEdit(p => p ? { ...p, gramTiers: [...p.gramTiers, { grams: last + 500, price: 0 }], detailsDirty: true } : p)
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', background: 'rgba(168,206,44,0.08)', border: '1px solid rgba(168,206,44,0.25)', color: '#A8CE2C', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        <Plus size={11} /> Add +500g
                      </button>
                    </div>

                    {edit.gramTiers.length === 0 ? (
                      <div style={{ fontSize: '0.7rem', color: 'rgba(144,128,180,0.45)', textAlign: 'center', padding: '10px 0' }}>
                        No tiers yet — click Add +500g to start
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 32px', gap: 6 }}>
                          <div style={{ fontSize: '0.5rem', fontWeight: 800, letterSpacing: '0.16em', color: '#9080B4', textTransform: 'uppercase', paddingLeft: 2 }}>Grams</div>
                          <div style={{ fontSize: '0.5rem', fontWeight: 800, letterSpacing: '0.16em', color: '#9080B4', textTransform: 'uppercase', paddingLeft: 2 }}>Price (€)</div>
                          <div />
                        </div>
                        {edit.gramTiers.map((tier, idx) => (
                          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 32px', gap: 6, alignItems: 'center' }}>
                            <div style={{ position: 'relative' }}>
                              <input type="number" value={tier.grams || ''} onChange={e => { const v = parseInt(e.target.value, 10); setEdit(p => { if (!p) return p; const tiers = [...p.gramTiers]; tiers[idx] = { ...tiers[idx], grams: isNaN(v) ? 0 : v }; return { ...p, gramTiers: tiers, detailsDirty: true } }) }} min="1" step="1" placeholder="e.g. 500" style={{ ...s.input, paddingRight: 30, fontSize: '0.82rem' }} onFocus={focusBorder} onBlur={blurBorder} />
                              <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: '0.55rem', fontWeight: 700, color: '#9080B4', pointerEvents: 'none' }}>g</span>
                            </div>
                            <div style={{ position: 'relative' }}>
                              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9080B4', fontSize: '0.8rem', pointerEvents: 'none' }}>€</span>
                              <input type="number" value={tier.price || ''} onChange={e => { const v = parseFloat(e.target.value); setEdit(p => { if (!p) return p; const tiers = [...p.gramTiers]; tiers[idx] = { ...tiers[idx], price: isNaN(v) ? 0 : v }; return { ...p, gramTiers: tiers, detailsDirty: true } }) }} min="0" step="0.01" placeholder="0.00" style={{ ...s.input, paddingLeft: 24, fontSize: '0.82rem' }} onFocus={focusBorder} onBlur={blurBorder} />
                            </div>
                            <button type="button" onClick={() => setEdit(p => { if (!p) return p; return { ...p, gramTiers: p.gramTiers.filter((_, i) => i !== idx), detailsDirty: true } })} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: 'rgba(239,68,68,0.7)', cursor: 'pointer', flexShrink: 0 }}>
                              <Minus size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ fontSize: '0.58rem', color: 'rgba(144,128,180,0.35)', letterSpacing: '0.04em' }}>Tiers are sorted by gram weight on save.</div>
                  </div>

                  {/* Badge */}
                  <div>
                    <label style={s.label}>Badge</label>
                    <div style={{ position: 'relative' }}>
                      <select value={edit.badge} onChange={e => setEdit(p => p ? { ...p, badge: e.target.value, detailsDirty: true } : p)} style={s.select} onFocus={focusBorder} onBlur={blurBorder}>
                        {BADGE_OPTIONS.map(b => <option key={b} value={b}>{b || 'None'}</option>)}
                      </select>
                      <ChevronDown size={13} color="#9080B4" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                  </div>

                  {/* Save details */}
                  <button
                    onClick={saveDetails}
                    style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #7C3AED, #5B21B6)', border: '1px solid rgba(124,58,237,0.4)', color: '#fff', fontSize: '0.68rem', fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    <CheckCircle size={14} /> Save Changes
                  </button>

                  {hasOverride(edit.product.id) && (
                    <button
                      onClick={() => { clearProductOverride(edit.product.id); closeEdit() }}
                      style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid rgba(239,68,68,0.25)', color: 'rgba(239,68,68,0.6)', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      Reset to defaults
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Library Picker Modal ── */}
      {libraryOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(12,9,25,0.92)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: 16 }}
          onClick={e => { if (e.target === e.currentTarget) setLibraryOpen(false) }}
        >
          <div style={{ width: '100%', maxWidth: 680, background: '#1A1628', border: '1px solid rgba(124,58,237,0.3)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', maxHeight: '85dvh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #2D2550', flexShrink: 0 }}>
              <div>
                <div style={{ fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.2em', color: '#A8CE2C', textTransform: 'uppercase', marginBottom: 2 }}>Choose Media</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#F0EBF8' }}>Media Library</div>
              </div>
              <button onClick={() => setLibraryOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9080B4', display: 'flex', padding: 4 }}>
                <X size={19} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
              {libLoading ? (
                <div style={{ padding: '32px', textAlign: 'center', color: '#9080B4', fontSize: '0.82rem' }}>Loading library…</div>
              ) : media.length === 0 ? (
                <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                  <Images size={32} color="#2D2550" style={{ marginBottom: 10 }} />
                  <div style={{ fontSize: '0.85rem', color: '#9080B4', marginBottom: 4 }}>Library is empty</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(144,128,180,0.45)' }}>Go to the Media Library page to upload files first</div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8 }}>
                  {media.map(item => {
                    const already = edit?.galleryItemIds.includes(item.id) ?? false
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleLibrarySelect(item)}
                        style={{ background: '#0C0919', border: `1px solid ${already ? 'rgba(168,206,44,0.5)' : '#2D2550'}`, padding: 0, cursor: already ? 'default' : 'pointer', textAlign: 'left', transition: 'border-color 0.15s', position: 'relative' }}
                        onMouseEnter={e => { if (!already) (e.currentTarget.style.borderColor = 'rgba(168,206,44,0.5)') }}
                        onMouseLeave={e => { if (!already) (e.currentTarget.style.borderColor = '#2D2550') }}
                      >
                        <div style={{ aspectRatio: '1/1', overflow: 'hidden', background: '#1A1628' }}>
                          {item.type === 'video' ? (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6 }}>
                              <Film size={28} color="#7C3AED" />
                              <span style={{ fontSize: '0.5rem', color: '#9080B4', fontWeight: 700, letterSpacing: '0.1em' }}>VIDEO</span>
                            </div>
                          ) : (
                            <img src={item.objectUrl} alt={item.filename} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: already ? 0.4 : 1 }} />
                          )}
                        </div>
                        <div style={{ padding: '6px 8px' }}>
                          <div style={{ fontSize: '0.58rem', fontWeight: 600, color: '#F0EBF8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.filename}
                          </div>
                        </div>
                        {already && (
                          <div style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(168,206,44,0.9)', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CheckCircle size={11} color="#0C0919" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* ── Create Product Modal ── */}
      {createOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(12,9,25,0.9)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-end', zIndex: 200 }}
          onClick={e => { if (e.target === e.currentTarget) setCreateOpen(false) }}
        >
          <div style={{ width: '100%', maxWidth: 480, margin: '0 auto', background: '#1A1628', border: '1px solid rgba(124,58,237,0.3)', boxShadow: '0 -20px 60px rgba(0,0,0,0.5)', borderRadius: '4px 4px 0 0', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #2D2550' }}>
              <div>
                <div style={{ fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.2em', color: '#A8CE2C', textTransform: 'uppercase', marginBottom: 2 }}>New Product</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#F0EBF8' }}>Add to Catalog</div>
              </div>
              <button onClick={() => setCreateOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9080B4', display: 'flex', padding: 4 }}>
                <X size={19} />
              </button>
            </div>
            <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {createError && (
                <div style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5', fontSize: '0.75rem' }}>
                  {createError}
                </div>
              )}
              <div>
                <label style={s.label}>Product Name *</label>
                <input
                  type="text" value={createName} onChange={e => setCreateName(e.target.value)}
                  placeholder="e.g. Moroccan Black" style={s.input}
                  onFocus={focusBorder} onBlur={blurBorder}
                  autoFocus
                />
              </div>
              <div>
                <label style={s.label}>Short Description</label>
                <textarea
                  value={createDesc} onChange={e => setCreateDesc(e.target.value)}
                  placeholder="A short product description…" style={{ ...s.textarea, minHeight: 60 }}
                  onFocus={focusBorder} onBlur={blurBorder}
                />
              </div>
              <div>
                <label style={s.label}>Category</label>
                <div style={{ position: 'relative' }}>
                  <select value={createSection} onChange={e => setCreateSection(e.target.value)} style={s.select} onFocus={focusBorder} onBlur={blurBorder}>
                    {sections.map(sec => <option key={sec.id} value={sec.slug}>{sec.label}</option>)}
                  </select>
                  <ChevronDown size={13} color="#9080B4" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
              </div>
              <button
                onClick={handleCreate}
                style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #7C3AED, #5B21B6)', border: '1px solid rgba(124,58,237,0.4)', color: '#fff', fontSize: '0.68rem', fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <Plus size={14} /> Create Product
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )

  function hasOverride(id: string) { return !!productOverrides[id] }
}
