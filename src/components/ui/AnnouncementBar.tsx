const COPY = '✦  WELTWEITER VERSAND · GANZ EUROPA · SCHNELLE LIEFERUNG · CMT 069  '

export function AnnouncementBar() {
  return (
    <div style={{
      height: 30,
      background: '#080614',
      borderBottom: '1px solid rgba(168,206,44,0.18)',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      zIndex: 50,
      flexShrink: 0,
    }}>
      {/* Left + right edge fades */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 48,
        background: 'linear-gradient(to right, #080614, transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 48,
        background: 'linear-gradient(to left, #080614, transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />

      {/* Scrolling track — two copies for seamless loop */}
      <div style={{
        display: 'flex',
        whiteSpace: 'nowrap',
        animation: 'announcementScroll 22s linear infinite',
      }}>
        {[0, 1, 2, 3].map(i => (
          <span key={i} style={{
            fontSize: '0.7rem',
            fontWeight: 800,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#A8CE2C',
            textShadow: '0 0 10px rgba(168,206,44,0.5)',
            paddingRight: '3rem',
          }}>
            {COPY}
          </span>
        ))}
      </div>
    </div>
  )
}
