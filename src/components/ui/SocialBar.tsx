import { Instagram } from 'lucide-react'

export function SocialBar() {
  return (
    <div style={{
      position: 'fixed',
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 40,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'rgba(12,9,25,0.88)',
      border: '1px solid rgba(45,37,80,0.8)',
      borderLeft: 'none',
      backdropFilter: 'blur(12px)',
      boxShadow: '4px 0 24px rgba(0,0,0,0.4)',
    }}>

      {/* Instagram */}
      <a
        href="https://www.instagram.com/catchmyterpzz069/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 44, height: 44,
          color: 'rgba(192,86,122,0.65)',
          transition: 'color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLAnchorElement
          el.style.color = '#C0567A'
          el.style.background = 'rgba(192,86,122,0.1)'
          el.style.boxShadow = 'inset 0 0 14px rgba(192,86,122,0.2)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLAnchorElement
          el.style.color = 'rgba(192,86,122,0.65)'
          el.style.background = 'transparent'
          el.style.boxShadow = 'none'
        }}
      >
        <Instagram size={16} strokeWidth={1.5} />
      </a>

      {/* Divider */}
      <div style={{ width: 24, height: 1, background: 'rgba(45,37,80,0.9)' }} />

      {/* Telegram */}
      <a
        href="#"
        aria-label="Telegram"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 44, height: 44,
          color: 'rgba(124,58,237,0.65)',
          transition: 'color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLAnchorElement
          el.style.color = '#7C3AED'
          el.style.background = 'rgba(124,58,237,0.1)'
          el.style.boxShadow = 'inset 0 0 14px rgba(124,58,237,0.2)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLAnchorElement
          el.style.color = 'rgba(124,58,237,0.65)'
          el.style.background = 'transparent'
          el.style.boxShadow = 'none'
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-16.5 6.75a2.25 2.25 0 0 0 .126 4.238l3.853 1.317 1.498 4.854a1.5 1.5 0 0 0 2.568.52l2.085-2.398 4.26 3.117a2.25 2.25 0 0 0 3.498-1.385l2.25-15.75a2.249 2.249 0 0 0-2.616-2.478z"/>
        </svg>
      </a>

    </div>
  )
}
