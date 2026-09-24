import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { useVaultAuth } from './auth/useVaultAuth'
import { useAdminAuth } from './admin/context/AdminAuthContext'
import { VaultLockScreen } from './components/vault/VaultLockScreen'
import { AnnouncementBar } from './components/ui/AnnouncementBar'
import { CartProvider } from './context/CartContext'
import { SearchProvider } from './context/SearchContext'
import { ProductImageProvider } from './context/ProductImageContext'
import { CatalogProvider } from './context/CatalogContext'
import { MediaLibraryProvider } from './context/MediaLibraryContext'
import { MediaProvider } from './context/MediaContext'
import { AdminAuthProvider } from './admin/context/AdminAuthContext'
import { MobileSettingsProvider } from './context/MobileSettingsContext'
import { RequireAdminAuth } from './admin/components/RequireAdminAuth'
import { AdminLayout } from './admin/components/AdminLayout'
import { AdminLoginPage } from './admin/pages/AdminLoginPage'
import { AdminDashboard } from './admin/pages/AdminDashboard'
import { AdminProducts } from './admin/pages/AdminProducts'
import { AdminCategories } from './admin/pages/AdminCategories'
import { AdminSettings } from './admin/pages/AdminSettings'
import { AdminMedia } from './admin/pages/AdminMedia'
import { Footer } from './components/layout/Footer'
import { CartDrawer } from './components/ui/CartDrawer'
import { CartPill } from './components/ui/CartPill'
import { SearchOverlay } from './components/ui/SearchOverlay'
import { HomePage } from './pages/HomePage'
import { CollectionPage } from './pages/CollectionPage'
import { ProductPage } from './pages/ProductPage'
import { AboutPage } from './pages/AboutPage'
import { FAQPage } from './pages/FAQPage'
import { ContactPage } from './pages/ContactPage'
import { CartPage } from './pages/CartPage'
import { PrivacyPage, TermsPage, ShippingPage, ReturnsPage, ImprintPage } from './pages/StaticPages'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])
  return null
}

function MainSite() {
  return (
    <div
      className="flex flex-col min-h-screen relative"
      style={{ background: '#0C0919', animation: 'vaultEntrance 0.45s ease forwards' }}
    >
      <AnnouncementBar />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand-accent focus:text-brand-bg focus:text-sm focus:font-black"
      >
        Zum Hauptinhalt
      </a>

      <div className="flex-1 relative z-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/collections/:slug" element={<CollectionPage />} />
          <Route path="/products/:slug" element={<ProductPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
          <Route path="/imprint" element={<ImprintPage />} />
          <Route
            path="*"
            element={
              <div className="container-base py-24 text-center">
                <h1 className="font-black text-6xl text-brand-accent mb-4">404</h1>
                <p className="text-brand-secondary mb-8">Seite nicht gefunden.</p>
                <a href="/" className="btn-primary">Zur Startseite</a>
              </div>
            }
          />
        </Routes>
      </div>

      <Footer />
      <CartDrawer />
      <CartPill />
      <SearchOverlay />
      <ScrollToTop />

      {/* Admin access bubble */}
      <Link
        to="/admin/login"
        aria-label="Admin"
        style={{
          position: 'fixed',
          bottom: 24,
          left: 24,
          zIndex: 90,
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: 'rgba(12,9,25,0.85)',
          border: '1px solid rgba(124,58,237,0.35)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(144,128,180,0.55)',
          textDecoration: 'none',
          boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
          transition: 'border-color 0.2s, color 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLAnchorElement
          el.style.borderColor = 'rgba(124,58,237,0.7)'
          el.style.color = '#C4B5FD'
          el.style.boxShadow = '0 0 18px rgba(124,58,237,0.35), 0 2px 12px rgba(0,0,0,0.4)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLAnchorElement
          el.style.borderColor = 'rgba(124,58,237,0.35)'
          el.style.color = 'rgba(144,128,180,0.55)'
          el.style.boxShadow = '0 2px 12px rgba(0,0,0,0.4)'
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </Link>
    </div>
  )
}

function AppLayout() {
  const { lockState, tryUnlock } = useVaultAuth()
  const { logout }    = useAdminAuth()
  const location      = useLocation()
  const navigate      = useNavigate()
  const justUnlocked  = useRef(false)
  const isAdminRoute  = location.pathname.startsWith('/admin')
  // Track previous value so we know when user *leaves* the admin area
  const wasAdminRoute = useRef(isAdminRoute)

  const handleUnlock = (pw: string): boolean => {
    const ok = tryUnlock(pw)
    if (ok) justUnlocked.current = true
    return ok
  }

  // Clear session whenever the user navigates away from /admin/*
  useEffect(() => {
    if (wasAdminRoute.current && !isAdminRoute) {
      logout()
    }
    wasAdminRoute.current = isAdminRoute
  }, [isAdminRoute, logout])

  useEffect(() => {
    if (lockState === 'unlocked' && justUnlocked.current) {
      justUnlocked.current = false
    }
  }, [lockState, navigate, location.pathname])

  /* Admin routes render independently — no vault required */
  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <RequireAdminAuth>
              <AdminLayout />
            </RequireAdminAuth>
          }
        >
          <Route index           element={<AdminDashboard />} />
          <Route path="products"   element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="settings"   element={<AdminSettings />} />
          <Route path="media"      element={<AdminMedia />} />
        </Route>
        <Route path="/admin/*" element={<RequireAdminAuth><AdminLayout /></RequireAdminAuth>} />
      </Routes>
    )
  }

  /* Public site with vault lock */
  return (
    <>
      {lockState !== 'unlocked' && (
        <VaultLockScreen lockState={lockState} onUnlock={handleUnlock} />
      )}
      {lockState === 'unlocked' && <MainSite />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <MediaProvider>
      <CatalogProvider>
        <MobileSettingsProvider>
        <MediaLibraryProvider>
        <ProductImageProvider>
          <AdminAuthProvider>
            <CartProvider>
              <SearchProvider>
                <AppLayout />
              </SearchProvider>
            </CartProvider>
          </AdminAuthProvider>
        </ProductImageProvider>
        </MediaLibraryProvider>
        </MobileSettingsProvider>
      </CatalogProvider>
      </MediaProvider>
    </BrowserRouter>
  )
}
