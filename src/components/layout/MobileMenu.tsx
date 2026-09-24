import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { X, ChevronRight, Instagram } from 'lucide-react'
import { collections } from '../../data/products'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'Über uns' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Kontakt' },
]

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const location = useLocation()

  useEffect(() => { onClose() }, [location.pathname]) // eslint-disable-line

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigationsmenü"
        className={`fixed top-0 left-0 h-full w-[85vw] max-w-sm bg-brand-surface border-r border-brand-border z-50 flex flex-col transition-transform duration-350 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/logo.jpg" alt="CMT Logo" className="w-9 h-9 rounded-full object-cover border border-brand-accent/50" />
            <div>
              <span className="font-black text-base leading-none text-brand-text">
                CatchMy<span className="text-brand-accent">Terpz</span>
              </span>
              <span className="block text-[11px] font-bold tracking-wider text-brand-secondary">069 · FRANKFURT</span>
            </div>
          </Link>
          <button onClick={onClose} className="p-2 -mr-2 text-brand-secondary hover:text-brand-text transition-colors" aria-label="Menü schließen">
            <X size={22} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Hauptnavigation">
          <ul className="space-y-0.5">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="flex items-center justify-between px-3 py-3 text-base font-bold text-brand-text hover:text-brand-accent hover:bg-brand-light rounded transition-colors"
                >
                  {link.label}
                  <ChevronRight size={15} className="text-brand-secondary" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 pt-6 border-t border-brand-border">
            <p className="px-3 mb-3 text-xs font-bold tracking-widest uppercase text-brand-secondary">Sortiment</p>
            <ul className="space-y-0.5">
              {collections.map((col) => (
                <li key={col.slug}>
                  <Link
                    to={`/collections/${col.slug}`}
                    className="flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-brand-secondary hover:text-brand-accent hover:bg-brand-light rounded transition-colors"
                  >
                    {col.name}
                    <ChevronRight size={13} className="text-brand-border" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-brand-border px-5 py-5 space-y-3">
          <Link to="/cart" className="block w-full text-center py-3 bg-brand-accent text-brand-bg text-sm font-black tracking-wide uppercase hover:bg-brand-accent-hover transition-colors">
            Zum Warenkorb
          </Link>
          <a
            href="https://www.instagram.com/catchmyterpzz069/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 border border-brand-border text-brand-secondary hover:text-brand-accent hover:border-brand-accent text-sm font-semibold transition-all"
          >
            <Instagram size={15} />
            @catchmyterpzz069
          </a>
          <div className="flex gap-4 text-xs text-brand-secondary justify-center pt-1">
            <Link to="/privacy" className="hover:text-brand-text transition-colors">Datenschutz</Link>
            <Link to="/terms" className="hover:text-brand-text transition-colors">AGB</Link>
            <Link to="/imprint" className="hover:text-brand-text transition-colors">Impressum</Link>
          </div>
        </div>
      </aside>
    </>
  )
}
