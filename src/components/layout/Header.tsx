import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Instagram } from 'lucide-react'
import { useSearch } from '../../context/SearchContext'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const { openSearch } = useSearch()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-30 backdrop-blur-md transition-all duration-300 ${scrolled ? 'shadow-[0_4px_32px_rgba(124,58,237,0.2)]' : ''}`}
      style={{ background: 'rgba(12,9,25,0.96)', position: 'relative' }}
    >
      <style>{`
        @keyframes header-border-sweep {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <div className="container-base">
        <div className="relative flex items-center" style={{ height: 72 }}>

          {/* LEFT — circular logo mark */}
          <Link
            to="/"
            className="flex items-center group z-10 flex-shrink-0"
            aria-label="CatchMyTerpz – Startseite"
          >
            <img
              src="/logo.jpg"
              alt="CatchMyTerpz 069 Logo"
              className="w-12 h-12 rounded-full object-cover border-2 border-brand-accent/50 group-hover:border-brand-accent transition-colors"
            />
          </Link>

{/* RIGHT — actions */}
          <div className="flex items-center gap-0.5 ml-auto z-10">
            <button
              onClick={openSearch}
              className="p-2.5 text-brand-secondary hover:text-brand-accent transition-colors"
              aria-label="Suche"
            >
              <Search size={19} />
            </button>
            <a
              href="https://www.instagram.com/catchmyterpzz069/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 text-brand-secondary hover:text-brand-accent transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={19} />
            </a>
          </div>

        </div>
      </div>

      {/* Animated gradient bottom border */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: 2,
        background: 'linear-gradient(90deg, #7C3AED, #A8CE2C, #C0567A, #A8CE2C, #7C3AED)',
        backgroundSize: '200% 100%',
        animation: 'header-border-sweep 4s ease infinite',
      }} />
    </header>
  )
}
