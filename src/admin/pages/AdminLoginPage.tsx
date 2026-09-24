import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, LogIn } from 'lucide-react'
import { useAdminAuth } from '../context/AdminAuthContext'

export function AdminLoginPage() {
  const { state, login } = useAdminAuth()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [digits,   setDigits]   = useState(['', '', '', ''])
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [shake,    setShake]    = useState(false)

  const pwRef = useRef<HTMLInputElement>(null)
  const r0 = useRef<HTMLInputElement>(null)
  const r1 = useRef<HTMLInputElement>(null)
  const r2 = useRef<HTMLInputElement>(null)
  const r3 = useRef<HTMLInputElement>(null)
  const pinRefs = [r0, r1, r2, r3]

  useEffect(() => {
    if (state === 'authenticated') navigate('/admin', { replace: true })
  }, [state, navigate])

  useEffect(() => {
    pwRef.current?.focus()
  }, [])

  const triggerError = () => {
    setLoading(false)
    setError('Incorrect password or PIN.')
    setShake(true)
    setDigits(['', '', '', ''])
    setTimeout(() => {
      setShake(false)
      setError('')
    }, 700)
  }

  const submit = async (pin: string) => {
    if (loading) return
    if (!password.trim()) {
      setError('Please enter your password.')
      pwRef.current?.focus()
      return
    }
    setLoading(true)
    try {
      const ok = await login(password, pin)
      if (!ok) triggerError()
      // Navigation is handled by the useEffect once state becomes 'authenticated'
    } catch {
      triggerError()
    }
  }

  const handlePinChange = (idx: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[idx] = digit
    setDigits(next)
    setError('')

    if (digit && idx < 3) {
      pinRefs[idx + 1].current?.focus()
    }

    if (next.every(d => d !== '')) {
      submit(next.join(''))
    }
  }

  const handlePinKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      pinRefs[idx - 1].current?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    if (pasted.length === 4) {
      setDigits(pasted.split(''))
      pinRefs[3].current?.focus()
      submit(pasted)
    }
  }

  const handlePasswordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      r0.current?.focus()
    }
  }

  const pinReady = digits.every(d => d !== '')
  const canSubmit = !!password.trim() && pinReady

  const pinBoxStyle = (filled: boolean): React.CSSProperties => ({
    width: 60,
    height: 68,
    background: filled ? 'rgba(124,58,237,0.1)' : 'rgba(12,9,25,0.7)',
    border: `1px solid ${filled ? 'rgba(124,58,237,0.55)' : 'rgba(45,37,80,0.9)'}`,
    color: '#F0EBF8',
    fontSize: '1.8rem',
    fontWeight: 700,
    textAlign: 'center' as const,
    outline: 'none',
    caretColor: 'transparent',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s, background 0.2s',
    boxSizing: 'border-box' as const,
  })

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#0C0919',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 16px',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <div style={{
        position: 'fixed', top: '20%', left: '50%',
        transform: 'translateX(-50%)',
        width: 500, height: 300,
        background: 'radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <style>{`
        @keyframes adminShake {
          0%,100% { transform: translateX(0); }
          15%      { transform: translateX(-10px); }
          30%      { transform: translateX(10px); }
          45%      { transform: translateX(-7px); }
          60%      { transform: translateX(7px); }
          75%      { transform: translateX(-4px); }
          90%      { transform: translateX(4px); }
        }
        @keyframes adminSpin { to { transform: rotate(360deg); } }
        .pw-input:focus  { border-color: rgba(168,206,44,0.55) !important; }
        .pin-box:focus   { border-color: rgba(168,206,44,0.6) !important; background: rgba(168,206,44,0.04) !important; }
      `}</style>

      <div style={{
        width: '100%',
        maxWidth: 400,
        background: 'rgba(26,22,40,0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(124,58,237,0.28)',
        boxShadow: '0 0 60px rgba(124,58,237,0.12), 0 20px 60px rgba(0,0,0,0.5)',
        padding: '36px 28px 32px',
        animation: shake ? 'adminShake 0.6s ease' : undefined,
      }}>

        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            border: '2px solid rgba(168,206,44,0.5)',
            background: 'rgba(124,58,237,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
          }}>
            <Lock size={20} color="#7C3AED" strokeWidth={1.5} />
          </div>
          <div style={{
            fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.3em',
            color: '#A8CE2C', textTransform: 'uppercase', marginBottom: 3,
          }}>
            Admin Panel
          </div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(144,128,180,0.5)', letterSpacing: '0.04em' }}>
            CatchMyTerpz 069 · Secure Access
          </div>
        </div>

        <div style={{ height: 1, background: 'rgba(45,37,80,0.8)', marginBottom: 24 }} />

        {/* Password field */}
        <div style={{ marginBottom: 24 }}>
          <label style={{
            display: 'block', fontSize: '0.55rem', fontWeight: 800,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: '#9080B4', marginBottom: 8,
          }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
              color: 'rgba(144,128,180,0.45)', display: 'flex', pointerEvents: 'none',
            }}>
              <Lock size={14} strokeWidth={1.5} />
            </span>
            <input
              ref={pwRef}
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              onKeyDown={handlePasswordKeyDown}
              placeholder="Enter password"
              className="pw-input"
              style={{
                width: '100%',
                padding: '12px 42px 12px 42px',
                background: 'rgba(12,9,25,0.7)',
                border: '1px solid rgba(45,37,80,0.9)',
                color: '#F0EBF8',
                fontSize: '0.875rem',
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              autoComplete="current-password"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPw(v => !v)}
              style={{
                position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(144,128,180,0.45)', display: 'flex', padding: 4,
              }}
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <p style={{ margin: '6px 0 0', fontSize: '0.52rem', color: 'rgba(144,128,180,0.3)', letterSpacing: '0.06em' }}>
            Press Enter to move to PIN
          </p>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(45,37,80,0.6)' }} />
          <span style={{ fontSize: '0.48rem', fontWeight: 800, letterSpacing: '0.2em', color: 'rgba(144,128,180,0.3)', textTransform: 'uppercase' }}>
            then PIN
          </span>
          <div style={{ flex: 1, height: 1, background: 'rgba(45,37,80,0.6)' }} />
        </div>

        {/* PIN boxes */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 24 }} onPaste={handlePaste}>
          {digits.map((d, idx) => (
            <input
              key={idx}
              ref={pinRefs[idx]}
              className="pin-box"
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => handlePinChange(idx, e.target.value)}
              onKeyDown={e => handlePinKeyDown(idx, e)}
              style={pinBoxStyle(!!d)}
              autoComplete="off"
              disabled={loading}
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            marginBottom: 16,
            padding: '9px 14px',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#FCA5A5',
            fontSize: '0.78rem',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="button"
          disabled={loading || !canSubmit}
          onClick={() => submit(digits.join(''))}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            padding: '13px 24px',
            background: (loading || !canSubmit)
              ? 'rgba(124,58,237,0.25)'
              : 'linear-gradient(135deg, #7C3AED, #5B21B6)',
            color: '#fff',
            border: '1px solid rgba(124,58,237,0.4)',
            fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.2em',
            textTransform: 'uppercase',
            cursor: (loading || !canSubmit) ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.2s',
            boxShadow: (loading || !canSubmit) ? 'none' : '0 0 24px rgba(124,58,237,0.3)',
            marginBottom: 14,
          }}
        >
          {loading ? (
            <>
              <span style={{
                width: 14, height: 14,
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff',
                borderRadius: '50%',
                animation: 'adminSpin 0.7s linear infinite',
                display: 'inline-block',
              }} />
              Authenticating…
            </>
          ) : (
            <>
              <LogIn size={14} strokeWidth={1.5} />
              Enter Admin Panel
            </>
          )}
        </button>

        <div style={{
          textAlign: 'center',
          fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.15em',
          color: 'rgba(144,128,180,0.3)', textTransform: 'uppercase',
        }}>
          Protected Area · Authorised Access Only
        </div>
      </div>
    </div>
  )
}
