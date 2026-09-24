import { useState, useRef, useCallback } from 'react'
import type { LockState } from '../../auth/useVaultAuth'

const COLOURS = ['#7C3AED', '#A8CE2C', '#C0567A', '#9B6FE8', '#c8e85a', '#d4789a']

const PARTICLES = [
  { left: '8%',  top: '12%', size: 2, colour: 0, dur: '9s',  delay: '0.0s' },
  { left: '91%', top: '16%', size: 2, colour: 1, dur: '11s', delay: '1.4s' },
  { left: '18%', top: '78%', size: 3, colour: 0, dur: '8s',  delay: '3.1s' },
  { left: '78%', top: '74%', size: 2, colour: 2, dur: '13s', delay: '0.7s' },
  { left: '4%',  top: '46%', size: 2, colour: 1, dur: '10s', delay: '2.4s' },
  { left: '95%', top: '54%', size: 2, colour: 0, dur: '9s',  delay: '4.2s' },
  { left: '32%', top: '6%',  size: 2, colour: 2, dur: '12s', delay: '0.9s' },
  { left: '68%', top: '90%', size: 3, colour: 0, dur: '10s', delay: '2.6s' },
  { left: '84%', top: '36%', size: 2, colour: 1, dur: '8s',  delay: '1.6s' },
  { left: '56%', top: '95%', size: 2, colour: 2, dur: '14s', delay: '0.1s' },
  { left: '24%', top: '33%', size: 2, colour: 4, dur: '10s', delay: '5.0s' },
  { left: '74%', top: '26%', size: 2, colour: 1, dur: '12s', delay: '2.0s' },
]

// ── Vault icon (120 × 120) ─────────────────────────────────────────────────
function VaultIcon({ isUnlocking }: { isUnlocking: boolean }) {
  const S = 120, C = 60
  return (
    <div style={{ position: 'relative', width: S, height: S, flexShrink: 0 }}>

      <div style={{
        position: 'absolute', inset: -35, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 62%)',
        animation: 'ambientPulse 4s ease-in-out infinite', pointerEvents: 'none',
      }} />

      {/* Outer rotating ring */}
      <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`}
        style={{ position: 'absolute', inset: 0, animation: 'vaultRingRotate 20s linear infinite' }}>
        <circle cx={C} cy={C} r="55" fill="none"
          stroke="rgba(124,58,237,0.32)" strokeWidth="1" strokeDasharray="5 7" />
      </svg>

      {/* Counter-rotating ring */}
      <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`}
        style={{ position: 'absolute', inset: 0, animation: 'vaultRingRotate 13s linear infinite reverse' }}>
        <circle cx={C} cy={C} r="44" fill="none"
          stroke="rgba(168,206,44,0.2)" strokeWidth="1" strokeDasharray="3 10" />
      </svg>

      {/* Radar scan */}
      <div style={{
        position: 'absolute', inset: 8, borderRadius: '50%',
        background: 'conic-gradient(from 0deg, transparent 0deg, rgba(124,58,237,0.14) 52deg, transparent 76deg)',
        animation: 'vaultRingRotate 3.2s linear infinite',
        opacity: isUnlocking ? 0 : 1, transition: 'opacity 0.45s', pointerEvents: 'none',
      }} />

      {/* Pulse ring */}
      <div style={{
        position: 'absolute', inset: 17, borderRadius: '50%',
        border: '1px solid rgba(124,58,237,0.3)',
        boxShadow: '0 0 12px rgba(124,58,237,0.12)',
        animation: 'vaultPulseRing 2.6s ease-in-out infinite', pointerEvents: 'none',
      }} />

      {/* Success pulses */}
      {isUnlocking && [0, 1, 2].map(j => (
        <div key={j} style={{
          position: 'absolute', inset: 15, borderRadius: '50%',
          border: '1.5px solid rgba(168,206,44,0.7)',
          animation: `vaultSuccessPulse 1.4s ease-out ${j * 0.28}s forwards`,
          pointerEvents: 'none',
        }} />
      ))}

      {/* Vault door */}
      <div style={{
        position: 'absolute', inset: 27, borderRadius: '50%',
        background: 'radial-gradient(circle at 36% 32%, #1c1040, #07030f)',
        border: `2px solid rgba(${isUnlocking ? '168,206,44' : '124,58,237'}, ${isUnlocking ? 0.9 : 0.45})`,
        boxShadow: isUnlocking
          ? '0 0 36px rgba(168,206,44,0.55), 0 0 70px rgba(168,206,44,0.2), inset 0 0 20px rgba(168,206,44,0.08)'
          : '0 0 18px rgba(124,58,237,0.22), inset 0 0 14px rgba(124,58,237,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'border-color 0.55s, box-shadow 0.65s',
      }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          style={{
            filter: isUnlocking
              ? 'drop-shadow(0 0 7px #A8CE2C) drop-shadow(0 0 14px rgba(168,206,44,0.5))'
              : 'drop-shadow(0 0 5px rgba(168,206,44,0.55))',
            transition: 'filter 0.55s',
          }}
        >
          <rect x="3" y="11" width="18" height="11" rx="2"
            stroke={isUnlocking ? '#A8CE2C' : 'rgba(168,206,44,0.92)'} />
          <path
            d={isUnlocking ? 'M7 11V7a5 5 0 0 1 9.9-1' : 'M7 11V7a5 5 0 0 1 10 0v4'}
            stroke={isUnlocking ? '#A8CE2C' : 'rgba(168,206,44,0.92)'}
          />
        </svg>
      </div>
    </div>
  )
}

// ── Lock screen ────────────────────────────────────────────────────────────
interface Props {
  lockState: LockState
  onUnlock:  (password: string) => boolean
}

export function VaultLockScreen({ lockState, onUnlock }: Props) {
  const [input,   setInput]   = useState('')
  const [error,   setError]   = useState(false)
  const [shaking, setShaking] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const isExiting = lockState === 'unlocking'

  const handleSubmit = useCallback(() => {
    if (!input.trim() || isExiting) return
    const ok = onUnlock(input)
    if (!ok) {
      setError(true); setShaking(true); setInput('')
      setTimeout(() => {
        setShaking(false)
        setTimeout(() => { setError(false); inputRef.current?.focus() }, 400)
      }, 600)
    }
  }, [input, isExiting, onUnlock])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#0C0919',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      animation: isExiting ? 'vaultReveal 1.9s cubic-bezier(0.4,0,0.2,1) forwards' : undefined,
    }}>

      {/* Background layer */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '-5%', left: '-5%', width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 65%)',
          animation: 'ambientPulse 7s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', top: '10%', right: '-5%', width: 480, height: 480,
          background: 'radial-gradient(circle, rgba(168,206,44,0.07) 0%, transparent 65%)',
          animation: 'ambientPulse 9s ease-in-out 3s infinite',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage:
            'linear-gradient(rgba(124,58,237,0.022) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(124,58,237,0.022) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }} />
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: 'linear-gradient(to right, transparent, #7C3AED, #A8CE2C, #C0567A, transparent)',
        }} />
      </div>

      {/* Particles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {PARTICLES.map((p, i) => {
          const c = COLOURS[p.colour]
          return (
            <div key={i} style={{
              position: 'absolute', left: p.left, top: p.top,
              width: p.size, height: p.size, borderRadius: '50%',
              background: c,
              boxShadow: `0 0 ${p.size * 3}px ${c}, 0 0 ${p.size * 6}px ${c}55`,
              animation: `particleFloat ${p.dur} ease-in-out ${p.delay} infinite`,
            }} />
          )
        })}
      </div>


      {/* ── Scrollable inner column ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        width: '100%', maxWidth: 440,
        padding: '16px 20px',
        maxHeight: '100dvh',
        overflowY: 'auto',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        animation: shaking ? 'vaultShake 0.55s ease' : undefined,
      } as React.CSSProperties}>

        {/* Logo wordmark */}
        <img
          src="/logo-writing.png"
          alt="CatchMyTerpz 069"
          draggable={false}
          style={{
            width: '100%', maxWidth: 300, height: 'auto',
            mixBlendMode: 'screen',
            filter: 'brightness(1.08) contrast(1.05) saturate(1.1)',
            userSelect: 'none', display: 'block',
            flexShrink: 0,
          }}
        />

        {/* Vault icon */}
        <VaultIcon isUnlocking={isExiting} />

        {/* Status label */}
        <div style={{
          marginTop: 10, marginBottom: 10, textAlign: 'center',
          fontSize: '0.42rem', fontWeight: 700, letterSpacing: '0.42em', textTransform: 'uppercase',
          color: isExiting ? 'rgba(168,206,44,0.65)' : 'rgba(144,128,180,0.45)',
          transition: 'color 0.4s',
        }}>
          {isExiting ? '✦  IDENTITY VERIFIED  ✦' : '✦  PRIVATE ACCESS REQUIRED  ✦'}
        </div>

        {/* Separator */}
        <div style={{
          width: '100%', height: 1, marginBottom: 14,
          background: 'linear-gradient(to right, transparent, rgba(124,58,237,0.45), rgba(168,206,44,0.28), rgba(124,58,237,0.45), transparent)',
        }} />

        {/* Glassmorphism card */}
        <div style={{
          width: '100%',
          background: 'rgba(255,255,255,0.03)',
          border: `1px solid ${error ? 'rgba(192,86,122,0.5)' : 'rgba(124,58,237,0.3)'}`,
          backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
          padding: '14px',
          boxShadow: error
            ? '0 0 28px rgba(192,86,122,0.14), inset 0 0 28px rgba(192,86,122,0.04)'
            : '0 0 28px rgba(124,58,237,0.1), inset 0 0 28px rgba(124,58,237,0.03)',
          transition: 'border-color 0.3s, box-shadow 0.3s',
        }}>
          {/* Input row */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            borderBottom: `1px solid ${error ? 'rgba(192,86,122,0.3)' : 'rgba(124,58,237,0.25)'}`,
            paddingBottom: 10, marginBottom: 12,
            transition: 'border-color 0.3s',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke={error ? 'rgba(192,86,122,0.65)' : 'rgba(144,128,180,0.5)'}
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
              style={{ flexShrink: 0, transition: 'stroke 0.3s' }}>
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <label
              htmlFor="vault-password-input"
              style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}
            >
              Zugangscode
            </label>
            <input
              id="vault-password-input"
              ref={inputRef}
              type="password"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="ENTER ACCESS CODE"
              autoComplete="new-password" autoCorrect="off" autoCapitalize="off" spellCheck={false}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: '#F0EBF8', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.26em',
                fontFamily: 'Inter, sans-serif',
              }}
            />
            <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
              {[0, 1, 2].map(j => (
                <div key={j} style={{
                  width: 4, height: 4, borderRadius: '50%',
                  background: error ? 'rgba(192,86,122,0.6)' : `rgba(124,58,237,${0.6 - j * 0.15})`,
                  animation: `ambientPulse 1.8s ease-in-out ${j * 0.28}s infinite`,
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>
          </div>

          {/* Button */}
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isExiting}
            style={{
              width: '100%', padding: '11px',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              fontSize: '0.62rem', letterSpacing: '0.22em', fontWeight: 900, textTransform: 'uppercase',
              background: isExiting
                ? 'linear-gradient(135deg, rgba(168,206,44,0.75), rgba(100,150,10,0.85))'
                : 'linear-gradient(135deg, #7C3AED, #5B21B6)',
              color: '#fff',
              border: `1px solid ${isExiting ? 'rgba(168,206,44,0.3)' : 'rgba(168,206,44,0.25)'}`,
              boxShadow: isExiting
                ? '0 0 28px rgba(168,206,44,0.4), 0 4px 14px rgba(0,0,0,0.4)'
                : '0 0 28px rgba(124,58,237,0.4), 0 4px 14px rgba(0,0,0,0.4)',
              transition: 'box-shadow 0.3s, transform 0.2s',
              cursor: input.trim() && !isExiting ? 'pointer' : 'default',
              opacity: !input.trim() ? 0.5 : 1,
              fontFamily: 'Inter, sans-serif',
            }}
            onMouseEnter={e => {
              if (!input.trim() || isExiting) return
              const el = e.currentTarget as HTMLButtonElement
              el.style.boxShadow = '0 0 48px rgba(124,58,237,0.65), 0 4px 22px rgba(0,0,0,0.5)'
              el.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.boxShadow = '0 0 28px rgba(124,58,237,0.4), 0 4px 14px rgba(0,0,0,0.4)'
              el.style.transform = 'translateY(0)'
            }}
          >
            {isExiting ? 'ACCESS GRANTED' : 'ENTER THE VAULT'}
            {!isExiting && <span style={{ fontSize: '0.9rem' }}>↓</span>}
          </button>

          {/* Error */}
          <div style={{
            height: 16, marginTop: 8, textAlign: 'center',
            fontSize: '0.42rem', fontWeight: 700, letterSpacing: '0.28em',
            color: '#C0567A', textShadow: '0 0 12px rgba(192,86,122,0.7)',
            opacity: error ? 1 : 0, transition: 'opacity 0.25s',
          }}>
            ACCESS DENIED — INVALID CREDENTIALS
          </div>
        </div>

        {/* Footer status */}
        <div style={{
          marginTop: 12, textAlign: 'center',
          fontSize: '0.38rem', fontWeight: 600, letterSpacing: '0.32em',
          color: 'rgba(144,128,180,0.26)',
        }}>
          ✦  ENCRYPTED CHANNEL ACTIVE  ✦
        </div>

        {/* Admin access */}
        <a
          href="/admin/login"
          style={{
            marginTop: 10,
            fontSize: '0.32rem', fontWeight: 600, letterSpacing: '0.22em',
            color: 'rgba(144,128,180,0.18)', textDecoration: 'none', textTransform: 'uppercase',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(144,128,180,0.45)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(144,128,180,0.18)' }}
        >
          Admin
        </a>
      </div>
    </div>
  )
}
