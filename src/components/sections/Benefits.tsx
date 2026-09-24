import { Zap, Globe, Shield, Truck, Star, Lock } from 'lucide-react'

const BENEFITS = [
  { Icon: Star,   title: 'Top-Qualität',     desc: 'Hand-selected, premium quality every time.', colour: '#A8CE2C' },
  { Icon: Globe,  title: 'Whole Europa',      desc: 'Versand in alle EU-Länder. 069 kennt keine Grenzen.', colour: '#7C3AED' },
  { Icon: Shield, title: '18+ Verifiziert',  desc: 'Nur für Erwachsene. Verantwortungsvoller Konsum.', colour: '#C0567A' },
  { Icon: Truck,  title: 'Diskreter Versand', desc: 'Neutrale Verpackung, schnelle und sichere Lieferung.', colour: '#A8CE2C' },
  { Icon: Zap,    title: 'Frischer Drop',    desc: 'Regelmäßige neue Strains und limitierte Drops.', colour: '#7C3AED' },
  { Icon: Lock,   title: '100% Sicher',      desc: 'Sichere Zahlung, verschlüsselte Bestellabwicklung.', colour: '#C0567A' },
]

export function Benefits() {
  return (
    <section style={{
      background: '#0D0A1A',
      borderTop: '1px solid rgba(45,37,80,0.6)',
      borderBottom: '1px solid rgba(45,37,80,0.6)',
      padding: '32px 0',
    }}>
      <div className="container-base">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-2">
          {BENEFITS.map(({ Icon, title, desc, colour }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center gap-2.5"
              style={{ padding: '14px 8px' }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(45,37,80,0.9)',
                  color: 'rgba(144,128,180,0.65)',
                  borderRadius: 4,
                  transition: 'border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease',
                  flexShrink: 0,
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.borderColor = colour
                  el.style.color = colour
                  el.style.boxShadow = `0 0 14px ${colour}55`
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.borderColor = 'rgba(45,37,80,0.9)'
                  el.style.color = 'rgba(144,128,180,0.65)'
                  el.style.boxShadow = 'none'
                }}
              >
                <Icon size={17} strokeWidth={2} />
              </div>
              <h3 style={{
                fontSize: '0.58rem',
                fontWeight: 900,
                color: '#F0EBF8',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                lineHeight: 1.3,
              }}>
                {title}
              </h3>
              <p style={{
                fontSize: '0.54rem',
                color: 'rgba(144,128,180,0.55)',
                lineHeight: 1.6,
              }} className="hidden lg:block">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
