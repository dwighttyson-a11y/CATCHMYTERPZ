import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'

const UPLOADS_DIR = path.resolve('public', 'uploads')
const INDEX_FILE  = path.join(UPLOADS_DIR, '_index.json')
const MAX_BINARY  = 200 * 1024 * 1024   // 200 MB cap for binary (video) uploads

// ── SSE broadcast (media library) ────────────────────────────────────────────
const sseClients = new Set<ServerResponse>()

function broadcast(action: 'upload' | 'delete', id: string): void {
  const line = `event: update\ndata: ${JSON.stringify({ action, id })}\n\n`
  for (const c of sseClients) {
    try { c.write(line) } catch { sseClients.delete(c) }
  }
}

// ── SSE broadcast (catalog overrides) ────────────────────────────────────────
const catalogClients = new Set<ServerResponse>()

function broadcastCatalog(): void {
  const line = `event: update\ndata: {}\n\n`
  for (const c of catalogClients) {
    try { c.write(line) } catch { catalogClients.delete(c) }
  }
}

// ── Index persistence ─────────────────────────────────────────────────────────
interface MediaEntry {
  id: string
  url: string
  filename: string
  mimeType: string
  size: number
  uploadedAt: number
  type: 'image' | 'video'
}

interface MediaIndex { v: number; items: MediaEntry[] }

function readIndex(): MediaIndex {
  try { return JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8')) as MediaIndex }
  catch { return { v: 1, items: [] } }
}

function writeIndex(idx: MediaIndex): void {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true })
  fs.writeFileSync(INDEX_FILE, JSON.stringify(idx, null, 2))
}

function upsertEntry(entry: MediaEntry): void {
  const idx = readIndex()
  const i = idx.items.findIndex(x => x.id === entry.id)
  if (i >= 0) idx.items[i] = entry
  else        idx.items.unshift(entry)
  writeIndex(idx)
}

function removeEntry(id: string): MediaEntry | undefined {
  const idx = readIndex()
  const i = idx.items.findIndex(x => x.id === id)
  if (i < 0) return undefined
  const [removed] = idx.items.splice(i, 1)
  writeIndex(idx)
  return removed
}

// ── MIME ↔ extension maps ─────────────────────────────────────────────────────
const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/png': 'png',
  'image/webp': 'webp', 'image/gif': 'gif',
  'video/mp4': 'mp4', 'video/webm': 'webm', 'video/quicktime': 'mov',
}

const EXT_TO_MIME: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
  webp: 'image/webp', gif: 'image/gif',
  mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime',
}

// ── Startup migration: index any pre-existing files ───────────────────────────
function migrateExistingFiles(): void {
  if (!fs.existsSync(UPLOADS_DIR)) return
  const idx = readIndex()
  const ids = new Set(idx.items.map(x => x.id))
  let changed = false
  try {
    for (const filename of fs.readdirSync(UPLOADS_DIR)) {
      if (filename.startsWith('_')) continue           // skip _index.json
      const id   = filename.replace(/\.[^.]+$/, '')   // strip extension → id
      if (ids.has(id)) continue
      const ext  = path.extname(filename).slice(1).toLowerCase()
      const mime = EXT_TO_MIME[ext] ?? 'application/octet-stream'
      const stat = fs.statSync(path.join(UPLOADS_DIR, filename))
      idx.items.push({
        id, url: `/uploads/${filename}`, filename,
        mimeType: mime, size: stat.size, uploadedAt: stat.mtimeMs,
        type: mime.startsWith('video/') ? 'video' : 'image',
      })
      ids.add(id)
      changed = true
    }
    if (changed) writeIndex(idx)
  } catch { /* ignore — uploads dir may not exist yet */ }
}

// ── HTTP helpers ──────────────────────────────────────────────────────────────
function setCors(res: ServerResponse): void {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
}

function jsonReply(res: ServerResponse, status: number, body: unknown): void {
  res.setHeader('Content-Type', 'application/json')
  res.statusCode = status
  res.end(JSON.stringify(body))
}

function readBody(req: IncomingMessage, maxBytes = MAX_BINARY): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    let total = 0
    req.on('data', (chunk: Buffer) => {
      total += chunk.length
      if (total > maxBytes) { req.destroy(); reject(new Error('Payload too large')); return }
      chunks.push(chunk)
    })
    req.on('end',   () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

// ── Request handler ───────────────────────────────────────────────────────────
async function handleMedia(req: IncomingMessage, res: ServerResponse): Promise<void> {
  setCors(res)
  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return }

  const parsed  = new URL(req.url!, 'http://localhost')
  const parts   = parsed.pathname.split('/').filter(Boolean)  // ['api','media','route']
  const route   = parts[2] ?? ''
  const method  = req.method ?? 'GET'

  // ── GET /api/media/list ────────────────────────────────────────────────────
  if (method === 'GET' && route === 'list') {
    jsonReply(res, 200, readIndex())
    return
  }

  // ── GET /api/media/events  (SSE live sync) ─────────────────────────────────
  if (method === 'GET' && route === 'events') {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders()
    // Keepalive ping every 25 s so proxies / mobile radios don't close the connection
    const ping = setInterval(() => {
      try { res.write(': ping\n\n') }
      catch { clearInterval(ping); sseClients.delete(res) }
    }, 25_000)
    sseClients.add(res)
    req.on('close', () => { clearInterval(ping); sseClients.delete(res) })
    return
  }

  // ── POST /api/media/upload  (base64 JSON — images and small files) ─────────
  if (method === 'POST' && route === 'upload') {
    try {
      const body  = JSON.parse((await readBody(req)).toString()) as { id: string; dataUrl: string }
      const match = body.dataUrl.match(/^data:([^;]+);base64,(.+)$/)
      if (!match) { jsonReply(res, 400, { error: 'invalid dataUrl' }); return }
      const mime     = match[1]
      const ext      = MIME_TO_EXT[mime] ?? 'bin'
      const filename = `${body.id}.${ext}`
      const data     = Buffer.from(match[2], 'base64')
      fs.mkdirSync(UPLOADS_DIR, { recursive: true })
      fs.writeFileSync(path.join(UPLOADS_DIR, filename), data)
      const entry: MediaEntry = {
        id: body.id, url: `/uploads/${filename}`, filename, mimeType: mime,
        size: data.length, uploadedAt: Date.now(),
        type: mime.startsWith('video/') ? 'video' : 'image',
      }
      upsertEntry(entry)
      broadcast('upload', body.id)
      jsonReply(res, 200, entry)
    } catch (e) { jsonReply(res, 500, { error: String(e) }) }
    return
  }

  // ── POST /api/media/upload-binary?id=…&mimeType=…  (raw binary — videos) ──
  if (method === 'POST' && route === 'upload-binary') {
    try {
      const id       = parsed.searchParams.get('id')       ?? `lib_${Date.now()}`
      const mime     = parsed.searchParams.get('mimeType') ?? 'application/octet-stream'
      const ext      = MIME_TO_EXT[mime] ?? 'bin'
      const filename = `${id}.${ext}`
      const data     = await readBody(req)
      fs.mkdirSync(UPLOADS_DIR, { recursive: true })
      fs.writeFileSync(path.join(UPLOADS_DIR, filename), data)
      const entry: MediaEntry = {
        id, url: `/uploads/${filename}`, filename, mimeType: mime,
        size: data.length, uploadedAt: Date.now(),
        type: mime.startsWith('video/') ? 'video' : 'image',
      }
      upsertEntry(entry)
      broadcast('upload', id)
      jsonReply(res, 200, entry)
    } catch (e) { jsonReply(res, 500, { error: String(e) }) }
    return
  }

  // ── DELETE /api/media/:id ─────────────────────────────────────────────────
  if (method === 'DELETE' && route) {
    try {
      const entry = removeEntry(route)
      if (entry) {
        try { fs.unlinkSync(path.join(UPLOADS_DIR, entry.filename)) } catch { /* already gone */ }
        broadcast('delete', route)
      }
      jsonReply(res, 200, { ok: true })
    } catch (e) { jsonReply(res, 500, { error: String(e) }) }
    return
  }

  jsonReply(res, 404, { error: 'not found' })
}

// ── Catalog config persistence ────────────────────────────────────────────────
// Unified config lives in public/ so it's committed to git and served by Netlify.
const CATALOG_CONFIG_FILE = path.resolve('public', 'catalog-config.json')
const CATALOG_LEGACY_FILE = path.resolve('catalog-overrides.json')   // migration source

interface CatalogConfig {
  overrides:    Record<string, unknown>
  sections:     unknown[]
  premiumSlots: { slot1: string | null; slot2: string | null; slot3: string | null }
}

const DEFAULT_CATALOG_CONFIG: CatalogConfig = {
  overrides:    {},
  sections:     [],
  premiumSlots: { slot1: null, slot2: null, slot3: null },
}

function loadCatalogConfig(): CatalogConfig {
  if (fs.existsSync(CATALOG_CONFIG_FILE)) {
    try { return { ...DEFAULT_CATALOG_CONFIG, ...JSON.parse(fs.readFileSync(CATALOG_CONFIG_FILE, 'utf8')) as CatalogConfig } }
    catch { /* fall through */ }
  }
  // First run: migrate from legacy overrides-only file
  const cfg = { ...DEFAULT_CATALOG_CONFIG }
  try {
    if (fs.existsSync(CATALOG_LEGACY_FILE))
      cfg.overrides = JSON.parse(fs.readFileSync(CATALOG_LEGACY_FILE, 'utf8')) as Record<string, unknown>
  } catch { /* ignore */ }
  saveCatalogConfig(cfg)   // write new file immediately so next load uses it
  return cfg
}

function saveCatalogConfig(cfg: CatalogConfig): void {
  fs.mkdirSync(path.dirname(CATALOG_CONFIG_FILE), { recursive: true })
  fs.writeFileSync(CATALOG_CONFIG_FILE, JSON.stringify(cfg, null, 2))
}

async function handleCatalog(req: IncomingMessage, res: ServerResponse): Promise<void> {
  setCors(res)
  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return }

  const parsed = new URL(req.url!, 'http://localhost')
  const route  = parsed.pathname.replace('/api/catalog', '')

  // Full config (used by CatalogContext on mount to restore all state)
  if (req.method === 'GET' && route === '/config') {
    jsonReply(res, 200, loadCatalogConfig())
    return
  }

  // Overrides — backwards-compat + real-time polling target
  if (req.method === 'GET' && route === '/overrides') {
    jsonReply(res, 200, loadCatalogConfig().overrides)
    return
  }

  if (req.method === 'POST' && route === '/overrides') {
    try {
      const body = JSON.parse((await readBody(req, 1_000_000)).toString()) as Record<string, unknown>
      const cfg = loadCatalogConfig()
      cfg.overrides = body
      saveCatalogConfig(cfg)
      broadcastCatalog()
      jsonReply(res, 200, { ok: true })
    } catch (e) { jsonReply(res, 500, { error: String(e) }) }
    return
  }

  // Sections
  if (req.method === 'POST' && route === '/sections') {
    try {
      const body = JSON.parse((await readBody(req, 1_000_000)).toString()) as unknown[]
      const cfg = loadCatalogConfig()
      cfg.sections = body
      saveCatalogConfig(cfg)
      broadcastCatalog()
      jsonReply(res, 200, { ok: true })
    } catch (e) { jsonReply(res, 500, { error: String(e) }) }
    return
  }

  // Premium slots
  if (req.method === 'POST' && route === '/premium-slots') {
    try {
      const body = JSON.parse((await readBody(req, 100_000)).toString()) as CatalogConfig['premiumSlots']
      const cfg = loadCatalogConfig()
      cfg.premiumSlots = body
      saveCatalogConfig(cfg)
      broadcastCatalog()
      jsonReply(res, 200, { ok: true })
    } catch (e) { jsonReply(res, 500, { error: String(e) }) }
    return
  }

  // ── GET /api/catalog/events  (SSE live sync for overrides) ────────────────
  if (req.method === 'GET' && route === '/events') {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders()
    const ping = setInterval(() => {
      try { res.write(': ping\n\n') }
      catch { clearInterval(ping); catalogClients.delete(res) }
    }, 25_000)
    catalogClients.add(res)
    req.on('close', () => { clearInterval(ping); catalogClients.delete(res) })
    return
  }

  jsonReply(res, 404, { error: 'not found' })
}

// ── Vite config ───────────────────────────────────────────────────────────────
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'media-server',
      configureServer(server) {
        migrateExistingFiles()
        server.middlewares.use(
          (req: IncomingMessage, res: ServerResponse, next: () => void) => {
            if (req.url?.startsWith('/api/catalog')) {
              handleCatalog(req, res).catch(e => {
                console.error('[catalog-server]', e)
                try { jsonReply(res, 500, { error: String(e) }) } catch { /* headers already sent */ }
              })
              return
            }
            if (!req.url?.startsWith('/api/media')) { next(); return }
            handleMedia(req, res).catch(e => {
              console.error('[media-server]', e)
              try { jsonReply(res, 500, { error: String(e) }) } catch { /* headers already sent */ }
            })
          },
        )
      },
    },
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: { host: '192.168.1.7' },
  },
  resolve: { alias: { '@': '/src' } },
})
