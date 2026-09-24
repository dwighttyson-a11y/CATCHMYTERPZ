import { Instagram } from 'lucide-react'
import { useMobileSettings } from '../../context/MobileSettingsContext'

const COLOURS = ['#7C3AED', '#A8CE2C', '#C0567A', '#9B6FE8', '#c8e85a', '#d4789a']

const PARTICLES = [
  { left: '62%', top: '6%',  size: 3, colour: 0, dur: '9s',  delay: '0s'   },
  { left: '68%', top: '12%', size: 2, colour: 1, dur: '12s', delay: '1.2s' },
  { left: '74%', top: '5%',  size: 4, colour: 2, dur: '8s',  delay: '2.4s' },
  { left: '79%', top: '15%', size: 3, colour: 0, dur: '14s', delay: '0.6s' },
  { left: '85%', top: '8%',  size: 2, colour: 1, dur: '10s', delay: '3.5s' },
  { left: '71%', top: '22%', size: 3, colour: 2, dur: '11s', delay: '1.8s' },
  { left: '88%', top: '18%', size: 2, colour: 3, dur: '13s', delay: '4.2s' },
  { left: '65%', top: '30%', size: 2, colour: 4, dur: '9s',  delay: '5.1s' },
  { left: '77%', top: '10%', size: 3, colour: 5, dur: '15s', delay: '0.3s' },
  { left: '82%', top: '28%', size: 2, colour: 0, dur: '8s',  delay: '6.0s' },
  { left: '91%', top: '12%', size: 4, colour: 1, dur: '16s', delay: '2.1s' },
  { left: '69%', top: '38%', size: 2, colour: 2, dur: '10s', delay: '4.8s' },
  { left: '75%', top: '32%', size: 3, colour: 3, dur: '12s', delay: '7.2s' },
  { left: '86%', top: '22%', size: 2, colour: 4, dur: '9s',  delay: '1.5s' },
  { left: '93%', top: '8%',  size: 3, colour: 5, dur: '11s', delay: '3.0s' },
  { left: '63%', top: '18%', size: 2, colour: 0, dur: '14s', delay: '5.5s' },
  { left: '80%', top: '36%', size: 4, colour: 1, dur: '8s',  delay: '0.9s' },
  { left: '72%', top: '4%',  size: 2, colour: 2, dur: '13s', delay: '6.6s' },
  { left: '89%', top: '32%', size: 3, colour: 3, dur: '10s', delay: '2.7s' },
  { left: '66%', top: '44%', size: 2, colour: 4, dur: '15s', delay: '4.0s' },
  { left: '84%', top: '14%', size: 3, colour: 5, dur: '9s',  delay: '7.8s' },
  { left: '76%', top: '42%', size: 2, colour: 0, dur: '11s', delay: '1.0s' },
  { left: '92%', top: '24%', size: 4, colour: 1, dur: '16s', delay: '3.6s' },
  { left: '70%', top: '26%', size: 2, colour: 2, dur: '8s',  delay: '5.8s' },
  { left: '87%', top: '6%',  size: 3, colour: 3, dur: '12s', delay: '2.0s' },
  { left: '78%', top: '48%', size: 2, colour: 4, dur: '10s', delay: '6.4s' },
  { left: '64%', top: '52%', size: 3, colour: 5, dur: '14s', delay: '0.4s' },
  { left: '83%', top: '44%', size: 2, colour: 0, dur: '9s',  delay: '4.6s' },
  { left: '90%', top: '38%', size: 4, colour: 1, dur: '11s', delay: '7.0s' },
  { left: '73%', top: '16%', size: 2, colour: 2, dur: '13s', delay: '2.9s' },

  // Centre zone
  { left: '42%', top: '18%', size: 2, colour: 0, dur: '11s', delay: '0.8s'  },
  { left: '48%', top: '10%', size: 3, colour: 1, dur: '9s',  delay: '2.2s'  },
  { left: '53%', top: '24%', size: 2, colour: 2, dur: '14s', delay: '4.5s'  },
  { left: '46%', top: '34%', size: 3, colour: 3, dur: '10s', delay: '1.4s'  },
  { left: '55%', top: '14%', size: 2, colour: 4, dur: '12s', delay: '6.1s'  },
  { left: '39%', top: '28%', size: 4, colour: 5, dur: '8s',  delay: '3.3s'  },
  { left: '51%', top: '42%', size: 2, colour: 0, dur: '15s', delay: '5.7s'  },
  { left: '44%', top: '8%',  size: 3, colour: 1, dur: '10s', delay: '0.2s'  },
  { left: '58%', top: '30%', size: 2, colour: 2, dur: '13s', delay: '7.4s'  },
  { left: '50%', top: '48%', size: 3, colour: 3, dur: '9s',  delay: '2.6s'  },
  { left: '37%', top: '16%', size: 2, colour: 4, dur: '11s', delay: '4.9s'  },
  { left: '56%', top: '38%', size: 4, colour: 5, dur: '16s', delay: '1.1s'  },
]

const SOCIAL = [
  {
    href:         'https://www.instagram.com/catchmyterpzz069/',
    label:        'INSTAGRAM',
    colour:       '#E1306C',
    top: '7%',  left: '43%',
    floatDelay:   '0s',
    flickerDelay: '0.8s',
    icon: <Instagram size={20} strokeWidth={1.5} />,
  },
  {
    href:         'https://signal.me/#eu/lpp-wWDSP4uEHHRKPyYm8zopk8v_T4uJN98SZEdBZOaBtr5i4oZM9IvBeebjau_4',
    label:        'SIGNAL',
    colour:       '#3A76F0',
    top: '2%',  left: '57%',
    floatDelay:   '1.1s',
    flickerDelay: '3.2s',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 6.628 5.374 12 12 12 6.628 0 12-5.372 12-12 0-6.627-5.372-12-12-12zm5.92 8.549l-1.978 9.32c-.147.658-.53.818-1.074.508l-2.977-2.193-1.437 1.382c-.159.159-.292.292-.598.292l.213-3.028 5.506-4.975c.239-.213-.053-.331-.372-.118L6.55 14.617l-2.932-.916c-.638-.199-.65-.638.133-.945l11.555-4.455c.531-.192.996.13.614.248z"/>
      </svg>
    ),
  },
  {
    href:         'https://invite.viber.com/?g2=AQAdw%2FOf21o71Vbfv9ERSMyDYQEPc0rHaRsu0bJc8KFyj%2BG6acK9tMbJVuP78nh8',
    label:        'VIBER',
    colour:       '#7360F2',
    top: '7%',  left: '71%',
    floatDelay:   '2.2s',
    flickerDelay: '1.6s',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M11.4 0C6.392.026 2.978 1.79 2.978 1.79S-.573 4.017.08 10.188c.357 3.39 1.555 9.64 7.367 11.15v2.562s-.04.988.614 1.188c.79.246 1.254-.51 2.009-1.327l1.38-1.597c3.796.319 6.712-.41 7.042-.517.767-.247 5.105-.804 5.812-6.55C25.044 8.5 23.76 2.64 11.4 0zm.2 20.36l-1.565 1.74-.484.538s-.118.13-.22.086c-.066-.028-.083-.113-.083-.113l.003-3.325s-4.917-1.17-5.186-6.913c-.268-5.741 3.618-9.04 9.14-9.384.194-.012.39-.018.59-.018 7.165 0 9.756 4.023 9.756 4.023s2.634 5.338-.742 9.764c-.47.614-1.538 1.59-4.04 1.983-2.505.394-5.077.102-7.17-.38zm4.79-9.59c.017.363-.543.388-.56.024-.063-1.348-.946-2.127-2.293-2.173-.362-.013-.347-.573.016-.56 1.666.057 2.77 1.034 2.837 2.71zm1.273.52c-.007.356-.549.348-.542-.008.04-2.167-1.32-3.7-3.734-3.872-.36-.026-.33-.587.03-.561 2.698.19 4.282 1.965 4.246 4.44zm1.347.506c.003.362-.555.37-.558.007-.056-3.09-1.95-5.05-5.208-5.285-.36-.025-.332-.587.028-.562 3.578.25 5.686 2.455 5.738 5.84z"/>
      </svg>
    ),
  },
  {
    href:         'https://threema.id/AB5B4S6T',
    label:        'THREEMA',
    colour:       '#3BC371',
    top: '2%',  left: '85%',
    floatDelay:   '3.3s',
    flickerDelay: '4.8s',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm0 3.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zm0 9.75c3.04 0 5.5 1.008 5.5 2.25v.5h-11v-.5c0-1.242 2.46-2.25 5.5-2.25z"/>
      </svg>
    ),
  },
]

export function Hero() {
  const { mobileSettings } = useMobileSettings()

  return (
    <div
      className={`relative w-full overflow-hidden${!mobileSettings.showHero ? ' hero-hide-mobile' : ''}`}
      style={{ background: '#0C0919', maxHeight: '100vh' }}
    >
      <style>{`
        @media (max-width: 640px) {
          .hero-hide-mobile { display: none !important; }
          .social-bubbles-hide { display: none !important; }
          .social-bubble { width: 56px !important; padding: 10px 8px 8px !important; }
          .social-bubble-icon svg { width: 14px !important; height: 14px !important; }
          .social-bubble-label { font-size: 0.5rem !important; letter-spacing: 0.14em !important; }
        }
      `}</style>
      {/* Ambient orbs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '-5%', left: '-5%',
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 65%)',
          animation: 'ambientPulse 7s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', top: '10%', right: '-5%',
          width: 480, height: 480,
          background: 'radial-gradient(circle, rgba(168,206,44,0.07) 0%, transparent 65%)',
          animation: 'ambientPulse 9s ease-in-out 3s infinite',
        }} />
      </div>

      {/* Hero banner */}
      <img
        src="/logo-design.png"
        alt="CatchMyTerpz 069"
        draggable={false}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          mixBlendMode: 'screen',
          filter: 'brightness(1.06) contrast(1.04) saturate(1.1)',
          userSelect: 'none',
          position: 'relative',
          zIndex: 1,
        }}
      />

      {/* ── Particle field ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
        {PARTICLES.map((p, i) => {
          const colour = COLOURS[p.colour]
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: p.left,
                top: p.top,
                width:  p.size,
                height: p.size,
                borderRadius: '50%',
                background: colour,
                boxShadow: `0 0 ${p.size * 3}px ${colour}, 0 0 ${p.size * 6}px ${colour}55`,
                animation: `particleFloat ${p.dur} ease-in-out ${p.delay} infinite`,
              }}
            />
          )
        })}
      </div>

      {/* ── Social contact bubbles ── */}
      <div className={!mobileSettings.showSocialBubbles ? 'social-bubbles-hide' : ''}>
      {SOCIAL.map((s, i) => {
        const brd = `1.5px solid ${s.colour}`
        const corners: React.CSSProperties[] = [
          { position: 'absolute', top: 5,    left: 5,  width: 7, height: 7, borderTop: brd, borderLeft: brd   },
          { position: 'absolute', top: 5,    right: 5, width: 7, height: 7, borderTop: brd, borderRight: brd  },
          { position: 'absolute', bottom: 5, left: 5,  width: 7, height: 7, borderBottom: brd, borderLeft: brd  },
          { position: 'absolute', bottom: 5, right: 5, width: 7, height: 7, borderBottom: brd, borderRight: brd },
        ]
        return (
          <a
            key={i}
            href={s.href}
            target={s.href !== '#' ? '_blank' : undefined}
            rel="noopener noreferrer"
            aria-label={s.label}
            style={{
              position: 'absolute',
              top: s.top, left: s.left,
              transform: 'translate(-50%, 0)',
              zIndex: 4,
              textDecoration: 'none',
              animation: `cloudFloat 4.5s ease-in-out ${s.floatDelay} infinite`,
            }}
          >
            <div style={{ position: 'relative', animation: `neonFlicker 8s linear ${s.flickerDelay} infinite` }}>

              {/* Badge card */}
              <div
                className="social-bubble"
                style={{
                  position: 'relative',
                  width: 74,
                  padding: '15px 10px 12px',
                  background: 'rgba(5, 2, 14, 0.94)',
                  border: `1px solid ${s.colour}45`,
                  boxShadow: [
                    `0 0 0 1px ${s.colour}0e`,
                    `0 0 18px ${s.colour}40`,
                    `0 0 44px ${s.colour}14`,
                    `inset 0 1px 0 ${s.colour}1e`,
                    `inset 0 -1px 0 ${s.colour}08`,
                  ].join(', '),
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.35s ease, border-color 0.35s ease',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.boxShadow = [
                    `0 0 0 1px ${s.colour}28`,
                    `0 0 28px ${s.colour}68`,
                    `0 0 68px ${s.colour}26`,
                    `inset 0 1px 0 ${s.colour}36`,
                    `inset 0 -1px 0 ${s.colour}12`,
                  ].join(', ')
                  el.style.borderColor = `${s.colour}72`
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.boxShadow = [
                    `0 0 0 1px ${s.colour}0e`,
                    `0 0 18px ${s.colour}40`,
                    `0 0 44px ${s.colour}14`,
                    `inset 0 1px 0 ${s.colour}1e`,
                    `inset 0 -1px 0 ${s.colour}08`,
                  ].join(', ')
                  el.style.borderColor = `${s.colour}45`
                }}
              >
                {/* Corner L-brackets */}
                {corners.map((style, j) => (
                  <div key={j} style={style} />
                ))}

                {/* Subtle top wash */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '55%',
                  background: `linear-gradient(to bottom, ${s.colour}09, transparent)`,
                  pointerEvents: 'none',
                }} />

                {/* Platform icon */}
                <span className="social-bubble-icon" style={{
                  color: s.colour,
                  display: 'flex',
                  marginBottom: 9,
                  filter: `drop-shadow(0 0 8px ${s.colour}e0) drop-shadow(0 0 20px ${s.colour}50)`,
                }}>
                  {s.icon}
                </span>

                {/* Divider line */}
                <div style={{
                  width: 32,
                  height: 1,
                  background: `linear-gradient(to right, transparent, ${s.colour}60, transparent)`,
                  marginBottom: 8,
                }} />

                {/* Platform name */}
                <span className="social-bubble-label" style={{
                  fontSize: '0.55rem',
                  fontWeight: 900,
                  letterSpacing: '0.22em',
                  color: `${s.colour}c0`,
                  textShadow: `0 0 12px ${s.colour}88`,
                  whiteSpace: 'nowrap',
                  fontFamily: 'inherit',
                  lineHeight: 1,
                }}>
                  {s.label}
                </span>
              </div>
            </div>
          </a>
        )
      })}
      </div>

      {/* SHOP NOW CTA */}
      <div
        className="flex flex-col items-center"
        style={{ position: 'absolute', bottom: 28, left: 0, right: 0, zIndex: 10 }}
      >
        <a
          href="#catalog"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            fontSize: '0.7rem',
            letterSpacing: '0.22em',
            fontWeight: 900,
            textTransform: 'uppercase',
            background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
            color: '#fff',
            padding: '13px 44px',
            border: '1px solid rgba(168,206,44,0.25)',
            boxShadow: '0 0 32px rgba(124,58,237,0.4), 0 4px 16px rgba(0,0,0,0.4)',
            transition: 'box-shadow 0.3s ease, transform 0.2s ease',
            textDecoration: 'none',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.boxShadow = '0 0 52px rgba(124,58,237,0.65), 0 4px 24px rgba(0,0,0,0.5)'
            el.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.boxShadow = '0 0 32px rgba(124,58,237,0.4), 0 4px 16px rgba(0,0,0,0.4)'
            el.style.transform = 'translateY(0)'
          }}
        >
          JETZT ENTDECKEN <span style={{ fontSize: '1.1rem' }}>↓</span>
        </a>
      </div>

      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
        background: 'linear-gradient(to bottom, transparent, #0C0919)',
        pointerEvents: 'none',
        zIndex: 3,
      }} />

    </div>
  )
}
