import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react'

// ── Shared types ──────────────────────────────────────────────────────────────

export interface MediaEntry {
  id: string
  url: string
  filename: string
  mimeType: string
  size: number
  uploadedAt: number
  type: 'image' | 'video'
}

// ── Internal context ──────────────────────────────────────────────────────────

interface MediaCtxValue {
  items:             MediaEntry[]
  isLoading:         boolean
  uploadFromDataUrl: (id: string, dataUrl: string) => Promise<MediaEntry>
  uploadBinary:      (id: string, file: File)      => Promise<MediaEntry>
  deleteItem:        (id: string)                   => Promise<void>
  getById:           (id: string)                   => MediaEntry | undefined
}

const MediaCtx = createContext<MediaCtxValue | null>(null)

function useMediaCtx(): MediaCtxValue {
  const ctx = useContext(MediaCtx)
  if (!ctx) throw new Error('useMediaCtx must be inside <MediaProvider>')
  return ctx
}

// ── Image compression (used when uploading raw files to the media library) ───

function compressBlob(blob: Blob, maxPx = 1200, quality = 0.88): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      const img = new Image()
      img.onload = () => {
        let { width: w, height: h } = img
        if (w > maxPx || h > maxPx) {
          if (w > h) { h = Math.round((h * maxPx) / w); w = maxPx }
          else        { w = Math.round((w * maxPx) / h); h = maxPx }
        }
        const canvas = document.createElement('canvas')
        canvas.width = w; canvas.height = h
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = reject
      img.src = e.target!.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const [items,     setItems]     = useState<MediaEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch the full index from the server (no-store so we always get fresh data)
  const fetchItems = useCallback(async () => {
    try {
      // In production there is no API server — read the committed static index file
      const url = import.meta.env.PROD ? '/uploads/_index.json' : '/api/media/list'
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) return
      const data = (await res.json()) as { items?: MediaEntry[] }
      setItems(data.items ?? [])
    } catch { /* server not reachable — leave current state */ }
  }, [])

  useEffect(() => {
    let source: EventSource | null = null
    let pollTimer: number | undefined

    // Initial load
    fetchItems().then(() => setIsLoading(false))

    // Real-time sync is dev-only — production serves committed static files
    if (!import.meta.env.PROD) {
      try {
        source = new EventSource('/api/media/events')
        source.addEventListener('update', fetchItems)
        source.onerror = () => {
          if (pollTimer === undefined) {
            pollTimer = window.setInterval(fetchItems, 15_000)
          }
        }
      } catch {
        pollTimer = window.setInterval(fetchItems, 15_000)
      }
    }

    return () => {
      source?.close()
      if (pollTimer !== undefined) window.clearInterval(pollTimer)
    }
  }, [fetchItems])

  // Upload a base64 data-URL (already-compressed images from AdminProducts)
  const uploadFromDataUrl = useCallback(
    async (id: string, dataUrl: string): Promise<MediaEntry> => {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, dataUrl }),
      })
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`)
      const entry = (await res.json()) as MediaEntry
      setItems(prev => {
        const i = prev.findIndex(x => x.id === id)
        if (i >= 0) { const next = [...prev]; next[i] = entry; return next }
        return [entry, ...prev]
      })
      return entry
    },
    [],
  )

  // Upload raw binary (videos — avoids base64 overhead)
  const uploadBinary = useCallback(
    async (id: string, file: File): Promise<MediaEntry> => {
      const params = new URLSearchParams({
        id, mimeType: file.type, filename: file.name,
      })
      const res = await fetch(`/api/media/upload-binary?${params}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: await file.arrayBuffer(),
      })
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`)
      const entry = (await res.json()) as MediaEntry
      setItems(prev => {
        const i = prev.findIndex(x => x.id === id)
        if (i >= 0) { const next = [...prev]; next[i] = entry; return next }
        return [entry, ...prev]
      })
      return entry
    },
    [],
  )

  const deleteItem = useCallback(async (id: string): Promise<void> => {
    const res = await fetch(`/api/media/${encodeURIComponent(id)}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(`Delete failed: ${res.status}`)
    setItems(prev => prev.filter(x => x.id !== id))
  }, [])

  const getById = useCallback(
    (id: string) => items.find(x => x.id === id),
    [items],
  )

  return (
    <MediaCtx.Provider
      value={{ items, isLoading, uploadFromDataUrl, uploadBinary, deleteItem, getById }}
    >
      {children}
    </MediaCtx.Provider>
  )
}

// ── useProductImages compat hook ──────────────────────────────────────────────
// Keeps the exact same API as the old ProductImageContext so no component
// that calls useProductImages() needs to change.

interface ProductImageHookValue {
  getProductImage:    (id: string) => string | null
  setProductImage:    (id: string, dataUrl: string) => Promise<void>
  removeProductImage: (id: string) => void
  customImages:       Record<string, string>
}

export function useProductImages(): ProductImageHookValue {
  const { items, uploadFromDataUrl, deleteItem } = useMediaCtx()

  // A flat map of id → URL for every known media item.
  // Components look up their product id here; unrelated ids are simply ignored.
  const customImages = useMemo(() => {
    const map: Record<string, string> = {}
    for (const item of items) map[item.id] = item.url
    return map
  }, [items])

  const getProductImage = useCallback(
    (id: string) => items.find(x => x.id === id)?.url ?? null,
    [items],
  )

  const setProductImage = useCallback(
    async (id: string, dataUrl: string): Promise<void> => {
      await uploadFromDataUrl(id, dataUrl)
    },
    [uploadFromDataUrl],
  )

  const removeProductImage = useCallback(
    (id: string): void => { deleteItem(id).catch(console.warn) },
    [deleteItem],
  )

  return { getProductImage, setProductImage, removeProductImage, customImages }
}

// ── useMediaLibrary compat hook ───────────────────────────────────────────────
// Keeps the exact same API as the old MediaLibraryContext.
// Key difference: objectUrl is now a real HTTP URL served by Vite's static
// server, so it works on every device — not a local blob: URL.

export interface MediaItem {
  id: string
  filename: string
  mimeType: string
  size: number
  uploadedAt: number
  type: 'image' | 'video'
  objectUrl: string
}

interface MediaLibraryHookValue {
  media:       MediaItem[]
  isLoading:   boolean
  uploading:   boolean
  uploadFiles: (files: File[]) => Promise<void>
  deleteMedia: (id: string)    => Promise<void>
  getBlob:     (id: string)    => Promise<Blob | null>
}

export function useMediaLibrary(): MediaLibraryHookValue {
  const {
    items, isLoading, uploadFromDataUrl, uploadBinary, deleteItem, getById,
  } = useMediaCtx()
  const [uploading, setUploading] = useState(false)

  // Map MediaEntry → MediaItem (objectUrl = static HTTP URL — works cross-device)
  const media: MediaItem[] = useMemo(
    () => items.map(item => ({ ...item, objectUrl: item.url })),
    [items],
  )

  const uploadFiles = useCallback(
    async (files: File[]): Promise<void> => {
      setUploading(true)
      try {
        for (const file of files) {
          const id = `lib_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
          if (file.type.startsWith('image/')) {
            // Compress before uploading so mobile delivery is fast
            const dataUrl = await compressBlob(file)
            await uploadFromDataUrl(id, dataUrl)
          } else {
            // Videos: send raw binary so the server can stream range requests
            await uploadBinary(id, file)
          }
        }
      } finally {
        setUploading(false)
      }
    },
    [uploadFromDataUrl, uploadBinary],
  )

  const deleteMedia = useCallback(
    async (id: string): Promise<void> => { await deleteItem(id) },
    [deleteItem],
  )

  // Fetch the file from the static server and return as a Blob.
  // Used by AdminProducts when selecting an image from the library
  // (to re-compress it at product-image dimensions).
  const getBlob = useCallback(
    async (id: string): Promise<Blob | null> => {
      const entry = getById(id)
      if (!entry) return null
      try {
        const res = await fetch(entry.url)
        return await res.blob()
      } catch { return null }
    },
    [getById],
  )

  return { media, isLoading, uploading, uploadFiles, deleteMedia, getBlob }
}

// Raw items access — used by gallery consumers (ProductPage, catalog thumbnails)
export function useMediaItems() {
  const { items, isLoading } = useMediaCtx()
  return { items, isLoading }
}

// Raw upload functions — used by admin gallery so we get back the MediaEntry with its id
export function useMediaUpload() {
  const { uploadFromDataUrl, uploadBinary } = useMediaCtx()
  return { uploadFromDataUrl, uploadBinary }
}
