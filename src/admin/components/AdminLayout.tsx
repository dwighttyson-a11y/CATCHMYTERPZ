import { useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, FolderOpen, Settings, LogOut, ChevronLeft, Images } from 'lucide-react'
import { useAdminAuth } from '../context/AdminAuthContext'
import { clearAdminSession } from '../auth/adminAuth'
import { ToastProvider } from './Toast'

const NAV = [
  { to: '/admin',            label: 'Dashboard',  icon: LayoutDashboard, end: true  },
  { to: '/admin/products',   label: 'Products',   icon: Package,         end: false },
  { to: '/admin/categories', label: 'Categories', icon: FolderOpen,      end: false },
  { to: '/admin/media',      label: 'Media',      icon: Images,          end: false },
  { to: '/admin/settings',   label: 'Settings',   icon: Settings,        end: false },
]

const ACTIVE_STYLE: React.CSSProperties = {
  color: '#A8CE2C',
  background: 'rgba(168,206,44,0.08)',
  borderRight: '3px solid #A8CE2C',
}

const INACTIVE_STYLE: React.CSSProperties = {
  color: '#9080B4',
  background: 'transparent',
  borderRight: '3px solid transparent',
}

export function AdminLayout() {
  const { logout } = useAdminAuth()
  const navigate   = useNavigate()

  // Clear session if the page is refreshed, the address bar is used,
  // or any other full-page unload happens while admin is open.
  useEffect(() => {
    const handler = () => clearAdminSession()
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [])

  // Explicit logout — clears session and goes to login screen
  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  // "Back to store" — clears session then navigates via React Router
  // (no page reload, so the beforeunload trick isn't needed here,
  //  but we call logout() explicitly to be safe)
  const handleBackToStore = () => {
    logout()
    navigate('/')
  }

  return (
    <ToastProvider>
    <>
      <style>{`
        .admin-nav-link { transition: color 0.15s, background 0.15s; }
        .admin-nav-link:hover { color: #F0EBF8 !important; background: rgba(45,37,80,0.5) !important; }
        @media (min-width: 768px) {
          .admin-sidebar     { display: flex !important; }
          .admin-top-bar     { display: none !important; }
          .admin-bottom-nav  { display: none !important; }
          .admin-main        { margin-left: 240px !important; }
        }
        @media (max-width: 767px) {
          .admin-sidebar     { display: none !important; }
          .admin-top-bar     { display: flex !important; }
          .admin-bottom-nav  { display: flex !important; }
          .admin-main        { margin-left: 0 !important; padding-bottom: 76px !important; }
        }
      `}</style>

      {/* ── Desktop sidebar ── */}
      <aside
        className="admin-sidebar"
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0,
          width: 240,
          background: '#1A1628',
          borderRight: '1px solid #2D2550',
          flexDirection: 'column',
          zIndex: 50,
          display: 'none',
        }}
      >
        {/* Brand */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid #2D2550' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'rgba(124,58,237,0.2)',
              border: '1px solid rgba(124,58,237,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{ color: '#7C3AED', fontSize: '0.65rem', fontWeight: 900 }}>CMT</span>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#F0EBF8' }}>Admin Panel</div>
              <div style={{ fontSize: '0.58rem', color: '#9080B4', letterSpacing: '0.1em' }}>CatchMyTerpz 069</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className="admin-nav-link"
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 20px',
                fontSize: '0.82rem', fontWeight: 600,
                textDecoration: 'none',
                ...(isActive ? ACTIVE_STYLE : INACTIVE_STYLE),
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon size={17} strokeWidth={isActive ? 2 : 1.5} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Back to store + Logout */}
        <div style={{ padding: '12px 0', borderTop: '1px solid #2D2550' }}>
          <button
            onClick={handleBackToStore}
            className="admin-nav-link"
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 20px',
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.78rem', fontWeight: 600,
              color: 'rgba(144,128,180,0.6)',
              borderRight: '3px solid transparent',
              fontFamily: 'inherit',
              textAlign: 'left',
            }}
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
            Back to Store
          </button>
          <button
            onClick={handleLogout}
            className="admin-nav-link"
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 20px',
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.82rem', fontWeight: 600,
              color: 'rgba(239,68,68,0.7)',
              borderRight: '3px solid transparent',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#EF4444'
              e.currentTarget.style.background = 'rgba(239,68,68,0.08)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'rgba(239,68,68,0.7)'
              e.currentTarget.style.background = 'none'
            }}
          >
            <LogOut size={17} strokeWidth={1.5} />
            Log Out
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <header
        className="admin-top-bar"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: 52,
          background: '#1A1628',
          borderBottom: '1px solid #2D2550',
          display: 'none',
          alignItems: 'center',
          padding: '0 12px',
          zIndex: 50,
          gap: 8,
        }}
      >
        <button
          onClick={handleBackToStore}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            color: '#9080B4', fontSize: '0.75rem',
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px 4px', fontFamily: 'inherit',
          }}
          aria-label="Back to site"
        >
          <ChevronLeft size={16} />
        </button>
        <span style={{
          flex: 1, textAlign: 'center',
          fontSize: '0.6rem', fontWeight: 900, letterSpacing: '0.3em',
          color: '#F0EBF8', textTransform: 'uppercase',
        }}>
          Admin Panel
        </span>
        <button
          onClick={handleLogout}
          style={{
            background: 'none', border: '1px solid rgba(239,68,68,0.3)',
            color: 'rgba(239,68,68,0.7)', fontSize: '0.55rem', fontWeight: 800,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            padding: '5px 10px', cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Logout
        </button>
      </header>

      {/* ── Main content ── */}
      <main
        className="admin-main"
        style={{ minHeight: '100dvh', background: '#0C0919', marginLeft: 0 }}
      >
        <div className="admin-mobile-pad" style={{ height: 52 }} />
        <Outlet />
      </main>

      {/* ── Mobile bottom nav ── */}
      <nav
        className="admin-bottom-nav"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          height: 60,
          background: '#1A1628',
          borderTop: '1px solid #2D2550',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 50,
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            style={({ isActive }) => ({
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              color: isActive ? '#A8CE2C' : '#9080B4',
              textDecoration: 'none',
              padding: '6px 8px',
              minWidth: 52,
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={19} strokeWidth={isActive ? 2 : 1.5} />
                <span style={{ fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.08em' }}>{label}</span>
              </>
            )}
          </NavLink>
        ))}

        <button
          onClick={handleLogout}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            color: 'rgba(239,68,68,0.6)',
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '6px 8px', minWidth: 52,
            fontFamily: 'inherit',
          }}
        >
          <LogOut size={19} strokeWidth={1.5} />
          <span style={{ fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.08em' }}>Logout</span>
        </button>
      </nav>

      <style>{`
        .admin-main .admin-mobile-pad { display: block; }
        @media (min-width: 768px) {
          .admin-main .admin-mobile-pad { display: none; }
        }
      `}</style>
    </>
    </ToastProvider>
  )
}
