import type { ProductVariantGroup } from '../../types'
import { formatPrice } from '../../utils/helpers'

interface VariantSelectorProps {
  variantGroup: ProductVariantGroup
  selectedValue: string
  onChange: (groupName: string, value: string) => void
}

export function VariantSelector({ variantGroup, selectedValue, onChange }: VariantSelectorProps) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9080B4' }}>
          {variantGroup.name}:
        </span>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F0EBF8' }}>
          {selectedValue}
        </span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {variantGroup.options.map((option) => {
          const isSelected    = selectedValue === option.value
          const isUnavailable = !option.available

          return (
            <button
              key={option.id}
              onClick={() => !isUnavailable && onChange(variantGroup.name, option.value)}
              disabled={isUnavailable}
              aria-pressed={isSelected}
              aria-label={`${variantGroup.name}: ${option.name}${isUnavailable ? ' (nicht verfügbar)' : ''}`}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                padding: '10px 16px',
                background: isSelected
                  ? 'linear-gradient(135deg, #7C3AED, #5B21B6)'
                  : '#1A1628',
                border: isSelected
                  ? '1px solid #7C3AED'
                  : '1px solid #2D2550',
                boxShadow: isSelected
                  ? '0 0 18px rgba(124,58,237,0.45)'
                  : 'none',
                opacity: isUnavailable ? 0.4 : 1,
                cursor: isUnavailable ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
                minWidth: 64,
              }}
              onMouseEnter={e => {
                if (!isSelected && !isUnavailable) {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.borderColor = 'rgba(124,58,237,0.6)'
                  el.style.background  = '#251F3D'
                }
              }}
              onMouseLeave={e => {
                if (!isSelected && !isUnavailable) {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.borderColor = '#2D2550'
                  el.style.background  = '#1A1628'
                }
              }}
            >
              <span style={{
                fontSize: '0.82rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                color: isSelected ? '#F0EBF8' : '#9080B4',
              }}>
                {option.name}
              </span>

              {option.priceModifier != null && (
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  color: isSelected ? '#A8CE2C' : '#A8CE2C',
                  letterSpacing: '0.02em',
                }}>
                  {formatPrice(option.priceModifier)}
                </span>
              )}

              {isUnavailable && (
                <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ position: 'absolute', width: '100%', height: 1, background: 'rgba(144,128,180,0.3)', transform: 'rotate(-15deg)' }} />
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
