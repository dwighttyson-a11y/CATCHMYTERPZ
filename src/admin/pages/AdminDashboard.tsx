import { Link } from 'react-router-dom'
import { Package, ImageIcon, AlertCircle, CheckCircle2, FolderOpen, Star } from 'lucide-react'
import { products } from '../../data/products'
import { useProductImages } from '../../context/ProductImageContext'
import { useCatalog } from '../../context/CatalogContext'

export function AdminDashboard() {
  const { customImages }     = useProductImages()
  const { sections, productOverrides, premiumProducts } = useCatalog()

  const total     = products.length
  const withPhoto = Object.keys(customImages).length
  const missing   = total - withPhoto
  const inStock   = products.filter(p => p.inventory > 0).length
  const editCount = Object.keys(productOverrides).length

  const stats = [
    {
      label: 'Total Products', value: total,
      icon: Package, colour: '#7C3AED',
      bg: 'rgba(124,58,237,0.1)', border: 'rgba(124,58,237,0.25)',
    },
    {
      label: 'Custom Photos', value: withPhoto,
      icon: ImageIcon, colour: '#A8CE2C',
      bg: 'rgba(168,206,44,0.08)', border: 'rgba(168,206,44,0.2)',
    },
    {
      label: 'Missing Photos', value: missing,
      icon: AlertCircle,
      colour: missing === 0 ? '#A8CE2C' : '#F59E0B',
      bg:     missing === 0 ? 'rgba(168,206,44,0.08)' : 'rgba(245,158,11,0.08)',
      border: missing === 0 ? 'rgba(168,206,44,0.2)'  : 'rgba(245,158,11,0.2)',
    },
    {
      label: 'In Stock', value: inStock,
      icon: CheckCircle2, colour: '#10B981',
      bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)',
    },
  ]

  const recentlyEdited = products
    .filter(p => productOverrides[p.id])
    .slice(0, 4)

  return (
    <div style={{ padding: '24px 16px', maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.25em',
          color: '#A8CE2C', textTransform: 'uppercase', marginBottom: 4,
        }}>
          Overview
        </div>
        <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', fontWeight: 700, color: '#F0EBF8', margin: 0 }}>
          Dashboard
        </h1>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
        {stats.map(({ label, value, icon: Icon, colour, bg, border }) => (
          <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 4, padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{
                width: 34, height: 34,
                background: `${colour}18`, border: `1px solid ${colour}30`,
                borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={16} color={colour} strokeWidth={1.5} />
              </div>
            </div>
            <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 900, color: colour, lineHeight: 1, marginBottom: 3 }}>
              {value}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#9080B4', fontWeight: 500 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Secondary stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
        <div style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.18)', padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FolderOpen size={15} color="#7C3AED" />
            <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', color: '#9080B4', textTransform: 'uppercase' }}>Sections</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#7C3AED', marginTop: 6 }}>{sections.length}</div>
        </div>
        <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)', padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Star size={15} color="#F59E0B" />
            <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', color: '#9080B4', textTransform: 'uppercase' }}>Premium</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F59E0B', marginTop: 6 }}>{premiumProducts.length}</div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 24 }}>
        {[
          { to: '/admin/products',   label: 'Manage Products',   icon: Package,    colour: 'rgba(124,58,237,0.15)', border: 'rgba(124,58,237,0.3)' },
          { to: '/admin/categories', label: 'Manage Categories', icon: FolderOpen, colour: 'rgba(168,206,44,0.08)', border: 'rgba(168,206,44,0.25)' },
        ].map(({ to, label, icon: Icon, colour, border }) => (
          <Link
            key={to}
            to={to}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 16px', background: colour,
              border: `1px solid ${border}`,
              color: '#F0EBF8', textDecoration: 'none',
              fontSize: '0.8rem', fontWeight: 700,
              transition: 'box-shadow 0.2s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 16px rgba(124,58,237,0.15)')}
            onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none')}
          >
            <Icon size={16} color="#A8CE2C" />
            {label} →
          </Link>
        ))}
      </div>

      {/* Sections overview */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{
          fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.2em',
          color: '#9080B4', textTransform: 'uppercase', marginBottom: 10,
        }}>
          Sections
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {sections.map(sec => (
            <div key={sec.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', background: '#1A1628', border: '1px solid #2D2550',
            }}>
              <div style={{ width: 6, height: 32, background: sec.colour, borderRadius: 1, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F0EBF8' }}>{sec.label}</div>
                {sec.desc && <div style={{ fontSize: '0.62rem', color: '#9080B4' }}>{sec.desc}</div>}
              </div>
              <span style={{
                fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.1em',
                color: sec.colour, background: `${sec.colour}15`,
                border: `1px solid ${sec.colour}30`, padding: '2px 8px',
              }}>
                {products.filter(p => p.collection === sec.slug).length} products
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recently edited products */}
      {recentlyEdited.length > 0 && (
        <div>
          <h2 style={{
            fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.2em',
            color: '#9080B4', textTransform: 'uppercase', marginBottom: 10,
          }}>
            Recently Edited ({editCount} total)
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {recentlyEdited.map(product => (
              <div key={product.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', background: '#1A1628', border: '1px solid #2D2550',
              }}>
                <img
                  src={product.images[0]}
                  alt={product.name}
                  style={{ width: 40, height: 40, objectFit: 'cover', flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.8rem', fontWeight: 700, color: '#F0EBF8',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {productOverrides[product.id]?.name ?? product.name}
                  </div>
                  <div style={{ fontSize: '0.62rem', color: '#9080B4' }}>Override active</div>
                </div>
                <span style={{
                  fontSize: '0.52rem', fontWeight: 800, letterSpacing: '0.12em',
                  color: '#7C3AED', background: 'rgba(124,58,237,0.08)',
                  border: '1px solid rgba(124,58,237,0.2)', padding: '2px 8px', flexShrink: 0,
                }}>
                  Edited
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
