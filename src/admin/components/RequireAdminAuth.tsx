import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'

function AdminLoadingScreen() {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#0C0919',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999,
    }}>
      <div style={{
        width: 48, height: 48,
        border: '3px solid rgba(124,58,237,0.2)',
        borderTopColor: '#7C3AED',
        borderRadius: '50%',
        animation: 'adminSpin 0.8s linear infinite',
      }} />
      <style>{`@keyframes adminSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export function RequireAdminAuth({ children }: { children: React.ReactNode }) {
  const { state } = useAdminAuth()
  if (state === 'checking') return <AdminLoadingScreen />
  if (state !== 'authenticated') return <Navigate to="/admin/login" replace />
  return <>{children}</>
}
