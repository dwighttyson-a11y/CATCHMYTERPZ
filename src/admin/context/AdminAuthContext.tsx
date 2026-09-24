import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import {
  clearAdminSession,
  createAdminSession,
  isAdminSessionValid,
  validateAdminCredentials,
} from '../auth/adminAuth'

export type AdminAuthState = 'checking' | 'unauthenticated' | 'authenticated'

interface AdminAuthContextValue {
  state: AdminAuthState
  login: (password: string, pin: string) => Promise<boolean>
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AdminAuthState>('checking')

  useEffect(() => {
    setState(isAdminSessionValid() ? 'authenticated' : 'unauthenticated')
  }, [])

  const login = useCallback(async (password: string, pin: string): Promise<boolean> => {
    const valid = await validateAdminCredentials(password, pin)
    if (valid) {
      createAdminSession()
      setState('authenticated')
    }
    return valid
  }, [])

  const logout = useCallback(() => {
    clearAdminSession()
    setState('unauthenticated')
  }, [])

  return (
    <AdminAuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be inside AdminAuthProvider')
  return ctx
}
