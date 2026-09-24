import { useState } from 'react'

interface AgeGateProps {
  onConfirm: () => void
}

export function AgeGate({ onConfirm }: AgeGateProps) {
  const [denied, setDenied] = useState(false)

  /* ── Shared ambient background — identical to the hero section ── */
  const ambientBg = (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Top-left purple orb */}
      <div style={{
        position: 'absolute', top: '-5%', left: '-5%',
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(124,58,237,0.10) 0%, transparent 65%)',
        animation: 'ambientPulse 7s ease-in-out infinite',
      }} />
      {/* Top-right lime orb */}
      <div style={{
        position: 'absolute', top: '10%', right: '-5%',
        width: 480, height: 480,
        background: 'radial-gradient(circle, rgba(168,206,44,0.07) 0%, transparent 65%)',
        animation: 'ambientPulse 9s ease-in-out 3s infinite',
      }} />
      {/* Bottom-centre pink orb */}
      <div style={{
        position: 'absolute', bottom: '-5%', left: '30%',
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(192,86,122,0.08) 0%, transparent 65%)',
        animation: 'ambientPulse 11s ease-in-out 5s infinite',
      }} />
      {/* Centre purple orb */}
      <div style={{
        position: 'absolute', top: '40%', left: '28%',
        width: 350, height: 350,
        background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)',
        animation: 'ambientPulse 5s ease-in-out 1s infinite',
      }} />
    </div>
  )

  /* ── Denied state ── */
  if (denied) {
    return (
      <div
        className="fixed inset-0 z-[999] flex items-center justify-center p-6"
        style={{ background: '#0C0919' }}
      >
        {ambientBg}
        <div className="relative z-10 text-center max-w-sm">
          <img
            src="/logo-writing.png"
            alt="CatchMyTerpz 069"
            draggable={false}
            style={{
              width: '100%',
              maxWidth: 260,
              height: 'auto',
              mixBlendMode: 'screen',
              filter: 'brightness(1.08) contrast(1.05) saturate(1.05)',
              userSelect: 'none',
              margin: '0 auto 1.5rem',
              display: 'block',
            }}
          />
          <div className="text-5xl mb-4">🔞</div>
          <h1 className="font-black text-2xl text-brand-text mb-3">Zugang verweigert</h1>
          <p className="text-brand-secondary text-sm leading-relaxed">
            Diese Website ist nur für Erwachsene ab 18 Jahren zugänglich.
            Bitte verlasse diese Seite.
          </p>
        </div>
      </div>
    )
  }

  /* ── Main age gate ── */
  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-6"
      style={{ background: '#0C0919' }}
    >
      {ambientBg}

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">

        {/*
          Logo — exact same treatment as the main page hero:
          logo-writing.png with mix-blend-mode: screen so the
          near-black background disappears, leaving only the
          cream / lime / purple brand lettering floating.
          1536×1024 native → maxWidth 320px → ~213px tall.
        */}
        <img
          src="/logo-writing.png"
          alt="CatchMyTerpz 069"
          draggable={false}
          style={{
            width: '100%',
            maxWidth: 320,
            height: 'auto',
            mixBlendMode: 'screen',
            filter: 'brightness(1.08) contrast(1.05) saturate(1.05)',
            userSelect: 'none',
            display: 'block',
            marginBottom: '1.75rem',
          }}
        />

        {/* Thin coloured rule above the card */}
        <div style={{
          width: '100%',
          height: 1,
          marginBottom: '-1px',
          background: 'linear-gradient(to right, transparent, rgba(124,58,237,0.6), rgba(168,206,44,0.5), rgba(124,58,237,0.6), transparent)',
        }} />

        {/* Verification card */}
        <div
          className="w-full text-center"
          style={{
            background: 'rgba(26,22,40,0.95)',
            border: '1px solid rgba(45,37,80,0.9)',
            borderTop: 'none',
            padding: '2rem',
            boxShadow: '0 0 60px rgba(124,58,237,0.12), 0 24px 48px rgba(0,0,0,0.6)',
          }}
        >
          <div className="text-4xl mb-4">🔞</div>

          <h2
            className="font-black uppercase text-brand-text mb-3"
            style={{ fontSize: '1rem', letterSpacing: '0.08em' }}
          >
            Altersverifikation erforderlich
          </h2>

          <p className="text-brand-secondary text-sm leading-relaxed mb-8">
            Diese Website enthält Inhalte, die nur für Erwachsene ab{' '}
            <strong className="text-brand-text">18 Jahren</strong> bestimmt sind.
            Bitte bestätige dein Alter, um fortzufahren.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
              className="btn-primary w-full py-4 text-base"
              style={{ boxShadow: '0 0 22px rgba(168,206,44,0.35)' }}
            >
              Ich bin 18+ Jahre alt – Eintreten
            </button>
            <button
              onClick={() => setDenied(true)}
              className="btn-secondary w-full py-3 text-sm"
            >
              Ich bin unter 18 – Verlassen
            </button>
          </div>

          <p style={{ color: 'rgba(144,128,180,0.4)', fontSize: '0.65rem', marginTop: '1.25rem', lineHeight: 1.6 }}>
            Mit dem Betreten dieser Website bestätigst du, dass du das gesetzliche
            Mindestalter in deinem Land erreicht hast und mit unseren{' '}
            <a href="/terms" style={{ textDecoration: 'underline' }}>AGB</a> einverstanden bist.
          </p>
        </div>

        {/* Thin coloured rule below the card */}
        <div style={{
          width: '100%',
          height: 1,
          marginTop: '-1px',
          background: 'linear-gradient(to right, transparent, rgba(192,86,122,0.4), rgba(168,206,44,0.4), rgba(192,86,122,0.4), transparent)',
        }} />

      </div>
    </div>
  )
}
