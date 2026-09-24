import { useCallback, useRef, useState } from 'react'
import { Images, Upload, Trash2, X, Play, AlertCircle } from 'lucide-react'
import { useMediaLibrary } from '../../context/MediaLibraryContext'
import type { MediaItem } from '../../context/MediaLibraryContext'

const ACCEPTED_IMAGES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const ACCEPTED_VIDEOS = ['video/mp4', 'video/webm', 'video/quicktime']
const ACCEPTED_ALL    = [...ACCEPTED_IMAGES, ...ACCEPTED_VIDEOS]
const MAX_IMAGE_MB    = 50
const MAX_VIDEO_MB    = 500

type FilterTab = 'all' | 'images' | 'videos'

function formatSize(bytes: number): string {
  if (bytes < 1024)           return `${bytes} B`
  if (bytes < 1024 * 1024)   return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function AdminMedia() {
  const { media, isLoading, uploading, uploadFiles, deleteMedia } = useMediaLibrary()

  const [filter,        setFilter]        = useState<FilterTab>('all')
  const [preview,       setPreview]       = useState<MediaItem | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [dragOver,      setDragOver]      = useState(false)
  const [uploadError,   setUploadError]   = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(async (files: File[]) => {
    setUploadError('')
    const valid: File[]   = []
    const errors: string[] = []

    for (const file of files) {
      if (!ACCEPTED_ALL.includes(file.type)) {
        errors.push(`"${file.name}": unsupported type`)
        continue
      }
      const maxMB = file.type.startsWith('video/') ? MAX_VIDEO_MB : MAX_IMAGE_MB
      if (file.size > maxMB * 1024 * 1024) {
        errors.push(`"${file.name}": exceeds ${maxMB} MB limit`)
        continue
      }
      valid.push(file)
    }

    if (errors.length) setUploadError(errors.join(' · '))
    if (valid.length)  await uploadFiles(valid)
  }, [uploadFiles])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (files.length) handleFiles(files)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length) handleFiles(files)
  }

  const handleDelete = async (id: string) => {
    await deleteMedia(id)
    setDeleteConfirm(null)
    if (preview?.id === id) setPreview(null)
  }

  const filtered = media.filter(m =>
    filter === 'all'    ? true :
    filter === 'images' ? m.type === 'image' :
    m.type === 'video'
  )

  const counts = {
    all:    media.length,
    images: media.filter(m => m.type === 'image').length,
    videos: media.filter(m => m.type === 'video').length,
  }

  return (
    <div style={{ padding: '24px 16px', maxWidth: 1000, margin: '0 auto' }}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.webp,.gif,.mp4,.webm,.mov"
        style={{ display: 'none' }}
        onChange={handleInputChange}
      />

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        marginBottom: 20, flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <div style={{
            fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.25em',
            color: '#A8CE2C', textTransform: 'uppercase', marginBottom: 4,
          }}>
            Asset Management
          </div>
          <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', fontWeight: 700, color: '#F0EBF8', margin: 0 }}>
            Media Library
          </h1>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 18px',
            background: uploading
              ? 'rgba(168,206,44,0.2)'
              : 'linear-gradient(135deg, #A8CE2C, #7AAB1E)',
            border: '1px solid rgba(168,206,44,0.4)',
            color: uploading ? '#A8CE2C' : '#0C0919',
            fontSize: '0.68rem', fontWeight: 900, letterSpacing: '0.12em',
            textTransform: 'uppercase', cursor: uploading ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', flexShrink: 0,
          }}
        >
          <Upload size={14} />
          {uploading ? 'Uploading…' : 'Upload Files'}
        </button>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? 'rgba(168,206,44,0.6)' : 'rgba(45,37,80,0.8)'}`,
          background: dragOver ? 'rgba(168,206,44,0.04)' : 'rgba(26,22,40,0.4)',
          padding: '22px 16px', marginBottom: 20,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          cursor: 'pointer', transition: 'all 0.2s',
        }}
      >
        <Upload size={22} color={dragOver ? '#A8CE2C' : '#9080B4'} />
        <div style={{
          fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em',
          color: dragOver ? '#A8CE2C' : '#9080B4',
        }}>
          {dragOver ? 'Drop to upload' : 'Drop files here or click to browse'}
        </div>
        <div style={{ fontSize: '0.58rem', color: 'rgba(144,128,180,0.4)', letterSpacing: '0.04em', textAlign: 'center' }}>
          Images: JPG, PNG, WebP, GIF (max 50 MB) · Videos: MP4, WebM, MOV (max 500 MB)
        </div>
      </div>

      {uploadError && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 8,
          padding: '10px 14px', marginBottom: 14,
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          color: '#FCA5A5', fontSize: '0.78rem',
        }}>
          <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ flex: 1 }}>{uploadError}</span>
          <button
            onClick={() => setUploadError('')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FCA5A5', display: 'flex', flexShrink: 0 }}
          ><X size={13} /></button>
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #2D2550', marginBottom: 16 }}>
        {(['all', 'images', 'videos'] as FilterTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              padding: '9px 18px',
              background: 'transparent', border: 'none',
              borderBottom: filter === tab ? '2px solid #7C3AED' : '2px solid transparent',
              color: filter === tab ? '#C4B5FD' : '#9080B4',
              fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.12em',
              textTransform: 'capitalize', cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            {tab} <span style={{ opacity: 0.55, marginLeft: 3, fontWeight: 700 }}>{counts[tab]}</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: '#9080B4', fontSize: '0.82rem' }}>
          Loading media library…
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          padding: '52px 24px', textAlign: 'center',
          background: '#1A1628', border: '1px solid #2D2550',
        }}>
          <Images size={36} color="#2D2550" style={{ marginBottom: 12 }} />
          <div style={{ fontSize: '0.88rem', color: '#9080B4', marginBottom: 5 }}>
            No {filter === 'all' ? 'media files' : filter} yet
          </div>
          <div style={{ fontSize: '0.7rem', color: 'rgba(144,128,180,0.45)' }}>
            Upload files using the button or drop zone above
          </div>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))',
          gap: 10,
        }}>
          {filtered.map(item => (
            <div
              key={item.id}
              style={{
                background: '#1A1628', border: '1px solid #2D2550',
                overflow: 'hidden', cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#2D2550')}
              onClick={() => setPreview(item)}
            >
              {/* Thumbnail */}
              <div style={{ aspectRatio: '1/1', background: '#0C0919', position: 'relative', overflow: 'hidden' }}>
                {item.type === 'image' ? (
                  <img
                    src={item.objectUrl}
                    alt={item.filename}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <>
                    <video
                      src={item.objectUrl}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      muted
                      playsInline
                      preload="metadata"
                    />
                    <div style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(0,0,0,0.35)',
                    }}>
                      <Play size={26} color="rgba(255,255,255,0.85)" />
                    </div>
                  </>
                )}

                {/* Type badge */}
                <div style={{
                  position: 'absolute', top: 6, left: 6,
                  background: item.type === 'video'
                    ? 'rgba(124,58,237,0.92)'
                    : 'rgba(12,9,25,0.78)',
                  padding: '2px 6px',
                  fontSize: '0.45rem', fontWeight: 900, letterSpacing: '0.1em',
                  color: item.type === 'video' ? '#F0EBF8' : '#A8CE2C',
                  textTransform: 'uppercase',
                }}>
                  {item.type === 'video' ? 'Video' : 'Image'}
                </div>

                {/* Delete button */}
                <button
                  onClick={e => { e.stopPropagation(); setDeleteConfirm(item.id) }}
                  style={{
                    position: 'absolute', top: 6, right: 6,
                    width: 26, height: 26,
                    background: 'rgba(239,68,68,0.88)', border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', borderRadius: 2,
                  }}
                >
                  <Trash2 size={13} color="#fff" />
                </button>
              </div>

              {/* Info */}
              <div style={{ padding: '8px 10px' }}>
                <div style={{
                  fontSize: '0.62rem', fontWeight: 600, color: '#F0EBF8',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  marginBottom: 3,
                }}>
                  {item.filename}
                </div>
                <div style={{
                  fontSize: '0.55rem', color: '#9080B4',
                  display: 'flex', justifyContent: 'space-between',
                }}>
                  <span>{formatSize(item.size)}</span>
                  <span>{formatDate(item.uploadedAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Delete confirmation ── */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(12,9,25,0.88)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 300, padding: 24,
        }}>
          <div style={{
            background: '#1A1628', border: '1px solid rgba(239,68,68,0.35)',
            padding: '24px 28px', maxWidth: 360, width: '100%',
          }}>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#F0EBF8', marginBottom: 8 }}>
              Delete this file?
            </div>
            <div style={{ fontSize: '0.78rem', color: '#9080B4', marginBottom: 22, lineHeight: 1.55 }}>
              The file will be permanently removed from the library. Any product photos already saved from this file will not be affected.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  flex: 1, padding: '11px',
                  background: 'transparent', border: '1px solid #2D2550',
                  color: '#9080B4', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.1em',
                  textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit',
                }}
              >Cancel</button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                style={{
                  flex: 1, padding: '11px',
                  background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)',
                  color: '#FCA5A5', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.1em',
                  textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit',
                }}
              >Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Preview lightbox ── */}
      {preview && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(12,9,25,0.96)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 300, padding: 20,
          }}
          onClick={e => { if (e.target === e.currentTarget) setPreview(null) }}
        >
          <div style={{ maxWidth: 820, width: '100%', position: 'relative' }}>
            <button
              onClick={() => setPreview(null)}
              style={{
                position: 'absolute', top: -14, right: -8, zIndex: 1,
                background: 'rgba(45,37,80,0.9)', border: '1px solid #2D2550',
                color: '#9080B4', cursor: 'pointer', display: 'flex', padding: 8,
              }}
            ><X size={16} /></button>

            {preview.type === 'image' ? (
              <img
                src={preview.objectUrl}
                alt={preview.filename}
                style={{ width: '100%', maxHeight: '72dvh', objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <video
                src={preview.objectUrl}
                controls
                style={{ width: '100%', maxHeight: '72dvh', display: 'block' }}
              />
            )}

            <div style={{
              background: '#1A1628', border: '1px solid #2D2550',
              padding: '12px 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 12, flexWrap: 'wrap',
            }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F0EBF8', marginBottom: 3 }}>
                  {preview.filename}
                </div>
                <div style={{ fontSize: '0.62rem', color: '#9080B4' }}>
                  {preview.mimeType} · {formatSize(preview.size)} · {formatDate(preview.uploadedAt)}
                </div>
              </div>
              <button
                onClick={() => { setDeleteConfirm(preview.id); setPreview(null) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                  color: '#FCA5A5', fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.08em',
                  textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                <Trash2 size={11} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
