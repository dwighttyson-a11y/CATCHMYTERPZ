import { useNavigate } from 'react-router-dom'
import { TowelieRunner } from './TowelieRunner'

const RUNNERS = [
  { delay: '0s',  scale: 1.00 },
  { delay: '-2s', scale: 0.92 },
  { delay: '-4s', scale: 1.05 },
  { delay: '-6s', scale: 0.97 },  // 4th — hidden admin entry
  { delay: '-8s', scale: 1.02 },
]

export function TowelieStrip() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        position: 'relative',
        height: 90,
        overflow: 'hidden',
        background: '#0C0919',
        borderTop: '1px solid rgba(124,58,237,0.15)',
        borderBottom: '1px solid rgba(124,58,237,0.15)',
      }}
    >
      <style>{`
        @keyframes run-across-loop {
          from { transform: translateX(-90px); }
          to   { transform: translateX(calc(100vw + 90px)); }
        }
      `}</style>

      {RUNNERS.map((r, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            animation: `run-across-loop 10s ${r.delay} linear infinite`,
          }}
        >
          <TowelieRunner
            style={{ height: `${72 * r.scale}px`, display: 'block' }}
            onAdminClick={i === 3 ? () => navigate('/admin/login') : undefined}
          />
        </div>
      ))}
    </div>
  )
}
