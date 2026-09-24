import { useState } from 'react'
import {
  Plus, Trash2, X, CheckCircle, ChevronUp, ChevronDown,
  Edit2, FolderOpen,
} from 'lucide-react'
import { useCatalog } from '../../context/CatalogContext'
import type { CatalogSection } from '../../context/CatalogContext'

// Preset colour swatches for new/edited sections
const PRESET_COLOURS = [
  '#7C3AED', '#A8CE2C', '#C0567A', '#F59E0B',
  '#10B981', '#3B82F6', '#EF4444', '#EC4899',
  '#8B5CF6', '#06B6D4', '#F97316', '#84CC16',
]

type ModalMode = 'add' | 'edit'

interface ModalState {
  mode: ModalMode
  id?: string
  label: string
  colour: string
  textDark: boolean
  desc: string
}

function emptyModal(): ModalState {
  return { mode: 'add', label: '', colour: '#7C3AED', textDark: false, desc: '' }
}

function fromSection(sec: CatalogSection): ModalState {
  return {
    mode: 'edit',
    id: sec.id,
    label: sec.label,
    colour: sec.colour,
    textDark: sec.textDark,
    desc: sec.desc,
  }
}

export function AdminCategories() {
  const { sections, addSection, updateSection, deleteSection, moveSectionUp, moveSectionDown, getProductsForSection } = useCatalog()

  const [modal,       setModal]       = useState<ModalState | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [successId,   setSuccessId]   = useState<string | null>(null)

  const openAdd  = () => setModal(emptyModal())
  const openEdit = (sec: CatalogSection) => setModal(fromSection(sec))
  const close    = () => setModal(null)

  const handleSave = () => {
    if (!modal || !modal.label.trim()) return
    if (modal.mode === 'add') {
      addSection({
        slug: modal.label.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        label: modal.label.trim().toUpperCase(),
        colour: modal.colour,
        textDark: modal.textDark,
        desc: modal.desc.trim(),
      })
    } else if (modal.mode === 'edit' && modal.id) {
      updateSection(modal.id, {
        label: modal.label.trim().toUpperCase(),
        colour: modal.colour,
        textDark: modal.textDark,
        desc: modal.desc.trim(),
      })
      setSuccessId(modal.id)
      setTimeout(() => setSuccessId(null), 2500)
    }
    close()
  }

  const handleDelete = (id: string) => {
    deleteSection(id)
    setDeleteConfirm(null)
  }

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
  }

  const focusBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = 'rgba(124,58,237,0.6)')
  const blurBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = '#2D2550')

  return (
    <div style={{ padding: '24px 16px', maxWidth: 900, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{
            fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.25em',
            color: '#A8CE2C', textTransform: 'uppercase', marginBottom: 4,
          }}>
            Section Management
          </div>
          <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', fontWeight: 700, color: '#F0EBF8', margin: '0 0 4px' }}>
            Categories
          </h1>
          <p style={{ color: '#9080B4', fontSize: '0.8rem', margin: 0 }}>
            {sections.length} sections · displayed on main page in this order
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '10px 16px', flexShrink: 0,
            background: 'linear-gradient(135deg, #A8CE2C, #7AAB1E)',
            border: '1px solid rgba(168,206,44,0.4)',
            color: '#0C0919', fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.15em',
            textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          <Plus size={14} /> New Section
        </button>
      </div>

      {/* Explanation banner */}
      <div style={{
        padding: '12px 16px', marginBottom: 20,
        background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.18)',
        fontSize: '0.75rem', color: '#9080B4', lineHeight: 1.6,
      }}>
        <strong style={{ color: '#F0EBF8' }}>How sections work:</strong> Each section appears as a tab and vault panel on the main page.
        Move products between sections from the <strong style={{ color: '#A8CE2C' }}>Products</strong> page.
        Use the arrows to reorder how sections appear on the site.
      </div>

      {/* Section list */}
      {sections.length === 0 ? (
        <div style={{
          padding: '40px 20px', textAlign: 'center',
          background: '#1A1628', border: '1px solid #2D2550',
          color: '#9080B4',
        }}>
          <FolderOpen size={32} color="rgba(144,128,180,0.3)" style={{ margin: '0 auto 12px', display: 'block' }} />
          <p style={{ margin: 0, fontSize: '0.85rem' }}>No sections yet. Add your first section above.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sections.map((sec, idx) => {
            const productCount = getProductsForSection(sec.slug).length
            const isSuccess    = successId === sec.id
            const isFirst      = idx === 0
            const isLast       = idx === sections.length - 1

            return (
              <div
                key={sec.id}
                style={{
                  background: '#1A1628',
                  border: `1px solid ${isSuccess ? 'rgba(168,206,44,0.4)' : '#2D2550'}`,
                  padding: '14px 14px',
                  display: 'flex', alignItems: 'center', gap: 12,
                  transition: 'border-color 0.3s',
                }}
              >
                {/* Colour swatch */}
                <div style={{
                  width: 10, height: 52, flexShrink: 0, borderRadius: 2,
                  background: sec.colour,
                  boxShadow: `0 0 8px ${sec.colour}55`,
                }} />

                {/* Reorder */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
                  <button
                    onClick={() => moveSectionUp(sec.id)}
                    disabled={isFirst}
                    style={{
                      background: 'none', border: '1px solid #2D2550', cursor: isFirst ? 'not-allowed' : 'pointer',
                      color: isFirst ? '#2D2550' : '#9080B4',
                      padding: '3px 5px', display: 'flex',
                    }}
                    title="Move up"
                  >
                    <ChevronUp size={12} />
                  </button>
                  <button
                    onClick={() => moveSectionDown(sec.id)}
                    disabled={isLast}
                    style={{
                      background: 'none', border: '1px solid #2D2550', cursor: isLast ? 'not-allowed' : 'pointer',
                      color: isLast ? '#2D2550' : '#9080B4',
                      padding: '3px 5px', display: 'flex',
                    }}
                    title="Move down"
                  >
                    <ChevronDown size={12} />
                  </button>
                </div>

                {/* Order badge */}
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(45,37,80,0.6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.6rem', fontWeight: 900, color: '#9080B4',
                }}>
                  {idx + 1}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#F0EBF8' }}>
                      {isSuccess && <CheckCircle size={12} color="#A8CE2C" style={{ marginRight: 5, display: 'inline', verticalAlign: 'middle' }} />}
                      {sec.label}
                    </span>
                    <span style={{
                      fontSize: '0.52rem', fontWeight: 800, letterSpacing: '0.08em',
                      padding: '2px 7px',
                      background: `${sec.colour}18`, color: sec.colour,
                      border: `1px solid ${sec.colour}30`,
                    }}>
                      {productCount} products
                    </span>
                  </div>
                  {sec.desc && (
                    <div style={{ fontSize: '0.72rem', color: '#9080B4', fontStyle: 'italic' }}>{sec.desc}</div>
                  )}
                  <div style={{ fontSize: '0.58rem', color: 'rgba(144,128,180,0.4)', marginTop: 2, letterSpacing: '0.06em' }}>
                    slug: {sec.slug}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button
                    onClick={() => openEdit(sec)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5, padding: '8px 12px',
                      background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)',
                      color: '#C4B5FD', fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.08em',
                      textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    <Edit2 size={11} /> Edit
                  </button>

                  {deleteConfirm === sec.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                      {productCount > 0 && (
                        <div style={{ fontSize: '0.52rem', color: 'rgba(239,68,68,0.8)', textAlign: 'right', maxWidth: 150, lineHeight: 1.4 }}>
                          ⚠ {productCount} Produkt{productCount !== 1 ? 'e' : ''} werden ohne Kategorie
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          onClick={() => handleDelete(sec.id)}
                          style={{
                            padding: '8px 10px',
                            background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)',
                            color: '#FCA5A5', fontSize: '0.58rem', fontWeight: 800,
                            letterSpacing: '0.06em', textTransform: 'uppercase',
                            cursor: 'pointer', fontFamily: 'inherit',
                          }}
                        >Löschen</button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          style={{
                            padding: '8px 9px', background: 'transparent',
                            border: '1px solid #2D2550', color: '#9080B4',
                            cursor: 'pointer', display: 'flex', fontFamily: 'inherit',
                          }}
                        ><X size={12} /></button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(sec.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 4, padding: '8px 10px',
                        background: 'transparent', border: '1px solid rgba(239,68,68,0.2)',
                        color: 'rgba(239,68,68,0.55)', fontSize: '0.62rem', fontWeight: 700,
                        textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit',
                      }}
                    >
                      <Trash2 size={11} />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Add/Edit Modal ── */}
      {modal && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(12,9,25,0.9)', backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16, zIndex: 200,
          }}
          onClick={e => { if (e.target === e.currentTarget) close() }}
        >
          <div style={{
            width: '100%', maxWidth: 440,
            background: '#1A1628', border: '1px solid rgba(124,58,237,0.35)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
            borderRadius: 4, overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 18px', borderBottom: '1px solid #2D2550',
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#F0EBF8', letterSpacing: '0.06em' }}>
                {modal.mode === 'add' ? 'New Section' : 'Edit Section'}
              </div>
              <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9080B4', display: 'flex', padding: 4 }}>
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Label */}
              <div>
                <label style={s.label}>Section Name</label>
                <input
                  type="text"
                  value={modal.label}
                  onChange={e => setModal(prev => prev ? { ...prev, label: e.target.value } : prev)}
                  placeholder="e.g. STATIC HASH"
                  style={s.input}
                  autoFocus
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                />
                {modal.mode === 'add' && modal.label.trim() && (
                  <p style={{ margin: '4px 0 0', fontSize: '0.6rem', color: 'rgba(144,128,180,0.4)' }}>
                    Slug: {modal.label.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label style={s.label}>Description / Tagline</label>
                <input
                  type="text"
                  value={modal.desc}
                  onChange={e => setModal(prev => prev ? { ...prev, desc: e.target.value } : prev)}
                  placeholder="e.g. Pressed pollen perfection"
                  style={s.input}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                />
              </div>

              {/* Colour */}
              <div>
                <label style={s.label}>Accent Colour</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                  {PRESET_COLOURS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setModal(prev => prev ? { ...prev, colour: c } : prev)}
                      style={{
                        width: 28, height: 28, borderRadius: 4,
                        background: c, cursor: 'pointer',
                        border: modal.colour === c
                          ? '3px solid #fff'
                          : '2px solid rgba(255,255,255,0.15)',
                        transition: 'border 0.15s',
                      }}
                      title={c}
                    />
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input
                    type="color"
                    value={modal.colour}
                    onChange={e => setModal(prev => prev ? { ...prev, colour: e.target.value } : prev)}
                    style={{
                      width: 36, height: 36, padding: 2, cursor: 'pointer',
                      background: '#0C0919', border: '1px solid #2D2550', borderRadius: 4,
                    }}
                  />
                  <input
                    type="text"
                    value={modal.colour}
                    onChange={e => setModal(prev => prev ? { ...prev, colour: e.target.value } : prev)}
                    style={{ ...s.input, width: 120 }}
                    onFocus={focusBorder}
                    onBlur={blurBorder}
                  />
                </div>
              </div>

              {/* Text dark toggle */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 12px',
                background: 'rgba(45,37,80,0.3)', border: '1px solid #2D2550',
              }}>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#F0EBF8', marginBottom: 2 }}>
                    Dark Text on Badge
                  </div>
                  <div style={{ fontSize: '0.62rem', color: '#9080B4' }}>
                    Use dark text on light-coloured badges (e.g. lime green)
                  </div>
                </div>
                <button
                  onClick={() => setModal(prev => prev ? { ...prev, textDark: !prev.textDark } : prev)}
                  style={{
                    width: 38, height: 20, borderRadius: 10,
                    background: modal.textDark ? modal.colour : '#2D2550',
                    border: 'none', cursor: 'pointer', position: 'relative',
                    transition: 'background 0.2s', flexShrink: 0,
                  }}
                >
                  <span style={{
                    position: 'absolute', top: 2,
                    left: modal.textDark ? 20 : 2,
                    width: 16, height: 16, borderRadius: '50%',
                    background: '#fff', transition: 'left 0.2s',
                  }} />
                </button>
              </div>

              {/* Preview */}
              <div style={{ padding: '10px 14px', background: '#0C0919', border: '1px solid #2D2550' }}>
                <div style={{ fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.18em', color: '#9080B4', textTransform: 'uppercase', marginBottom: 8 }}>Preview</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{
                    padding: '4px 12px', fontSize: '0.6rem', fontWeight: 900, letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    background: `linear-gradient(135deg, ${modal.colour}, ${modal.colour}bb)`,
                    color: modal.textDark ? '#0C0919' : '#fff',
                    boxShadow: `0 0 12px ${modal.colour}55`,
                  }}>
                    {modal.label || 'SECTION NAME'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10 }}>
                <button
                  onClick={close}
                  style={{
                    padding: '12px', background: 'transparent', border: '1px solid #2D2550',
                    color: '#9080B4', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.1em',
                    textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!modal.label.trim()}
                  style={{
                    padding: '12px',
                    background: modal.label.trim()
                      ? 'linear-gradient(135deg, #7C3AED, #5B21B6)'
                      : 'rgba(124,58,237,0.2)',
                    border: '1px solid rgba(124,58,237,0.4)',
                    color: modal.label.trim() ? '#fff' : 'rgba(255,255,255,0.3)',
                    fontSize: '0.68rem', fontWeight: 900, letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    cursor: modal.label.trim() ? 'pointer' : 'not-allowed',
                    fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  <CheckCircle size={14} />
                  {modal.mode === 'add' ? 'Create Section' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
